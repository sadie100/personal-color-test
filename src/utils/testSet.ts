import { diagnosticChips } from "../data/colorData";
import type { DiagnosticChip, HueCategory } from "../types";

export const allHueCategories = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purplePink",
  "neutral",
] as const satisfies readonly HueCategory[];

export const getSelectedDiagnosticChips = (
  selectedCategories: readonly HueCategory[],
): DiagnosticChip[] =>
  selectedCategories.flatMap((selectedCategory) =>
    diagnosticChips.filter((chip) => chip.hueCategory === selectedCategory),
  );

export const getSelectedColorCount = (selectedCategories: readonly HueCategory[]): number =>
  getSelectedDiagnosticChips(selectedCategories).length;
