import { translations } from "../i18n/translations";
import type { ColorTypeSlug, Lang } from "../types";
import { colorTypeSlugs } from "../utils/colorTypeSlug";
import { localizePath } from "../utils/localizePath";

export const ORIGIN = "https://personal-color.dev";

const LANGS: Lang[] = ["ko", "en"];
const clip = (s: string, n = 150) => (s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`);
const logicalPaths = ["/", "/about", "/types", ...colorTypeSlugs.map((s) => `/types/${s}`)];

const titleDesc = (lang: Lang, logical: string): { title: string; description: string } => {
  const t = translations[lang];

  if (logical === "/") {
    return {
      title: lang === "ko" ? "퍼스널 컬러 자가진단 · Personal Color Self Test" : "Personal Color Self Test",
      description: clip(t.home.hero.subtext),
    };
  }
  if (logical === "/about") {
    return { title: t.about.title, description: clip(t.about.intro) };
  }
  if (logical === "/types") {
    return { title: t.types.pageTitle, description: clip(t.types.pageSubtitle) };
  }

  const slug = logical.replace("/types/", "") as ColorTypeSlug;
  return { title: t.types[slug].title, description: clip(t.types[slug].summary) };
};

export interface PrerenderRoute {
  url: string;
  lang: Lang;
  logical: string;
  title: string;
  description: string;
  alternates: { ko: string; en: string };
}

export const prerenderRoutes: PrerenderRoute[] = logicalPaths.flatMap((logical) =>
  LANGS.map((lang) => ({
    url: localizePath(lang, logical),
    lang,
    logical,
    ...titleDesc(lang, logical),
    alternates: { ko: localizePath("ko", logical), en: localizePath("en", logical) },
  })),
);

export const DEFAULT_TITLE: Record<Lang, string> = {
  ko: "퍼스널 컬러 자가진단 · Personal Color Self Test",
  en: "Personal Color Self Test",
};

const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);
const byUrl = new Map(prerenderRoutes.map((r) => [norm(r.url), r]));

/** 현재 경로의 prerender 메타 조회. 메타 없는 경로(/test, /results 등)는 null. */
export const getRouteMeta = (pathname: string): PrerenderRoute | null =>
  byUrl.get(norm(pathname)) ?? null;
