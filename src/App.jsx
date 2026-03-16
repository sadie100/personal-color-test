import { useState, useEffect } from "react";
import { Home } from "./components/Home";
import { ColorTest } from "./components/ColorTest";
import { Results } from "./components/Results";
import { Header } from "./components/Header";
import { About } from "./components/About";
import "./index.css";

const PREVIEW_LIKED_COLORS = [
  { hex: "#F4A460", name: "Sandy Brown", hsl: { h: 27, s: 87, l: 67 } },
  { hex: "#FFD700", name: "Gold", hsl: { h: 51, s: 100, l: 50 } },
  { hex: "#FF8C00", name: "Dark Orange", hsl: { h: 33, s: 100, l: 50 } },
  { hex: "#FFA07A", name: "Light Salmon", hsl: { h: 17, s: 100, l: 74 } },
  { hex: "#DEB887", name: "Burlywood", hsl: { h: 34, s: 57, l: 70 } },
  { hex: "#D2691E", name: "Chocolate", hsl: { h: 25, s: 75, l: 47 } },
];

function App() {
  const preview = new URLSearchParams(window.location.search).get("preview");
  const initialScreen = preview === "results" ? "results" : preview === "about" ? "about" : "home";
  const [screen, setScreen] = useState(initialScreen);
  const [likedColors, setLikedColors] = useState(preview === "results" ? PREVIEW_LIKED_COLORS : []);
  const [lang, setLang] = useState("ko");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const handleToggleLang = (newLang) => setLang(newLang);

  const handleStartTest = () => setScreen("test");

  const handleTestComplete = (colors) => {
    setLikedColors(colors);
    setScreen("results");
  };

  const handleRetry = () => {
    setLikedColors([]);
    setScreen("test");
  };

  const handleGoHome = () => {
    setLikedColors([]);
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
    <div className="w-full min-h-screen">
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
      {screen === "about" && (
        <About lang={lang} onStart={handleStartTest} />
      )}
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
          onRetry={handleRetry}
          lang={lang}
        />
      )}
    </div>
  );
}

export default App;
