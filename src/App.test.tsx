// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { cleanup } from "@testing-library/react";

import App from "./App";
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
    likedColors,
    dislikedColors,
    shareUrl,
  }: {
    likedColors: Array<{ name: string }>;
    dislikedColors: Array<{ name: string }>;
    shareUrl?: string;
  }) => (
    <div data-testid="results-screen">
      <span data-testid="liked-count">{likedColors.length}</span>
      <span data-testid="disliked-count">{dislikedColors.length}</span>
      <span data-testid="share-url">{shareUrl ?? ""}</span>
    </div>
  ),
}));

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
      likedColors: [
        {
          hex: "#FFA07A",
          name: "Light Salmon",
          hsl: { h: 17, s: 100, l: 74 },
          seasonTone: "Autumn Light",
        },
        {
          hex: "#DEB887",
          name: "Burlywood",
          hsl: { h: 34, s: 57, l: 70 },
          seasonTone: "Autumn Light",
        },
      ],
      dislikedColors: [
        {
          hex: "#4682B4",
          name: "Muted Blue",
          hsl: { h: 207, s: 44, l: 49 },
          seasonTone: "Summer Muted",
        },
      ],
    };
    const search = createResultsSearchParams(payload).toString();

    render(
      <MemoryRouter initialEntries={[`/results?${search}`]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("results-screen")).toBeTruthy();
    expect(screen.getByTestId("liked-count").textContent).toBe("2");
    expect(screen.getByTestId("disliked-count").textContent).toBe("1");
    expect(screen.getByTestId("share-url").textContent).toContain("/results?");
    expect(screen.getByTestId("share-url").textContent).toContain("data=");
  });
});
