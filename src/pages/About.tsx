import pccsImage from "../assets/pccs_tone_map.jpg";
import { colorData } from "../data/colorData";
import { translations } from "../i18n/translations";
import type { AboutSeasonSlug, AboutToneSlug, Lang, PersonalColorType } from "../types";

interface AboutProps {
  lang: Lang;
  onStart: () => void;
}

interface SeasonSectionItem {
  slug: AboutSeasonSlug;
  types: [PersonalColorType, PersonalColorType];
}

interface ToneItem {
  slug: AboutToneSlug;
  sampleKey: PersonalColorType;
  icon: string;
}

const seasonSections: ReadonlyArray<SeasonSectionItem> = [
  { slug: "spring", types: ["Spring Light", "Spring Bright"] },
  { slug: "summer", types: ["Summer Light", "Summer Muted"] },
  { slug: "autumn", types: ["Autumn Muted", "Autumn Dark"] },
  { slug: "winter", types: ["Winter Bright", "Winter Dark"] },
];

const toneItems: ReadonlyArray<ToneItem> = [
  { slug: "light", sampleKey: "Spring Light", icon: "☀" },
  { slug: "bright", sampleKey: "Spring Bright", icon: "✦" },
  { slug: "muted", sampleKey: "Autumn Muted", icon: "◐" },
  { slug: "dark", sampleKey: "Winter Dark", icon: "◼" },
];

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
          <div className="space-y-12">
            {seasonSections.map((season) => {
              const chips = season.types.flatMap((type) => colorData[type]);
              const copy = t.about.seasons[season.slug];
              return (
                <article key={season.slug}>
                  <h3 className="font-display text-3xl text-ink md:text-4xl">{copy.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed break-keep text-ink-2 md:text-base">
                    {copy.desc}
                  </p>
                  <div
                    className="mt-4 flex h-16 w-full overflow-hidden rounded-2xl border border-hairline md:h-20"
                    aria-hidden
                  >
                    {chips.map((color, index) => (
                      <span
                        key={`${season.slug}-${color.hex}-${index}`}
                        className="h-full flex-1"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-8 font-display text-2xl text-ink md:text-3xl">
            {t.about.tones.title}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {toneItems.map((tone) => {
              const copy = t.about.tones[tone.slug];
              const swatches = colorData[tone.sampleKey].slice(0, 4);
              return (
                <div
                  key={tone.slug}
                  className="rounded-2xl border border-hairline bg-surface p-6"
                >
                  <div className="mb-2 text-2xl text-ink-3" aria-hidden>
                    {tone.icon}
                  </div>
                  <h3 className="mb-2 font-display text-lg text-ink">{copy.title}</h3>
                  <p className="text-sm leading-relaxed break-keep text-ink-2">{copy.desc}</p>
                  <div className="mt-3 flex gap-1.5" aria-hidden>
                    {swatches.map((color, index) => (
                      <span
                        key={`${tone.slug}-${color.hex}-${index}`}
                        className="h-8 w-8 rounded-full border border-hairline"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-hairline bg-surface p-6 md:p-10">
          <h2 className="mb-6 font-display text-2xl text-ink md:text-3xl">
            {t.about.howItWorks.title}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[t.about.howItWorks.step1, t.about.howItWorks.step2, t.about.howItWorks.step3].map((step, index) => (
              <div key={`step-${index}`} className="flex gap-3">
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
