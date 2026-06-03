import { Heart, X } from "lucide-react";

import { translations } from "../i18n/translations";
import type { Lang } from "../types";

interface SwipeButtonsProps {
  onDislike: () => void;
  onLike: () => void;
  lang: Lang;
}

export const SwipeButtons = ({ onDislike, onLike, lang }: SwipeButtonsProps) => {
  const t = translations[lang].test;

  return (
    <div className="absolute right-0 bottom-8 left-0 flex items-center justify-center gap-5 px-4">
      <button
        onClick={onDislike}
        aria-label={t.dislike}
        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-hairline bg-surface text-ink shadow-sm transition-all hover:bg-fill active:scale-95"
      >
        <X size={26} strokeWidth={2} />
      </button>

      <button
        onClick={onLike}
        aria-label={t.like}
        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-fg shadow-sm transition-all hover:opacity-90 active:scale-95"
      >
        <Heart size={24} fill="currentColor" strokeWidth={0} />
      </button>
    </div>
  );
};
