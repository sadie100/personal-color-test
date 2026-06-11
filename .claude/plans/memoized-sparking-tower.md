# 다국어 SSG 전환 (SEO 목적, 한국어 + 영어)

## Context

현재 앱은 Vite 8 + React 19 + react-router-dom v7 기반 **CSR SPA**다. 첫 응답 HTML이 빈
`<div id="root">`뿐이라 크롤러·OG 미리보기가 JS 없이는 콘텐츠를 못 본다. 또한 `lang`이 App
state(`useState("ko")`)라 영어판이 **별도 URL로 존재하지 않아** 영어는 검색에 아예 안 잡힌다.

목표: SEO 가치가 있는 정적 페이지를 **언어별로 분리된 URL에 빌드 타임 prerender**하여, 크롤러가
한국어판·영어판을 각각 JS 없이 읽게 만든다. `translations.en`에 영어 카피가 이미 완비돼 있어 콘텐츠
작성은 불필요하다.

### URL 구조 (결정 완료)
**한국어 = 무접두 / 영어 = `/en` 접두.** 기존 한국어 URL·인덱싱·공유 링크 보존, 변경 최소.
```
ko:  /         /about       /types       /types/spring-light       /test       /results
en:  /en       /en/about    /en/types    /en/types/spring-light    /en/test    /en/results
```
- prerender 대상: 11(ko) + 11(en) = **22 페이지** (`/`,`/about`,`/types`,`/types/{8종}` × 2 언어)
- `/test`·`/results`(+ `/en/*`)는 prerender 안 함 → SPA 유지, noindex
- 루트 `/` = 한국어 홈 (리다이렉트 불필요)

### 도구 (결정 완료)
**Vite 네이티브 SSR + 빌드 타임 prerender 스크립트.** RR7 framework 모드는 Vite 8 미지원(Vite 7
다운그레이드 필요), vite-react-ssg는 RR7 peer 불일치 → 둘 다 배제. 수동 방식은 `<App/>` 트리를
유지하고 버전 락 리스크 없음. RR7의 `StaticRouter`는 `react-router-dom`에서 직접 export됨(검증 완료).

### 핵심 아키텍처 변경: lang을 state → URL 파생으로
현재 `lang`은 `App.tsx:66`의 `useState`. 이를 **pathname에서 파생**으로 바꾼다:
- `getLangFromPathname(p) = (p === "/en" || p.startsWith("/en/")) ? "en" : "ko"`
- 모든 `navigate()`·`<Link to>`·`shareUrl`은 `localizePath(lang, path)`로 언어 접두 처리
- 언어 토글 = `setLang` 대신 동일 논리 경로의 반대 언어 URL로 `navigate`

## 구현

### 1. SSG 차단 버그 수정 (필수)
[src/components/ColorCard.tsx:18](src/components/ColorCard.tsx#L18) — [ShirtSwatch.tsx:9](src/components/ShirtSwatch.tsx#L9) 패턴 적용:
```ts
const exitOffset = typeof window === "undefined" ? 1200 : window.innerWidth + 200;
```
유일한 렌더타임 무가드 `window`. 나머지(useCamera, culori)는 SSR-safe.

### 2. 신규: `src/utils/localizePath.ts` (단일 진실 공급원)
앱 코드와 prerender/routeMeta가 **같은** 경로 규칙을 쓰도록 분리.
```ts
import type { Lang } from "../types";

export const getLangFromPathname = (pathname: string): Lang =>
  pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ko";

/** 논리 경로(무접두 ko 경로)를 해당 언어 URL로 변환. "/" + en → "/en" */
export const localizePath = (lang: Lang, path: string): string =>
  lang === "ko" ? path : path === "/" ? "/en" : `/en${path}`;

/** URL → 논리 경로(접두 제거). "/en/about" → "/about", "/en" → "/" */
export const stripLangPrefix = (pathname: string): string => {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
};
```

### 3. `src/App.tsx` — lang 파생 + 네비게이션 언어 인식
- **L66 `useState` 제거** → `const lang = getLangFromPathname(location.pathname);`
- **L40-58 `getScreenFromPathname`**: 시작에서 `pathname = stripLangPrefix(pathname)` 후 기존 매칭.
- **L149 `handleToggleLang`**: 동일 논리 경로의 반대 언어로 이동(search 보존):
  ```ts
  const handleToggleLang = (newLang: Lang) => {
    const logical = stripLangPrefix(location.pathname);
    navigate({ pathname: localizePath(newLang, logical), search: location.search });
  };
  ```
- **모든 `navigate(...)` 17곳**(L88,95,115,128,135,146,154,163,184,189,205,210,216,224,256,260,288)
  의 경로 인자를 `localizePath(lang, "...")`로 감쌈. 예: `navigate(localizePath(lang, "/test"))`.
  `goToResults`의 `{pathname:"/results"}` → `{pathname: localizePath(lang, "/results")}`. catch-all
  `<Navigate to="/">`는 그대로(미지 경로는 ko 홈으로).
- **L240 `shareUrl`**: `…/results` → `…${localizePath(lang, "/results")}`.
- **`<Routes>` (L253-289)**: 논리 라우트를 언어별로 2회 렌더하는 헬퍼로 교체:
  ```tsx
  const renderRoutes = (routeLang: Lang) => {
    const b = routeLang === "ko" ? "" : "/en";
    return (
      <>
        <Route path={b === "" ? "/" : b} element={<Home lang={routeLang} … />} />
        <Route path={`${b}/about`} element={<About lang={routeLang} … />} />
        <Route path={`${b}/types`} element={<ColorTypes lang={routeLang} />} />
        <Route path={`${b}/types/:typeId`} element={<ColorTypeDetail lang={routeLang} />} />
        <Route path={`${b}/test`} element={<ColorTest lang={routeLang} … />} />
        <Route path={`${b}/results`} element={<Results lang={routeLang} … />} />
      </>
    );
  };
  // <Routes>{renderRoutes("ko")}{renderRoutes("en")}<Route path="*" element={<Navigate to="/" replace/>}/></Routes>
  ```
  → `/en/about` 매칭 시 About이 `lang="en"`으로 렌더됨. App 레벨 `lang`(Header·핸들러용)과 일치.
- **`<html>` lang 동기화**(a11y·클라 내비용): `useEffect(() => { document.documentElement.lang = lang; }, [lang]);` 추가.

### 4. 페이지 `<Link to>` 언어 인식 (lang prop 이미 받음)
- [ColorTypes.tsx:27](src/pages/ColorTypes.tsx#L27): `to={localizePath(lang, \`/types/${slug}\`)}`
- [ColorTypeDetail.tsx](src/pages/ColorTypeDetail.tsx): L47 Navigate, L67 `/types`, L184/L205 prev/next → 전부 `localizePath(lang, …)`
- [Results.tsx:444](src/pages/Results.tsx#L444): `to={localizePath(lang, \`/types/${toSlug(detailType)}\`)}`

### 5. 신규: `src/seo/routeMeta.ts`
22개 prerender 라우트의 메타 + hreflang 입력을 빌드 타임 데이터로 생성. `translations[lang]`에서 추출.
```ts
import { colorTypeSlugs } from "../utils/colorTypeSlug";
import { translations } from "../i18n/translations";
import { localizePath } from "../utils/localizePath";
import type { Lang } from "../types";

export const ORIGIN = "https://personal-color.dev";
const LANGS: Lang[] = ["ko", "en"];
const clip = (s: string, n = 150) => (s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…");
const logicalPaths = ["/", "/about", "/types", ...colorTypeSlugs.map((s) => `/types/${s}`)];

const titleDesc = (lang: Lang, logical: string) => {
  const t = translations[lang];
  if (logical === "/") return { title: lang === "ko" ? "퍼스널 컬러 자가진단 · Personal Color Self Test" : "Personal Color Self Test", description: clip(t.home.hero.subtext) };
  if (logical === "/about") return { title: t.about.title, description: clip(t.about.intro) };
  if (logical === "/types") return { title: t.types.pageTitle, description: clip(t.types.pageSubtitle) };
  const slug = logical.replace("/types/", "") as (typeof colorTypeSlugs)[number];
  return { title: t.types[slug].title, description: clip(t.types[slug].summary) };
};

export interface PrerenderRoute {
  url: string; lang: Lang; logical: string; title: string; description: string;
  alternates: { ko: string; en: string };
}
export const prerenderRoutes: PrerenderRoute[] = logicalPaths.flatMap((logical) =>
  LANGS.map((lang) => ({
    url: localizePath(lang, logical), lang, logical, ...titleDesc(lang, logical),
    alternates: { ko: localizePath("ko", logical), en: localizePath("en", logical) },
  })),
);
```

### 6. 신규: `src/entry-server.tsx`
```tsx
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

export { prerenderRoutes, ORIGIN } from "./seo/routeMeta";

export function render(url: string): string {
  return renderToString(
    <StrictMode><StaticRouter location={url}><App /></StaticRouter></StrictMode>,
  );
}
```
`./index.css` import 금지(클라 빌드가 해시 CSS link 주입). App이 `url`에서 lang 파생하므로 언어별 렌더 자동.

### 7. `src/main.tsx` — 라우트 일치 기반 hydrate/createRoot
SPA 폴백(`/test` 등)이 한국어 홈 셸을 받으면 hydrate 미스매치가 나므로, prerender 시 심은
`data-ssg-path`와 현재 경로가 일치할 때만 hydrate:
```tsx
import { createRoot, hydrateRoot } from "react-dom/client";
// …
const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);
const here = norm(window.location.pathname);
const app = (<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>);
if (rootElement.dataset.ssgPath && norm(rootElement.dataset.ssgPath) === here) {
  hydrateRoot(rootElement, app);
} else {
  rootElement.innerHTML = "";
  createRoot(rootElement).render(app);
}
```

### 8. 신규: `prerender.js` (레포 루트, ESM)
`vite build`(클라) + `vite build --ssr`(서버) 후 실행. `dist/server/entry-server.js`에서
`render`·`prerenderRoutes`·`ORIGIN` import. 각 라우트마다:
1. `render(url)` → HTML 문자열
2. `dist/index.html` 템플릿의 `<div id="root"></div>` → `<div id="root" data-ssg-path="{url}">{html}</div>`
3. `<title>`·`description`·`og:title`·`og:description`·`twitter:*` 치환 (멀티라인 메타는 `[\s\S]*?`)
4. `</head>` 앞에 주입: canonical + hreflang(ko/en/x-default) + og:locale
   ```html
   <link rel="canonical" href="{ORIGIN}{url}" />
   <link rel="alternate" hreflang="ko" href="{ORIGIN}{alt.ko}" />
   <link rel="alternate" hreflang="en" href="{ORIGIN}{alt.en}" />
   <link rel="alternate" hreflang="x-default" href="{ORIGIN}{alt.ko}" />
   <meta property="og:locale" content="{lang==='ko'?'ko_KR':'en_US'}" />
   ```
5. `<html lang="ko">` → `<html lang="{lang}">` (en 페이지만 변경)
6. 출력: ko `/` → `dist/index.html`, ko `/about` → `dist/about/index.html`, en `/en` →
   `dist/en/index.html`, en `/en/about` → `dist/en/about/index.html` …
7. **sitemap.xml 재생성**: 22개 indexable URL을 hreflang `xhtml:link` 대안과 함께 `dist/sitemap.xml`로
   기록(수동 드리프트 방지). `/test`·`/results` 제외.

`dist/index.html`(ko 홈, `data-ssg-path="/"`)이 `/test`·`/results`·미지 경로의 SPA 폴백도 겸함 —
경로 불일치 시 §7 로직이 createRoot로 깨끗이 클라 렌더(미스매치 없음).

### 9. `package.json` 스크립트 (dev 무변경)
```jsonc
"build": "vite build && vite build --ssr src/entry-server.tsx --outDir dist/server && node prerender.js",
"build:client": "vite build",
"build:ssr": "vite build --ssr src/entry-server.tsx --outDir dist/server",
"prerender": "node prerender.js",
```
`vite.config.ts` 변경 불필요.

### 10. SEO 파일
- [public/robots.txt](public/robots.txt): `Disallow: /en/results`, `Disallow: /en/test` 추가.
- [public/sitemap.xml](public/sitemap.xml): prerender 스크립트가 `dist/sitemap.xml`을 재생성하므로
  소스 파일은 폴백용으로만 유지(또는 동일 내용으로 갱신). hreflang 대안 포함.
- [index.html](index.html) 템플릿: 변경 불필요(prerender가 페이지별로 head 주입). `<html lang="ko">`는
  ko 페이지·SPA 폴백 기본값으로 유지.

### 11. 호스팅 (Vercel)
[vercel.json](vercel.json) catch-all rewrite는 파일시스템 우선이라 **변경 불필요** — 실제 prerender된
파일(`/about/index.html`, `/en/types/spring-light/index.html` 등)은 직접 서빙, `/test`·`/en/results`·
미지 경로만 `/index.html` 셸로 폴백 후 클라 라우팅. [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)에 설명 주석만 추가(선택).

## 변경/신규 파일
- [src/components/ColorCard.tsx](src/components/ColorCard.tsx) — window 가드 (버그)
- `src/utils/localizePath.ts` — 신규 (경로 언어 규칙, 단일 공급원)
- [src/App.tsx](src/App.tsx) — lang 파생, 17개 navigate + shareUrl 언어화, Routes 2언어 렌더, html lang 동기화
- [src/pages/ColorTypes.tsx](src/pages/ColorTypes.tsx) / [ColorTypeDetail.tsx](src/pages/ColorTypeDetail.tsx) / [Results.tsx](src/pages/Results.tsx) — `<Link>` 5곳 언어화
- `src/seo/routeMeta.ts` — 신규 (22라우트 메타 + hreflang 입력)
- `src/entry-server.tsx` — 신규 (SSR 진입점)
- [src/main.tsx](src/main.tsx) — data-ssg-path 기반 hydrate/createRoot
- `prerender.js` — 신규 (22페이지 prerender + sitemap 생성)
- [package.json](package.json) — build 체인
- [public/robots.txt](public/robots.txt) — /en 제외 추가

## 엣지 케이스
- **SPA 폴백 hydrate 미스매치**: §7 data-ssg-path 일치 검사로 해소(불일치 → createRoot).
- **Header 토글**: `onNavigate` 콜백 기반이라 App `handleToggleLang`만 고치면 됨(개별 Link 없음).
- `shareUrl` server `""` vs client URL: `/results`에서만 소비, prerender 안 됨 + createRoot라 안전.
- catch-all: 22개 유효 라우트만 prerender → `<Navigate>` prerender 중 미발화. 미지 `/en/xyz`는 ko 홈으로(허용).
- StrictMode 이중 렌더: 동기·순수, 무해.

## 검증 (PowerShell, 레포 루트)
```powershell
pnpm typecheck; pnpm build
Get-ChildItem dist -Recurse -Filter index.html | Select-Object FullName   # 22개 (ko 11 + en 11)
# 한국어 상세
Get-Content dist/types/spring-light/index.html -Raw | Select-String "<title>"          # 봄 라이트
Get-Content dist/types/spring-light/index.html -Raw | Select-String '<html lang="ko">'
Get-Content dist/types/spring-light/index.html -Raw | Select-String 'hreflang="en"'     # 영어 대안 링크
# 영어 상세
Get-Content dist/en/types/spring-light/index.html -Raw | Select-String "Spring Light"
Get-Content dist/en/types/spring-light/index.html -Raw | Select-String '<html lang="en">'
Get-Content dist/en/types/spring-light/index.html -Raw | Select-String 'rel="canonical".+/en/types/spring-light'
Get-Content dist/sitemap.xml -Raw | Select-String "/en/types/spring-light"
```
브라우저(`npx serve dist -s` 권장 — `/test` 폴백까지 검증):
- `/types/spring-light` JS 끄고 → 한국어 콘텐츠+title (SSG 증명). JS 켜고 → hydration 콘솔 경고 없음.
- `/en/types/spring-light` → 영어 콘텐츠, `<html lang="en">`, hreflang 상호 링크.
- 언어 토글 → 동일 페이지 반대 언어 URL로 이동(예: `/about` ↔ `/en/about`), search 보존.
- 내부 링크(타입 카드·prev/next·결과→상세)가 현재 언어 접두 유지.
- `/test`·`/en/test` 인터랙티브 동작, `/results` 공유 URL이 현재 언어 접두 포함.
- (선택) Lighthouse SEO + Google Rich Results의 hreflang 검증.

## 구현 순서
1. ColorCard 가드 → 2. localizePath.ts → 3. routeMeta.ts → 4. entry-server.tsx →
5. App.tsx (lang 파생·navigate·Routes·html lang) → 6. 페이지 Link 언어화 →
7. main.tsx → 8. prerender.js → 9. package.json → 10. robots.txt →
11. `pnpm typecheck && pnpm build` + 검증 → 12. (선택) DEPLOYMENT.md 주석.
```
