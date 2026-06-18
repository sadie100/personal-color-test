import { translations } from "../i18n/translations";
import type { ColorTypeSlug } from "../types";
import { colorTypeSlugs } from "../utils/colorTypeSlug";
import { localizePath } from "../utils/localizePath";
import { ORIGIN, type PrerenderRoute } from "./routeMeta";

// Author identity — fill from user input (Tier 4). Handle is fine; never claim a credential.
const AUTHOR_NAME = "Personal Color Self Test"; // [REPLACE with name/handle once provided]
const AUTHOR_SAMEAS: string[] = []; // [REPLACE with real profile URLs, or leave empty]

const publisher = (lang: "ko" | "en") => ({
  "@type": "Person",
  "@id": `${ORIGIN}/#publisher`,
  name: AUTHOR_NAME,
  url: `${ORIGIN}${localizePath(lang, "/about")}`,
  knowsAbout:
    lang === "ko"
      ? ["퍼스널 컬러", "PCCS 톤 시스템", "사계절 컬러 이론", "색채 이론"]
      : ["Personal color analysis", "PCCS tone system", "Seasonal color theory", "Color theory"],
  ...(AUTHOR_SAMEAS.length ? { sameAs: AUTHOR_SAMEAS } : {}),
});

export function buildJsonLd(route: PrerenderRoute): object[] {
  const { lang, logical, url, title, description } = route;
  const t = translations[lang];
  const abs = (logicalPath: string) => `${ORIGIN}${localizePath(lang, logicalPath)}`;
  const pub = { "@id": `${ORIGIN}/#publisher` };

  if (logical === "/") {
    return [
      publisher(lang),
      {
        "@type": "WebSite",
        "@id": `${ORIGIN}/#website`,
        url: `${ORIGIN}${url}`,
        name: title,
        description,
        inLanguage: lang,
        publisher: pub,
      },
      {
        "@type": "WebApplication",
        "@id": `${ORIGIN}/#app`,
        name: title,
        url: `${ORIGIN}${url}`,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web browser",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description,
        inLanguage: lang,
        publisher: pub,
      },
    ].map((o) => ({ "@context": "https://schema.org", ...o }));
  }

  if (logical === "/about") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${abs("/about")}#article`,
        headline: title,
        description,
        url: abs("/about"),
        mainEntityOfPage: abs("/about"),
        inLanguage: lang,
        image: `${ORIGIN}/og.png`,
        author: pub,
        publisher: pub,
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2"] },
      },
    ];
  }

  if (logical === "/types") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        "@id": `${abs("/types")}#set`,
        name: t.types.pageTitle,
        url: abs("/types"),
        inLanguage: lang,
        hasDefinedTerm: colorTypeSlugs.map((slug) => ({
          "@type": "DefinedTerm",
          "@id": `${abs(`/types/${slug}`)}#term`,
          name: t.types[slug].title,
          url: abs(`/types/${slug}`),
          inDefinedTermSet: `${abs("/types")}#set`,
        })),
      },
    ];
  }

  // /types/:slug
  const slug = logical.replace("/types/", "") as ColorTypeSlug;
  return [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "@id": `${abs(logical)}#term`,
      name: t.types[slug].title,
      description: route.description,
      url: abs(logical),
      inDefinedTermSet: `${abs("/types")}#set`,
      inLanguage: lang,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: lang === "ko" ? "홈" : "Home", item: abs("/") },
        { "@type": "ListItem", position: 2, name: t.types.pageTitle, item: abs("/types") },
        { "@type": "ListItem", position: 3, name: t.types[slug].title, item: abs(logical) },
      ],
    },
  ];
}
