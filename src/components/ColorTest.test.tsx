// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ColorTest } from "./ColorTest";

describe("ColorTest setup flow", () => {
  it("shows mode selection first and starts the simple test by default", () => {
    const handleComplete = vi.fn();

    render(
      <ColorTest onComplete={handleComplete} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />,
    );

    expect(screen.getByText("원하는 테스트 모드를 골라보세요")).toBeTruthy();
    expect(screen.getByRole("button", { name: /간략 테스트/ }).getAttribute("aria-pressed")).toBe(
      "true",
    );
    expect(screen.getByText("문항 22개 · 베이스 + 계절")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "선택한 모드로 테스트 시작" }));

    expect(screen.queryByText("원하는 테스트 모드를 골라보세요")).toBeNull();
    expect(screen.getByText(/좋아요:/)).toBeTruthy();
    expect(screen.getByText("1 / 22")).toBeTruthy();
    expect(handleComplete).not.toHaveBeenCalled();
  });

  it("lets the user switch to detailed mode before starting", () => {
    render(<ColorTest onComplete={vi.fn()} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />);

    const detailedButton = screen.getByRole("button", { name: /세부 테스트/ });

    fireEvent.click(detailedButton);

    expect(detailedButton.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: /간략 테스트/ }).getAttribute("aria-pressed")).toBe(
      "false",
    );
  });

  it("starts detailed mode", () => {
    render(<ColorTest onComplete={vi.fn()} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /세부 테스트/ }));
    fireEvent.click(screen.getByRole("button", { name: "선택한 모드로 테스트 시작" }));

    expect(screen.getByText("1 / 39")).toBeTruthy();
  });
});
