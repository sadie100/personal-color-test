// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { translations } from "../i18n/translations";
import { ColorTest } from "../pages/ColorTest";

const ko = translations.ko;

describe("ColorTest setup flow", () => {
  it("shows mode selection first and starts the detailed test by default", () => {
    const handleComplete = vi.fn();

    render(
      <ColorTest onComplete={handleComplete} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />,
    );

    expect(screen.getByText(ko.test.setup.title)).toBeTruthy();
    expect(
      screen
        .getByRole("radio", { name: new RegExp(ko.test.mode.detailed.label) })
        .getAttribute("aria-checked"),
    ).toBe("true");
    expect(screen.getByText(ko.test.mode.detailed.count(39))).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: ko.test.mode.startSelected }));

    expect(screen.queryByText(ko.test.setup.title)).toBeNull();
    expect(screen.getByText(new RegExp(`${ko.test.liked}:`))).toBeTruthy();
    expect(screen.getByText("1 / 39")).toBeTruthy();
    expect(handleComplete).not.toHaveBeenCalled();
  });

  it("lets the user switch from the default detailed mode to simple", () => {
    render(<ColorTest onComplete={vi.fn()} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />);

    const simpleButton = screen.getByRole("radio", {
      name: new RegExp(ko.test.mode.simple.label),
    });
    const detailedButton = screen.getByRole("radio", {
      name: new RegExp(ko.test.mode.detailed.label),
    });

    fireEvent.click(simpleButton);

    expect(simpleButton.getAttribute("aria-checked")).toBe("true");
    expect(detailedButton.getAttribute("aria-checked")).toBe("false");
  });

  it("starts detailed mode", () => {
    render(<ColorTest onComplete={vi.fn()} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />);

    fireEvent.click(
      screen.getByRole("radio", { name: new RegExp(ko.test.mode.detailed.label) }),
    );
    fireEvent.click(screen.getByRole("button", { name: ko.test.mode.startSelected }));

    expect(screen.getByText("1 / 39")).toBeTruthy();
  });

  it("스와이프 화면에는 언어 토글을 노출하지 않는다", () => {
    render(<ColorTest onComplete={vi.fn()} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />);

    // 모드 선택(setup) 화면에는 언어 토글이 있다
    expect(screen.queryByText("한국어")).not.toBeNull();

    // 테스트 시작 → 스와이프 화면 진입
    fireEvent.click(screen.getByRole("button", { name: ko.test.mode.startSelected }));

    // 스와이프 화면에는 언어 토글 라벨이 없어야 한다
    expect(screen.getByText("1 / 39")).toBeTruthy();
    expect(screen.queryByText("한국어")).toBeNull();
  });
});
