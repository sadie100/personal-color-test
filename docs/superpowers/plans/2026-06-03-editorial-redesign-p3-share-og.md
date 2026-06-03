# 결과 공유 OG 이미지 (P3-15) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [docs/UI_FEEDBACK.md](../../UI_FEEDBACK.md) §4 P3 #15 — 결과 페이지를 공유했을 때 메신저/SNS 미리보기에 **그 결과(베스트 타입)의 컬러 스트립 OG 이미지**가 뜨도록 한다. 베스트 결과 타입은 유한(상세 8 + 심플 4 = 12종)하므로, **타입별 OG 이미지를 빌드 전에 미리 생성·커밋**하고 정적으로 제공한다(사용자 결정).

**Architecture:** 정적 Vite SPA + Vercel 호스팅이라 크롤러는 JS를 실행하지 않으므로, 결과별 OG 메타는 **결과 타입별 정적 stub HTML 페이지**(`/s/<slug>`)로 내보낸다. 각 stub은 그 타입의 OG/Twitter 메타(사전 생성 PNG를 가리킴)를 정적으로 담고, 사람이 열면 JS로 `/results?<params>`(실제 SPA 결과)로 즉시 리다이렉트한다. 단일 진실 원천 `src/data/ogTargets.ts`(슬러그+라벨+팔레트 hex, 기존 데이터에서 파생)를 ① 이미지 생성 스크립트 ② stub을 찍는 Vite 플러그인이 공유한다. 공유 버튼은 정규 `/results?...` URL을 `/s/<bestSlug>?...`로 변환해 공유한다. 분석/데이터/라우팅 로직은 손대지 않는다.

**Tech Stack:** React 19 + TypeScript, Vite 8(빌드 플러그인), react-router-dom v7, Vitest. 신규 **devDependency**: `@napi-rs/canvas`(OG PNG 래스터화, 일회성 생성 스크립트 전용), `tsx`(TS 스크립트 실행). 프로덕션 빌드(`vite build`)는 이 둘을 쓰지 않는다(PNG는 커밋된 정적 자산). 신규 런타임 의존성 없음.

---

## 적용 범위 (확정)

| 항목                          | 결정                                                                                                       | 대상 Task |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | --------- |
| OG 타깃 단일 원천             | `src/data/ogTargets.ts` — 12개 베스트 슬러그 × {labelKo, labelEn, hexes}, 기존 `colorData`/메타에서 파생   | Task 1    |
| 기본 메타 (폴백)              | `index.html`에 기본 title/description/OG/Twitter + `og/default.png`                                        | Task 2    |
| 정적 라우팅 + stub 도달성     | `vercel.json` — 파일시스템 우선 + SPA 폴백 rewrite (deep-link 404도 함께 해소)                              | Task 3    |
| 타입별 OG PNG 사전 생성       | `scripts/generate-og-images.mts` + `@napi-rs/canvas`, `public/og/<slug>.png` 12개 + `default.png` 커밋     | Task 4    |
| 결과별 stub 페이지            | `vite.config.ts` 빌드 플러그인 — `dist/s/<slug>.html` 12개 (OG 메타 + JS 리다이렉트)                        | Task 5    |
| 공유 버튼 → `/s/<slug>` + Web Share | `resultShare.ts`에 순수 변환 util(+테스트), Results 공유 버튼이 변환 URL을 `navigator.share`/클립보드로 공유 | Task 6    |

**유한 슬러그 (Task 1·4·5가 동일하게 다룸):**

- 상세 8: `spring-light` `spring-bright` `summer-light` `summer-muted` `autumn-muted` `autumn-dark` `winter-bright` `winter-dark`
- 심플 4: `spring-warm` `summer-cool` `autumn-warm` `winter-cool`
- (슬러그는 [src/data/colorData.ts](../../../src/data/colorData.ts) `personalColorTypeMeta`/`simpleResultTypeMeta`의 `slug` 값과 정확히 일치 — URL `?best=` 파라미터 값과 동일.)

**의도적으로 제외:**

- 클라이언트 캔버스 "이미지로 저장" 버튼 — 사용자는 **사전 생성 OG 이미지** 방식을 택했으므로 본 플랜은 OG 링크 미리보기에 집중한다(저장 버튼 없음).
- 동적 `@vercel/og` 서버리스 — 사전 생성 정적 방식 채택으로 불필요.
- `data=` 파라미터로 인코딩된 세부 선택(liked/disliked)은 stub 리다이렉트가 `location.search`를 그대로 보존해 SPA가 복원한다(stub 자체는 베스트 슬러그만 알면 됨).

---

## TDD 적용 방침

대부분은 **빌드 산출물·정적 자산·설정·메타** 변경이라 red-green TDD가 부적합하다(사용자 CLAUDE.md §4). **단 하나의 순수 로직** — 정규 결과 URL을 공유 stub URL로 바꾸는 변환 — 은 분리 가능한 함수이므로 **red-green TDD를 적용**한다(Task 6 Step 1~4).

- 비-TDD 항목 검증 = `npm run typecheck` + `npm run lint` + `npm run build` + 산출물 파일 점검(`dist/s/*.html`, `dist/og/*.png`) + OG 디버거 육안.
- TDD 항목 = `src/utils/resultShare.test.ts`에 변환 함수 테스트 추가 → 실패 → 구현 → 통과.

**불변 제약 — 기존 테스트를 깨지 말 것:**

- [src/App.test.tsx](../../../src/App.test.tsx)는 `shareUrl` prop이 `"/results?"`와 `"data="`를 포함하는지 단언한다(111·112·133줄). **App이 Results에 넘기는 `shareUrl`은 정규 `/results?...`로 그대로 유지**하고, `/s/<slug>` 변환은 Results 공유 버튼 내부에서만 수행하므로(App.test는 Results를 mock) App.test는 green을 유지한다. **App.tsx의 `shareUrl` useMemo(231~241줄)는 절대 바꾸지 말 것.**
- [src/utils/resultShare.test.ts](../../../src/utils/resultShare.test.ts)는 기존 직렬화를 단언 — Task 6은 **추가**만 하고 기존 export를 바꾸지 않는다.

---

## File Structure

**생성:**

- `src/data/ogTargets.ts` — OG 타깃 단일 원천(12종). 빌드 플러그인·생성 스크립트가 공유. (Task 1)
- `vercel.json` — 파일시스템 우선 + SPA 폴백 rewrite. (Task 3)
- `scripts/generate-og-images.mts` — `@napi-rs/canvas`로 1200×630 PNG 12개 + default 생성. 일회성 dev 스크립트. (Task 4)
- `public/og/<slug>.png` × 12 + `public/og/default.png` — 커밋되는 정적 OG 이미지. (Task 4 산출물)

**수정:**

- `index.html` — 기본 title/description/OG/Twitter 메타 + `<html lang="ko">`. (Task 2)
- `package.json` — devDeps(`@napi-rs/canvas`, `tsx`) + `og:generate` 스크립트. (Task 4)
- `vite.config.ts` — 결과별 stub 페이지를 찍는 빌드 플러그인. (Task 5)
- `src/utils/resultShare.ts` — `toSharePageUrl` 순수 변환 함수 export. (Task 6)
- `src/utils/resultShare.test.ts` — 변환 함수 테스트. (Task 6)
- `src/pages/Results.tsx` — 공유 버튼이 변환 URL을 `navigator.share`/클립보드로 공유. (Task 6)

**손대지 않음:** `src/App.tsx`(shareUrl 유지), `src/data/colorData.ts`, `src/utils/analyzer.ts`, 라우팅, i18n(공유 텍스트 키 `share`/`copied`는 이미 존재).

---

## Task 1: OG 타깃 단일 원천 `ogTargets.ts`

**Files:**

- Create: `src/data/ogTargets.ts`

12개 베스트 슬러그를 기존 데이터에서 파생해 한 곳에 모은다. Task 4(이미지)·Task 5(stub)가 이 배열을 그대로 순회한다. hex 중복 정의 없이 `colorData`/메타에서 계산.

- [ ] **Step 1: ogTargets.ts 생성**

```ts
import {
  colorData,
  personalColorTypeMeta,
  personalColorTypes,
  simpleResultTypeMeta,
  simpleResultTypes,
} from "./colorData";

export interface OgTarget {
  /** 베스트 결과 슬러그 — URL `?best=` 값과 동일 */
  slug: string;
  labelKo: string;
  labelEn: string;
  /** OG 스트립용 팔레트 hex (앞에서부터 사용) */
  hexes: string[];
}

const detailedTargets: OgTarget[] = personalColorTypes.map((type) => {
  const meta = personalColorTypeMeta[type];
  return {
    slug: meta.slug,
    labelKo: meta.labelKo,
    labelEn: meta.labelEn,
    hexes: colorData[type].map((color) => color.hex),
  };
});

const simpleTargets: OgTarget[] = simpleResultTypes.map((type) => {
  const meta = simpleResultTypeMeta[type];
  return {
    slug: meta.slug,
    labelKo: meta.labelKo,
    labelEn: meta.labelEn,
    hexes: meta.paletteTypes.flatMap((paletteType) => colorData[paletteType].map((color) => color.hex)),
  };
});

/** 결과로 나올 수 있는 모든 베스트 타입(상세 8 + 심플 4 = 12). */
export const ogTargets: ReadonlyArray<OgTarget> = [...detailedTargets, ...simpleTargets];
```

- [ ] **Step 2: 검증**

Run: `npm run typecheck && npm run lint`
Expected: 0 에러. (export-only 모듈이라 미사용 경고 없음 — 다음 Task들이 import.)

빠른 형상 확인:
Run: `npx tsx -e "import('./src/data/ogTargets.ts').then(m => console.log(m.ogTargets.length, m.ogTargets.map(t => t.slug).join(',')))"`
Expected: `12 spring-light,spring-bright,summer-light,summer-muted,autumn-muted,autumn-dark,winter-bright,winter-dark,spring-warm,summer-cool,autumn-warm,winter-cool`
(`tsx`는 Task 4에서 devDep로 추가되지만 `npx tsx`로 즉석 실행 가능. 미설치 시 이 확인은 Task 4 이후로 미뤄도 됨.)

- [ ] **Step 3: 커밋**

```bash
git add src/data/ogTargets.ts
git commit -m "feat(share): OG 타깃 단일 원천 ogTargets 추가 (#15)"
```

---

## Task 2: index.html 기본 메타 (폴백)

**Files:**

- Modify: `index.html`

현재 [index.html](../../../index.html)에는 OG 태그가 전혀 없고 `<title>`이 기본값(`personal-color-test`), `<html lang="en">`이다. 공유 stub이 아닌 경로(`/`, 직접 연 `/results`)에서 쓰일 기본 메타와 `og/default.png`를 추가한다.

- [ ] **Step 1: `<html lang>`를 ko로**

[index.html](../../../index.html) 2줄:
```html
<html lang="ko">
```

- [ ] **Step 2: `<title>` 교체 + 기본 메타 블록 추가**

`<title>personal-color-test</title>`(8줄 부근)를 아래로 교체:
```html
    <title>퍼스널 컬러 셀프 테스트 · Personal Color Self Test</title>
    <meta
      name="description"
      content="색을 고르기만 하면 끝나는 퍼스널 컬러 셀프 진단. 12타입 컬러 팔레트로 내 시즌을 찾아보세요."
    />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="퍼스널 컬러 셀프 테스트" />
    <meta
      property="og:description"
      content="색을 고르기만 하면 끝나는 퍼스널 컬러 셀프 진단. 내 시즌을 찾아보세요."
    />
    <meta property="og:image" content="/og/default.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="퍼스널 컬러 셀프 테스트" />
    <meta name="twitter:image" content="/og/default.png" />
```

> 기본 `og:image`는 상대경로 `/og/default.png`. 절대 URL이 필요한 일부 크롤러를 위해 결과별 stub(Task 5)은 절대 URL을 쓴다. 기본 폴백은 상대경로로 충분.

- [ ] **Step 3: 검증**

Run: `npm run build`
Expected: 빌드 성공. (`og/default.png`는 Task 4에서 생성 — 이 시점엔 파일이 없어도 빌드는 통과하나, 실제 미리보기 확인은 Task 4 이후.)

- [ ] **Step 4: 커밋**

```bash
git add index.html
git commit -m "feat(share): 기본 OG/메타 태그 + lang=ko (#15)"
```

---

## Task 3: vercel.json — 정적 우선 + SPA 폴백

**Files:**

- Create: `vercel.json`

현재 `vercel.json`이 없다. Vercel은 **파일시스템(정적 파일)을 rewrite보다 먼저** 확인하므로, `cleanUrls`를 켜면 `/s/<slug>`가 `dist/s/<slug>.html`로, `/og/<slug>.png`가 그대로 서빙된다. 그 외 경로(`/`, `/about`, `/types/...`, `/results`)는 SPA 폴백으로 `index.html`에 rewrite된다. (이 rewrite는 기존에 없던 SPA deep-link 404도 함께 해소한다.)

- [ ] **Step 1: vercel.json 생성**

```json
{
  "cleanUrls": true,
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> 동작: 크롤러가 `/s/spring-bright`를 요청 → `dist/s/spring-bright.html`가 존재 → 정적 stub 직접 서빙(rewrite 미적용). 사람이 `/results?...`를 요청 → 매칭 파일 없음 → `index.html`로 rewrite → SPA 렌더. `cleanUrls`가 `.html` 확장자 없이 `/s/<slug>`로 도달하게 한다.

- [ ] **Step 2: 커밋**

```bash
git add vercel.json
git commit -m "feat(deploy): vercel.json — 정적 우선 + SPA 폴백 rewrite (#15)"
```

---

## Task 4: 타입별 OG PNG 사전 생성

**Files:**

- Modify: `package.json` (devDeps + 스크립트)
- Create: `scripts/generate-og-images.mts`
- Create(산출물): `public/og/<slug>.png` × 12, `public/og/default.png`

1200×630 OG 이미지를 타입별로 그려 `public/og/`에 PNG로 커밋한다. `@napi-rs/canvas`(prebuilt, 네이티브 빌드 불필요)로 래스터화, 텍스트는 실행 머신의 시스템 폰트를 쓴다(산출물 PNG가 커밋되므로 재현 환경 독립 — 일회성 dev 스크립트). 프로덕션 `vite build`는 이 스크립트/의존성을 쓰지 않는다.

- [ ] **Step 1: devDependency 설치**

Run: `npm install -D @napi-rs/canvas tsx`
Expected: 설치 성공, `package.json` devDependencies에 두 항목 추가.

- [ ] **Step 2: package.json에 생성 스크립트 추가**

[package.json](../../../package.json) `scripts`에 추가(예: `format` 다음):
```json
    "og:generate": "tsx scripts/generate-og-images.mts",
```

- [ ] **Step 3: 생성 스크립트 작성**

`scripts/generate-og-images.mts` 생성:
```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createCanvas } from "@napi-rs/canvas";

import { ogTargets } from "../src/data/ogTargets";

const WIDTH = 1200;
const HEIGHT = 630;
const STRIP_TOP = 320;
const MARGIN = 72;

const PAPER = "#fafaf7";
const INK = "#14110f";
const INK_3 = "#8a857c";

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), "../public/og");

const drawCard = (labelEn: string, hexes: string[]): Buffer => {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 브랜드 (상단)
  ctx.fillStyle = INK_3;
  ctx.font = "600 30px sans-serif";
  ctx.fillText("PERSONAL COLOR SELF TEST", MARGIN, 110);

  // 타입 라벨 (세리프, 대형) — 라틴 라벨만 사용해 폰트 의존 최소화
  ctx.fillStyle = INK;
  ctx.font = "700 104px serif";
  ctx.fillText(labelEn, MARGIN, 230);

  // 컬러 스트립 (하단 풀폭)
  const strip = hexes.slice(0, 10);
  const blockW = WIDTH / strip.length;
  strip.forEach((hex, index) => {
    ctx.fillStyle = hex;
    ctx.fillRect(Math.floor(index * blockW), STRIP_TOP, Math.ceil(blockW), HEIGHT - STRIP_TOP);
  });

  return canvas.toBuffer("image/png");
};

mkdirSync(outDir, { recursive: true });

for (const target of ogTargets) {
  writeFileSync(resolve(outDir, `${target.slug}.png`), drawCard(target.labelEn, target.hexes));
}

// 기본 폴백 — 4시즌 대표색 스트립
const defaultHexes = ogTargets
  .filter((t) => ["spring-warm", "summer-cool", "autumn-warm", "winter-cool"].includes(t.slug))
  .flatMap((t) => t.hexes.slice(0, 3));
writeFileSync(resolve(outDir, "default.png"), drawCard("Find your season", defaultHexes));

console.log(`Generated ${ogTargets.length + 1} OG images in ${outDir}`);
```

> `@napi-rs/canvas`의 `toBuffer("image/png")`는 Node `Buffer`를 반환한다. 텍스트는 라틴 라벨(`labelEn`, 예: "Spring Warm Light")만 그려 한글 폰트 번들을 피한다. 한글 결과 텍스트는 stub의 og:title(Task 5)이 플랫폼 텍스트로 보여준다.

- [ ] **Step 4: 생성 실행**

Run: `npm run og:generate`
Expected: `Generated 13 OG images in .../public/og` 출력.

Run: `ls public/og`
Expected: 13개 파일 — `spring-light.png` … `winter-cool.png`(12) + `default.png`.

육안: `public/og/spring-bright.png`를 열어 1200×630, 상단 브랜드/대형 라벨 + 하단 컬러 스트립이 보이는지 확인.

- [ ] **Step 5: 커밋 (스크립트 + 의존성 + 산출물 PNG)**

```bash
git add package.json package-lock.json scripts/generate-og-images.mts public/og
git commit -m "feat(share): 타입별 OG 이미지 사전 생성 스크립트 + PNG 자산 (#15)"
```

---

## Task 5: 결과별 정적 stub 페이지 (Vite 빌드 플러그인)

**Files:**

- Modify: `vite.config.ts`

빌드 시 각 베스트 슬러그마다 `dist/s/<slug>.html`을 찍는다. 각 stub은 그 타입의 OG/Twitter 메타(절대 URL의 `og/<slug>.png`)를 담고, JS로 `/results?<params>`로 리다이렉트한다(쿼리·해시 보존). 크롤러는 JS를 안 돌리고 메타만 읽으므로 결과별 미리보기가 뜬다.

- [ ] **Step 1: vite.config.ts에 플러그인 추가**

[vite.config.ts](../../../vite.config.ts) 전체를 교체:
```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

import { ogTargets } from "./src/data/ogTargets";

// 배포 도메인 — Vercel 환경변수 SITE_URL로 덮어쓸 수 있음.
const SITE_URL = (process.env.SITE_URL ?? "https://personal-color-test.vercel.app").replace(/\/$/, "");

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderStub = (slug: string, labelKo: string, labelEn: string): string => {
  const title = escapeHtml(`${labelKo} · Personal Color Self Test`);
  const desc = escapeHtml(`내 퍼스널 컬러 결과: ${labelKo} (${labelEn})`);
  const url = `${SITE_URL}/s/${slug}`;
  const image = `${SITE_URL}/og/${slug}.png`;
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${image}" />
    <script>
      location.replace("/results" + location.search + location.hash);
    </script>
    <noscript><meta http-equiv="refresh" content="0; url=/results" /></noscript>
  </head>
  <body></body>
</html>
`;
};

const ogSharePages = (): Plugin => ({
  name: "og-share-pages",
  apply: "build",
  writeBundle(options) {
    const outDir = options.dir ?? "dist";
    const dir = join(outDir, "s");
    mkdirSync(dir, { recursive: true });
    for (const target of ogTargets) {
      writeFileSync(join(dir, `${target.slug}.html`), renderStub(target.slug, target.labelKo, target.labelEn));
    }
  },
});

export default defineConfig({
  plugins: [react(), checker({ typescript: true }), ogSharePages()],
  test: {
    environment: "node",
    globals: true,
  },
});
```

> `apply: "build"`라 dev 서버엔 영향 없다. `writeBundle`는 산출물이 디스크에 쓰인 뒤 실행되므로 `dist/s/`에 추가 파일을 안전히 쓴다. `SITE_URL`은 절대 OG URL용 — 실제 도메인이 다르면 Vercel 프로젝트 환경변수 `SITE_URL`로 설정.

- [ ] **Step 2: 빌드 + stub 산출 확인**

Run: `npm run build`
Expected: 빌드 성공.

Run: `ls dist/s`
Expected: 12개 — `spring-light.html` … `winter-cool.html`.

Run: `grep -l "og:image" dist/s/spring-bright.html`
확인: `dist/s/spring-bright.html`에 `og:image .../og/spring-bright.png`, `og:title`에 한글 라벨(`봄 웜 브라이트 …`), `location.replace("/results"...)` 스크립트 포함.

Run: `ls dist/og`
Expected: 13개 PNG(`public/og`가 빌드 시 `dist/og`로 복사됨).

- [ ] **Step 3: 검증**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 전체 통과. (vite.config는 tsconfig 포함 여부와 무관하게 esbuild로 로드 — typecheck 영향 없음.)

- [ ] **Step 4: 커밋**

```bash
git add vite.config.ts
git commit -m "feat(share): 결과별 정적 OG stub 페이지 빌드 플러그인 (#15)"
```

---

## Task 6: 공유 버튼 → `/s/<slug>` + Web Share (TDD)

**Files:**

- Modify: `src/utils/resultShare.ts`
- Modify: `src/utils/resultShare.test.ts`
- Modify: `src/pages/Results.tsx`

정규 `/results?best=<slug>&...` URL을 stub URL `/s/<slug>?...`로 바꾸는 순수 함수를 TDD로 만들고, 공유 버튼이 그 URL을 `navigator.share`(가능 시)/클립보드로 공유하게 한다. App.tsx의 `shareUrl`(정규 URL)은 그대로 둔다 → App.test green.

- [ ] **Step 1: 실패하는 테스트 작성**

[src/utils/resultShare.test.ts](../../../src/utils/resultShare.test.ts) 맨 아래에 추가:
```ts
import { toSharePageUrl } from "./resultShare";

describe("toSharePageUrl", () => {
  it("rewrites /results to /s/<best> preserving query", () => {
    const input = "https://example.com/results?mode=detailed&best=spring-bright&data=abc";
    expect(toSharePageUrl(input)).toBe(
      "https://example.com/s/spring-bright?mode=detailed&best=spring-bright&data=abc",
    );
  });

  it("returns input unchanged when best param is missing", () => {
    const input = "https://example.com/results?mode=detailed";
    expect(toSharePageUrl(input)).toBe(input);
  });

  it("returns input unchanged when not a valid URL", () => {
    expect(toSharePageUrl("not a url")).toBe("not a url");
  });
});
```

> `describe`/`it`/`expect`는 기존 파일 상단에서 이미 import되어 있는지 확인 — [resultShare.test.ts](../../../src/utils/resultShare.test.ts)는 vitest globals(`globals: true`)를 쓰므로 별도 import 없이 동작한다. `import { toSharePageUrl }`만 추가하면 된다(같은 모듈에서 기존 import가 있으면 거기에 합쳐도 됨).

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm run test:run -- resultShare`
Expected: FAIL — `toSharePageUrl` is not exported / not a function.

- [ ] **Step 3: 변환 함수 구현**

[src/utils/resultShare.ts](../../../src/utils/resultShare.ts) 맨 아래에 export 추가:
```ts
/** 정규 결과 URL(/results?best=<slug>&...)을 OG stub URL(/s/<slug>?...)로 변환한다. */
export const toSharePageUrl = (canonicalResultsUrl: string): string => {
  try {
    const url = new URL(canonicalResultsUrl);
    const best = url.searchParams.get("best");
    if (best && /\/results$/.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\/results$/, `/s/${best}`);
    }
    return url.toString();
  } catch {
    return canonicalResultsUrl;
  }
};
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm run test:run -- resultShare`
Expected: PASS (신규 3건 + 기존 직렬화 테스트 모두 green).

- [ ] **Step 5: Results 공유 버튼이 변환 URL을 공유**

[src/pages/Results.tsx](../../../src/pages/Results.tsx) 상단 import에 추가(기존 `createResultsSearchParams`/`getPayloadFromResultsSearchParams` import 줄과 동일 모듈):
```tsx
import { toSharePageUrl } from "../utils/resultShare";
```
> 만약 Results가 아직 resultShare에서 import하는 게 없다면 위 한 줄을 새로 추가한다.

공유 버튼(410~419줄)의 `onClick`을 교체. 클립보드 폴백·`t.results.copied` 알림은 유지하고, `navigator.share` 가능 시 우선 사용:
```tsx
          <button
            onClick={async () => {
              const urlToShare = toSharePageUrl(shareUrl || window.location.href);
              if (navigator.share) {
                try {
                  await navigator.share({ title: t.results.share, url: urlToShare });
                  return;
                } catch (error) {
                  if (error instanceof Error && error.name === "AbortError") {
                    return;
                  }
                }
              }
              void navigator.clipboard.writeText(urlToShare);
              window.alert(t.results.copied);
            }}
            className="flex-1 rounded-lg border border-hairline bg-surface py-3 font-bold text-ink transition-colors hover:bg-hairline/40"
          >
            {t.results.share}
          </button>
```

> 사용자가 공유 시트를 취소(AbortError)하면 조용히 종료(클립보드 폴백 안 함). 그 외 공유 실패/미지원 시에만 클립보드 복사 + 알림. **버튼 className은 그대로** — Task(폴리시 플랜)에서 focus 링이 추가됐다면 그 문자열을 보존할 것(여기선 onClick만 교체).

- [ ] **Step 6: 검증**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 전체 통과. **App.test의 `share-url` 단언 green 유지**(App.shareUrl 미변경, 변환은 Results 내부).

`npm run dev` → `/?preview=results` → 공유 버튼 클릭:
- `navigator.share` 미지원 데스크톱: 클립보드에 `…/s/spring-bright?...` 복사 + 알림. 주소창에 붙여넣어 `/results?...`로 리다이렉트되는지 확인.
- (모바일/지원 브라우저: 네이티브 공유 시트.)

- [ ] **Step 7: 커밋**

```bash
git add src/utils/resultShare.ts src/utils/resultShare.test.ts src/pages/Results.tsx
git commit -m "feat(share): 공유 버튼 → /s/<slug> stub URL + Web Share (#15)"
```

---

## Task 7: 통합 검증 + 미리보기 육안 점검

**Files:** 없음 (검증 전용)

- [ ] **Step 1: 전체 자동 검증**

Run: `npm run typecheck && npm run lint && npm run test:run && npm run build`
Expected: 전부 통과.

- [ ] **Step 2: 산출물 일관성 확인**

Run: `ls dist/s && ls dist/og`
Expected: `dist/s`에 12 html, `dist/og`에 13 png. 슬러그 집합이 서로 일치(default.png는 og에만).

- [ ] **Step 3: stub ↔ 이미지 매칭 스캔**

각 stub이 자기 슬러그 이미지를 가리키는지 확인:
Run: `grep -o "og/[a-z-]*\.png" dist/s/winter-dark.html`
Expected: `og/winter-dark.png`.

- [ ] **Step 4: 로컬 프리뷰로 리다이렉트·메타 확인**

Run: `npm run preview` (Vite preview는 정적 dist 서빙)
- 브라우저로 `http://localhost:4173/s/spring-bright?mode=detailed&best=spring-bright` 열기 → 즉시 `/results?...`로 이동, 결과 렌더 확인(JS 리다이렉트).
- "페이지 소스 보기"로 (리다이렉트 전 원본) 또는 `curl http://localhost:4173/s/spring-bright`로 OG 메타(이미지/타이틀)가 들어있는지 확인.

> 실제 메신저/SNS 미리보기는 배포 후 OG 디버거(예: opengraph.xyz, 카카오/페북 디버거)에 `https://<도메인>/s/<slug>`를 넣어 확인. `SITE_URL`이 실제 도메인과 일치해야 절대 `og:image`가 정상 로드된다.

- [ ] **Step 5: 마무리**

검증만 한 경우 커밋 없음. 미세 수정 시 해당 파일만 커밋.

---

## Self-Review

**1. 스펙 커버리지 (UI_FEEDBACK §4 P3 #15):**

- "결과 페이지 공유 OG 이미지 — 컬러 스트립 기반" → 타입별 사전 생성 PNG(Task 4) + 결과별 stub 메타(Task 5) + 공유 버튼 연결(Task 6) ✓
- "자동 생성(미리 만들어둠)" — 사용자 결정대로 12 타입 PNG를 빌드 전 생성·커밋(Task 4), 동적 서버리스 대신 정적 stub로 결과별 미리보기 달성 ✓

**2. 플레이스홀더 스캔:** TBD/추후구현 없음. 모든 코드 단계에 실제 TS/JSON/HTML 포함. `SITE_URL` 기본값은 동작하는 상수(배포 도메인) + 환경변수 오버라이드 — 플레이스홀더 아님.

**3. 타입/이름 일관성:**

- `ogTargets`/`OgTarget`(Task 1) → 생성 스크립트(Task 4)·vite 플러그인(Task 5)이 `target.slug`/`labelKo`/`labelEn`/`hexes` 동일 필드로 소비. ✓
- 슬러그 집합 = `colorData` 메타 `slug` = URL `?best=` 값 = PNG 파일명 = stub 파일명 = `toSharePageUrl`이 만드는 경로. 다섯 곳이 동일 슬러그로 연결. ✓
- `toSharePageUrl`(Task 6 구현) ↔ 테스트(Step 1) ↔ Results import(Step 5) 이름 일치. ✓
- App.shareUrl(정규 `/results?...`)은 불변 → App.test green, 변환은 Results 경계 안. ✓

**4. 기존 테스트 보호:**

- App.test `share-url` 단언: App.shareUrl 미변경으로 green(불변 제약 절). ✓
- resultShare.test: 기존 export 미변경, 신규 `toSharePageUrl` 테스트만 추가. ✓
- 프로덕션 빌드는 `@napi-rs/canvas`/`tsx` 미사용(vite 플러그인은 `node:fs`/`node:path` + ogTargets만) → 배포 의존성 영향 없음. ✓

**의존성 주의:** `@napi-rs/canvas`는 prebuilt 바이너리(플랫폼별)다. Windows dev 머신에서 `npm i -D`로 설치되며 생성 스크립트만 사용한다. CI/배포에서 OG 이미지를 재생성하지 않는 한(커밋된 PNG 사용) 빌드에 불필요.

**실행 순서 주의:** Task 1(ogTargets) → Task 4(이미지, ogTargets 소비) → Task 5(stub, ogTargets 소비) 순서 의존. Task 2/3은 독립. Task 6은 Task 1~5와 독립이나 Task 7(통합 검증)은 마지막.

**폴리시 플랜과의 관계:** Results 공유 버튼은 [polish 플랜](2026-06-03-editorial-redesign-p3-polish.md) Task 2 Step 7에서 focus 링 className이 추가될 수 있다. 두 플랜을 함께 실행하면 **className(폴리시)과 onClick(본 플랜)을 각각 보존**하라(같은 버튼, 다른 속성).
