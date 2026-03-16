import { useState, useEffect, useCallback } from "react";
import { colorData } from "../data/colorData";
import { ColorCard } from "./ColorCard";
import { SwipeButtons } from "./SwipeButtons";
import { ProgressBar } from "./ProgressBar";

const allColors = Object.values(colorData).flat();

export const ColorTest = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedColors, setLikedColors] = useState([]);
  const [dislikedColors, setDislikedColors] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shuffledColors, setShuffledColors] = useState([]);

  // Shuffle colors on mount
  useEffect(() => {
    const shuffled = [...allColors].sort(() => Math.random() - 0.5);
    setShuffledColors(shuffled);
  }, []);

  const currentColor = shuffledColors[currentIndex];

  const handleNext = useCallback((liked) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    if (liked) {
      setLikedColors([...likedColors, currentColor]);
    } else {
      setDislikedColors([...dislikedColors, currentColor]);
    }

    setTimeout(() => {
      if (currentIndex < shuffledColors.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsTransitioning(false);
      } else {
        // Test complete
        onComplete(liked ? [...likedColors, currentColor] : likedColors);
      }
    }, 300);
  }, [currentIndex, shuffledColors.length, likedColors, dislikedColors, isTransitioning, currentColor, onComplete]);

  const handleSkip = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      if (currentIndex < shuffledColors.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsTransitioning(false);
      } else {
        onComplete(likedColors);
      }
    }, 300);
  }, [currentIndex, shuffledColors.length, isTransitioning, likedColors, onComplete]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") handleNext(false);
      if (e.key === "ArrowRight") handleNext(true);
      if (e.key === " ") {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleNext, handleSkip]);

  if (!currentColor) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Loading colors...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ProgressBar current={currentIndex + 1} total={shuffledColors.length} />
      <ColorCard color={currentColor} isTransitioning={isTransitioning} />
      <SwipeButtons
        onDislike={() => handleNext(false)}
        onLike={() => handleNext(true)}
        onSkip={handleSkip}
        hasMore={currentIndex < shuffledColors.length - 1}
      />

      {/* Top info */}
      <div className="absolute top-4 left-4 text-white drop-shadow-lg">
        <p className="text-sm">
          {currentIndex + 1} / {shuffledColors.length}
        </p>
        <p className="text-sm">Liked: {likedColors.length}</p>
      </div>
    </div>
  );
};
