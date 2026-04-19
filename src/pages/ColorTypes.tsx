import { Link } from "react-router-dom";

import { colorData } from "../data/colorData";
import { colorTypeMetas, coolSlugs, warmSlugs } from "../data/colorTypeMeta";
import { translations } from "../i18n/translations";
import type { ColorTypeSlug, Lang } from "../types";

interface ColorTypesProps {
  lang: Lang;
}

interface TypeCardProps {
  slug: ColorTypeSlug;
  lang: Lang;
}

const TypeCard = ({ slug, lang }: TypeCardProps) => {
  const meta = colorTypeMetas[slug];
  const copy = translations[lang].types[slug];
  const palette = colorData[meta.type].slice(0, 6);
  const cta = translations[lang].types.cardViewDetail;

  return (
    <li>
      <Link
        to={`/types/${slug}`}
        className={[
          "group flex h-full flex-col overflow-hidden rounded-3xl border-t-4 bg-white shadow-sm transition-all",
          "hover:-translate-y-0.5 hover:shadow-lg focus-visible:-translate-y-0.5 focus-visible:shadow-lg",
          "focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none",
          meta.borderClass,
        ].join(" ")}
        aria-label={`${copy.title} — ${copy.tagline}`}
      >
        <div
          className={[
            "relative h-28 w-full bg-gradient-to-br px-5 py-4",
            meta.gradientClass,
            meta.heroTextClass,
          ].join(" ")}
        >
          <p className="text-xs font-semibold tracking-wide uppercase opacity-80">
            {meta.season} · {meta.detailTone}
          </p>
          <h3 className="mt-1 text-xl font-bold">{copy.title}</h3>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <p className="text-sm leading-relaxed break-keep text-slate-600">{copy.tagline}</p>

          <div className="flex flex-wrap gap-1.5">
            {copy.keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
              >
                {keyword}
              </span>
            ))}
          </div>

          <div className="flex gap-1.5" aria-hidden>
            {palette.map((color, index) => (
              <span
                key={`${color.hex}-${index}`}
                className="h-6 flex-1 rounded-md border border-white/60 shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>

          <span className="mt-auto text-sm font-semibold text-purple-600 transition-transform group-hover:translate-x-0.5">
            {cta}
          </span>
        </div>
      </Link>
    </li>
  );
};

export const ColorTypes = ({ lang }: ColorTypesProps) => {
  const t = translations[lang].types;

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-16 pb-16">
      <section className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 px-4 py-14 text-center text-white">
        <h1 className="mb-3 text-4xl font-bold drop-shadow-lg md:text-5xl">{t.pageTitle}</h1>
        <p className="mx-auto max-w-2xl text-base text-balance break-keep opacity-95 md:text-lg">
          {t.pageSubtitle}
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-balance break-keep opacity-85 md:text-base">
          {t.pageIntro}
        </p>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-4 py-12">
        <section aria-labelledby="warm-group">
          <header className="mb-5">
            <h2
              id="warm-group"
              className="text-2xl font-bold text-slate-900 md:text-3xl"
            >
              {t.warmGroupTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600 md:text-base">{t.warmGroupDesc}</p>
          </header>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {warmSlugs.map((slug) => (
              <TypeCard key={slug} slug={slug} lang={lang} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="cool-group">
          <header className="mb-5">
            <h2
              id="cool-group"
              className="text-2xl font-bold text-slate-900 md:text-3xl"
            >
              {t.coolGroupTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600 md:text-base">{t.coolGroupDesc}</p>
          </header>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coolSlugs.map((slug) => (
              <TypeCard key={slug} slug={slug} lang={lang} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
