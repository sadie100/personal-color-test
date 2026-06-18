import pccsImage from "../assets/pccs_tone_map.jpg";
import { colorData } from "../data/colorData";
import { translations } from "../i18n/translations";
import type { AboutSeasonSlug, AboutToneSlug, Lang, PersonalColorType } from "../types";

interface AboutProps {
  lang: Lang;
  onStart: () => void;
  onTypes: () => void;
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

export const About = ({ lang, onStart, onTypes }: AboutProps) => {
  const t = translations[lang];

  return (
    <div className="bg-paper min-h-screen w-full pt-16">
      <section className="page-container px-4 pt-16">
        <h1 className="font-display text-ink text-4xl md:text-5xl">{t.about.title}</h1>
      </section>

      <div className="page-container space-y-16 px-4 py-12">
        <section id="what-is" className="border-hairline bg-surface rounded-2xl border p-6 md:p-10">
          <h2 className="font-display text-ink mb-4 text-2xl md:text-3xl">
            {t.about.whatIs.title}
          </h2>
          <p className="text-ink-2 text-base leading-relaxed break-keep md:text-lg">
            {t.about.whatIs.desc}
          </p>
        </section>

        <section id="pccs" className="border-hairline bg-surface rounded-2xl border p-6 md:p-10">
          <h2 className="font-display text-ink mb-6 text-2xl md:text-3xl">{t.about.pccs.title}</h2>
          <div className="mb-6 flex justify-center">
            <img
              src={pccsImage}
              alt={t.about.pccs.imageAlt}
              className="border-hairline max-w-full rounded-xl border md:max-w-lg"
            />
          </div>
          <p className="text-ink-2 text-base leading-relaxed break-keep md:text-lg">
            {t.about.pccs.desc}
          </p>
        </section>

        <section id="seasons">
          <h2 className="font-display text-ink mb-8 text-2xl md:text-3xl">
            {t.about.seasons.title}
          </h2>
          <div className="space-y-12">
            {seasonSections.map((season) => {
              const chips = season.types.flatMap((type) => colorData[type]);
              const copy = t.about.seasons[season.slug];
              return (
                <article key={season.slug}>
                  <h3 className="font-display text-ink text-3xl md:text-4xl">{copy.title}</h3>
                  <p className="text-ink-2 mt-2 max-w-2xl text-sm leading-relaxed break-keep md:text-base">
                    {copy.desc}
                  </p>
                  <div
                    className="border-hairline mt-4 flex h-16 w-full overflow-hidden rounded-2xl border md:h-20"
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
          <div className="mt-8 text-right">
            <button
              onClick={onTypes}
              className="group border-hairline bg-surface text-ink hover:bg-hairline/40 inline-flex cursor-pointer items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition-colors"
            >
              {t.about.seasons.seeAllTypes}
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </button>
          </div>
        </section>

        <section id="tones">
          <h2 className="font-display text-ink mb-8 text-2xl md:text-3xl">{t.about.tones.title}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {toneItems.map((tone) => {
              const copy = t.about.tones[tone.slug];
              const swatches = colorData[tone.sampleKey].slice(0, 4);
              return (
                <div key={tone.slug} className="border-hairline bg-surface rounded-2xl border p-6">
                  <div className="text-ink-3 mb-2 text-2xl" aria-hidden>
                    {tone.icon}
                  </div>
                  <h3 className="font-display text-ink mb-2 text-lg">{copy.title}</h3>
                  <p className="text-ink-2 text-sm leading-relaxed break-keep">{copy.desc}</p>
                  <div className="mt-3 flex gap-1.5" aria-hidden>
                    {swatches.map((color, index) => (
                      <span
                        key={`${tone.slug}-${color.hex}-${index}`}
                        className="border-hairline h-8 w-8 rounded-full border"
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

        <section className="border-hairline bg-surface rounded-2xl border p-6 md:p-10">
          <h2 className="font-display text-ink mb-6 text-2xl md:text-3xl">
            {t.about.howItWorks.title}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[t.about.howItWorks.step1, t.about.howItWorks.step2, t.about.howItWorks.step3].map(
              (step, index) => (
                <div key={`step-${index}`} className="flex gap-3">
                  <div className="bg-accent font-display text-accent-fg flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg">
                    {index + 1}
                  </div>
                  <p className="text-ink-2 pt-1 text-sm leading-relaxed break-keep">{step}</p>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="border-hairline bg-surface rounded-2xl border p-6 md:p-10">
          <h2 className="font-display text-ink mb-6 text-2xl md:text-3xl">{t.about.faq.title}</h2>
          <div className="space-y-6">
            {t.about.faq.items.map((item, index) => (
              <div key={`faq-${index}`}>
                <h3 className="font-display text-ink mb-2 text-base font-semibold">{item.q}</h3>
                <p className="text-ink-2 text-sm leading-relaxed break-keep">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-hairline bg-surface rounded-2xl border p-8 text-center md:p-12">
          <h2 className="font-display text-ink mb-4 text-2xl md:text-3xl">{t.about.cta}</h2>
          <button
            onClick={onStart}
            className="bg-accent text-accent-fg cursor-pointer rounded-lg px-8 py-4 text-base font-bold transition-opacity hover:opacity-90 active:scale-95"
          >
            {t.home.startButton}
          </button>
        </section>
      </div>

      <div className="h-12" />
    </div>
  );
};
