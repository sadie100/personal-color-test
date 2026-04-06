import type { ColorDataMap, ColorWithSeason, Hsl, SeasonTone } from "../types";

interface SeasonToneRanking {
  seasonTone: SeasonTone;
  count: number;
  firstSeenAt: number;
  occurrenceIndexes: number[];
}

const isColorWithSeason = (
  color: ColorWithSeason | null | undefined,
): color is ColorWithSeason => color !== null && color !== undefined;

const getSeasonToneRankings = (colors: ReadonlyArray<ColorWithSeason>): SeasonToneRanking[] => {
  const rankingsMap = colors.reduce<Partial<Record<SeasonTone, SeasonToneRanking>>>(
    (accumulator, color, index) => {
      if (!isColorWithSeason(color)) {
        return accumulator;
      }

      const existing = accumulator[color.seasonTone];

      if (!existing) {
        accumulator[color.seasonTone] = {
          seasonTone: color.seasonTone,
          count: 1,
          firstSeenAt: index,
          occurrenceIndexes: [index],
        };
        return accumulator;
      }

      existing.count += 1;
      existing.occurrenceIndexes.push(index);
      return accumulator;
    },
    {},
  );

  return Object.values(rankingsMap)
    .filter((ranking): ranking is SeasonToneRanking => ranking !== undefined)
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      const leftReachedAt =
        left.occurrenceIndexes[left.count - 1] ?? Number.MAX_SAFE_INTEGER;
      const rightReachedAt =
        right.occurrenceIndexes[right.count - 1] ?? Number.MAX_SAFE_INTEGER;

      if (leftReachedAt !== rightReachedAt) {
        return leftReachedAt - rightReachedAt;
      }

      if (left.firstSeenAt !== right.firstSeenAt) {
        return left.firstSeenAt - right.firstSeenAt;
      }

      return left.seasonTone.localeCompare(right.seasonTone);
    });
};

export const getBestResults = (
  likedColors: ReadonlyArray<ColorWithSeason>,
  limit = 3,
): SeasonTone[] =>
  getSeasonToneRankings(likedColors)
    .slice(0, limit)
    .map(({ seasonTone }) => seasonTone);

export const analyzePersonalColor = (
  likedColors: ReadonlyArray<ColorWithSeason>,
): SeasonTone | null => getBestResults(likedColors, 1)[0] ?? null;

export const getWorstResult = (
  dislikedColors: ReadonlyArray<ColorWithSeason>,
  bestResult: SeasonTone | null,
): SeasonTone | null => {
  const rankedWorstResults = getSeasonToneRankings(dislikedColors);
  const worstMatch = rankedWorstResults.find(({ seasonTone }) => seasonTone !== bestResult);

  return worstMatch?.seasonTone ?? null;
};

export const getRecommendedColors = (
  personalColorType: SeasonTone,
  allColors: ColorDataMap,
): ColorWithSeason[] =>
  allColors[personalColorType].map((color) => ({
    ...color,
    seasonTone: personalColorType,
  }));

export const getAvoidColors = (
  worstColorType: SeasonTone,
  allColors: ColorDataMap,
): ColorWithSeason[] =>
  allColors[worstColorType].map((color) => ({
    ...color,
    seasonTone: worstColorType,
  }));

export const calculateChromaFromHsl = ({ s, l }: Hsl): number => {
  const saturation = s / 100;
  const lightness = l / 100;
  return saturation * (1 - Math.abs(2 * lightness - 1));
};

export const calculateTurbidityFromHsl = (hsl: Hsl): number =>
  (1 - calculateChromaFromHsl(hsl)) * 100;
