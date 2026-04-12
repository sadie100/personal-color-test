import { colorData, seasonTones } from "../data/colorData";
import type { ColorWithSeason, SeasonTone, TestCompletePayload } from "../types";
import { getBestResults, getWorstResult } from "./analyzer";

type SummaryKey = "best" | "second" | "third" | "worst";

interface EncodedSelections {
  v: 1;
  l: number[];
  d: number[];
}

const SUMMARY_KEYS: ReadonlyArray<SummaryKey> = ["best", "second", "third", "worst"];

const toneToSlugMap: Record<SeasonTone, string> = seasonTones.reduce(
  (accumulator, tone) => ({
    ...accumulator,
    [tone]: tone.toLowerCase().replace(/\s+/g, "-"),
  }),
  {} as Record<SeasonTone, string>,
);

const slugToToneMap: Record<string, SeasonTone> = Object.entries(toneToSlugMap).reduce(
  (accumulator, [tone, slug]) => ({
    ...accumulator,
    [slug]: tone as SeasonTone,
  }),
  {} as Record<string, SeasonTone>,
);

const colorCatalog: ColorWithSeason[] = seasonTones.flatMap((seasonTone) =>
  colorData[seasonTone].map((color) => ({ ...color, seasonTone })),
);

const colorToCatalogIndex = new Map(
  colorCatalog.map((color, index) => [`${color.seasonTone}::${color.hex}::${color.name}`, index]),
);

const safeJsonParse = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const toBase64Url = (value: string): string =>
  btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

const fromBase64Url = (value: string): string | null => {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return atob(padded);
  } catch {
    return null;
  }
};

const encodeSelections = (payload: TestCompletePayload): string | null => {
  const likedIndexes = payload.likedColors
    .map((color) => colorToCatalogIndex.get(`${color.seasonTone}::${color.hex}::${color.name}`))
    .filter((index): index is number => typeof index === "number");
  const dislikedIndexes = payload.dislikedColors
    .map((color) => colorToCatalogIndex.get(`${color.seasonTone}::${color.hex}::${color.name}`))
    .filter((index): index is number => typeof index === "number");

  if (likedIndexes.length === 0 && dislikedIndexes.length === 0) {
    return null;
  }

  const encoded: EncodedSelections = {
    v: 1,
    l: likedIndexes,
    d: dislikedIndexes,
  };

  return toBase64Url(JSON.stringify(encoded));
};

const decodeSelections = (encodedValue: string): TestCompletePayload | null => {
  const decoded = fromBase64Url(encodedValue);
  if (!decoded) {
    return null;
  }

  const parsed = safeJsonParse<EncodedSelections>(decoded);
  if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.l) || !Array.isArray(parsed.d)) {
    return null;
  }

  const likedColors = parsed.l
    .map((index) => colorCatalog[index])
    .filter((color): color is ColorWithSeason => color !== undefined);
  const dislikedColors = parsed.d
    .map((index) => colorCatalog[index])
    .filter((color): color is ColorWithSeason => color !== undefined);

  if (likedColors.length === 0 && dislikedColors.length === 0) {
    return null;
  }

  return { likedColors, dislikedColors };
};

const getSummaryFromParams = (searchParams: URLSearchParams): Partial<Record<SummaryKey, SeasonTone>> =>
  SUMMARY_KEYS.reduce<Partial<Record<SummaryKey, SeasonTone>>>((accumulator, key) => {
    const value = searchParams.get(key);
    if (!value) {
      return accumulator;
    }

    const mappedTone = slugToToneMap[value];
    if (mappedTone) {
      accumulator[key] = mappedTone;
    }
    return accumulator;
  }, {});

const createFallbackPayloadFromSummary = (
  summary: Partial<Record<SummaryKey, SeasonTone>>,
): TestCompletePayload | null => {
  const best = summary.best;
  if (!best) {
    return null;
  }

  const second = summary.second;
  const third = summary.third;
  const worst = summary.worst;

  const likedTones: SeasonTone[] = [best, best, best];
  if (second) {
    likedTones.push(second, second);
  }
  if (third) {
    likedTones.push(third);
  }

  const likedColors = likedTones
    .map((tone) => {
      const color = colorData[tone][0];
      if (!color) {
        return null;
      }
      return { ...color, seasonTone: tone } satisfies ColorWithSeason;
    })
    .filter((color): color is ColorWithSeason => color !== null);

  const dislikedColors = worst
    ? colorData[worst][0]
      ? [{ ...colorData[worst][0], seasonTone: worst } satisfies ColorWithSeason]
      : []
    : [];

  if (likedColors.length === 0 && dislikedColors.length === 0) {
    return null;
  }

  return { likedColors, dislikedColors };
};

export const createResultsSearchParams = (payload: TestCompletePayload): URLSearchParams => {
  const params = new URLSearchParams();
  const bestResults = getBestResults(payload.likedColors, 3);
  const worst = getWorstResult(payload.dislikedColors, bestResults[0] ?? null);

  const [best, second, third] = bestResults;

  if (best) {
    params.set("best", toneToSlugMap[best]);
  }
  if (second) {
    params.set("second", toneToSlugMap[second]);
  }
  if (third) {
    params.set("third", toneToSlugMap[third]);
  }
  if (worst) {
    params.set("worst", toneToSlugMap[worst]);
  }

  const encodedSelections = encodeSelections(payload);
  if (encodedSelections) {
    params.set("data", encodedSelections);
  }

  return params;
};

export const getPayloadFromResultsSearchParams = (
  searchParams: URLSearchParams,
): TestCompletePayload | null => {
  const encodedData = searchParams.get("data");
  if (encodedData) {
    const decoded = decodeSelections(encodedData);
    if (decoded) {
      return decoded;
    }
  }

  const summary = getSummaryFromParams(searchParams);
  return createFallbackPayloadFromSummary(summary);
};
