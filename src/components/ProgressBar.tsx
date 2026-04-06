interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="absolute top-0 right-0 left-0 h-1 bg-gray-300/30">
      <div
        className="h-full bg-white transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
