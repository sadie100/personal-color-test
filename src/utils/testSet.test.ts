import { describe, expect, it } from "vitest";

import { diagnosticChips } from "../data/colorData";
import { getIncludedPhasesForMode, getSelectedDiagnosticChips } from "./testSet";

describe("testSet utilities", () => {
  it("returns only base and season chips for simple mode", () => {
    const selectedColors = getSelectedDiagnosticChips("simple");

    expect(selectedColors.length).toBeGreaterThan(0);
    expect(selectedColors.every((color) => color.diagnosticPhase !== "detail")).toBe(true);
    expect(selectedColors.every((color) => color.diagnosticPhase === "base" || color.diagnosticPhase === "season")).toBe(
      true,
    );
  });

  it("returns every diagnostic chip for detailed mode", () => {
    expect(getSelectedDiagnosticChips("detailed").length).toBe(diagnosticChips.length);
  });

  it("returns included phases in order for each mode", () => {
    expect(getIncludedPhasesForMode("simple")).toEqual(["base", "season"]);
    expect(getIncludedPhasesForMode("detailed")).toEqual(["base", "season", "detail"]);
  });
});
