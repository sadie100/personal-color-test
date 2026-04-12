import type { ColorWithSeason } from "../types";

interface ColorCardProps {
  color: ColorWithSeason | null;
  isTransitioning: boolean;
}

export const ColorCard = ({ color, isTransitioning }: ColorCardProps) => {
  if (!color) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: color.hex }}
    >
      <div className="absolute bottom-8 left-8 text-white drop-shadow-lg">
        <p className="text-2xl font-bold">{color.name}</p>
        <p className="text-lg">{color.hex}</p>
      </div>
    </div>
  );
};
