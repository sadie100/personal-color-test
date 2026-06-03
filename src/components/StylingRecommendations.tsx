import type { ReactNode } from "react";
import { Gem, Palette, Scissors, Shirt, Sparkles } from "lucide-react";
import type { Lang, PersonalColorType, TranslationSchema } from "../types";
import { stylingRecommendations } from "../data/stylingRecommendations";

interface StylingRecommendationsProps {
  bestType: PersonalColorType;
  displayName: string;
  lang: Lang;
  t: TranslationSchema;
}

interface PanelProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}

function Panel({ icon, label, children, fullWidth }: PanelProps) {
  return (
    <section
      className={[
        "rounded-2xl border border-hairline bg-paper p-5",
        fullWidth ? "md:col-span-2" : "",
      ].join(" ")}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full bg-fill text-ink-2"
        >
          {icon}
        </span>
        <h3 className="text-base font-bold text-ink">{label}</h3>
      </div>
      <div className="space-y-2 text-sm leading-relaxed text-ink-2">
        {children}
      </div>
    </section>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-ink-3">
        {label}
      </span>
      {value}
    </p>
  );
}

export function StylingRecommendations({
  bestType,
  displayName,
  lang,
  t,
}: StylingRecommendationsProps) {
  const data = stylingRecommendations[bestType];
  const keywords = data.keywords[lang];
  const makeup = data.makeup[lang];

  return (
    <div className="mb-6 rounded-3xl border border-hairline bg-surface p-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl text-ink">{t.styling.title}</h2>
        <p className="mt-1 text-sm text-ink-3">
          {t.styling.subtitle(displayName)}
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-3">
          {t.styling.keywords}
        </span>
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full bg-fill px-3 py-1 text-xs font-semibold text-ink-2"
          >
            {keyword}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Panel icon={<Shirt size={18} strokeWidth={1.75} />} label={t.styling.fabric}>
          <p>{data.fabric[lang]}</p>
        </Panel>

        <Panel icon={<Sparkles size={18} strokeWidth={1.75} />} label={t.styling.pattern}>
          <p>{data.patterns[lang]}</p>
        </Panel>

        <Panel icon={<Gem size={18} strokeWidth={1.75} />} label={t.styling.accessory}>
          <FieldRow label={t.styling.accessorySize} value={data.accessorySize[lang]} />
          <FieldRow label={t.styling.metal} value={data.metals[lang]} />
        </Panel>

        <Panel icon={<Scissors size={18} strokeWidth={1.75} />} label={t.styling.hair}>
          <p>{data.hair[lang]}</p>
        </Panel>

        <Panel
          icon={<Palette size={18} strokeWidth={1.75} />}
          label={t.styling.makeup}
          fullWidth
        >
          <FieldRow label={t.styling.skin} value={makeup.skin} />
          <FieldRow label={t.styling.lip} value={makeup.lip} />
          <FieldRow label={t.styling.eye} value={makeup.eye} />
        </Panel>
      </div>

      <p className="mt-5 text-xs text-ink-3">{t.styling.sourceNote}</p>
    </div>
  );
}
