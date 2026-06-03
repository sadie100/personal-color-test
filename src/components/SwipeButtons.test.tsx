// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { translations } from "../i18n/translations";
import { SwipeButtons } from "./SwipeButtons";

const ko = translations.ko.test;

describe("SwipeButtons", () => {
  it("좋아요/싫어요 버튼에 다국어 aria-label을 단다", () => {
    render(<SwipeButtons lang="ko" onLike={vi.fn()} onDislike={vi.fn()} />);

    expect(screen.getByRole("button", { name: ko.like })).toBeTruthy();
    expect(screen.getByRole("button", { name: ko.dislike })).toBeTruthy();
  });

  it("클릭 시 해당 핸들러를 호출한다", () => {
    const onLike = vi.fn();
    const onDislike = vi.fn();
    render(<SwipeButtons lang="ko" onLike={onLike} onDislike={onDislike} />);

    fireEvent.click(screen.getByRole("button", { name: ko.like }));
    fireEvent.click(screen.getByRole("button", { name: ko.dislike }));

    expect(onLike).toHaveBeenCalledTimes(1);
    expect(onDislike).toHaveBeenCalledTimes(1);
  });
});
