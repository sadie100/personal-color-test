import { useEffect, useState } from "react";

import { About } from "./components/About";
import { ColorTest } from "./components/ColorTest";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { Results } from "./components/Results";
import "./index.css";
import type { ColorWithSeason, Lang, Screen, TestCompletePayload, TestCompleteResult } from "./types";

const PREVIEW_RESULT: TestCompletePayload = {
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
    { hex: "#FFD700", name: "Gold", hsl: { h: 51, s: 100, l: 50 }, seasonTone: "Spring Bright" },
    {
      hex: "#FF8C00",
      name: "Dark Orange",
      hsl: { h: 33, s: 100, l: 50 },
      seasonTone: "Autumn Bright",
    },
    {
      hex: "#D2691E",
      name: "Chocolate",
      hsl: { h: 25, s: 75, l: 47 },
      seasonTone: "Autumn Bright",
    },
    {
      hex: "#FAFAD2",
      name: "Light Goldenrod",
      hsl: { h: 60, s: 100, l: 84 },
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
    {
      hex: "#4A7C7E",
      name: "Muted Teal",
      hsl: { h: 175, s: 24, l: 41 },
      seasonTone: "Summer Muted",
    },
    {
      hex: "#967BB6",
      name: "Muted Purple",
      hsl: { h: 280, s: 35, l: 63 },
      seasonTone: "Summer Muted",
    },
    {
      hex: "#0000FF",
      name: "Pure Blue",
      hsl: { h: 240, s: 100, l: 50 },
      seasonTone: "Winter Bright",
    },
  ],
};

const getInitialScreen = (preview: string | null): Screen => {
  if (preview === "results") {
    return "results";
  }

  if (preview === "about") {
    return "about";
  }

  return "home";
};

const getResultPayload = (result: TestCompleteResult): TestCompletePayload => {
  if (Array.isArray(result)) {
    return {
      likedColors: result,
      dislikedColors: [],
    };
  }

  return result;
};

function App() {
  const preview = new URLSearchParams(window.location.search).get("preview");
  const initialScreen = getInitialScreen(preview);
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [likedColors, setLikedColors] = useState<ColorWithSeason[]>(
    preview === "results" ? PREVIEW_RESULT.likedColors : [],
  );
  const [dislikedColors, setDislikedColors] = useState<ColorWithSeason[]>(
    preview === "results" ? PREVIEW_RESULT.dislikedColors : [],
  );
  const [lang, setLang] = useState<Lang>("ko");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const handleToggleLang = (newLang: Lang) => setLang(newLang);

  const handleStartTest = () => setScreen("test");

  const handleTestComplete = (result: TestCompleteResult) => {
    const payload = getResultPayload(result);
    setLikedColors(payload.likedColors);
    setDislikedColors(payload.dislikedColors);
    setScreen("results");
  };

  const resetSelections = () => {
    setLikedColors([]);
    setDislikedColors([]);
  };

  const handleRetry = () => {
    resetSelections();
    setScreen("test");
  };

  const handleGoHome = () => {
    resetSelections();
    setScreen("home");
  };

  const handleNavigate = (target: Screen) => {
    if (target === "test") {
      handleStartTest();
      return;
    }

    if (target === "home") {
      handleGoHome();
      return;
    }

    setScreen(target);
  };

  return (
    <div className="min-h-screen w-full">
      {screen !== "test" && (
        <Header
          lang={lang}
          onToggleLang={handleToggleLang}
          screen={screen}
          onNavigate={handleNavigate}
        />
      )}
      {screen === "home" && (
        <Home onStart={handleStartTest} lang={lang} onAbout={() => setScreen("about")} />
      )}
      {screen === "about" && <About lang={lang} onStart={handleStartTest} />}
      {screen === "test" && (
        <ColorTest
          onComplete={handleTestComplete}
          onHome={handleGoHome}
          lang={lang}
          onToggleLang={handleToggleLang}
        />
      )}
      {screen === "results" && (
        <Results
          likedColors={likedColors}
          dislikedColors={dislikedColors}
          onRetry={handleRetry}
          lang={lang}
        />
      )}
    </div>
  );
}

export default App;
