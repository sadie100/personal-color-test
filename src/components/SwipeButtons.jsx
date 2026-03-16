export const SwipeButtons = ({ onDislike, onLike, onSkip, hasMore }) => {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4 px-4">
      <button
        onClick={onDislike}
        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
        title="Dislike (Left Arrow)"
      >
        <span className="text-2xl">✕</span>
      </button>

      <button
        onClick={onSkip}
        className="bg-gray-500 hover:bg-gray-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
        title="Skip (Space)"
      >
        <span className="text-xl">⟳</span>
      </button>

      <button
        onClick={onLike}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
        title="Like (Right Arrow)"
      >
        <span className="text-2xl">♥</span>
      </button>
    </div>
  );
};
