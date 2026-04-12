import { describe, expect, it } from "vitest";

import {
  allHueCategories,
  coreHueCategories,
  getDefaultCategoriesForPreset,
  getHueCategoryForHsl,
  getSelectedTestColors,
} from "./testSet";

describe("testSet utilities", () => {
  it("returns all 180 colors when every category is selected", () => {
    expect(getSelectedTestColors(allHueCategories).length).toBe(180);
  });

  it("returns expected defaults for each preset", () => {
    expect(getDefaultCategoriesForPreset("full")).toEqual([...allHueCategories]);
    expect(getDefaultCategoriesForPreset("core")).toEqual([...coreHueCategories]);
  });

  it("classifies representative hues into expected categories", () => {
    expect(getHueCategoryForHsl({ h: 0, s: 100, l: 50 })).toBe("red");
    expect(getHueCategoryForHsl({ h: 30, s: 100, l: 50 })).toBe("orange");
    expect(getHueCategoryForHsl({ h: 60, s: 100, l: 50 })).toBe("yellow");
    expect(getHueCategoryForHsl({ h: 120, s: 100, l: 50 })).toBe("green");
    expect(getHueCategoryForHsl({ h: 210, s: 100, l: 50 })).toBe("blue");
    expect(getHueCategoryForHsl({ h: 300, s: 100, l: 50 })).toBe("purplePink");
    expect(getHueCategoryForHsl({ h: 0, s: 0, l: 50 })).toBe("neutral");
  });

  it("filters colors only from the selected categories", () => {
    const selectedColors = getSelectedTestColors(["red", "neutral"]);

    expect(selectedColors.length).toBeGreaterThan(0);
    expect(
      selectedColors.every((color) => {
        const category = getHueCategoryForHsl(color.hsl);
        return category === "red" || category === "neutral";
      }),
    ).toBe(true);
    expect(selectedColors.some((color) => color.name === "Black")).toBe(true);
  });

  it("returns colors grouped by the selected category order", () => {
    const selectedColors = getSelectedTestColors(["neutral", "red"]);
    const firstRedIndex = selectedColors.findIndex((color) => getHueCategoryForHsl(color.hsl) === "red");

    expect(firstRedIndex).toBeGreaterThan(0);
    expect(getHueCategoryForHsl(selectedColors[0]!.hsl)).toBe("neutral");
    expect(
      selectedColors.slice(0, firstRedIndex).every((color) => getHueCategoryForHsl(color.hsl) === "neutral"),
    ).toBe(true);
  });
});
