import { translations } from "../i18n/translations";
import type { Lang } from "../types";

interface AttributionNoteProps {
  lang: Lang;
  variant?: "light" | "dark";
  className?: string;
}

export const AttributionNote = ({ lang, variant = "light", className }: AttributionNoteProps) => {
  const t = translations[lang].attribution;
  const colorClass = variant === "dark" ? "text-white/70" : "text-slate-400";

  return (
    <p className={["text-center text-xs break-keep", colorClass, className ?? ""].join(" ")}>
      {t.line}
    </p>
  );
};
