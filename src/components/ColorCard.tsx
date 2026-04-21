import { getChipName } from "../data/colorData";
import type { DiagnosticChip, Lang } from "../types";

interface ColorCardProps {
  color: DiagnosticChip | null;
  isTransitioning: boolean;
  lang: Lang;
  dragX?: number;
  isDragging?: boolean;
  exitDirection?: "left" | "right" | null;
}

export const ColorCard = ({
  color,
  isTransitioning,
  lang,
  dragX = 0,
  isDragging = false,
  exitDirection = null,
}: ColorCardProps) => {
  if (!color) {
    return null;
  }

  const exitOffset =
    typeof window !== "undefined" ? window.innerWidth + 200 : 1200;
  const translateX = exitDirection
    ? exitDirection === "right"
      ? exitOffset
      : -exitOffset
    : dragX;
  const rotateDeg = exitDirection
    ? exitDirection === "right"
      ? 20
      : -20
    : dragX / 20;

  const transformStyle = `translateX(${translateX}px) rotate(${rotateDeg}deg)`;
  const transformDurationMs = isDragging ? 0 : 300;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        isTransitioning && !exitDirection ? "opacity-0" : "opacity-100"
      }`}
      style={{
        backgroundColor: color.hex,
        transform: transformStyle,
        transition: `transform ${transformDurationMs}ms ease-out, opacity 300ms`,
        willChange: "transform",
      }}
    >
      <div className="absolute bottom-8 left-8 text-white drop-shadow-lg">
        <p className="text-2xl font-bold">{getChipName(color, lang)}</p>
        <p className="text-lg">{color.hex}</p>
      </div>
    </div>
  );
};
