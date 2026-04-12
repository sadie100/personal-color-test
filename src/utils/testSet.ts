import { colorData, seasonTones } from "../data/colorData";
import type { ColorWithSeason, Hsl, HueCategory, TestPreset } from "../types";

export const allHueCategories = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purplePink",
  "neutral",
] as const satisfies readonly HueCategory[];

export const coreHueCategories = [
  "red",
  "green",
  "blue",
  "purplePink",
  "neutral",
] as const satisfies readonly HueCategory[];

const NEUTRAL_SATURATION_MAX = 10;

export const getHueCategoryForHsl = ({ h, s }: Hsl): HueCategory => {
  if (s <= NEUTRAL_SATURATION_MAX) {
    return "neutral";
  }

  if (h < 20 || h >= 345) {
    return "red";
  }

  if (h < 45) {
    return "orange";
  }

  if (h < 75) {
    return "yellow";
  }

  if (h < 165) {
    return "green";
  }

  if (h < 255) {
    return "blue";
  }

  return "purplePink";
};

export const getDefaultCategoriesForPreset = (preset: TestPreset): HueCategory[] =>
  preset === "core" ? [...coreHueCategories] : [...allHueCategories];

const allColors: ColorWithSeason[] = seasonTones.flatMap((seasonTone) =>
  colorData[seasonTone].map((color) => ({ ...color, seasonTone })),
);

export const getSelectedTestColors = (selectedCategories: readonly HueCategory[]): ColorWithSeason[] => {
  const selectedCategorySet = new Set(selectedCategories);

  return selectedCategories.flatMap((selectedCategory) =>
    allColors.filter((color) => {
      if (!selectedCategorySet.has(selectedCategory)) {
        return false;
      }

      return getHueCategoryForHsl(color.hsl) === selectedCategory;
    }),
  );
};

export const getSelectedColorCount = (selectedCategories: readonly HueCategory[]): number =>
  getSelectedTestColors(selectedCategories).length;
