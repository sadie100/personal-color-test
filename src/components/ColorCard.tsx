import { getChipName } from "../data/colorData";
import type { DiagnosticChip, Lang } from "../types";
import { getReadableInkColor } from "../utils/contrast";

interface ColorCardProps {
  color: DiagnosticChip | null;
  lang: Lang;
  dragX: number;
  isDragging: boolean;
  exitDirection: "left" | "right" | null;
}

export const ColorCard = ({ color, lang, dragX, isDragging, exitDirection }: ColorCardProps) => {
  if (!color) {
    return null;
  }

  const exitOffset = window.innerWidth + 200;
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

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: color.hex,
        transform: `translateX(${translateX}px) rotate(${rotateDeg}deg)`,
        transition: `transform ${isDragging ? 0 : 300}ms ease-out`,
        willChange: "transform",
      }}
    >
      <div className="absolute bottom-8 left-8" style={{ color: getReadableInkColor(color.hex) }}>
        <p className="font-display text-3xl leading-tight">{getChipName(color, lang)}</p>
        <p className="mt-1 font-mono text-sm tracking-wide opacity-80">{color.hex}</p>
      </div>
    </div>
  );
};
