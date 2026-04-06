import { useState, useEffect } from "react";
import { Home } from "./components/Home";
import { ColorTest } from "./components/ColorTest";
import { Results } from "./components/Results";
import { Header } from "./components/Header";
import { About } from "./components/About";
import "./index.css";

const PREVIEW_RESULT = {
  likedColors: [
    {
      hex: "#FFA07A",
      name: "Light Salmon",
      hsl: { h: 17, s: 100, l: 74 },
      seasonTone: "Autumn Light",
    },
    { hex: "#DEB887", name: "Burlywood", hsl: { h: 34, s: 57, l: 70 }, seasonTone: "Autumn Light" },
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

function App() {
  const preview = new URLSearchParams(window.location.search).get("preview");
  const initialScreen = preview === "results" ? "results" : preview === "about" ? "about" : "home";
  const [screen, setScreen] = useState(initialScreen);
  const [likedColors, setLikedColors] = useState(
    preview === "results" ? PREVIEW_RESULT.likedColors : [],
  );
  const [dislikedColors, setDislikedColors] = useState(
    preview === "results" ? PREVIEW_RESULT.dislikedColors : [],
  );
  const [lang, setLang] = useState("ko");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const handleToggleLang = (newLang) => setLang(newLang);

  const handleStartTest = () => setScreen("test");

  const handleTestComplete = (result) => {
    if (Array.isArray(result)) {
      setLikedColors(result);
      setDislikedColors([]);
      setScreen("results");
      return;
    }

    setLikedColors(result.likedColors);
    setDislikedColors(result.dislikedColors);
    setScreen("results");
  };

  const handleRetry = () => {
    setLikedColors([]);
    setDislikedColors([]);
    setScreen("test");
  };

  const handleGoHome = () => {
    setLikedColors([]);
    setDislikedColors([]);
    setScreen("home");
  };

  const handleNavigate = (target) => {
    if (target === "test") {
      handleStartTest();
    } else if (target === "home") {
      handleGoHome();
    } else {
      setScreen(target);
    }
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
