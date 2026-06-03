import { describe, expect, it } from "vitest";

import { getReadableInkColor } from "./contrast";

const INK = "#14110f";
const PAPER = "#fafaf7";

describe("getReadableInkColor", () => {
  it("밝은 칩에는 잉크(거의 검정) 텍스트를 고른다", () => {
    expect(getReadableInkColor("#FFDACA")).toBe(INK); // 밝은 살구
    expect(getReadableInkColor("#ffffff")).toBe(INK);
  });

  it("어두운 칩에는 페이퍼(오프화이트) 텍스트를 고른다", () => {
    expect(getReadableInkColor("#0F3D2E")).toBe(PAPER); // 딥 그린
    expect(getReadableInkColor("#000000")).toBe(PAPER);
  });

  it("# 없는 입력도 처리한다", () => {
    expect(getReadableInkColor("FFDACA")).toBe(INK);
  });
});
