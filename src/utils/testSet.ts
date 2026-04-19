import { detailedDiagnosticChips, simpleDiagnosticChips } from "../data/colorData";
import type { DiagnosticChip, TestMode } from "../types";

const diagnosticChipsByMode: Record<TestMode, DiagnosticChip[]> = {
  simple: simpleDiagnosticChips,
  detailed: detailedDiagnosticChips,
};

export const getSelectedDiagnosticChips = (mode: TestMode): DiagnosticChip[] => diagnosticChipsByMode[mode];

export const getSelectedColorCount = (mode: TestMode): number => getSelectedDiagnosticChips(mode).length;
