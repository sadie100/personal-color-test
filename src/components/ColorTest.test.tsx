// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ColorTest } from "./ColorTest";

describe("ColorTest setup flow", () => {
  it("shows core preset defaults first and starts the test with customized categories", () => {
    const handleComplete = vi.fn();

    render(
      <ColorTest onComplete={handleComplete} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />,
    );

    expect(screen.getByText("어떤 방식으로 테스트할까요?")).toBeTruthy();
    expect(screen.getByText("선택된 카테고리 5개")).toBeTruthy();

    const orangeButton = screen.getByRole("button", { name: "주황" });
    expect(orangeButton.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(orangeButton);

    expect(screen.getByText("선택된 카테고리 6개")).toBeTruthy();
    expect(orangeButton.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "이 설정으로 테스트 시작" }));

    expect(screen.queryByText("어떤 방식으로 테스트할까요?")).toBeNull();
    expect(screen.getByText(/좋아요:/)).toBeTruthy();
    expect(screen.getByText("현재 카테고리 빨강")).toBeTruthy();
    expect(screen.getByText("카테고리 진행 순서")).toBeTruthy();
    expect(screen.getByText(/^남은 색상 \d+개$/)).toBeTruthy();
    expect(screen.getByText(/^현재 카테고리 남은 색상 \d+개$/)).toBeTruthy();
    expect(handleComplete).not.toHaveBeenCalled();
  });

  it("resets categories when switching to full preset", () => {
    render(<ColorTest onComplete={vi.fn()} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /^전체 테스트/ }));

    expect(screen.getByText("선택된 카테고리 7개")).toBeTruthy();
    expect(screen.getByRole("button", { name: "주황" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "노랑" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("prevents deselecting the final remaining category", () => {
    render(<ColorTest onComplete={vi.fn()} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "빨강" }));
    fireEvent.click(screen.getByRole("button", { name: "초록" }));
    fireEvent.click(screen.getByRole("button", { name: "파랑" }));
    fireEvent.click(screen.getByRole("button", { name: "보라/핑크" }));

    const neutralButton = screen.getByRole("button", { name: "무채색" });

    expect(screen.getByText("선택된 카테고리 1개")).toBeTruthy();

    fireEvent.click(neutralButton);

    expect(screen.getByText("선택된 카테고리 1개")).toBeTruthy();
    expect(neutralButton.getAttribute("aria-pressed")).toBe("true");
  });

  it("uses the final selected category order during the test", () => {
    render(<ColorTest onComplete={vi.fn()} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "빨강" }));
    fireEvent.click(screen.getByRole("button", { name: "빨강" }));
    fireEvent.click(screen.getByRole("button", { name: "이 설정으로 테스트 시작" }));

    const redLabels = screen.getAllByText("빨강");
    const greenLabels = screen.getAllByText("초록");

    expect(screen.getByText("현재 카테고리 초록")).toBeTruthy();
    expect(redLabels[redLabels.length - 1]?.className).not.toContain("bg-white text-gray-900");
    expect(greenLabels[greenLabels.length - 1]?.className).toContain("bg-white text-gray-900");
  });
});
