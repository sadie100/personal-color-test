interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="absolute top-0 right-0 left-0 h-1 bg-hairline">
      <div
        className="h-full bg-accent transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
