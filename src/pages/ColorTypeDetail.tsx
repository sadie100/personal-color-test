import { useMemo, type CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { StylingRecommendations } from "../components/StylingRecommendations";
import { colorData } from "../data/colorData";
import { colorTypeMetas } from "../data/colorTypeMeta";
import { translations } from "../i18n/translations";
import type { Color, ColorTypeSlug, Lang } from "../types";
import { colorTypeSlugs, fromSlug } from "../utils/colorTypeSlug";
import { localizePath } from "../utils/localizePath";

interface ColorTypeDetailProps {
  lang: Lang;
}

interface AdjacentSlugs {
  prev: ColorTypeSlug;
  next: ColorTypeSlug;
}

const getAdjacent = (slug: ColorTypeSlug): AdjacentSlugs => {
  const index = colorTypeSlugs.indexOf(slug);
  const prev = colorTypeSlugs[(index - 1 + colorTypeSlugs.length) % colorTypeSlugs.length]!;
  const next = colorTypeSlugs[(index + 1) % colorTypeSlugs.length]!;
  return { prev, next };
};

/** Blend 5 evenly-sampled palette colors into a soft gradient (falls back to a solid hex). */
const paletteCircleStyle = (palette: Color[], fallbackHex: string): CSSProperties => {
  if (palette.length <= 1) {
    return { backgroundColor: fallbackHex };
  }
  const swatches = Array.from(
    { length: 5 },
    (_, i) => palette[Math.round((i * (palette.length - 1)) / 4)]!.hex,
  );
  return { backgroundImage: `linear-gradient(135deg, ${swatches.join(", ")})` };
};

export const ColorTypeDetail = ({ lang }: ColorTypeDetailProps) => {
  const { typeId } = useParams<{ typeId: string }>();
  const slug = typeId ? fromSlug(typeId) : null;

  const t = translations[lang];
  const palette = useMemo(() => (slug ? colorData[colorTypeMetas[slug].type] : []), [slug]);

  if (!slug) {
    return <Navigate to={localizePath(lang, "/types")} replace />;
  }

  const meta = colorTypeMetas[slug];
  const copy = t.types[slug];
  const detailCopy = t.types.detail;
  const { prev, next } = getAdjacent(slug);
  const prevMeta = colorTypeMetas[prev];
  const nextMeta = colorTypeMetas[next];
  const prevCopy = t.types[prev];
  const nextCopy = t.types[next];

  const baseLabel = meta.base === "Warm" ? t.undertone.warm : t.undertone.cool;

  return (
    <div className="min-h-screen w-full bg-paper pt-16 pb-16">
      <section className="bg-paper px-4 pt-10 pb-8">
        <div className="page-container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to={localizePath(lang, "/types")}
              className="inline-flex text-xs font-semibold tracking-wide uppercase text-ink-3 transition-colors hover:text-ink"
            >
              {detailCopy.backToList}
            </Link>
            <span
              aria-hidden
              className="mt-4 block h-1 w-12 rounded-full"
              style={{ backgroundColor: meta.signatureHex }}
            />
            <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">{copy.title}</h1>
            <p className="mt-2 text-base text-ink-2 md:text-lg">{copy.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold md:text-sm">
              <span className="rounded-full border border-hairline bg-surface px-3 py-1 text-ink-2">
                {detailCopy.heroMetaSeason(meta.season)}
              </span>
              <span className="rounded-full border border-hairline bg-surface px-3 py-1 text-ink-2">
                {detailCopy.heroMetaBase(baseLabel)}
              </span>
              <span className="rounded-full border border-hairline bg-surface px-3 py-1 text-ink-2">
                {detailCopy.heroMetaTone(meta.detailTone)}
              </span>
            </div>
          </div>

          <div
            aria-hidden
            className="relative h-28 w-28 shrink-0 rounded-full border-4 border-surface shadow-md ring-1 ring-hairline md:h-36 md:w-36"
            style={paletteCircleStyle(palette, meta.signatureHex)}
          />
        </div>
      </section>

      <div className="page-container space-y-10 px-4 py-12">
        <section className="rounded-3xl border border-hairline bg-surface p-6 md:p-8">
          <p className="text-base leading-relaxed break-keep text-ink-2 md:text-lg">
            {copy.summary}
          </p>
          <blockquote
            className={[
              "mt-5 border-l-4 pl-4 text-sm leading-relaxed break-keep text-ink-2 italic md:text-base",
              meta.borderClass,
            ].join(" ")}
          >
            “{copy.quote}”
          </blockquote>
        </section>

        <section aria-labelledby="attributes-heading">
          <h2 id="attributes-heading" className="mb-4 font-display text-xl text-ink md:text-2xl">
            {detailCopy.baseLabel} · {detailCopy.brightnessLabel} · {detailCopy.chromaLabel} · {detailCopy.clarityLabel}
          </h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AttributeCell label={detailCopy.baseLabel} value={copy.attributes.base} />
            <AttributeCell label={detailCopy.brightnessLabel} value={copy.attributes.brightness} />
            <AttributeCell label={detailCopy.chromaLabel} value={copy.attributes.chroma} />
            <AttributeCell label={detailCopy.clarityLabel} value={copy.attributes.clarity} />
            <AttributeCell
              label={detailCopy.pccsLabel}
              value={meta.pccs}
              className="sm:col-span-2"
            />
          </dl>
        </section>

        <section aria-labelledby="keywords-heading">
          <h2 id="keywords-heading" className="mb-3 font-display text-xl text-ink md:text-2xl">
            {detailCopy.keywordsLabel}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {copy.keywords.map((keyword) => (
              <li
                key={keyword}
                className={[
                  "rounded-full border px-3 py-1 text-sm font-semibold text-ink-2",
                  meta.borderClass,
                  meta.bgClass,
                ].join(" ")}
              >
                {keyword}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="palette-heading">
          <h2 id="palette-heading" className="mb-3 font-display text-xl text-ink md:text-2xl">
            {detailCopy.paletteLabel}
          </h2>
          <ul className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
            {palette.map((color, index) => (
              <li key={`${color.hex}-${index}`} className="flex flex-col items-center gap-1">
                <span
                  aria-hidden
                  className="h-12 w-12 rounded-lg border border-white/60 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-[10px] text-ink-3">{color.hex}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="beauty-heading">
          <h2 id="beauty-heading" className="mb-4 font-display text-xl text-ink md:text-2xl">
            {detailCopy.beautyTitle}
          </h2>
          <StylingRecommendations
            bestType={meta.type}
            displayName={copy.title}
            lang={lang}
            t={t}
          />
        </section>

        <nav aria-label={detailCopy.backToList} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to={localizePath(lang, `/types/${prev}`)}
            className={[
              "flex items-center justify-between gap-3 rounded-2xl border bg-surface p-4 transition-all",
              "hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink",
              prevMeta.borderClass,
            ].join(" ")}
            aria-label={`${detailCopy.prev}: ${prevCopy.title}`}
          >
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-ink-3">
                {detailCopy.prev}
              </p>
              <p className="mt-1 text-base font-bold text-ink">{prevCopy.title}</p>
            </div>
            <span
              aria-hidden
              className="h-8 w-8 shrink-0 rounded-full border border-white/70 shadow-sm"
              style={paletteCircleStyle(colorData[prevMeta.type], prevMeta.signatureHex)}
            />
          </Link>
          <Link
            to={localizePath(lang, `/types/${next}`)}
            className={[
              "flex items-center justify-between gap-3 rounded-2xl border bg-surface p-4 transition-all",
              "hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink",
              nextMeta.borderClass,
            ].join(" ")}
            aria-label={`${detailCopy.next}: ${nextCopy.title}`}
          >
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-ink-3">
                {detailCopy.next}
              </p>
              <p className="mt-1 text-base font-bold text-ink">{nextCopy.title}</p>
            </div>
            <span
              aria-hidden
              className="h-8 w-8 shrink-0 rounded-full border border-white/70 shadow-sm"
              style={paletteCircleStyle(colorData[nextMeta.type], nextMeta.signatureHex)}
            />
          </Link>
        </nav>
      </div>
    </div>
  );
};

interface AttributeCellProps {
  label: string;
  value: string;
  className?: string;
}

const AttributeCell = ({ label, value, className }: AttributeCellProps) => (
  <div
    className={[
      "rounded-2xl border border-hairline bg-surface p-4",
      className ?? "",
    ].join(" ")}
  >
    <dt className="text-xs font-semibold tracking-wide uppercase text-ink-3">{label}</dt>
    <dd className="mt-1 text-sm leading-relaxed text-ink-2 md:text-base">{value}</dd>
  </div>
);
