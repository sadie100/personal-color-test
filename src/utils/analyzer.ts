import { personalColorTypes, personalColorTypeMeta, simpleResultTypes } from "../data/colorData";
import type { ColorDataMap, ColorChip, DiagnosticChip, PersonalColorType, SimpleResultType } from "../types";

export interface TypeScoreEntry {
  type: PersonalColorType;
  score: number;
}

export interface SimpleTypeScoreEntry {
  type: SimpleResultType;
  score: number;
}

const personalColorTypeOrder = new Map(personalColorTypes.map((type, index) => [type, index]));
const simpleResultTypeOrder = new Map(simpleResultTypes.map((type, index) => [type, index]));

const createInitialScores = (): Record<PersonalColorType, number> =>
  personalColorTypes.reduce<Record<PersonalColorType, number>>(
    (accumulator, type) => ({
      ...accumulator,
      [type]: 0,
    }),
    {} as Record<PersonalColorType, number>,
  );

const createInitialSimpleScores = (): Record<SimpleResultType, number> =>
  simpleResultTypes.reduce<Record<SimpleResultType, number>>(
    (accumulator, type) => ({
      ...accumulator,
      [type]: 0,
    }),
    {} as Record<SimpleResultType, number>,
  );

const getSimpleResultTypeFromPersonalColorType = (type: PersonalColorType): SimpleResultType => {
  const meta = personalColorTypeMeta[type];
  return `${meta.season} ${meta.baseTone}` as SimpleResultType;
};

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

export const getSimpleResultScores = (
  likedChips: ReadonlyArray<DiagnosticChip>,
  dislikedChips: ReadonlyArray<DiagnosticChip>,
): Record<SimpleResultType, number> => {
  const scores = createInitialSimpleScores();

  likedChips.forEach((chip) => {
    chip.targetTypes.forEach((type) => {
      scores[getSimpleResultTypeFromPersonalColorType(type)] += 1;
    });
  });

  dislikedChips.forEach((chip) => {
    chip.targetTypes.forEach((type) => {
      scores[getSimpleResultTypeFromPersonalColorType(type)] -= 1;
    });
  });

  return scores;
};

export const getRankedSimpleResultScores = (
  likedChips: ReadonlyArray<DiagnosticChip>,
  dislikedChips: ReadonlyArray<DiagnosticChip>,
): SimpleTypeScoreEntry[] => {
  const scores = getSimpleResultScores(likedChips, dislikedChips);

  return simpleResultTypes
    .map((type) => ({
      type,
      score: scores[type],
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return (simpleResultTypeOrder.get(left.type) ?? 0) - (simpleResultTypeOrder.get(right.type) ?? 0);
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

export const getBestSimpleResults = (
  likedChips: ReadonlyArray<DiagnosticChip>,
  dislikedChips: ReadonlyArray<DiagnosticChip>,
  limit = 1,
): SimpleResultType[] =>
  getRankedSimpleResultScores(likedChips, dislikedChips)
    .slice(0, limit)
    .map(({ type }) => type);

export const analyzeSimplePersonalColor = (
  likedChips: ReadonlyArray<DiagnosticChip>,
  dislikedChips: ReadonlyArray<DiagnosticChip>,
): SimpleResultType | null => getBestSimpleResults(likedChips, dislikedChips, 1)[0] ?? null;

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

export const getWorstSimpleResult = (
  likedChips: ReadonlyArray<DiagnosticChip>,
  dislikedChips: ReadonlyArray<DiagnosticChip>,
): SimpleResultType | null => {
  const rankedTypes = getRankedSimpleResultScores(likedChips, dislikedChips);

  if (rankedTypes.length === 0) {
    return null;
  }

  return [...rankedTypes].sort((left, right) => {
    if (left.score !== right.score) {
      return left.score - right.score;
    }

    return (simpleResultTypeOrder.get(left.type) ?? 0) - (simpleResultTypeOrder.get(right.type) ?? 0);
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
