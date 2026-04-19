// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { diagnosticChips } from "../data/colorData";
import { Results } from "../pages/Results";

const getChip = (id: string) => {
  const chip = diagnosticChips.find((entry) => entry.id === id);

  if (!chip) {
    throw new Error(`Missing test chip: ${id}`);
  }

  return chip;
};

describe("Results", () => {
  it("shows LIKE and NOPE directly on simple diagnostic chip grids", () => {
    render(
      <Results
        mode="simple"
        likedChips={[getChip("base-warm-pink"), getChip("season-spring-orange")]}
        dislikedChips={[getChip("base-cool-blue"), getChip("season-winter-blue")]}
        onRetry={() => {}}
        lang="ko"
      />,
    );

    expect(screen.getByText("Best Color 진단칩")).toBeTruthy();
    expect(screen.getByText("Worst Color 진단칩")).toBeTruthy();
    expect(screen.getByText("엘리노어")).toBeTruthy();
    expect(screen.getByText("살로미")).toBeTruthy();
    expect(screen.getByText("헤븐")).toBeTruthy();
    expect(screen.getByText("인디고 다이")).toBeTruthy();
    expect(screen.getAllByText("LIKE").length).toBeGreaterThan(0);
    expect(screen.getAllByText("NOPE").length).toBeGreaterThan(0);
  });
});
