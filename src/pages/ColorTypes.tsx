import { Link } from "react-router-dom";

import { colorData } from "../data/colorData";
import { colorTypeMetas, seasonSlugGroups } from "../data/colorTypeMeta";
import { translations } from "../i18n/translations";
import type { ColorTypeSlug, Lang } from "../types";
import { colorTypeSlugs } from "../utils/colorTypeSlug";
import { localizePath } from "../utils/localizePath";

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
  const signature = colorData[meta.type].slice(0, 4);
  const cta = translations[lang].types.cardViewDetail;

  return (
    <li>
      <Link
        to={localizePath(lang, `/types/${slug}`)}
        className={[
          "group flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-surface shadow-sm transition-all",
          "hover:-translate-y-0.5 hover:shadow-lg focus-visible:-translate-y-0.5 focus-visible:shadow-lg",
          "focus-visible:ring-2 focus-visible:ring-ink focus-visible:outline-none",
        ].join(" ")}
        aria-label={`${copy.title} — ${copy.tagline}`}
      >
        <div className="flex h-24 w-full" aria-hidden>
          {signature.map((color, index) => (
            <span
              key={`${color.hex}-${index}`}
              className="h-full flex-1"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <p className="text-xs font-semibold tracking-wide text-ink-3 uppercase">
              {meta.season} · {meta.detailTone}
            </p>
            <h3 className="mt-1 font-display text-xl text-ink">{copy.title}</h3>
          </div>

          <p className="text-sm leading-relaxed break-keep text-ink-2">{copy.tagline}</p>

          <div className="flex flex-wrap gap-1.5">
            {copy.keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-fill px-2.5 py-1 text-[11px] font-semibold text-ink-2"
              >
                {keyword}
              </span>
            ))}
          </div>

          <div className="flex gap-1.5" aria-hidden>
            {palette.map((color, index) => (
              <span
                key={`${color.hex}-${index}`}
                className="h-6 flex-1 rounded-md border border-hairline shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>

          <span className="mt-auto text-sm font-semibold text-ink transition-transform group-hover:translate-x-0.5">
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
    <div className="min-h-screen w-full bg-paper pt-16 pb-16">
      <section className="page-container px-4 py-14">
        <h1 className="font-display text-4xl text-ink md:text-5xl">{t.pageTitle}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed break-keep text-ink-2 md:text-lg">
          {t.pageSubtitle}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed break-keep text-ink-3 md:text-base">
          {t.pageIntro}
        </p>
      </section>

      <div className="page-container px-4 pb-12 pt-0">
        <section aria-labelledby="comparison-heading">
          <h2
            id="comparison-heading"
            className="mb-4 font-display text-2xl text-ink md:text-3xl"
          >
            {t.comparison.sectionTitle}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-hairline">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-fill">
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-ink">
                    {t.comparison.colType}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-ink">
                    {t.comparison.colSeason}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-ink">
                    {t.comparison.colBase}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-ink">
                    {t.comparison.colKeywords}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-ink">
                    {t.comparison.colSignature}
                  </th>
                </tr>
              </thead>
              <tbody>
                {colorTypeSlugs.map((slug) => {
                  const meta = colorTypeMetas[slug];
                  const copy = translations[lang].types[slug];
                  return (
                    <tr key={slug} className="border-t border-hairline hover:bg-fill/50">
                      <td className="px-4 py-3 font-semibold text-ink">
                        <Link
                          to={localizePath(lang, `/types/${slug}`)}
                          className="underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none"
                        >
                          {copy.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-ink-2">{meta.season}</td>
                      <td className="px-4 py-3 text-ink-2">{meta.base}</td>
                      <td className="px-4 py-3 text-ink-2">
                        {copy.keywords.slice(0, 3).join(" · ")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block h-6 w-10 rounded-md border border-hairline shadow-sm"
                          style={{ backgroundColor: meta.signatureHex }}
                          aria-label={meta.signatureHex}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="page-container space-y-14 px-4 py-12">
        {seasonSlugGroups.map((group) => {
          const groupCopy = t.seasonGroups[group.seasonSlug];
          const groupId = `group-${group.seasonSlug}`;
          return (
            <section key={group.season} aria-labelledby={groupId}>
              <header className="mb-5">
                <h2 id={groupId} className="font-display text-2xl text-ink md:text-3xl">
                  {groupCopy.title}
                </h2>
                <p className="mt-1 text-sm text-ink-2 md:text-base">{groupCopy.desc}</p>
              </header>
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {group.slugs.map((slug) => (
                  <TypeCard key={slug} slug={slug} lang={lang} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
};
