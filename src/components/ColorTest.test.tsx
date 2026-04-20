// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { translations } from "../i18n/translations";
import { ColorTest } from "../pages/ColorTest";

const ko = translations.ko;

describe("ColorTest setup flow", () => {
  it("shows mode selection first and starts the simple test by default", () => {
    const handleComplete = vi.fn();

    render(
      <ColorTest onComplete={handleComplete} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />,
    );

    expect(screen.getByText(ko.test.setup.title)).toBeTruthy();
    expect(
      screen
        .getByRole("button", { name: new RegExp(ko.test.mode.simple.label) })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(screen.getByText(ko.test.mode.simple.count(22))).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: ko.test.mode.startSelected }));

    expect(screen.queryByText(ko.test.setup.title)).toBeNull();
    expect(screen.getByText(new RegExp(`${ko.test.liked}:`))).toBeTruthy();
    expect(screen.getByText("1 / 22")).toBeTruthy();
    expect(handleComplete).not.toHaveBeenCalled();
  });

  it("lets the user switch to detailed mode before starting", () => {
    render(<ColorTest onComplete={vi.fn()} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />);

    const detailedButton = screen.getByRole("button", {
      name: new RegExp(ko.test.mode.detailed.label),
    });

    fireEvent.click(detailedButton);

    expect(detailedButton.getAttribute("aria-pressed")).toBe("true");
    expect(
      screen
        .getByRole("button", { name: new RegExp(ko.test.mode.simple.label) })
        .getAttribute("aria-pressed"),
    ).toBe("false");
  });

  it("starts detailed mode", () => {
    render(<ColorTest onComplete={vi.fn()} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />);

    fireEvent.click(
      screen.getByRole("button", { name: new RegExp(ko.test.mode.detailed.label) }),
    );
    fireEvent.click(screen.getByRole("button", { name: ko.test.mode.startSelected }));

    expect(screen.getByText("1 / 39")).toBeTruthy();
  });
});
