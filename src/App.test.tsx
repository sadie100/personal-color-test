// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { cleanup } from "@testing-library/react";

import App from "./App";
import { diagnosticChips } from "./data/colorData";
import type { TestCompletePayload } from "./types";
import { createResultsSearchParams } from "./utils/resultShare";

vi.mock("./components/Header", () => ({
  Header: ({ screen: currentScreen }: { screen: string }) => (
    <div data-testid="header">{`header-${currentScreen}`}</div>
  ),
}));

vi.mock("./components/Home", () => ({
  Home: () => <div data-testid="home-screen">home-screen</div>,
}));

vi.mock("./components/About", () => ({
  About: () => <div data-testid="about-screen">about-screen</div>,
}));

vi.mock("./components/ColorTest", () => ({
  ColorTest: () => <div data-testid="test-screen">test-screen</div>,
}));

vi.mock("./components/Results", () => ({
  Results: ({
    mode,
    likedChips,
    dislikedChips,
    shareUrl,
  }: {
    mode: string;
    likedChips: Array<{ name: string }>;
    dislikedChips: Array<{ name: string }>;
    shareUrl?: string;
  }) => (
    <div data-testid="results-screen">
      <span data-testid="result-mode">{mode}</span>
      <span data-testid="liked-count">{likedChips.length}</span>
      <span data-testid="disliked-count">{dislikedChips.length}</span>
      <span data-testid="share-url">{shareUrl ?? ""}</span>
    </div>
  ),
}));

const getChip = (id: string) => {
  const chip = diagnosticChips.find((entry) => entry.id === id);

  if (!chip) {
    throw new Error(`Missing test chip: ${id}`);
  }

  return chip;
};

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: vi.fn(),
  });
});

describe("App routing", () => {
  it("renders test screen for /test route", () => {
    render(
      <MemoryRouter initialEntries={["/test"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("test-screen")).toBeTruthy();
  });

  it("redirects /results to /test when payload is missing", async () => {
    render(
      <MemoryRouter initialEntries={["/results"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("test-screen")).toBeTruthy();
  });

  it("hydrates result payload from query params on /results", async () => {
    const payload: TestCompletePayload = {
      mode: "detailed",
      likedChips: [
        getChip("base-warm-pink"),
        getChip("detail-spring-bright-red"),
      ],
      dislikedChips: [getChip("detail-winter-dark-navy")],
    };
    const search = createResultsSearchParams(payload).toString();

    render(
      <MemoryRouter initialEntries={[`/results?${search}`]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("results-screen")).toBeTruthy();
    expect(screen.getByTestId("result-mode").textContent).toBe("detailed");
    expect(screen.getByTestId("liked-count").textContent).toBe("2");
    expect(screen.getByTestId("disliked-count").textContent).toBe("1");
    expect(screen.getByTestId("share-url").textContent).toContain("/results?");
    expect(screen.getByTestId("share-url").textContent).toContain("data=");
  });

  it("hydrates simple mode result payload from query params on /results", async () => {
    const payload: TestCompletePayload = {
      mode: "simple",
      likedChips: [getChip("base-cool-blue"), getChip("season-winter-blue")],
      dislikedChips: [getChip("base-warm-pink")],
    };
    const search = createResultsSearchParams(payload).toString();

    render(
      <MemoryRouter initialEntries={[`/results?${search}`]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("results-screen")).toBeTruthy();
    expect(screen.getByTestId("result-mode").textContent).toBe("simple");
    expect(screen.getByTestId("liked-count").textContent).toBe("2");
    expect(screen.getByTestId("disliked-count").textContent).toBe("1");
    expect(screen.getByTestId("share-url").textContent).toContain("mode=simple");
  });
});
