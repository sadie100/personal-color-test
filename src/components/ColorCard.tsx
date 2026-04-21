import { getChipName } from "../data/colorData";
import type { DiagnosticChip, Lang } from "../types";

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
      <div className="absolute bottom-8 left-8 text-white drop-shadow-lg">
        <p className="text-2xl font-bold">{getChipName(color, lang)}</p>
        <p className="text-lg">{color.hex}</p>
      </div>
    </div>
  );
};
