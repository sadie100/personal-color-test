import { describe, expect, it } from "vitest";

import { diagnosticChips } from "../data/colorData";
import { allHueCategories, getSelectedDiagnosticChips } from "./testSet";

describe("testSet utilities", () => {
  it("returns all diagnostic chips when every category is selected", () => {
    expect(getSelectedDiagnosticChips(allHueCategories).length).toBe(diagnosticChips.length);
  });

  it("filters colors only from the selected categories", () => {
    const selectedColors = getSelectedDiagnosticChips(["red", "neutral"]);

    expect(selectedColors.length).toBeGreaterThan(0);
    expect(selectedColors.every((color) => color.hueCategory === "red" || color.hueCategory === "neutral")).toBe(true);
    expect(selectedColors.some((color) => color.hex === "#FDF5E0")).toBe(true);
  });

  it("returns chips grouped by the selected category order", () => {
    const selectedColors = getSelectedDiagnosticChips(["neutral", "red"]);
    const firstRedIndex = selectedColors.findIndex((color) => color.hueCategory === "red");

    expect(firstRedIndex).toBeGreaterThan(0);
    expect(selectedColors[0]!.hueCategory).toBe("neutral");
    expect(selectedColors.slice(0, firstRedIndex).every((color) => color.hueCategory === "neutral")).toBe(true);
  });
});
