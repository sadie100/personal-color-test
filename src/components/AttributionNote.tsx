import { BookOpenCheck } from "lucide-react";

import { translations } from "../i18n/translations";
import type { Lang } from "../types";

interface AttributionNoteProps {
  lang: Lang;
  variant?: "light" | "dark";
  className?: string;
}

export const AttributionNote = ({ lang, variant = "light", className }: AttributionNoteProps) => {
  const t = translations[lang].attribution;
  const isDark = variant === "dark";

  const containerClass = isDark
    ? "border-white/30 bg-white/10 text-white"
    : "border-slate-200 bg-white/80 text-slate-600";
  const iconBgClass = isDark ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600";
  const headingClass = isDark ? "text-white" : "text-slate-700";
  const sourceClass = isDark ? "text-white/70" : "text-slate-400";

  return (
    <aside
      className={[
        "mx-auto flex max-w-3xl items-start gap-3 rounded-2xl border px-5 py-4 text-sm leading-relaxed backdrop-blur-sm",
        containerClass,
        className ?? "",
      ].join(" ")}
      aria-label={t.heading}
    >
      <span
        aria-hidden
        className={["mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", iconBgClass].join(" ")}
      >
        <BookOpenCheck size={16} strokeWidth={1.75} />
      </span>
      <div className="flex-1 break-keep">
        <p className={["text-xs font-semibold tracking-wide uppercase", headingClass].join(" ")}>
          {t.heading}
        </p>
        <p className="mt-1">{t.line}</p>
        <p className={["mt-1 text-xs", sourceClass].join(" ")}>{t.source}</p>
      </div>
    </aside>
  );
};
