export const LangToggle = ({ lang, onToggle, className = "" }) => {
  return (
    <button
      onClick={onToggle}
      className={`text-sm px-3 py-1.5 rounded-full font-medium transition-all active:scale-95 ${className}`}
    >
      {lang === "ko" ? "EN" : "한국어"}
    </button>
  );
};
