import { useCallback, useEffect, useState } from "react";

import { colorData, seasonTones } from "../data/colorData";
import { translations } from "../i18n/translations";
import type { ColorWithSeason, Lang, TestCompletePayload } from "../types";
import { ColorCard } from "./ColorCard";
import { LangToggle } from "./LangToggle";
import { ProgressBar } from "./ProgressBar";
import { SwipeButtons } from "./SwipeButtons";

interface ColorTestProps {
  onComplete: (result: TestCompletePayload) => void;
  onHome: () => void;
  lang: Lang;
  onToggleLang: (newLang: Lang) => void;
}

const allColors: ColorWithSeason[] = seasonTones.flatMap((seasonTone) =>
  colorData[seasonTone].map((color) => ({ ...color, seasonTone })),
);

export const ColorTest = ({ onComplete, onHome, lang, onToggleLang }: ColorTestProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedColors, setLikedColors] = useState<ColorWithSeason[]>([]);
  const [dislikedColors, setDislikedColors] = useState<ColorWithSeason[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shuffledColors] = useState<ColorWithSeason[]>(() =>
    [...allColors].sort(() => Math.random() - 0.5),
  );

  const t = translations[lang];
  const currentColor = shuffledColors[currentIndex] ?? null;

  const handleNext = useCallback(
    (liked: boolean) => {
      if (isTransitioning || !currentColor) {
        return;
      }

      setIsTransitioning(true);

      const nextLikedColors = liked ? [...likedColors, currentColor] : likedColors;
      const nextDislikedColors = liked ? dislikedColors : [...dislikedColors, currentColor];

      if (liked) {
        setLikedColors(nextLikedColors);
      } else {
        setDislikedColors(nextDislikedColors);
      }

      window.setTimeout(() => {
        if (currentIndex < shuffledColors.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setIsTransitioning(false);
        } else {
          onComplete({
            likedColors: nextLikedColors,
            dislikedColors: nextDislikedColors,
          });
        }
      }, 300);
    },
    [
      currentIndex,
      currentColor,
      dislikedColors,
      isTransitioning,
      likedColors,
      onComplete,
      shuffledColors.length,
    ],
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handleNext(false);
      }

      if (event.key === "ArrowRight") {
        handleNext(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleNext]);

  if (!currentColor) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <p className="text-xl">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <ProgressBar current={currentIndex + 1} total={shuffledColors.length} />
      <ColorCard color={currentColor} isTransitioning={isTransitioning} />
      <SwipeButtons onDislike={() => handleNext(false)} onLike={() => handleNext(true)} />

      <div className="absolute top-4 left-4 text-white drop-shadow-lg">
        <p className="text-sm">
          {currentIndex + 1} / {shuffledColors.length}
        </p>
        <p className="text-sm">
          {t.liked}: {likedColors.length}
        </p>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={onHome}
          className="rounded-full border border-white/50 bg-white/90 px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white active:scale-95"
        >
          {t.homeButton}
        </button>
        <LangToggle lang={lang} onToggle={onToggleLang} />
      </div>

      {currentIndex >= 10 && (
        <button
          onClick={() =>
            onComplete({
              likedColors,
              dislikedColors,
            })
          }
          className="absolute right-6 bottom-6 rounded-full border border-white/50 bg-white/90 px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white active:scale-95"
        >
          {t.earlyExit}
        </button>
      )}
    </div>
  );
};
