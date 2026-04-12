import { describe, expect, it } from "vitest";

import { diagnosticChips } from "../data/colorData";
import {
  analyzePersonalColor,
  analyzeSimplePersonalColor,
  getBestResults,
  getBestSimpleResults,
  getPersonalColorScores,
  getSimpleResultScores,
  getWorstResult,
  getWorstSimpleResult,
} from "./analyzer";

const getChip = (id: string) => {
  const chip = diagnosticChips.find((entry) => entry.id === id);

  if (!chip) {
    throw new Error(`Missing test chip: ${id}`);
  }

  return chip;
};

describe("8-type score analysis", () => {
  it("adds points to the matching warm base types", () => {
    const scores = getPersonalColorScores([getChip("base-warm-pink")], []);

    expect(scores["Spring Light"]).toBe(1);
    expect(scores["Spring Bright"]).toBe(1);
    expect(scores["Autumn Muted"]).toBe(1);
    expect(scores["Autumn Dark"]).toBe(1);
    expect(scores["Summer Light"]).toBe(0);
    expect(scores["Winter Bright"]).toBe(0);
  });

  it("subtracts points from the matching season and detail types on dislike", () => {
    const scores = getPersonalColorScores([], [getChip("season-summer-blue"), getChip("detail-winter-dark-navy")]);

    expect(scores["Summer Light"]).toBe(-1);
    expect(scores["Summer Muted"]).toBe(-1);
    expect(scores["Winter Dark"]).toBe(-1);
    expect(scores["Spring Light"]).toBe(0);
  });

  it("returns top 3 and worst 1 from accumulated scores", () => {
    const liked = [
      getChip("base-warm-pink"),
      getChip("season-spring-green"),
      getChip("detail-spring-bright-red"),
      getChip("detail-bright-green"),
    ];
    const disliked = [getChip("season-summer-purple"), getChip("detail-winter-dark-navy")];

    expect(analyzePersonalColor(liked, disliked)).toBe("Spring Bright");
    expect(getBestResults(liked, disliked, 3)).toEqual(["Spring Bright", "Spring Light", "Autumn Muted"]);
    expect(getWorstResult(liked, disliked)).toBe("Summer Light");
  });

  it("supports detail-only detailed mode inputs", () => {
    const liked = [
      getChip("detail-spring-bright-red"),
      getChip("detail-spring-bright-orange"),
      getChip("detail-bright-green"),
    ];
    const disliked = [getChip("detail-winter-dark-navy")];

    expect(analyzePersonalColor(liked, disliked)).toBe("Spring Bright");
    expect(getBestResults(liked, disliked, 2)).toEqual(["Spring Bright", "Winter Bright"]);
    expect(getWorstResult(liked, disliked)).toBe("Winter Dark");
  });
});

describe("simple mode seasonal analysis", () => {
  it("aggregates detailed type targets into seasonal results", () => {
    const scores = getSimpleResultScores([getChip("base-warm-pink"), getChip("season-spring-green")], []);

    expect(scores["Spring Warm"]).toBe(4);
    expect(scores["Autumn Warm"]).toBe(2);
    expect(scores["Summer Cool"]).toBe(0);
    expect(scores["Winter Cool"]).toBe(0);
  });

  it("returns best and worst seasonal result from base and season chips", () => {
    const liked = [getChip("base-cool-blue"), getChip("season-winter-blue"), getChip("season-winter-purple")];
    const disliked = [getChip("base-warm-pink"), getChip("season-spring-red")];

    expect(analyzeSimplePersonalColor(liked, disliked)).toBe("Winter Cool");
    expect(getBestSimpleResults(liked, disliked, 1)).toEqual(["Winter Cool"]);
    expect(getWorstSimpleResult(liked, disliked)).toBe("Spring Warm");
  });
});
