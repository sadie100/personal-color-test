import { describe, expect, it } from "vitest";

import type { TestCompletePayload } from "../types";
import { createResultsSearchParams, getPayloadFromResultsSearchParams } from "./resultShare";

const SAMPLE_PAYLOAD: TestCompletePayload = {
  likedColors: [
    {
      hex: "#FFA07A",
      name: "Light Salmon",
      hsl: { h: 17, s: 100, l: 74 },
      seasonTone: "Autumn Light",
    },
    {
      hex: "#DEB887",
      name: "Burlywood",
      hsl: { h: 34, s: 57, l: 70 },
      seasonTone: "Autumn Light",
    },
    {
      hex: "#FFD700",
      name: "Gold",
      hsl: { h: 51, s: 100, l: 50 },
      seasonTone: "Spring Bright",
    },
  ],
  dislikedColors: [
    {
      hex: "#4682B4",
      name: "Muted Blue",
      hsl: { h: 207, s: 44, l: 49 },
      seasonTone: "Summer Muted",
    },
  ],
};

describe("result share query serialization", () => {
  it("creates summary params and reconstructs payload from data param", () => {
    const params = createResultsSearchParams(SAMPLE_PAYLOAD);

    expect(params.get("best")).toBeTruthy();
    expect(params.get("data")).toBeTruthy();

    const restored = getPayloadFromResultsSearchParams(params);
    expect(restored).toEqual(SAMPLE_PAYLOAD);
  });

  it("falls back to summary params when encoded data is missing", () => {
    const params = new URLSearchParams({
      best: "autumn-light",
      second: "spring-bright",
      third: "autumn-bright",
      worst: "summer-muted",
    });

    const restored = getPayloadFromResultsSearchParams(params);

    expect(restored).not.toBeNull();
    expect(restored?.likedColors.length).toBeGreaterThan(0);
    expect(restored?.likedColors[0]?.seasonTone).toBe("Autumn Light");
    expect(restored?.dislikedColors[0]?.seasonTone).toBe("Summer Muted");
  });

  it("returns null for invalid summary and corrupted data", () => {
    const params = new URLSearchParams({
      best: "unknown-tone",
      data: "%%%invalid%%%",
    });

    const restored = getPayloadFromResultsSearchParams(params);
    expect(restored).toBeNull();
  });
});
