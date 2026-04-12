import { useCallback, useEffect, useMemo, useState } from "react";

import { translations } from "../i18n/translations";
import type { ColorWithSeason, HueCategory, Lang, TestCompletePayload, TestConfiguration, TranslationSchema } from "../types";
import { getHueCategoryForHsl, getSelectedTestColors } from "../utils/testSet";
import { ColorCard } from "./ColorCard";
import { LangToggle } from "./LangToggle";
import { ProgressBar } from "./ProgressBar";
import { SwipeButtons } from "./SwipeButtons";
import { TestSetup } from "./TestSetup";

const CARD_TRANSITION_MS = 300;

interface ColorTestProps {
  onComplete: (result: TestCompletePayload) => void;
  onHome: () => void;
  lang: Lang;
  onToggleLang: (newLang: Lang) => void;
}

interface ActiveColorTestProps extends ColorTestProps {
  configuration: TestConfiguration;
}

const hueCategoryTranslationKeyMap: Record<
  HueCategory,
  | "hueCategoryRed"
  | "hueCategoryOrange"
  | "hueCategoryYellow"
  | "hueCategoryGreen"
  | "hueCategoryBlue"
  | "hueCategoryPurplePink"
  | "hueCategoryNeutral"
> = {
  red: "hueCategoryRed",
  orange: "hueCategoryOrange",
  yellow: "hueCategoryYellow",
  green: "hueCategoryGreen",
  blue: "hueCategoryBlue",
  purplePink: "hueCategoryPurplePink",
  neutral: "hueCategoryNeutral",
};

const getHueCategoryLabel = (category: HueCategory, translation: TranslationSchema): string =>
  translation[hueCategoryTranslationKeyMap[category]];

const ActiveColorTest = ({
  configuration,
  onComplete,
  onHome,
  lang,
  onToggleLang,
}: ActiveColorTestProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedColors, setLikedColors] = useState<ColorWithSeason[]>([]);
  const [dislikedColors, setDislikedColors] = useState<ColorWithSeason[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const orderedColors = useMemo(
    () => getSelectedTestColors(configuration.selectedCategories),
    [configuration.selectedCategories],
  );

  const t = translations[lang];
  const currentColor = orderedColors[currentIndex] ?? null;
  const currentCategory = currentColor ? getHueCategoryForHsl(currentColor.hsl) : null;
  const remainingColors = Math.max(orderedColors.length - currentIndex - 1, 0);
  const remainingInCurrentCategory =
    currentCategory === null
      ? 0
      : orderedColors.slice(currentIndex + 1).filter((color) => getHueCategoryForHsl(color.hsl) === currentCategory)
          .length;

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
        if (currentIndex < orderedColors.length - 1) {
          setCurrentIndex(currentIndex + 1);
          // Let the new color render at opacity 0 first, then fade it in.
          window.requestAnimationFrame(() => {
            setIsTransitioning(false);
          });
        } else {
          onComplete({
            likedColors: nextLikedColors,
            dislikedColors: nextDislikedColors,
          });
        }
      }, CARD_TRANSITION_MS);
    },
    [
      currentIndex,
      currentColor,
      dislikedColors,
      isTransitioning,
      likedColors,
      onComplete,
      orderedColors.length,
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
    <div className="relative h-screen w-full overflow-hidden bg-white">
      <ProgressBar current={currentIndex + 1} total={orderedColors.length} />
      <ColorCard color={currentColor} isTransitioning={isTransitioning} />
      <SwipeButtons onDislike={() => handleNext(false)} onLike={() => handleNext(true)} />

      <div className="absolute top-4 left-4 max-w-[min(22rem,calc(100vw-8rem))] rounded-2xl bg-black/25 p-4 text-white shadow-lg backdrop-blur-sm">
        <p className="text-sm">
          {currentIndex + 1} / {orderedColors.length}
        </p>
        <p className="text-sm">
          {t.liked}: {likedColors.length}
        </p>
        {currentCategory && (
          <>
            <p className="mt-2 text-sm font-semibold">{t.testCurrentCategory(getHueCategoryLabel(currentCategory, t))}</p>
            <p className="text-sm">{t.testRemainingColors(remainingColors)}</p>
            <p className="text-sm">{t.testRemainingInCategory(remainingInCurrentCategory)}</p>
            <div className="mt-3">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/70">{t.testCategoryOrderTitle}</p>
              <div className="flex flex-wrap gap-2">
                {configuration.selectedCategories.map((category) => {
                  const isCurrentCategory = category === currentCategory;

                  return (
                    <span
                      key={category}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isCurrentCategory ? "bg-white text-gray-900" : "bg-white/20 text-white"
                      }`}
                    >
                      {getHueCategoryLabel(category, t)}
                    </span>
                  );
                })}
              </div>
            </div>
          </>
        )}
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

export const ColorTest = ({ onComplete, onHome, lang, onToggleLang }: ColorTestProps) => {
  const [configuration, setConfiguration] = useState<TestConfiguration | null>(null);

  if (!configuration) {
    return (
      <TestSetup
        lang={lang}
        onToggleLang={onToggleLang}
        onHome={onHome}
        onStart={setConfiguration}
      />
    );
  }

  return (
    <ActiveColorTest
      configuration={configuration}
      onComplete={onComplete}
      onHome={onHome}
      lang={lang}
      onToggleLang={onToggleLang}
    />
  );
};
