import { personalColorTypes } from "../data/colorData";
import type { ColorDataMap, ColorChip, DiagnosticChip, PersonalColorType } from "../types";

export interface TypeScoreEntry {
  type: PersonalColorType;
  score: number;
}

const personalColorTypeOrder = new Map(personalColorTypes.map((type, index) => [type, index]));

const createInitialScores = (): Record<PersonalColorType, number> =>
  personalColorTypes.reduce<Record<PersonalColorType, number>>(
    (accumulator, type) => ({
      ...accumulator,
      [type]: 0,
    }),
    {} as Record<PersonalColorType, number>,
  );

export const getPersonalColorScores = (
  likedChips: ReadonlyArray<DiagnosticChip>,
  dislikedChips: ReadonlyArray<DiagnosticChip>,
): Record<PersonalColorType, number> => {
  const scores = createInitialScores();

  likedChips.forEach((chip) => {
    chip.targetTypes.forEach((type) => {
      scores[type] += 1;
    });
  });

  dislikedChips.forEach((chip) => {
    chip.targetTypes.forEach((type) => {
      scores[type] -= 1;
    });
  });

  return scores;
};

export const getRankedTypeScores = (
  likedChips: ReadonlyArray<DiagnosticChip>,
  dislikedChips: ReadonlyArray<DiagnosticChip>,
): TypeScoreEntry[] => {
  const scores = getPersonalColorScores(likedChips, dislikedChips);

  return personalColorTypes
    .map((type) => ({
      type,
      score: scores[type],
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return (personalColorTypeOrder.get(left.type) ?? 0) - (personalColorTypeOrder.get(right.type) ?? 0);
    });
};

export const getBestResults = (
  likedChips: ReadonlyArray<DiagnosticChip>,
  dislikedChips: ReadonlyArray<DiagnosticChip>,
  limit = 3,
): PersonalColorType[] =>
  getRankedTypeScores(likedChips, dislikedChips)
    .slice(0, limit)
    .map(({ type }) => type);

export const analyzePersonalColor = (
  likedChips: ReadonlyArray<DiagnosticChip>,
  dislikedChips: ReadonlyArray<DiagnosticChip>,
): PersonalColorType | null => getBestResults(likedChips, dislikedChips, 1)[0] ?? null;

export const getWorstResult = (
  likedChips: ReadonlyArray<DiagnosticChip>,
  dislikedChips: ReadonlyArray<DiagnosticChip>,
): PersonalColorType | null => {
  const rankedTypes = getRankedTypeScores(likedChips, dislikedChips);

  if (rankedTypes.length === 0) {
    return null;
  }

  return [...rankedTypes].sort((left, right) => {
    if (left.score !== right.score) {
      return left.score - right.score;
    }

    return (personalColorTypeOrder.get(left.type) ?? 0) - (personalColorTypeOrder.get(right.type) ?? 0);
  })[0]?.type ?? null;
};

export const getRecommendedColors = (
  personalColorType: PersonalColorType,
  allColors: ColorDataMap,
): ColorChip[] => allColors[personalColorType];

export const getAvoidColors = (
  worstColorType: PersonalColorType,
  allColors: ColorDataMap,
): ColorChip[] => allColors[worstColorType];
