// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { diagnosticChips } from "../data/colorData";
import { translations } from "../i18n/translations";
import { Results } from "../pages/Results";

const ko = translations.ko;

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

    expect(screen.getByText(ko.results.diagnosticChipTitle(ko.results.best))).toBeTruthy();
    expect(screen.getByText(ko.results.diagnosticChipTitle(ko.results.worst))).toBeTruthy();
    expect(screen.getByText("페일 살몬")).toBeTruthy();
    expect(screen.getByText("위트")).toBeTruthy();
    expect(screen.getByText("로빈 에그 블루")).toBeTruthy();
    expect(screen.getByText("로열")).toBeTruthy();
    expect(screen.getAllByText(ko.results.badges.liked).length).toBeGreaterThan(0);
    expect(screen.getAllByText(ko.results.badges.disliked).length).toBeGreaterThan(0);
  });

  it("collapses the worst section by default and expands on toggle", () => {
    render(
      <Results
        mode="simple"
        likedChips={[getChip("base-warm-pink"), getChip("season-spring-orange")]}
        dislikedChips={[getChip("base-cool-blue"), getChip("season-winter-blue")]}
        onRetry={() => {}}
        lang="ko"
      />,
    );

    const toggle = screen.getByRole("button", { name: ko.results.worst });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });
});
