export const SwipeButtons = ({ onDislike, onLike }) => {
  return (
    <div className="absolute right-0 bottom-8 left-0 flex items-center justify-center gap-4 px-4">
      <button
        onClick={onDislike}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-red-600 active:scale-95"
        title="Dislike (Left Arrow)"
      >
        <span className="text-2xl">✕</span>
      </button>

      <button
        onClick={onLike}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-green-600 active:scale-95"
        title="Like (Right Arrow)"
      >
        <span className="text-2xl">♥</span>
      </button>
    </div>
  );
};
