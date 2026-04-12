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
  mode: "detailed",
  likedChips: [getChip("detail-spring-bright-red"), getChip("detail-spring-bright-orange")],
  dislikedChips: [getChip("detail-winter-dark-navy")],
};

describe("result share query serialization", () => {
  it("creates summary params and reconstructs payload from data param", () => {
    const params = createResultsSearchParams(SAMPLE_PAYLOAD);

    expect(params.get("mode")).toBe("detailed");
    expect(params.get("best")).toBeTruthy();
    expect(params.get("data")).toBeTruthy();

    const restored = getPayloadFromResultsSearchParams(params);
    expect(restored).toEqual(SAMPLE_PAYLOAD);
  });

  it("falls back to summary params when encoded data is missing", () => {
    const params = new URLSearchParams({
      mode: "detailed",
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

  it("serializes and restores simple mode payloads", () => {
    const payload: TestCompletePayload = {
      mode: "simple",
      likedChips: [getChip("base-cool-blue"), getChip("season-winter-blue")],
      dislikedChips: [getChip("base-warm-pink"), getChip("season-spring-red")],
    };

    const params = createResultsSearchParams(payload);

    expect(params.get("mode")).toBe("simple");
    expect(params.get("best")).toBe("winter-cool");
    expect(params.get("second")).toBeNull();
    expect(params.get("third")).toBeNull();
    expect(params.get("worst")).toBeTruthy();

    const restored = getPayloadFromResultsSearchParams(params);
    expect(restored).toEqual(payload);
  });

  it("falls back to simple summary params when encoded data is missing", () => {
    const params = new URLSearchParams({
      mode: "simple",
      best: "spring-warm",
      worst: "winter-cool",
    });

    const restored = getPayloadFromResultsSearchParams(params);

    expect(restored?.mode).toBe("simple");
    expect(restored?.likedChips.some((chip) => chip.diagnosticPhase === "base")).toBe(true);
    expect(restored?.likedChips.some((chip) => chip.diagnosticPhase === "season")).toBe(true);
    expect(restored?.dislikedChips.some((chip) => chip.targetTypes.includes("Winter Bright"))).toBe(true);
  });

  it("returns null for invalid summary and corrupted data", () => {
    const params = new URLSearchParams({
      mode: "detailed",
      best: "unknown-tone",
      data: "%%%invalid%%%",
    });

    const restored = getPayloadFromResultsSearchParams(params);
    expect(restored).toBeNull();
  });
});
