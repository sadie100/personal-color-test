interface ShirtSwatchProps {
  color: string;
  dragX: number;
  isDragging: boolean;
  exitDirection: "left" | "right" | null;
}

export const ShirtSwatch = ({ color, dragX, isDragging, exitDirection }: ShirtSwatchProps) => {
  const exitOffset = typeof window === "undefined" ? 1200 : window.innerWidth + 200;
  const translateX = exitDirection
    ? exitDirection === "right"
      ? exitOffset
      : -exitOffset
    : dragX;
  const rotateDeg = exitDirection
    ? exitDirection === "right"
      ? 18
      : -18
    : dragX / 24;

  return (
    <svg
      viewBox="0 0 400 280"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      style={{
        transform: `translateX(${translateX}px) rotate(${rotateDeg}deg)`,
        transition: `transform ${isDragging ? 0 : 300}ms ease-out`,
        willChange: "transform",
        filter: "drop-shadow(0 -8px 24px rgba(0,0,0,0.25))",
      }}
      className="block w-full"
    >
      <path
        d="
          M 100 20
          L 40 70
          L 10 150
          L 70 175
          L 90 140
          L 90 280
          L 310 280
          L 310 140
          L 330 175
          L 390 150
          L 360 70
          L 300 20
          C 280 65 250 90 200 90
          C 150 90 120 65 100 20
          Z
        "
        fill={color}
      />
    </svg>
  );
};
