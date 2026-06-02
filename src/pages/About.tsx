import pccsImage from "../assets/pccs_tone_map.jpg";
import { colorData } from "../data/colorData";
import { translations } from "../i18n/translations";
import type {
  AboutSeasonSlug,
  AboutToneSlug,
  Color,
  Lang,
  PersonalColorType,
} from "../types";

interface AboutProps {
  lang: Lang;
  onStart: () => void;
}

interface SeasonConfigItem {
  key: "Spring" | "Summer" | "Autumn" | "Winter";
  slug: AboutSeasonSlug;
  gradient: string;
  borderColor: string;
  bgColor: string;
  sampleKey: PersonalColorType;
}

interface ToneConfigItem {
  slug: AboutToneSlug;
  sampleKey: PersonalColorType;
  icon: string;
  bgColor: string;
  borderColor: string;
}

interface ColorSwatchesProps {
  colors: ReadonlyArray<Color>;
  count?: number;
}

const seasonConfig: ReadonlyArray<SeasonConfigItem> = [
  {
    key: "Spring",
    slug: "spring",
    gradient: "from-amber-400 to-orange-300",
    borderColor: "border-amber-400",
    bgColor: "bg-amber-50",
    sampleKey: "Spring Light",
  },
  {
    key: "Summer",
    slug: "summer",
    gradient: "from-sky-400 to-indigo-300",
    borderColor: "border-sky-400",
    bgColor: "bg-sky-50",
    sampleKey: "Summer Light",
  },
  {
    key: "Autumn",
    slug: "autumn",
    gradient: "from-orange-600 to-amber-700",
    borderColor: "border-orange-600",
    bgColor: "bg-orange-50",
    sampleKey: "Autumn Muted",
  },
  {
    key: "Winter",
    slug: "winter",
    gradient: "from-indigo-600 to-purple-700",
    borderColor: "border-indigo-600",
    bgColor: "bg-indigo-50",
    sampleKey: "Winter Bright",
  },
];

const toneConfig: ReadonlyArray<ToneConfigItem> = [
  {
    slug: "light",
    sampleKey: "Spring Light",
    icon: "☀",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
  },
  {
    slug: "bright",
    sampleKey: "Spring Bright",
    icon: "✦",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-300",
  },
  {
    slug: "muted",
    sampleKey: "Autumn Muted",
    icon: "◐",
    bgColor: "bg-stone-50",
    borderColor: "border-stone-300",
  },
  {
    slug: "dark",
    sampleKey: "Winter Dark",
    icon: "◼",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-400",
  },
];

const ColorSwatches = ({ colors, count = 5 }: ColorSwatchesProps) => (
  <div className="mt-3 flex gap-1.5">
    {colors.slice(0, count).map((color, index) => (
      <div
        key={`${color.hex}-${index}`}
        className="h-8 w-8 rounded-full border border-white/50 shadow-sm"
        style={{ backgroundColor: color.hex }}
        title={color.name}
      />
    ))}
  </div>
);

export const About = ({ lang, onStart }: AboutProps) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen w-full bg-paper pt-16">
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display text-4xl text-ink md:text-5xl">{t.about.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed break-keep text-ink-2 md:text-lg">
          {t.about.intro}
        </p>
      </section>

      <div className="mx-auto max-w-4xl space-y-16 px-4 py-12">
        <section className="rounded-2xl border border-hairline bg-surface p-6 md:p-10">
          <h2 className="mb-4 font-display text-2xl text-ink md:text-3xl">
            {t.about.whatIs.title}
          </h2>
          <p className="text-base leading-relaxed break-keep text-ink-2 md:text-lg">
            {t.about.whatIs.desc}
          </p>
        </section>

        <section className="rounded-2xl border border-hairline bg-surface p-6 md:p-10">
          <h2 className="mb-6 font-display text-2xl text-ink md:text-3xl">
            {t.about.pccs.title}
          </h2>
          <div className="mb-6 flex justify-center">
            <img
              src={pccsImage}
              alt={t.about.pccs.imageAlt}
              className="max-w-full rounded-xl border border-hairline md:max-w-lg"
            />
          </div>
          <p className="text-base leading-relaxed break-keep text-ink-2 md:text-lg">
            {t.about.pccs.desc}
          </p>
        </section>

        <section>
          <h2 className="mb-8 font-display text-2xl text-ink md:text-3xl">
            {t.about.seasons.title}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {seasonConfig.map((season) => (
              <div
                key={season.key}
                className={`${season.bgColor} rounded-2xl border-t-4 p-6 shadow-md ${season.borderColor}`}
              >
                <h3 className="mb-2 text-xl font-bold text-gray-800">
                  {t.about.seasons[season.slug].title}
                </h3>
                <p className="text-sm leading-relaxed break-keep text-gray-600">
                  {t.about.seasons[season.slug].desc}
                </p>
                <ColorSwatches colors={colorData[season.sampleKey]} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-8 font-display text-2xl text-ink md:text-3xl">
            {t.about.tones.title}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {toneConfig.map((tone) => (
              <div
                key={tone.slug}
                className={`${tone.bgColor} rounded-2xl border-t-4 p-6 shadow-md ${tone.borderColor}`}
              >
                <div className="mb-2 text-2xl">{tone.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-gray-800">
                  {t.about.tones[tone.slug].title}
                </h3>
                <p className="text-sm leading-relaxed break-keep text-gray-600">
                  {t.about.tones[tone.slug].desc}
                </p>
                <ColorSwatches colors={colorData[tone.sampleKey]} count={4} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-hairline bg-surface p-6 md:p-10">
          <h2 className="mb-6 font-display text-2xl text-ink md:text-3xl">
            {t.about.howItWorks.title}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[t.about.howItWorks.step1, t.about.howItWorks.step2, t.about.howItWorks.step3].map((step, index) => (
              <div key={step} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-lg text-accent-fg">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-relaxed break-keep text-ink-2">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-hairline bg-surface p-8 text-left md:p-12">
          <h2 className="mb-4 font-display text-2xl text-ink md:text-3xl">{t.about.cta}</h2>
          <button
            onClick={onStart}
            className="cursor-pointer rounded-lg bg-accent px-8 py-4 text-base font-bold text-accent-fg transition-opacity hover:opacity-90 active:scale-95"
          >
            {t.home.startButton}
          </button>
        </section>
      </div>

      <div className="h-12" />
    </div>
  );
};
