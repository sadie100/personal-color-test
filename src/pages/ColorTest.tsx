import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { ColorCard } from "../components/ColorCard";
import { LangToggle } from "../components/LangToggle";
import { ProgressBar } from "../components/ProgressBar";
import { SwipeButtons } from "../components/SwipeButtons";
import { TestSetup } from "../components/TestSetup";
import { translations } from "../i18n/translations";
import type { DiagnosticChip, Lang, TestCompletePayload, TestConfiguration } from "../types";
import { getSelectedDiagnosticChips } from "../utils/testSet";

const CARD_TRANSITION_MS = 150;
const SWIPE_DISTANCE_THRESHOLD = 100;
const SWIPE_VELOCITY_THRESHOLD = 0.5;

interface ColorTestProps {
  onComplete: (result: TestCompletePayload) => void;
  onHome: () => void;
  lang: Lang;
  onToggleLang: (newLang: Lang) => void;
}

interface ActiveColorTestProps extends ColorTestProps {
  configuration: TestConfiguration;
}

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
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; t: number; cancelled: boolean } | null>(null);
  const orderedColors = useMemo(
    () => getSelectedDiagnosticChips(configuration.mode),
    [configuration.mode],
  );

  const t = translations[lang];
  const currentColor = orderedColors[currentIndex] ?? null;

  const handleNext = useCallback(
    (liked: boolean, swipeDirection?: "left" | "right") => {
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
        if (currentIndex >= orderedColors.length - 1) {
          onComplete({
            mode: configuration.mode,
            likedChips: nextLikedChips,
            dislikedChips: nextDislikedChips,
          });
          return;
        }

        setCurrentIndex(currentIndex + 1);
        setExitDirection(null);

        if (swipeDirection) {
          // Place the new card off-screen opposite the exit, then slide it in to X=0
          // on the next tick. Skip the opacity fade. The short setTimeout (not a
          // double RAF) ensures the browser paints the off-screen position before
          // the transition re-enables — React otherwise coalesces both renders.
          const enterFromX = (swipeDirection === "right" ? -1 : 1) * (window.innerWidth + 200);
          setIsDragging(true);
          setDragX(enterFromX);
          setIsTransitioning(false);
          window.setTimeout(() => {
            setIsDragging(false);
            setDragX(0);
          }, 32);
        } else {
          setDragX(0);
          window.requestAnimationFrame(() => {
            setIsTransitioning(false);
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

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (isTransitioning || exitDirection) {
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        t: event.timeStamp,
        cancelled: false,
      };
      setIsDragging(true);
    },
    [isTransitioning, exitDirection],
  );

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    if (!start || start.cancelled) {
      return;
    }
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    // If the gesture is clearly vertical, cancel so the user can scroll / tap elsewhere.
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
      start.cancelled = true;
      setIsDragging(false);
      setDragX(0);
      return;
    }
    setDragX(dx);
  }, []);

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const start = dragStartRef.current;
      dragStartRef.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      if (!start || start.cancelled) {
        setIsDragging(false);
        setDragX(0);
        return;
      }
      const dx = event.clientX - start.x;
      const elapsed = Math.max(event.timeStamp - start.t, 1);
      const velocity = Math.abs(dx) / elapsed;
      const passesDistance = Math.abs(dx) >= SWIPE_DISTANCE_THRESHOLD;
      const passesVelocity = velocity >= SWIPE_VELOCITY_THRESHOLD && Math.abs(dx) > 20;
      setIsDragging(false);

      if (passesDistance || passesVelocity) {
        const direction: "left" | "right" = dx > 0 ? "right" : "left";
        setExitDirection(direction);
        window.setTimeout(() => {
          handleNext(direction === "right", direction);
        }, CARD_TRANSITION_MS);
      } else {
        setDragX(0);
      }
    },
    [handleNext],
  );

  if (!currentColor) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <p className="text-xl">{t.test.loading}</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      <ProgressBar current={currentIndex + 1} total={orderedColors.length} />
      <div
        className="absolute inset-0"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ColorCard
          color={currentColor}
          isTransitioning={isTransitioning}
          lang={lang}
          dragX={dragX}
          isDragging={isDragging}
          exitDirection={exitDirection}
        />
      </div>
      <SwipeButtons onDislike={() => handleNext(false)} onLike={() => handleNext(true)} />

      <div className="absolute top-4 left-4 max-w-[min(22rem,calc(100vw-8rem))] rounded-2xl bg-black/25 p-4 text-white shadow-lg backdrop-blur-sm">
        <p className="text-sm">
          {currentIndex + 1} / {orderedColors.length}
        </p>
        <p className="text-sm">
          {t.test.liked}: {likedChips.length}
        </p>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={onHome}
          className="rounded-full border border-white/50 bg-white/90 px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white active:scale-95"
        >
          {t.test.home}
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
          {t.test.earlyExit}
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
