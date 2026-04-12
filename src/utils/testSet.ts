import { diagnosticChips } from "../data/colorData";
import type { DiagnosticChip, DiagnosticPhase, TestMode } from "../types";

const diagnosticPhasesByMode: Record<TestMode, readonly DiagnosticPhase[]> = {
  simple: ["base", "season"],
  detailed: ["detail"],
};

export const getIncludedPhasesForMode = (mode: TestMode): readonly DiagnosticPhase[] => diagnosticPhasesByMode[mode];

export const getSelectedDiagnosticChips = (mode: TestMode): DiagnosticChip[] => {
  const includedPhases = new Set(getIncludedPhasesForMode(mode));
  return diagnosticChips.filter((chip) => includedPhases.has(chip.diagnosticPhase));
};

export const getSelectedColorCount = (mode: TestMode): number => getSelectedDiagnosticChips(mode).length;
