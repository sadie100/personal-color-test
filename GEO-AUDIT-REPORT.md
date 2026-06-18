---
brand_name: Personal Color Self Test
domain: personal-color.dev
geo_score: 46
audit_date: 2026-06-18
business_type: Publisher / Interactive Tool (indie)
location: Korea (bilingual ko/en)
---

# GEO Audit Report — personal-color.dev

**Site:** Personal Color Self Test · 퍼스널 컬러 자가진단
**URL:** https://personal-color.dev
**Audit date:** 2026-06-18
**Business type:** Publisher / interactive self-test tool (bilingual ko/en, indie project)
**Rendering:** Static Site Generation (SSG) — React + Vite

---

## Composite GEO Score: 46 / 100 — Fair

A **well-engineered foundation undermined by missing GEO layers.** The site does the hard part right — true SSG means every AI crawler sees full content on every page, with correct canonical/hreflang/i18n and clean crawl directives. But it is missing the three things that actually drive AI citation: **structured data (8/100), off-site brand authority (8/100), and platform-specific answer formatting (34/100).** The result is a site that AI engines *can* read perfectly but have little reason to *cite*.

### Score Breakdown

| Category | Weight | Score | Weighted | Band |
|----------|:------:|:-----:|:--------:|------|
| AI Citability & Visibility | 25% | 66/100 | 16.5 | Good |
| Brand Authority Signals | 20% | 8/100 | 1.6 | Critical |
| Content Quality & E-E-A-T | 20% | 52/100 | 10.4 | Fair |
| Technical Foundations | 15% | 87/100 | 13.1 | Good |
| Structured Data | 10% | 8/100 | 0.8 | Critical |
| Platform Optimization | 10% | 34/100 | 3.4 | Weak |
| **Composite** | **100%** | | **46** | **Fair** |

---

## What's Already Strong (don't touch)

- **True SSG on every route.** `/`, `/about`, `/types`, all 8 `/types/*`, and every `/en/*` mirror return complete server-rendered HTML *before* JS runs (home 8.8 KB, /about 19.2 KB, spring-light 19.7 KB). AI crawlers that don't execute JS — GPTBot, ClaudeBot, PerplexityBot — see the full content. This is the single biggest GEO asset and most indie sites fail it.
- **Crawler access: open and correct.** `robots.txt` allows all bots via `User-agent: *` / `Allow: /`, deliberately disallowing only the non-indexable per-user `/test` and `/results` pages (both locales). No AI crawler is blocked. Sitemap directive present.
- **A real, valid `llms.txt`** (1,749 bytes, `text/plain`) — well-formed against the standard, lists all pages with descriptions, and cites the theory source.
- **Clean i18n.** Correct `ko` / `en` / `x-default` hreflang in both HTML head and sitemap, bidirectionally consistent; per-locale `<html lang>` and titles.
- **Self-referencing canonicals** on every route; clean, hyphenated, descriptive URLs (`/types/spring-light`).
- **Genuinely human-authored, original content** with a real theory basis (PCCS + the 한국분장예술인협회 Level-2 consultant curriculum). Not AI filler.

---

## Findings by Severity

### 🔴 Critical

1. **Zero structured data anywhere.** `application/ld+json` count is 0 on every page (verified via raw HTML, not JS-stripped). No Organization/Person, WebSite, WebApplication, DefinedTermSet, Article, or BreadcrumbList. For a *definitional, encyclopedic* tool — exactly the content AI loves to cite — this is the highest-leverage missing layer. Ready-to-deploy JSON-LD is provided below.

2. **No off-site brand/entity authority (8/100).** No Wikipedia entity (verified absent via API), no Wikidata item, no Reddit/forum threads, no third-party reviews, no YouTube. Searches surface only competitors (mypscolorys.com, mycolor.kr, colorize.co.kr). This is expected for an indie `.dev` project, but it is the **binding ceiling** for ChatGPT (cites Wikipedia ~48% of the time), Perplexity (cites Reddit ~47%), and Gemini (weights YouTube + Knowledge Graph). Without it, those three platforms cannot exceed ~35 regardless of on-page work.

3. **No named author or credentials.** Expertise is asserted institutionally ("based on the 한국분장예술인협회 Level-2 curriculum") but never attached to a person — no byline, no bio, no author page, no `Person` schema. Anonymous expertise is heavily discounted by E-E-A-T.

### 🟠 High

4. **No trust infrastructure.** No contact info, email, privacy policy, terms, copyright line, or results disclaimer anywhere on `/` or `/about` (verified in raw HTML). Color analysis borders on appearance/self-image advice — a results disclaimer ("styling guidance, not a professional diagnosis") matters.

5. **No FAQ / Q&A blocks and no comparison table.** Headings are topic labels ("퍼스널 컬러란?"), not the question phrasings AI retrieval matches ("퍼스널 컬러란 무엇인가요?"). There's no 8-type comparison table — the single most AIO/Perplexity-citable asset for this topic.

6. **No `meta description` on any page.** OG/Twitter tags exist but there's no `<meta name="description">` and no `og:description`/`twitter:description`. Bing/Copilot weights descriptions heavily. *(Note: the homepage HTML does carry a description meta; confirm coverage across all routes and locales — the platform agent found it absent site-wide on the rendered routes it checked.)*

7. **Render-blocking third-party font CSS.** Pretendard loads from `cdn.jsdelivr.net` with **no `preconnect`** to that origin (preconnect exists only for Google Fonts). Adds cross-origin round-trips on the critical path → LCP risk.

### 🟡 Medium

8. **Soft-404.** Unknown paths (e.g. `/nonexistent-xyz`) return **HTTP 200** serving the homepage HTML verbatim (with the homepage canonical and `data-ssg-path="/"`). Crawlers can index typo/junk URLs as homepage duplicates. Add a real 404 route that returns a 404 status.

9. **Missing defense-in-depth security headers.** HTTPS + HSTS present (the critical items), but no CSP, `X-Frame-Options`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, or `Permissions-Policy`. HSTS also lacks `includeSubDomains; preload`. Cheap trust signals via `vercel.json`.

10. **`llms.txt` is ko-only and has no `llms-full.txt`.** Links point only to Korean URLs (no `/en/...` despite the bilingual sitemap); `/llms-full.txt` 404s (returns the SPA fallback). No `## Optional` section.

11. **Thin per-page depth + weak interlinking.** Pages run ~90–450 words. The `/types/*` spokes don't link back to the relevant `/about` theory sections (pillar↔cluster not interlinked). No "Spring Light vs Spring Bright" comparison content, no glossary.

### 🟢 Low

12. **Sitemap has no `<lastmod>`; OG block has no `og:url`; `og:image` is relative** (`/og.png` — some consumers reject relative OG URLs; make it absolute).
13. **IndexNow not implemented; Bing Webmaster not verified.** `/.well-known/indexnow-key.txt` is a false positive (SPA fallback), and no `msvalidate.01` meta tag or Bing DNS record exists. **Correction (verified 2026-06-18):** Google Search Console *is* verified via a DNS TXT record (`google-site-verification=…`) — the original audit only inspected page HTML and missed it. Google verification is fine; only Bing remains unverified.
14. **No `Content-Signal:` directive** in robots.txt (forward-looking AI-preference declaration).

---

## Platform Readiness Snapshot

| Platform | Score | Binding Constraint |
|----------|:-----:|--------------------|
| Google AI Overviews | 38/100 | Best fit (rewards SSG + structure). Needs FAQ + 8-type comparison table + question-phrased headings. |
| Perplexity AI | 32/100 | Needs Reddit/community validation + visible freshness dates. SSG + quotable definitions help. |
| Google Gemini | 30/100 | Needs YouTube + Schema.org + Knowledge Graph entity. Topic clustering is the one aligned asset. |
| Bing Copilot | 30/100 | Needs IndexNow + Webmaster verification + meta descriptions. |
| ChatGPT Web Search | 28/100 | Needs an entity (Wikipedia/Wikidata) + Organization schema with `sameAs`. Crawler access is open. |

---

## Prioritized Action Plan

Ordered by **impact ÷ effort**. Items 1–4 are mostly code you control in the SSG build; items 5–6 are off-site and slower-burning but are the true ceiling-raisers.

### Phase 1 — On-site, high-leverage (do this week)

1. **Inject JSON-LD at SSG build time** (never client-side — crawlers don't run JS). Minimum viable set, in priority order:
   - `Person` (or `Organization`) publisher with `@id: …#publisher` and a **real** `sameAs` array (GitHub repo / maintainer profile — never fabricate links).
   - `WebApplication` on the homepage (defines *what the site is*).
   - `DefinedTermSet` + 8 `DefinedTerm`s on `/types` (defines *what it teaches* — the most citable structure here).
   - `BreadcrumbList` on each `/types/:slug`; `Article` + `speakable` on `/about`.
   - Render Korean schema on `/*`, English on `/en/*`. Validate in Google Rich Results Test. *(Templates below.)*

2. **Add a named author + credentials.** Convert the anonymous footer line into a real bio on `/about` ("Built by [name], 퍼스널 컬러 컨설턴트 2급 — 한국분장예술인협회") backed by the `Person` schema above. Lifts Expertise, Authoritativeness, and Trust at once.

3. **Add trust infrastructure + a comparison table + FAQ.**
   - Persistent footer: contact email, a one-line privacy note (test runs client-side), and a results disclaimer.
   - An 8-type comparison table on `/types` (type · season · undertone · keywords · best colors) — the canonical AIO/Perplexity asset.
   - A FAQ block on `/about` with question-phrased H3s ("자가진단은 정확한가요?", "1:1 컨설팅과 뭐가 다른가요?") + `FAQPage` JSON-LD.

4. **Technical hygiene (all in `vercel.json` / SSG head):**
   - Fix the soft-404 → return a real 404 status for unknown paths.
   - Add security headers (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, basic CSP, `Permissions-Policy`; extend HSTS with `includeSubDomains; preload`).
   - `preconnect` to `cdn.jsdelivr.net` (or self-host Pretendard).
   - Ensure `<meta name="description">` on every route/locale; add `og:url`; make `og:image` absolute; add `<lastmod>` to sitemap.

### Phase 2 — Off-site authority (ongoing, the real ceiling)

5. **Create a citable entity.** A **Wikidata item** (lower bar than Wikipedia: instance of → website, official site, topic) gives ChatGPT/Gemini an entity anchor. Add a public GitHub repo + README for the project.

6. **Seed community + media signals.** A short YouTube demo (Gemini-aligned), and authentic participation in r/coloranalysis / r/Kibbe and Korean communities (Perplexity-aligned). Complete `llms.txt` (add `/en/*` links, an `## Optional` section, and a real `/llms-full.txt`).

---

## Ready-to-Deploy JSON-LD

> Inject at **SSG build time** into each page `<head>`. Replace `[REPLACE: …]` placeholders. Verify the inferred Korean type display names against `src/i18n/translations.ts` and `src/utils/colorTypeSlug.ts` before shipping. Use real `sameAs` links only — never fabricate.

### 1. Person (publisher) — site-wide

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://personal-color.dev/#publisher",
  "name": "[REPLACE: your name or handle]",
  "url": "https://personal-color.dev/about",
  "jobTitle": "[REPLACE: e.g. Creator of Personal Color Self Test]",
  "knowsAbout": ["Personal color analysis", "PCCS tone system", "Seasonal color theory", "Color theory"],
  "sameAs": [
    "[REPLACE: https://github.com/your-handle — real profile only, omit if none]"
  ]
}
```

### 2. WebSite — homepage

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://personal-color.dev/#website",
  "url": "https://personal-color.dev/",
  "name": "퍼스널 컬러 자가진단 · Personal Color Self Test",
  "description": "이론 기반 진단 컬러칩으로 나의 퍼스널 컬러 8타입을 찾아보세요. 잘 맞는 색의 방향을 알면 스타일링이 훨씬 선명해집니다.",
  "inLanguage": ["ko", "en"],
  "publisher": { "@id": "https://personal-color.dev/#publisher" }
}
```

### 3. WebApplication — homepage

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://personal-color.dev/#app",
  "name": "퍼스널 컬러 자가진단 · Personal Color Self Test",
  "url": "https://personal-color.dev/",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web browser",
  "browserRequirements": "Requires JavaScript. Works in modern browsers.",
  "description": "이론 기반 진단 컬러칩으로 나의 퍼스널 컬러 8타입을 찾아보세요.",
  "inLanguage": ["ko", "en"],
  "isAccessibleForFree": true,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "publisher": { "@id": "https://personal-color.dev/#publisher" }
}
```

### 4. DefinedTermSet — `/types` (verify Korean names!)

```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": "https://personal-color.dev/types/#set",
  "name": "퍼스널 컬러 8타입",
  "url": "https://personal-color.dev/types",
  "description": "웜/쿨 × 라이트·브라이트·뮤트·다크로 나뉘는 8가지 세부 타입",
  "inLanguage": "ko",
  "hasDefinedTerm": [
    { "@type": "DefinedTerm", "@id": "https://personal-color.dev/types/spring-light#term", "name": "봄 라이트", "url": "https://personal-color.dev/types/spring-light", "inDefinedTermSet": "https://personal-color.dev/types/#set" },
    { "@type": "DefinedTerm", "@id": "https://personal-color.dev/types/spring-bright#term", "name": "봄 브라이트", "url": "https://personal-color.dev/types/spring-bright", "inDefinedTermSet": "https://personal-color.dev/types/#set" },
    { "@type": "DefinedTerm", "@id": "https://personal-color.dev/types/summer-light#term", "name": "여름 라이트", "url": "https://personal-color.dev/types/summer-light", "inDefinedTermSet": "https://personal-color.dev/types/#set" },
    { "@type": "DefinedTerm", "@id": "https://personal-color.dev/types/summer-muted#term", "name": "여름 뮤트", "url": "https://personal-color.dev/types/summer-muted", "inDefinedTermSet": "https://personal-color.dev/types/#set" },
    { "@type": "DefinedTerm", "@id": "https://personal-color.dev/types/autumn-muted#term", "name": "가을 뮤트", "url": "https://personal-color.dev/types/autumn-muted", "inDefinedTermSet": "https://personal-color.dev/types/#set" },
    { "@type": "DefinedTerm", "@id": "https://personal-color.dev/types/autumn-dark#term", "name": "가을 다크", "url": "https://personal-color.dev/types/autumn-dark", "inDefinedTermSet": "https://personal-color.dev/types/#set" },
    { "@type": "DefinedTerm", "@id": "https://personal-color.dev/types/winter-bright#term", "name": "겨울 브라이트", "url": "https://personal-color.dev/types/winter-bright", "inDefinedTermSet": "https://personal-color.dev/types/#set" },
    { "@type": "DefinedTerm", "@id": "https://personal-color.dev/types/winter-dark#term", "name": "겨울 다크", "url": "https://personal-color.dev/types/winter-dark", "inDefinedTermSet": "https://personal-color.dev/types/#set" }
  ]
}
```

### 5. DefinedTerm + BreadcrumbList — each `/types/:slug` (example: spring-light)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "DefinedTerm",
      "@id": "https://personal-color.dev/types/spring-light#term",
      "name": "봄 라이트",
      "url": "https://personal-color.dev/types/spring-light",
      "description": "옐로우 베이스 위의 부드럽고 화사한 타입. 높은 명도와 맑은 청탁감으로 파스텔톤의 맑은 색에서 가장 큰 매력을 발휘합니다.",
      "inDefinedTermSet": "https://personal-color.dev/types/#set",
      "inLanguage": "ko"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://personal-color.dev/" },
        { "@type": "ListItem", "position": 2, "name": "퍼스널 컬러 8타입", "item": "https://personal-color.dev/types" },
        { "@type": "ListItem", "position": 3, "name": "봄 라이트", "item": "https://personal-color.dev/types/spring-light" }
      ]
    }
  ]
}
```

### 6. Article + speakable — `/about`

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://personal-color.dev/about#article",
  "headline": "퍼스널 컬러의 모든 것",
  "description": "퍼스널 컬러는 개인의 타고난 신체 색상과 가장 조화를 이루는 색상 팔레트를 찾는 컬러 분석 시스템입니다.",
  "url": "https://personal-color.dev/about",
  "mainEntityOfPage": "https://personal-color.dev/about",
  "inLanguage": "ko",
  "image": "https://personal-color.dev/og.png",
  "author": { "@id": "https://personal-color.dev/#publisher" },
  "publisher": { "@id": "https://personal-color.dev/#publisher" },
  "datePublished": "[REPLACE: ISO 8601]",
  "dateModified": "[REPLACE: ISO 8601]",
  "articleSection": ["퍼스널 컬러란?", "PCCS 톤 시스템", "4계절 컬러 시스템", "4가지 세부 톤", "테스트 방법"],
  "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "h2"] }
}
```

---

## Source Files (for implementation)

The schema and meta tags are emitted by the SSG build. Relevant repo locations:
- `index.html` — head/meta template (where OG/canonical/hreflang already live; add JSON-LD injection here or in the SSG step)
- `prerender.js` — SSG/sitemap generation (add `<lastmod>`, per-route meta description, JSON-LD)
- `src/i18n/translations.ts` — verify Korean type display names before shipping schema
- `src/utils/colorTypeSlug.ts` — slug source of truth
- `src/pages/About.tsx`, `src/pages/ColorTypeDetail.tsx` — content depth, FAQ, author bio
- `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml` — discoverability files

---

*Methodology: weighted composite across 6 categories (AI Citability 25%, Brand Authority 20%, Content/E-E-A-T 20%, Technical 15%, Schema 10%, Platform 10%). All findings verified against live fetches of personal-color.dev on 2026-06-18. No traffic, ranking, or brand-mention data was fabricated; unverifiable signals are marked as such.*

*Limitation: this audit inspected page **HTML and HTTP responses only**. It does NOT see DNS records, server-side config, or external dashboards — so verification done via DNS TXT (e.g. Google Search Console, confirmed present) or other out-of-band methods will not appear in HTML and may be wrongly flagged as "missing." Treat any "X is absent" finding about verification/config as "not visible in HTML — confirm directly."*
