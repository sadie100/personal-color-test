import {
  diagnosticChips,
  personalColorTypeMeta,
  personalColorTypes,
  simpleResultTypeMeta,
  simpleResultTypes,
} from "../data/colorData";
import type { DiagnosticChip, PersonalColorType, SimpleResultType, TestCompletePayload, TestMode } from "../types";
import { getBestResults, getBestSimpleResults, getWorstResult, getWorstSimpleResult } from "./analyzer";

type SummaryKey = "best" | "second" | "third" | "worst";

interface EncodedSelections {
  v: 3;
  m: TestMode;
  l: number[];
  d: number[];
}

const SUMMARY_KEYS: ReadonlyArray<SummaryKey> = ["best", "second", "third", "worst"];

const toneToSlugMap: Record<PersonalColorType, string> = personalColorTypes.reduce(
  (accumulator, type) => ({
    ...accumulator,
    [type]: personalColorTypeMeta[type].slug,
  }),
  {} as Record<PersonalColorType, string>,
);

const slugToToneMap: Record<string, PersonalColorType> = Object.entries(toneToSlugMap).reduce(
  (accumulator, [type, slug]) => ({
    ...accumulator,
    [slug]: type as PersonalColorType,
  }),
  {} as Record<string, PersonalColorType>,
);

const simpleToneToSlugMap: Record<SimpleResultType, string> = simpleResultTypes.reduce(
  (accumulator, type) => ({
    ...accumulator,
    [type]: simpleResultTypeMeta[type].slug,
  }),
  {} as Record<SimpleResultType, string>,
);

const slugToSimpleToneMap: Record<string, SimpleResultType> = Object.entries(simpleToneToSlugMap).reduce(
  (accumulator, [type, slug]) => ({
    ...accumulator,
    [slug]: type as SimpleResultType,
  }),
  {} as Record<string, SimpleResultType>,
);

const colorCatalog: DiagnosticChip[] = diagnosticChips;

const colorToCatalogIndex = new Map(
  colorCatalog.map((chip, index) => [chip.id, index]),
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
  const likedIndexes = payload.likedChips
    .map((chip) => colorToCatalogIndex.get(chip.id))
    .filter((index): index is number => typeof index === "number");
  const dislikedIndexes = payload.dislikedChips
    .map((chip) => colorToCatalogIndex.get(chip.id))
    .filter((index): index is number => typeof index === "number");

  if (likedIndexes.length === 0 && dislikedIndexes.length === 0) {
    return null;
  }

  const encoded: EncodedSelections = {
    v: 3,
    m: payload.mode,
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
  if (!parsed || !Array.isArray(parsed.l) || !Array.isArray(parsed.d)) {
    return null;
  }

  const mode: TestMode =
    parsed.v === 3 && (parsed.m === "simple" || parsed.m === "detailed") ? parsed.m : "detailed";

  const likedChips = parsed.l
    .map((index) => colorCatalog[index])
    .filter((chip): chip is DiagnosticChip => chip !== undefined);
  const dislikedChips = parsed.d
    .map((index) => colorCatalog[index])
    .filter((chip): chip is DiagnosticChip => chip !== undefined);

  if (likedChips.length === 0 && dislikedChips.length === 0) {
    return null;
  }

  return { mode, likedChips, dislikedChips };
};

const getModeFromParams = (searchParams: URLSearchParams): TestMode =>
  searchParams.get("mode") === "simple" ? "simple" : "detailed";

const getRepresentativeChip = (type: PersonalColorType): DiagnosticChip | null =>
  diagnosticChips.find(
    (chip) => chip.diagnosticPhase === "detail" && chip.targetTypes.includes(type),
  ) ?? diagnosticChips.find((chip) => chip.targetTypes.includes(type)) ?? null;

const getRepresentativeChipsForSimpleTone = (type: SimpleResultType): DiagnosticChip[] => {
  const { paletteTypes } = simpleResultTypeMeta[type];
  const chips = [
    diagnosticChips.find(
      (chip) =>
        chip.diagnosticPhase === "base" && paletteTypes.every((paletteType) => chip.targetTypes.includes(paletteType)),
    ) ?? null,
    diagnosticChips.find(
      (chip) =>
        chip.diagnosticPhase === "season" && paletteTypes.every((paletteType) => chip.targetTypes.includes(paletteType)),
    ) ?? null,
  ];

  return chips.filter((chip): chip is DiagnosticChip => chip !== null);
};

const createDetailedFallbackPayloadFromSummary = (
  summary: Partial<Record<SummaryKey, PersonalColorType>>,
): TestCompletePayload | null => {
  const best = summary.best;
  if (!best) {
    return null;
  }

  const second = summary.second;
  const third = summary.third;
  const worst = summary.worst;

  const likedTypes: PersonalColorType[] = [best, best, best];
  if (second) {
    likedTypes.push(second, second);
  }
  if (third) {
    likedTypes.push(third);
  }

  const likedChips = likedTypes
    .map((type) => getRepresentativeChip(type))
    .filter((chip): chip is DiagnosticChip => chip !== null);

  const worstChip = worst ? getRepresentativeChip(worst) : null;
  const dislikedChips = worstChip ? [worstChip] : [];

  if (likedChips.length === 0 && dislikedChips.length === 0) {
    return null;
  }

  return { mode: "detailed", likedChips, dislikedChips };
};

const createSimpleFallbackPayloadFromSummary = (
  summary: Partial<Record<SummaryKey, SimpleResultType>>,
): TestCompletePayload | null => {
  const best = summary.best;
  if (!best) {
    return null;
  }

  const worst = summary.worst;
  const bestChips = getRepresentativeChipsForSimpleTone(best);
  const likedChips = [...bestChips, ...bestChips];
  const dislikedChips = worst ? getRepresentativeChipsForSimpleTone(worst) : [];

  if (likedChips.length === 0 && dislikedChips.length === 0) {
    return null;
  }

  return {
    mode: "simple",
    likedChips,
    dislikedChips,
  };
};

const getDetailedSummaryFromParams = (
  searchParams: URLSearchParams,
): Partial<Record<SummaryKey, PersonalColorType>> =>
  SUMMARY_KEYS.reduce<Partial<Record<SummaryKey, PersonalColorType>>>((accumulator, key) => {
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

const getSimpleSummaryFromParams = (
  searchParams: URLSearchParams,
): Partial<Record<SummaryKey, SimpleResultType>> =>
  ["best", "worst"].reduce<Partial<Record<SummaryKey, SimpleResultType>>>((accumulator, key) => {
    const value = searchParams.get(key);
    if (!value) {
      return accumulator;
    }

    const mappedTone = slugToSimpleToneMap[value];
    if (mappedTone) {
      accumulator[key as SummaryKey] = mappedTone;
    }

    return accumulator;
  }, {});

export const createResultsSearchParams = (payload: TestCompletePayload): URLSearchParams => {
  const params = new URLSearchParams();
  params.set("mode", payload.mode);

  if (payload.mode === "simple") {
    const best = getBestSimpleResults(payload.likedChips, payload.dislikedChips, 1)[0];
    const worst = getWorstSimpleResult(payload.likedChips, payload.dislikedChips);

    if (best) {
      params.set("best", simpleToneToSlugMap[best]);
    }

    if (worst) {
      params.set("worst", simpleToneToSlugMap[worst]);
    }
  } else {
    const bestResults = getBestResults(payload.likedChips, payload.dislikedChips, 3);
    const worst = getWorstResult(payload.likedChips, payload.dislikedChips);
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

  const mode = getModeFromParams(searchParams);

  if (mode === "simple") {
    const summary = getSimpleSummaryFromParams(searchParams);
    return createSimpleFallbackPayloadFromSummary(summary);
  }

  const summary = getDetailedSummaryFromParams(searchParams);
  return createDetailedFallbackPayloadFromSummary(summary);
};
