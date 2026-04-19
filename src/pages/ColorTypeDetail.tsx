import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { AttributionNote } from "../components/AttributionNote";
import { StylingRecommendations } from "../components/StylingRecommendations";
import { colorData } from "../data/colorData";
import { colorTypeMetas } from "../data/colorTypeMeta";
import { translations } from "../i18n/translations";
import type { ColorTypeSlug, Lang } from "../types";
import { colorTypeSlugs, fromSlug } from "../utils/colorTypeSlug";

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

export const ColorTypeDetail = ({ lang }: ColorTypeDetailProps) => {
  const { typeId } = useParams<{ typeId: string }>();
  const slug = typeId ? fromSlug(typeId) : null;

  const t = translations[lang];
  const palette = useMemo(() => (slug ? colorData[colorTypeMetas[slug].type] : []), [slug]);

  if (!slug) {
    return <Navigate to="/types" replace />;
  }

  const meta = colorTypeMetas[slug];
  const copy = t.types[slug];
  const detailCopy = t.types.detail;
  const { prev, next } = getAdjacent(slug);
  const prevMeta = colorTypeMetas[prev];
  const nextMeta = colorTypeMetas[next];
  const prevCopy = t.types[prev];
  const nextCopy = t.types[next];

  const baseLabel = meta.base === "Warm" ? t.warmUndertone : t.coolUndertone;

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-16 pb-16">
      <section
        className={["bg-gradient-to-br px-4 py-16", meta.gradientClass, meta.heroTextClass].join(" ")}
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/types"
              className="inline-flex text-xs font-semibold tracking-wide uppercase opacity-80 transition-opacity hover:opacity-100"
            >
              {detailCopy.backToList}
            </Link>
            <h1 className="mt-3 text-4xl font-bold drop-shadow-sm md:text-5xl">{copy.title}</h1>
            <p className="mt-2 text-base opacity-90 md:text-lg">{copy.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold md:text-sm">
              <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                {detailCopy.heroMetaSeason(meta.season)}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                {detailCopy.heroMetaBase(baseLabel)}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                {detailCopy.heroMetaTone(meta.detailTone)}
              </span>
            </div>
          </div>

          <div
            aria-hidden
            className="relative h-28 w-28 shrink-0 rounded-full border-4 border-white/70 shadow-xl md:h-36 md:w-36"
            style={{ backgroundColor: meta.signatureHex }}
          />
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <p className="text-base leading-relaxed break-keep text-slate-700 md:text-lg">
            {copy.summary}
          </p>
          <blockquote
            className={[
              "mt-5 border-l-4 pl-4 text-sm leading-relaxed break-keep text-slate-600 italic md:text-base",
              meta.borderClass,
            ].join(" ")}
          >
            “{copy.quote}”
          </blockquote>
        </section>

        <section aria-labelledby="attributes-heading">
          <h2 id="attributes-heading" className="mb-4 text-xl font-bold text-slate-900 md:text-2xl">
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
          <h2 id="keywords-heading" className="mb-3 text-xl font-bold text-slate-900 md:text-2xl">
            {detailCopy.keywordsLabel}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {copy.keywords.map((keyword) => (
              <li
                key={keyword}
                className={[
                  "rounded-full border px-3 py-1 text-sm font-semibold text-slate-700",
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
          <h2 id="palette-heading" className="mb-3 text-xl font-bold text-slate-900 md:text-2xl">
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
                <span className="text-[10px] text-slate-500">{color.hex}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="beauty-heading">
          <h2 id="beauty-heading" className="mb-4 text-xl font-bold text-slate-900 md:text-2xl">
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
            to={`/types/${prev}`}
            className={[
              "flex items-center justify-between gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all",
              "hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
              prevMeta.borderClass,
            ].join(" ")}
            aria-label={`${detailCopy.prev}: ${prevCopy.title}`}
          >
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">
                {detailCopy.prev}
              </p>
              <p className="mt-1 text-base font-bold text-slate-900">{prevCopy.title}</p>
            </div>
            <span
              aria-hidden
              className="h-8 w-8 shrink-0 rounded-full border border-white/70 shadow-sm"
              style={{ backgroundColor: prevMeta.signatureHex }}
            />
          </Link>
          <Link
            to={`/types/${next}`}
            className={[
              "flex items-center justify-between gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all",
              "hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
              nextMeta.borderClass,
            ].join(" ")}
            aria-label={`${detailCopy.next}: ${nextCopy.title}`}
          >
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">
                {detailCopy.next}
              </p>
              <p className="mt-1 text-base font-bold text-slate-900">{nextCopy.title}</p>
            </div>
            <span
              aria-hidden
              className="h-8 w-8 shrink-0 rounded-full border border-white/70 shadow-sm"
              style={{ backgroundColor: nextMeta.signatureHex }}
            />
          </Link>
        </nav>

        <AttributionNote lang={lang} />
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
      "rounded-2xl border border-slate-100 bg-white p-4 shadow-sm",
      className ?? "",
    ].join(" ")}
  >
    <dt className="text-xs font-semibold tracking-wide uppercase text-slate-500">{label}</dt>
    <dd className="mt-1 text-sm leading-relaxed text-slate-800 md:text-base">{value}</dd>
  </div>
);
