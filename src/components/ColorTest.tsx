import { useCallback, useEffect, useMemo, useState } from "react";

import { translations } from "../i18n/translations";
import type { DiagnosticChip, DiagnosticPhase, Lang, TestCompletePayload, TestConfiguration, TestMode } from "../types";
import { getIncludedPhasesForMode, getSelectedDiagnosticChips } from "../utils/testSet";
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

const phaseLabelMap: Record<Lang, Record<DiagnosticPhase, string>> = {
  ko: {
    base: "베이스",
    season: "계절",
    detail: "세부톤",
  },
  en: {
    base: "Base",
    season: "Season",
    detail: "Detail",
  },
};

const modeLabelMap: Record<TestMode, "testModeSimple" | "testModeDetailed"> = {
  simple: "testModeSimple",
  detailed: "testModeDetailed",
};

const ActiveColorTest = ({
  configuration,
  onComplete,
  onHome,
  lang,
  onToggleLang,
}: ActiveColorTestProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedChips, setLikedChips] = useState<DiagnosticChip[]>([]);
  const [dislikedChips, setDislikedChips] = useState<DiagnosticChip[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const orderedColors = useMemo(() => getSelectedDiagnosticChips(configuration.mode), [configuration.mode]);

  const t = translations[lang];
  const currentColor = orderedColors[currentIndex] ?? null;
  const remainingColors = Math.max(orderedColors.length - currentIndex - 1, 0);
  const modeLabel = t[modeLabelMap[configuration.mode]];
  const includedPhasesLabel = getIncludedPhasesForMode(configuration.mode)
    .map((phase) => phaseLabelMap[lang][phase])
    .join(" / ");

  const handleNext = useCallback(
    (liked: boolean) => {
      if (isTransitioning || !currentColor) {
        return;
      }

      setIsTransitioning(true);

      const nextLikedChips = liked ? [...likedChips, currentColor] : likedChips;
      const nextDislikedChips = liked ? dislikedChips : [...dislikedChips, currentColor];

      if (liked) {
        setLikedChips(nextLikedChips);
      } else {
        setDislikedChips(nextDislikedChips);
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
            mode: configuration.mode,
            likedChips: nextLikedChips,
            dislikedChips: nextDislikedChips,
          });
        }
      }, CARD_TRANSITION_MS);
    },
    [
      currentIndex,
      currentColor,
      dislikedChips,
      configuration.mode,
      isTransitioning,
      likedChips,
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
      <ColorCard color={currentColor} isTransitioning={isTransitioning} lang={lang} />
      <SwipeButtons onDislike={() => handleNext(false)} onLike={() => handleNext(true)} />

      <div className="absolute top-4 left-4 max-w-[min(22rem,calc(100vw-8rem))] rounded-2xl bg-black/25 p-4 text-white shadow-lg backdrop-blur-sm">
        <p className="text-sm">
          {currentIndex + 1} / {orderedColors.length}
        </p>
        <p className="text-sm">
          {t.liked}: {likedChips.length}
        </p>
        <p className="mt-2 text-sm font-semibold">{t.testCurrentMode(modeLabel)}</p>
        <p className="text-sm">{t.testRemainingColors(remainingColors)}</p>
        <p className="text-sm">
          {t.testIncludedPhases}: {includedPhasesLabel}
        </p>
        {currentColor && (
          <p className="text-sm">
            {phaseLabelMap[lang][currentColor.diagnosticPhase]}
          </p>
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
              mode: configuration.mode,
              likedChips,
              dislikedChips,
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
