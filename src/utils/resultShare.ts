import { diagnosticChips, personalColorTypeMeta, personalColorTypes } from "../data/colorData";
import type { DiagnosticChip, PersonalColorType, TestCompletePayload } from "../types";
import { getBestResults, getWorstResult } from "./analyzer";

type SummaryKey = "best" | "second" | "third" | "worst";

interface EncodedSelections {
  v: 2;
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
    v: 2,
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
  if (!parsed || parsed.v !== 2 || !Array.isArray(parsed.l) || !Array.isArray(parsed.d)) {
    return null;
  }

  const likedChips = parsed.l
    .map((index) => colorCatalog[index])
    .filter((chip): chip is DiagnosticChip => chip !== undefined);
  const dislikedChips = parsed.d
    .map((index) => colorCatalog[index])
    .filter((chip): chip is DiagnosticChip => chip !== undefined);

  if (likedChips.length === 0 && dislikedChips.length === 0) {
    return null;
  }

  return { likedChips, dislikedChips };
};

const getSummaryFromParams = (
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

const getRepresentativeChip = (type: PersonalColorType): DiagnosticChip | null =>
  diagnosticChips.find(
    (chip) => chip.diagnosticPhase === "detail" && chip.targetTypes.includes(type),
  ) ?? diagnosticChips.find((chip) => chip.targetTypes.includes(type)) ?? null;

const createFallbackPayloadFromSummary = (
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

  return { likedChips, dislikedChips };
};

export const createResultsSearchParams = (payload: TestCompletePayload): URLSearchParams => {
  const params = new URLSearchParams();
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
