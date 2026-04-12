import { describe, expect, it } from "vitest";

import { diagnosticChips } from "../data/colorData";
import type { TestCompletePayload } from "../types";
import { createResultsSearchParams, getPayloadFromResultsSearchParams } from "./resultShare";

const getChip = (id: string) => {
  const chip = diagnosticChips.find((entry) => entry.id === id);

  if (!chip) {
    throw new Error(`Missing test chip: ${id}`);
  }

  return chip;
};

const SAMPLE_PAYLOAD: TestCompletePayload = {
  likedChips: [getChip("base-warm-pink"), getChip("season-spring-green"), getChip("detail-spring-bright-red")],
  dislikedChips: [getChip("detail-winter-dark-navy")],
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
      best: "spring-bright",
      second: "spring-bright",
      third: "spring-light",
      worst: "winter-dark",
    });

    const restored = getPayloadFromResultsSearchParams(params);

    expect(restored).not.toBeNull();
    expect(restored?.likedChips.length).toBeGreaterThan(0);
    expect(restored?.likedChips[0]?.targetTypes).toContain("Spring Bright");
    expect(restored?.dislikedChips[0]?.targetTypes).toContain("Winter Dark");
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
