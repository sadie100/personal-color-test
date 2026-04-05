const getSeasonToneRankings = (colors) => {
  const rankingsMap = colors.reduce((acc, color, index) => {
    if (!color?.seasonTone) {
      return acc;
    }

    if (!acc[color.seasonTone]) {
      acc[color.seasonTone] = {
        seasonTone: color.seasonTone,
        count: 0,
        firstSeenAt: index,
        occurrenceIndexes: [],
      };
    }

    acc[color.seasonTone].count += 1;
    acc[color.seasonTone].occurrenceIndexes.push(index);

    return acc;
  }, {});

  return Object.values(rankingsMap).sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }

    const aReachedAt = a.occurrenceIndexes[a.count - 1] ?? Number.MAX_SAFE_INTEGER;
    const bReachedAt = b.occurrenceIndexes[b.count - 1] ?? Number.MAX_SAFE_INTEGER;

    if (aReachedAt !== bReachedAt) {
      return aReachedAt - bReachedAt;
    }

    if (a.firstSeenAt !== b.firstSeenAt) {
      return a.firstSeenAt - b.firstSeenAt;
    }

    return a.seasonTone.localeCompare(b.seasonTone);
  });
};

export const getBestResults = (likedColors, limit = 3) =>
  getSeasonToneRankings(likedColors)
    .slice(0, limit)
    .map(({ seasonTone }) => seasonTone);

export const analyzePersonalColor = (likedColors) => getBestResults(likedColors, 1)[0] || null;

export const getWorstResult = (dislikedColors, bestResult) => {
  const rankedWorstResults = getSeasonToneRankings(dislikedColors);
  const worstMatch = rankedWorstResults.find(({ seasonTone }) => seasonTone !== bestResult);

  return worstMatch?.seasonTone || null;
};

export const getRecommendedColors = (personalColorType, allColors) => allColors[personalColorType] || [];

export const getAvoidColors = (worstColorType, allColors) => allColors[worstColorType] || [];
