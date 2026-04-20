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

type PanelAccent = "rose" | "amber" | "emerald" | "sky" | "violet";

const ACCENT_CLASSES: Record<
  PanelAccent,
  { panel: string; iconBg: string; iconText: string }
> = {
  rose: {
    panel: "bg-rose-50/70 border-rose-100",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
  },
  amber: {
    panel: "bg-amber-50/70 border-amber-100",
    iconBg: "bg-amber-100",
    iconText: "text-amber-700",
  },
  emerald: {
    panel: "bg-emerald-50/70 border-emerald-100",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-700",
  },
  sky: {
    panel: "bg-sky-50/70 border-sky-100",
    iconBg: "bg-sky-100",
    iconText: "text-sky-700",
  },
  violet: {
    panel: "bg-violet-50/70 border-violet-100",
    iconBg: "bg-violet-100",
    iconText: "text-violet-700",
  },
};

interface PanelProps {
  icon: ReactNode;
  label: string;
  accent: PanelAccent;
  children: ReactNode;
  fullWidth?: boolean;
}

function Panel({ icon, label, accent, children, fullWidth }: PanelProps) {
  const classes = ACCENT_CLASSES[accent];
  return (
    <section
      className={[
        "rounded-2xl border p-5",
        classes.panel,
        fullWidth ? "md:col-span-2" : "",
      ].join(" ")}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          aria-hidden
          className={[
            "flex h-9 w-9 items-center justify-center rounded-full",
            classes.iconBg,
            classes.iconText,
          ].join(" ")}
        >
          {icon}
        </span>
        <h3 className="text-base font-bold text-slate-800">{label}</h3>
      </div>
      <div className="space-y-2 text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </section>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
    <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-md">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900">{t.styling.title}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {t.styling.subtitle(displayName)}
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t.styling.keywords}
        </span>
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
          >
            {keyword}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Panel
          icon={<Shirt size={18} strokeWidth={1.75} />}
          label={t.styling.fabric}
          accent="rose"
        >
          <p>{data.fabric[lang]}</p>
        </Panel>

        <Panel
          icon={<Sparkles size={18} strokeWidth={1.75} />}
          label={t.styling.pattern}
          accent="amber"
        >
          <p>{data.patterns[lang]}</p>
        </Panel>

        <Panel
          icon={<Gem size={18} strokeWidth={1.75} />}
          label={t.styling.accessory}
          accent="emerald"
        >
          <FieldRow label={t.styling.accessorySize} value={data.accessorySize[lang]} />
          <FieldRow label={t.styling.metal} value={data.metals[lang]} />
        </Panel>

        <Panel
          icon={<Scissors size={18} strokeWidth={1.75} />}
          label={t.styling.hair}
          accent="sky"
        >
          <p>{data.hair[lang]}</p>
        </Panel>

        <Panel
          icon={<Palette size={18} strokeWidth={1.75} />}
          label={t.styling.makeup}
          accent="violet"
          fullWidth
        >
          <FieldRow label={t.styling.skin} value={makeup.skin} />
          <FieldRow label={t.styling.lip} value={makeup.lip} />
          <FieldRow label={t.styling.eye} value={makeup.eye} />
        </Panel>
      </div>

      <p className="mt-5 text-xs text-slate-400">{t.styling.sourceNote}</p>
    </div>
  );
}
