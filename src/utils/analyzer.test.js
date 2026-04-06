import { describe, expect, it } from "vitest";
import { calculateChromaFromHsl, calculateTurbidityFromHsl } from "./analyzer";

describe("chroma/turbidity calculations", () => {
  it("calculates expected chroma and turbidity for representative colors", () => {
    const vividMid = { h: 0, s: 100, l: 50 };
    const chromaVividMid = calculateChromaFromHsl(vividMid);
    const turbidityVividMid = calculateTurbidityFromHsl(vividMid);

    expect(chromaVividMid).toBeCloseTo(1, 6);
    expect(turbidityVividMid).toBeCloseTo(0, 6);

    const white = { h: 0, s: 0, l: 100 };
    const chromaWhite = calculateChromaFromHsl(white);
    const turbidityWhite = calculateTurbidityFromHsl(white);

    expect(chromaWhite).toBeCloseTo(0, 6);
    expect(turbidityWhite).toBeCloseTo(100, 6);
  });
});
