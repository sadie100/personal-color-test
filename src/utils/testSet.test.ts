import { describe, expect, it } from "vitest";

import { detailedDiagnosticChips, simpleDiagnosticChips } from "../data/colorData";
import { getSelectedDiagnosticChips } from "./testSet";

describe("testSet utilities", () => {
  it("returns only base and season chips for simple mode", () => {
    const selectedColors = getSelectedDiagnosticChips("simple");

    expect(selectedColors.length).toBe(simpleDiagnosticChips.length);
    expect(selectedColors.every((color) => color.diagnosticPhase === "base" || color.diagnosticPhase === "season")).toBe(
      true,
    );
  });

  it("returns only detail chips for detailed mode", () => {
    const selectedColors = getSelectedDiagnosticChips("detailed");

    expect(selectedColors.length).toBe(detailedDiagnosticChips.length);
    expect(selectedColors.every((color) => color.diagnosticPhase === "detail")).toBe(true);
  });
});
