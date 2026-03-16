import { useState } from "react";
import { Home } from "./components/Home";
import { ColorTest } from "./components/ColorTest";
import { Results } from "./components/Results";
import "./index.css";

function App() {
  const [screen, setScreen] = useState("home"); // 'home', 'test', 'results'
  const [likedColors, setLikedColors] = useState([]);

  const handleStartTest = () => {
    setScreen("test");
  };

  const handleTestComplete = (colors) => {
    setLikedColors(colors);
    setScreen("results");
  };

  const handleRetry = () => {
    setLikedColors([]);
    setScreen("test");
  };

  return (
    <div className="w-full h-screen">
      {screen === "home" && <Home onStart={handleStartTest} />}
      {screen === "test" && <ColorTest onComplete={handleTestComplete} />}
      {screen === "results" && <Results likedColors={likedColors} onRetry={handleRetry} />}
    </div>
  );
}

export default App;
