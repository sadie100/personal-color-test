// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { diagnosticChips, getChipName } from "../data/colorData";
import type { DiagnosticChip } from "../types";
import { ColorCard } from "./ColorCard";

// 실제 데이터 칩에서 hex만 덮어써 타입을 만족시킨다(손수 만든 mock은 ColorChip 필드가 깨지기 쉬움)
const chipWithHex = (hex: string): DiagnosticChip => ({ ...diagnosticChips[0]!, hex });
const name = getChipName(diagnosticChips[0]!, "ko");

describe("ColorCard label", () => {
  it("밝은 칩 위에서는 라벨이 잉크색이다", () => {
    render(
      <ColorCard color={chipWithHex("#FFDACA")} lang="ko" dragX={0} isDragging={false} exitDirection={null} />,
    );
    const label = screen.getByText(name);
    // 라벨 컨테이너(부모)에 color 인라인 스타일 적용
    expect((label.parentElement as HTMLElement).style.color).toBe("rgb(20, 17, 15)"); // #14110f
  });

  it("어두운 칩 위에서는 라벨이 페이퍼색이다", () => {
    render(
      <ColorCard color={chipWithHex("#0F3D2E")} lang="ko" dragX={0} isDragging={false} exitDirection={null} />,
    );
    const label = screen.getByText(name);
    expect((label.parentElement as HTMLElement).style.color).toBe("rgb(250, 250, 247)"); // #fafaf7
  });
});
