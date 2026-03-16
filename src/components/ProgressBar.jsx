export const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-300/30">
      <div
        className="h-full bg-white transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
