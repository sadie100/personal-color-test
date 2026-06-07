import type { CSSProperties } from "react";
import { Heart, X } from "lucide-react";

import { translations } from "../i18n/translations";
import type { Lang } from "../types";

interface SwipeButtonsProps {
  onDislike: () => void;
  onLike: () => void;
  lang: Lang;
  // Live drag offset + commit threshold. The button the card is heading
  // toward grows in proportion, clarifying which action the swipe will trigger.
  dragX?: number;
  threshold?: number;
}

const DEADZONE = 8;

export const SwipeButtons = ({
  onDislike,
  onLike,
  lang,
  dragX = 0,
  threshold = 100,
}: SwipeButtonsProps) => {
  const t = translations[lang].test;

  const magnitude = Math.abs(dragX);
  const progress = Math.min(magnitude / threshold, 1);
  const active = magnitude >= DEADZONE;
  const targetScale = 1 + progress * 0.25;

  // Only set an inline transform while actively scaling up, so the tap
  // `active:scale-95` press feedback still works when the buttons are at rest.
  const dislikeStyle: CSSProperties = {
    transition: "transform 90ms ease-out, background-color 150ms ease-out",
    ...(active && dragX < 0 ? { transform: `scale(${targetScale})` } : {}),
  };
  const likeStyle: CSSProperties = {
    transition: "transform 90ms ease-out, opacity 150ms ease-out",
    ...(active && dragX > 0 ? { transform: `scale(${targetScale})` } : {}),
  };

  return (
    <div className="absolute right-0 bottom-8 left-0 flex items-center justify-center gap-5 px-4">
      <button
        onClick={onDislike}
        aria-label={t.dislike}
        style={dislikeStyle}
        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-hairline bg-surface text-ink shadow-sm hover:bg-fill active:scale-95"
      >
        <X size={26} strokeWidth={2} />
      </button>

      <button
        onClick={onLike}
        aria-label={t.like}
        style={likeStyle}
        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-fg shadow-sm hover:opacity-90 active:scale-95"
      >
        <Heart size={24} fill="currentColor" strokeWidth={0} />
      </button>
    </div>
  );
};
