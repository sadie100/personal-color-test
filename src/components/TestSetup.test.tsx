// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { translations } from "../i18n/translations";
import { TestSetup } from "./TestSetup";

const ko = translations.ko;

describe("TestSetup", () => {
  it("starts with detailed mode selected by default", () => {
    const onStart = vi.fn();
    render(<TestSetup lang="ko" onToggleLang={() => {}} onHome={() => {}} onStart={onStart} />);
    fireEvent.click(screen.getByText(ko.test.mode.startSelected));
    expect(onStart).toHaveBeenCalledWith(expect.objectContaining({ mode: "detailed" }));
  });

  it("renders a recommended badge on the detailed card", () => {
    render(<TestSetup lang="ko" onToggleLang={() => {}} onHome={() => {}} onStart={() => {}} />);
    expect(screen.getByText(ko.test.mode.detailed.recommended)).toBeTruthy();
  });
});
