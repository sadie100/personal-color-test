# 에디토리얼 갤러리 리디자인 (P0 + P1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [docs/UI_FEEDBACK.md](../../UI_FEEDBACK.md)의 "에디토리얼 갤러리" 컨셉을 코드에 적용한다 — 풀스크린 그라데이션을 걷어내고 오프화이트 종이 위에 컬러칩이 주인공이 되도록, P0(인상)·P1(위계) 액션을 구현한다.

**Architecture:** Tailwind v4 `@theme` 블록에 에디토리얼 디자인 토큰(오프화이트/잉크/헤어라인 + 세리프 디스플레이 폰트)을 등록하고, 각 페이지 컴포넌트의 그라데이션·글래스 클래스를 토큰 기반 무채색 유틸리티로 교체한다. 데이터·라우팅·분석 로직은 손대지 않고 프레젠테이션 레이어만 바꾼다.

**Tech Stack:** React 19 + TypeScript, Tailwind CSS v4 (`@theme`), Vite, react-router-dom, Vitest + Testing Library, Google Fonts CDN.

---

## 적용 범위 (확정)

- **우선순위:** P0 + P1 만. (P2 일관성 / P3 폴리시는 별도 후속 플랜)
- **폰트:** Instrument Serif + Noto Serif KR — Google Fonts CDN 로드.
- **토큰:** Tailwind v4 `@theme` 커스텀 토큰.

**다루는 액션 (UI_FEEDBACK §4):**

| # | 항목 | 대상 Task |
|---|---|---|
| P0-1 | 전역 배경 오프화이트 (그라데이션 제거) | Task 2/3/4/5/6 |
| P0-2 | 헤더 솔리드 배경 + 잉크 로고 | Task 1 |
| P0-3 | 흰 글씨×핫핑크 → 잉크/딥차콜 (대비 AA) | Task 1~6 |
| P0-4 | CTA 통일: 잉크 솔리드 1종 + 텍스트 링크 1종 | Task 1~5 |
| P1-5 | 홈 히어로 재구성 (헤드라인+부제+실 컬러칩 16개+CTA, 체크마크 삭제) | Task 2 |
| P1-6 | 결과 Best 강조 (풀폭 컬러 스트립), 2nd/3rd 축소 | Task 6 |
| P1-7 | Worst 섹션 접기 (아코디언, 기본 닫힘) | Task 6 |
| P1-8 | 테스트 모드 "세부(권장)" 배지 + 사이즈 차등 | Task 5 |

**범위 밖 (이번 플랜 제외):** About 1-Up 시즌 섹션, 8타입 카드 그룹핑/컬러 띠, PCCS 자체 SVG, hover/focus 폴리시, OG 이미지, reduced-motion. (모두 P2/P3)

---

## TDD 적용 방침

순수 시각(CSS/className) 변경은 red-green TDD가 부적합하다 (사용자 CLAUDE.md §4 "trivial → 판단", writing-plans는 사용자 지침 우선). 따라서:

- **순수 시각 변경:** 검증 = `npm run typecheck` + `npm run lint` + `npm run test:run`(기존 테스트 green 유지) + dev 서버 육안 확인.
- **동작 추가(아코디언 토글, 테스트 모드 기본 선택 변경):** 실패 테스트 먼저 작성하는 TDD 적용.

**불변 제약 — 기존 테스트를 깨지 말 것:**
- [src/components/Results.test.tsx](../../../src/components/Results.test.tsx)는 Worst 팔레트의 칩 이름("인디고 다이")과 `NOPE` 배지가 DOM에 존재함을 단언한다. **Worst 아코디언은 닫혀도 콘텐츠를 언마운트하지 않고 CSS로만 숨겨야 한다** (`getByText`는 `display:none`/`hidden` 요소도 찾으므로 통과).
- [src/App.test.tsx](../../../src/App.test.tsx)는 Home/About/Results/Header를 mock 처리하므로 페이지 내부 변경에 영향받지 않는다.

---

## File Structure

**수정:**
- `index.html` — Google Fonts preconnect + stylesheet 링크 (Task 0)
- `src/index.css` — `@theme` 디자인 토큰 (Task 0)
- `src/components/Header.tsx` — 솔리드 헤더 + 잉크 로고 + 통일 CTA (Task 1)
- `src/pages/Home.tsx` — 히어로 전면 재구성 (Task 2)
- `src/pages/About.tsx` — 오프화이트 히어로 + 좌측정렬 + CTA (Task 3)
- `src/pages/ColorTypes.tsx` — 오프화이트 히어로 (Task 4)
- `src/pages/ColorTypeDetail.tsx` — 히어로 대비/CTA 정리 (Task 4)
- `src/components/TestSetup.tsx` — 오프화이트 + 권장 배지 + 사이즈 차등 (Task 5)
- `src/pages/Results.tsx` — Best 스트립 / 2nd·3rd 축소 / Worst 아코디언 + 토큰화 (Task 6)

**생성:** 없음 (토큰·폰트는 기존 파일에 추가, 신규 컴포넌트 불필요)

**손대지 않음:** `src/data/**`, `src/utils/**`, `src/i18n/**`, `src/App.tsx`(라우팅), `src/hooks/**`, `analyzer`·`resultShare`·`testSet` 및 그 테스트.

---

## Task 0: 디자인 토큰 + 폰트 기반 구축

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`

이 Task는 이후 모든 Task가 의존하는 토큰을 만든다. 순수 인프라 변경이라 별도 테스트 없음. 검증은 빌드가 깨지지 않고 유틸리티가 생성되는지로 한다.

- [ ] **Step 1: index.html에 Google Fonts 링크 추가**

`index.html`의 `<head>` 안, `<title>` 다음 줄에 추가:

```html
    <title>personal-color-test</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Noto+Serif+KR:wght@500;700&display=swap"
      rel="stylesheet"
    />
```

- [ ] **Step 2: index.css에 @theme 토큰 등록**

`src/index.css` 전체를 아래로 교체:

```css
@import "tailwindcss";

@theme {
  /* 에디토리얼 갤러리 색 토큰 (UI_FEEDBACK §3.1) */
  --color-paper: #fafaf7; /* 전역 배경 — 종이 */
  --color-surface: #ffffff; /* 카드 표면 */
  --color-hairline: #e6e4de; /* 1px 경계선 (shadow 대체) */
  --color-ink: #14110f; /* 제목 — 거의 검정 */
  --color-ink-2: #555049; /* 본문 */
  --color-ink-3: #8a857c; /* 캡션 */
  --color-accent: #1f1b16; /* CTA 배경 — 거의 검정 */
  --color-accent-fg: #fafaf7; /* CTA 텍스트 */

  /* 세리프 디스플레이 (제목 전용) */
  --font-display: "Instrument Serif", "Noto Serif KR", serif;
}

html {
  scroll-behavior: smooth;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: "Pretendard", system-ui, "Segoe UI", Roboto, sans-serif;
}

body {
  background-color: var(--color-paper);
  color: var(--color-ink);
}

#root {
  width: 100%;
  height: 100%;
}
```

> 생성되는 유틸리티: `bg-paper` `bg-surface` `bg-accent`, `text-ink` `text-ink-2` `text-ink-3` `text-accent-fg`, `border-hairline`, `font-display`. (Tailwind v4는 `--color-<name>` / `--font-<name>` 토큰을 자동으로 유틸리티화한다.)

- [ ] **Step 3: 빌드/타입/린트 검증**

Run: `npm run typecheck && npm run lint`
Expected: 에러 0건 (CSS 토큰 추가는 타입에 영향 없음).

Run: `npm run dev` 후 브라우저에서 `http://localhost:5173` 접속 → 페이지 배경이 회색이던 부분과 무관하게 콘솔에 폰트/CSS 404가 없는지 확인. Instrument Serif/Noto Serif KR 요청이 200인지 네트워크 탭에서 확인.
Expected: 폰트 2개 200, CSS 에러 없음.

- [ ] **Step 4: 커밋**

```bash
git add index.html src/index.css
git commit -m "feat(design): 에디토리얼 디자인 토큰 + 세리프 폰트 도입"
```

---

## Task 1: 헤더 — 솔리드 배경 + 잉크 로고 + 통일 CTA (P0-2/3/4)

**Files:**
- Modify: `src/components/Header.tsx`

그라데이션 텍스트 로고와 그라데이션 알약 CTA를 제거하고, 솔리드 잉크 로고 + 검정 솔리드 직사각형 CTA(둥글기 8px)로 통일한다. App.test에서 Header는 mock이므로 라우팅 테스트는 영향 없음.

- [ ] **Step 1: 헤더 컨테이너 + 로고 교체**

[src/components/Header.tsx](../../../src/components/Header.tsx) 24~31줄을 교체:

```tsx
    <header className="fixed top-0 z-50 w-full border-b border-hairline bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <button
          onClick={() => handleNav("home")}
          className="cursor-pointer font-display text-xl text-ink"
        >
          Personal Color Self Test
        </button>
```

- [ ] **Step 2: 데스크톱 nav 링크 + CTA 교체**

33~61줄(`<nav ...>` ~ `</nav>`)을 교체:

```tsx
        <nav className="hidden items-center gap-6 md:flex">
          <button
            onClick={() => handleNav("about")}
            className={`cursor-pointer text-sm font-medium transition-colors ${
              screen === "about"
                ? "border-b-2 border-ink pb-0.5 text-ink"
                : "text-ink-2 hover:text-ink"
            }`}
          >
            {t.nav.about}
          </button>
          <button
            onClick={() => handleNav("types")}
            className={`cursor-pointer text-sm font-medium transition-colors ${
              screen === "types"
                ? "border-b-2 border-ink pb-0.5 text-ink"
                : "text-ink-2 hover:text-ink"
            }`}
          >
            {t.nav.types}
          </button>
          <button
            onClick={() => handleNav("test")}
            className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90 active:scale-95"
          >
            {t.nav.test}
          </button>
          <LangToggle lang={lang} onToggle={onToggleLang} />
        </nav>
```

- [ ] **Step 3: 모바일 메뉴 버튼 색 + 드로어 CTA 교체**

63~116줄(모바일 `<div ...md:hidden>` ~ 메뉴 패널 끝)을 교체:

```tsx
        <div className="flex items-center gap-2 md:hidden">
          <LangToggle lang={lang} onToggle={onToggleLang} />
          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="cursor-pointer p-2 text-ink-2 hover:text-ink"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="space-y-2 border-t border-hairline bg-paper px-4 py-3 md:hidden">
          <button
            onClick={() => handleNav("about")}
            className={`block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              screen === "about" ? "bg-hairline/50 text-ink" : "text-ink-2 hover:bg-hairline/40"
            }`}
          >
            {t.nav.about}
          </button>
          <button
            onClick={() => handleNav("types")}
            className={`block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              screen === "types" ? "bg-hairline/50 text-ink" : "text-ink-2 hover:bg-hairline/40"
            }`}
          >
            {t.nav.types}
          </button>
          <button
            onClick={() => handleNav("test")}
            className="block w-full cursor-pointer rounded-lg bg-accent px-3 py-2.5 text-left text-sm font-semibold text-accent-fg"
          >
            {t.nav.test}
          </button>
        </div>
      )}
    </header>
```

- [ ] **Step 4: 검증**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 전부 통과 (App.test 4건 green, Header mock).

Run: `npm run dev` → 홈/About/Types/Results 헤더 확인. 로고가 잉크 솔리드, 배경 오프화이트, "테스트 시작" CTA가 검정 직사각형인지 육안 확인.

- [ ] **Step 5: 커밋**

```bash
git add src/components/Header.tsx
git commit -m "feat(header): 솔리드 오프화이트 헤더 + 잉크 로고 + 통일 CTA"
```

---

## Task 2: 홈 히어로 전면 재구성 (P0-1/3/4 + P1-5)

**Files:**
- Modify: `src/pages/Home.tsx`

풀스크린 보라 그라데이션·글래스 카드·체크마크 4줄을 전부 제거. 오프화이트 배경, 좌측 정렬 세리프 헤드라인 1줄 + 부제, 오른쪽에 실제 컬러칩 16개 미리보기 그리드(4×4), 검정 솔리드 CTA + 텍스트 링크. App.test에서 Home은 mock이라 영향 없음.

- [ ] **Step 1: Home.tsx 전체 교체**

[src/pages/Home.tsx](../../../src/pages/Home.tsx) 전체를 아래로 교체:

```tsx
import { AttributionNote } from "../components/AttributionNote";
import { colorData, personalColorTypes } from "../data/colorData";
import { translations } from "../i18n/translations";
import type { Lang } from "../types";

interface HomeProps {
  onStart: () => void;
  lang: Lang;
  onAbout: () => void;
}

// 8개 퍼스널 컬러 타입에서 각 2색씩 = 16개 실 데이터 미리보기 (UI_FEEDBACK §3.4 홈 히어로)
const heroChips = personalColorTypes.flatMap((type) => colorData[type].slice(0, 2));

export const Home = ({ onStart, lang, onAbout }: HomeProps) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen w-full bg-paper px-4 pt-24 pb-16">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
        <div className="text-left">
          <h1 className="font-display text-5xl leading-tight break-keep text-ink md:text-6xl">
            {t.home.hero.quote}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed break-keep text-ink-2 md:text-lg">
            {t.home.hero.subtext}
          </p>
          <p className="mt-3 text-sm text-ink-3">{t.home.subtitle}</p>

          <div className="mt-8 flex flex-col items-start gap-3">
            <button
              onClick={onStart}
              className="cursor-pointer rounded-lg bg-accent px-8 py-4 text-base font-bold text-accent-fg transition-transform hover:opacity-90 active:scale-95"
            >
              {t.home.startButton}
            </button>
            <button
              onClick={onAbout}
              className="cursor-pointer text-sm text-ink-2 underline underline-offset-4 transition-colors hover:text-ink"
            >
              {t.home.learnMore}
            </button>
          </div>
        </div>

        <div aria-hidden className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {heroChips.map((chip, index) => (
            <div
              key={`${chip.hex}-${index}`}
              className="aspect-square rounded-xl border border-hairline shadow-sm"
              style={{ backgroundColor: chip.hex }}
            />
          ))}
        </div>
      </div>

      <AttributionNote lang={lang} variant="light" className="mt-16" />
    </div>
  );
};
```

> 주의: `t.home.tip`과 `t.home.features.*`는 더 이상 사용하지 않는다 (체크마크 삭제). 번역 파일은 그대로 두되(다른 곳에서 안 씀), 미사용 import만 정리됨. `personalColorTypes` import가 colorData에 존재함은 Task 작성 시 확인됨.

- [ ] **Step 2: 검증 — 빌드/테스트**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 통과. (lint가 미사용 변수 경고하면 위 코드엔 미사용 없음 — `colorData`,`personalColorTypes` 모두 사용.)

- [ ] **Step 3: 검증 — 육안**

Run: `npm run dev` → `http://localhost:5173`
확인 항목:
- 보라 그라데이션 0, 배경 오프화이트.
- 헤드라인이 세리프(Instrument/Noto Serif), 좌측 정렬.
- 우측에 컬러칩 4×4(16개)가 실제 색으로 표시.
- CTA가 검정 직사각형 1개 + 그 아래 밑줄 텍스트 링크 1개.
- 모바일 폭(390px)에서 1열로 쌓이고 가로 스크롤 없음.

- [ ] **Step 4: 커밋**

```bash
git add src/pages/Home.tsx
git commit -m "feat(home): 에디토리얼 히어로 재구성 — 오프화이트 + 컬러칩 미리보기"
```

---

## Task 3: About — 오프화이트 히어로 + 좌측정렬 본문 + CTA (P0-1/3/4)

**Files:**
- Modify: `src/pages/About.tsx`

상단 그라데이션 히어로와 하단 그라데이션 CTA 박스를 오프화이트/잉크로, 본문 가운데정렬을 좌측정렬로 바꾼다. **시즌/톤 카드의 1-Up 재구성은 P2라 범위 밖** — 카드 자체 구조는 유지하되 페이지 배경만 오프화이트로 통일한다.

- [ ] **Step 1: 페이지 컨테이너 + 히어로 교체**

[src/pages/About.tsx](../../../src/pages/About.tsx) 121~128줄을 교체:

```tsx
  return (
    <div className="min-h-screen w-full bg-paper pt-16">
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display text-4xl text-ink md:text-5xl">{t.about.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed break-keep text-ink-2 md:text-lg">
          {t.about.intro}
        </p>
      </section>
```

- [ ] **Step 2: "퍼스널 컬러란" + PCCS 섹션 좌측정렬·헤어라인 카드화**

131~154줄(`whatIs` + `pccs` 두 `<section>`)을 교체:

```tsx
        <section className="rounded-2xl border border-hairline bg-surface p-6 md:p-10">
          <h2 className="mb-4 font-display text-2xl text-ink md:text-3xl">
            {t.about.whatIs.title}
          </h2>
          <p className="text-base leading-relaxed break-keep text-ink-2 md:text-lg">
            {t.about.whatIs.desc}
          </p>
        </section>

        <section className="rounded-2xl border border-hairline bg-surface p-6 md:p-10">
          <h2 className="mb-6 font-display text-2xl text-ink md:text-3xl">
            {t.about.pccs.title}
          </h2>
          <div className="mb-6 flex justify-center">
            <img
              src={pccsImage}
              alt={t.about.pccs.imageAlt}
              className="max-w-full rounded-xl border border-hairline md:max-w-lg"
            />
          </div>
          <p className="text-base leading-relaxed break-keep text-ink-2 md:text-lg">
            {t.about.pccs.desc}
          </p>
        </section>
```

- [ ] **Step 3: 시즌/톤 섹션 제목 좌측정렬**

157줄과 179줄의 시즌·톤 섹션 제목을 각각 교체:

157줄:
```tsx
          <h2 className="mb-8 font-display text-2xl text-ink md:text-3xl">
            {t.about.seasons.title}
          </h2>
```

179줄:
```tsx
          <h2 className="mb-8 font-display text-2xl text-ink md:text-3xl">
            {t.about.tones.title}
          </h2>
```

> 시즌/톤 카드 박스(파스텔 배경)는 P2 1-Up 재구성 대상이라 이번엔 그대로 둔다. 제목 중앙정렬만 좌측으로 바꿔 가독성·일관성 개선.

- [ ] **Step 4: "테스트 방법" + CTA 섹션 교체**

201~227줄(`howItWorks` `<section>` + CTA `<section>`)을 교체:

```tsx
        <section className="rounded-2xl border border-hairline bg-surface p-6 md:p-10">
          <h2 className="mb-6 font-display text-2xl text-ink md:text-3xl">
            {t.about.howItWorks.title}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[t.about.howItWorks.step1, t.about.howItWorks.step2, t.about.howItWorks.step3].map((step, index) => (
              <div key={step} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-lg text-accent-fg">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-relaxed break-keep text-ink-2">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-hairline bg-surface p-8 text-left md:p-12">
          <h2 className="mb-4 font-display text-2xl text-ink md:text-3xl">{t.about.cta}</h2>
          <button
            onClick={onStart}
            className="cursor-pointer rounded-lg bg-accent px-8 py-4 text-base font-bold text-accent-fg transition-opacity hover:opacity-90 active:scale-95"
          >
            {t.home.startButton}
          </button>
        </section>
```

- [ ] **Step 5: 검증**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 통과.

Run: `npm run dev` → `/about` 확인. 그라데이션 0, 본문 좌측정렬, CTA 검정 직사각형 1개, 제목 세리프, 대비 충분(잉크/오프화이트).

- [ ] **Step 6: 커밋**

```bash
git add src/pages/About.tsx
git commit -m "feat(about): 오프화이트 히어로 + 좌측정렬 본문 + 통일 CTA"
```

---

## Task 4: 8타입 목록 & 상세 — 오프화이트 히어로 + 대비 정리 (P0-1/3/4)

**Files:**
- Modify: `src/pages/ColorTypes.tsx`
- Modify: `src/pages/ColorTypeDetail.tsx`

목록 페이지 상단의 큰 보라 히어로를 오프화이트/잉크로 바꾼다. **타입 카드 자체와 상세 페이지의 타입별 그라데이션 히어로는 "컨텐츠 색"(그 타입의 시그니처)이므로 유지** — 브랜드 그라데이션과 다르다. 단, 목록 페이지 톱의 의미 없는 보라 히어로만 제거한다. 상세 페이지는 그라데이션 히어로는 두되, 목록 진입 링크/메타 칩의 대비를 점검한다(이미 heroTextClass로 처리됨 → 변경 없음). ColorTypeDetail은 사실상 변경 없음이지만, 일관성 점검을 위해 본 Task에 포함한다.

- [ ] **Step 1: ColorTypes 목록 히어로 교체**

[src/pages/ColorTypes.tsx](../../../src/pages/ColorTypes.tsx) 84~94줄을 교체:

```tsx
  return (
    <div className="min-h-screen w-full bg-paper pt-16 pb-16">
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="font-display text-4xl text-ink md:text-5xl">{t.pageTitle}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed break-keep text-ink-2 md:text-lg">
          {t.pageSubtitle}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed break-keep text-ink-3 md:text-base">
          {t.pageIntro}
        </p>
      </section>
```

- [ ] **Step 2: ColorTypes 그룹 제목·설명 토큰화**

96~129줄의 두 그룹 `<section>` 컨테이너와 제목 색을 교체. `space-y-14` 컨테이너와 제목/설명만 토큰 색으로 바꾼다:

99~105줄(warm 헤더):
```tsx
          <header className="mb-5">
            <h2 id="warm-group" className="font-display text-2xl text-ink md:text-3xl">
              {t.warmGroupTitle}
            </h2>
            <p className="mt-1 text-sm text-ink-2 md:text-base">{t.warmGroupDesc}</p>
          </header>
```

116~122줄(cool 헤더):
```tsx
          <header className="mb-5">
            <h2 id="cool-group" className="font-display text-2xl text-ink md:text-3xl">
              {t.coolGroupTitle}
            </h2>
            <p className="mt-1 text-sm text-ink-2 md:text-base">{t.coolGroupDesc}</p>
          </header>
```

> 타입 카드(`TypeCard`)의 그라데이션 헤더는 그 타입 고유색이므로 유지. 카드 CTA 텍스트(`text-purple-600`)는 P0-4 "텍스트 링크" 허용 범위지만 잉크로 통일: 72줄 `text-purple-600` → `text-ink` 로 변경.

72줄:
```tsx
          <span className="mt-auto text-sm font-semibold text-ink transition-transform group-hover:translate-x-0.5">
            {cta}
          </span>
```

- [ ] **Step 3: ColorTypeDetail 포커스 링/요소 색 점검 (잉크 통일)**

[src/pages/ColorTypeDetail.tsx](../../../src/pages/ColorTypeDetail.tsx)는 페이지 배경이 `bg-gray-50`. 오프화이트로 통일하기 위해 50줄을 교체:

```tsx
    <div className="min-h-screen w-full bg-paper pt-16 pb-16">
```

86줄 요약 카드와 222~232줄 AttributeCell, 86줄 흰 카드들의 경계를 헤어라인으로 통일:

86줄:
```tsx
        <section className="rounded-3xl border border-hairline bg-surface p-6 md:p-8">
```

AttributeCell 224~227줄:
```tsx
    className={[
      "rounded-2xl border border-hairline bg-surface p-4",
      className ?? "",
    ].join(" ")}
```

prev/next nav 카드 171~174줄, 192~195줄의 `bg-white shadow-sm`을 `bg-surface`로(테두리는 meta.borderClass 유지). 각 `bg-white shadow-sm` → `bg-surface`:

171줄 블록 className 내 `bg-white shadow-sm` → `bg-surface`, 192줄 동일.

> 타입 상세의 그라데이션 히어로(52줄)와 시그니처 원(78줄)은 그 타입의 정체성 표현이므로 유지 (UI_FEEDBACK은 상세 페이지 일러스트를 P2 일관성 이슈로 분류 — 이번 범위 밖).

- [ ] **Step 4: 검증**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 통과.

Run: `npm run dev` → `/types` 와 `/types/spring-bright` 확인. 목록 상단 보라 히어로가 오프화이트로, 카드 배경 오프화이트, 상세 배경 오프화이트. 타입별 컬러 히어로는 유지.

- [ ] **Step 5: 커밋**

```bash
git add src/pages/ColorTypes.tsx src/pages/ColorTypeDetail.tsx
git commit -m "feat(types): 목록/상세 오프화이트 통일 + 잉크 텍스트 대비 정리"
```

---

## Task 5: 테스트 모드 선택 — 오프화이트 + 권장 배지 + 사이즈 차등 (P0-1/4 + P1-8)

**Files:**
- Modify: `src/components/TestSetup.tsx`
- Test: `src/components/TestSetup.test.tsx` (신규)

그라데이션·글래스 카드를 오프화이트로. "세부 테스트"를 권장으로 강조(배지 + 1.4배 크기), 기본 선택을 `detailed`로 변경. **기본 선택 변경은 동작 변경이므로 실패 테스트 먼저 작성.**

- [ ] **Step 1: 실패 테스트 작성 — 기본 선택이 detailed**

`src/components/TestSetup.test.tsx` 생성:

```tsx
// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { translations } from "../i18n/translations";
import { TestSetup } from "./TestSetup";

const ko = translations.ko;

const renderSetup = () => {
  const onStart = vi.fn();
  render(
    <TestSetup lang="ko" onToggleLang={() => {}} onHome={() => {}} onStart={onStart} />,
  );
  return { onStart };
};

describe("TestSetup", () => {
  it("defaults to the recommended detailed mode", () => {
    const detailedCard = screen.getByRole?.("button", { name: new RegExp(ko.test.mode.detailed.label) });
    // 위 헬퍼는 렌더 전이므로 아래에서 다시 조회
  });

  it("starts with detailed mode selected by default", () => {
    const { onStart } = renderSetup();
    fireEvent.click(screen.getByText(ko.test.mode.startSelected));
    expect(onStart).toHaveBeenCalledWith(
      expect.objectContaining({ mode: "detailed" }),
    );
  });

  it("renders a recommended badge on the detailed card", () => {
    renderSetup();
    expect(screen.getByText(ko.test.mode.detailed.recommended)).toBeTruthy();
  });
});
```

> 위 첫 번째 빈 `it`은 제거하고 두 번째·세 번째만 남긴다 (작성 실수 방지용 주석). 최종 테스트는 아래 Step 4에서 정리된 형태로 확정한다.

- [ ] **Step 2: 번역 키 추가 — recommended 배지**

[src/i18n/translations.ts](../../../src/i18n/translations.ts)에서 `test.mode.detailed` 객체에 `recommended` 키를 추가한다. 먼저 위치를 찾는다:

Run: `npm run dev` 대신 — 검색으로 위치 확인:
```bash
grep -n "detailed:" src/i18n/translations.ts
```

`ko`의 `test.mode.detailed` 블록(label/description/count 옆)과 `en`의 동일 블록에 각각 추가:

ko:
```ts
        detailed: {
          label: "세부 테스트",
          recommended: "권장",
          // ... 기존 description, count 유지
```

en:
```ts
        detailed: {
          label: "Detailed Test",
          recommended: "Recommended",
          // ... 기존 description, count 유지
```

> `TranslationSchema` 타입이 구조에서 자동 추론되면 추가만으로 충분. 만약 명시적 인터페이스라면 해당 인터페이스의 `detailed`에 `recommended: string`도 추가. (Step 5 typecheck가 잡아준다.)

- [ ] **Step 3: TestSetup 컨테이너·헤더·디스플레이 토글 오프화이트화**

[src/components/TestSetup.tsx](../../../src/components/TestSetup.tsx) 17줄 기본 모드와 60~113줄을 교체.

17줄:
```tsx
  const [selectedMode, setSelectedMode] = useState<TestMode>("detailed");
```

60~113줄(컨테이너 ~ display 토글 끝):
```tsx
  return (
    <div className="relative min-h-screen w-full bg-paper px-4 py-6 text-ink sm:px-6">
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between gap-2">
        <button
          onClick={onHome}
          className="rounded-lg border border-hairline bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:bg-hairline/40 active:scale-95"
        >
          {t.test.home}
        </button>
        <LangToggle lang={lang} onToggle={onToggleLang} />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl items-center justify-center pt-16">
        <div className="w-full rounded-3xl border border-hairline bg-surface p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl text-ink sm:text-4xl">{t.test.setup.title}</h1>
            <p className="mt-3 text-sm text-ink-2 sm:text-base">{t.test.setup.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-ink-3 uppercase">
              {t.test.display.title}
            </h2>
            <div
              role="radiogroup"
              aria-label={t.test.display.title}
              className="grid grid-cols-2 gap-2 rounded-2xl border border-hairline bg-paper p-1.5"
            >
              {displayOptions.map((option) => {
                const isSelected = selectedDisplay === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedDisplay(option.value)}
                    className={`rounded-xl px-3 py-2.5 text-center transition ${
                      isSelected
                        ? "bg-accent text-accent-fg"
                        : "text-ink-2 hover:bg-hairline/40"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span
                      className={`mt-1 block text-xs ${
                        isSelected ? "text-accent-fg/80" : "text-ink-3"
                      }`}
                    >
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
```

- [ ] **Step 4: 모드 카드 — 권장 배지 + 사이즈 차등**

115~141줄(모드 카드 블록)을 교체. detailed 카드는 `order` 앞으로 + 강조, simple은 보조:

```tsx
          <div>
            <div className="mt-5 grid gap-3 sm:grid-cols-5">
              {modeCards.map((card) => {
                const isSelected = selectedMode === card.mode;
                const isRecommended = card.mode === "detailed";

                return (
                  <button
                    key={card.mode}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedMode(card.mode)}
                    className={[
                      "rounded-2xl border px-4 py-4 text-left transition",
                      isRecommended ? "sm:col-span-3" : "sm:col-span-2",
                      isSelected
                        ? "border-ink bg-paper shadow-sm"
                        : "border-hairline bg-surface text-ink-2 hover:border-ink/40",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2">
                      <span className="block text-lg font-semibold text-ink">{card.title}</span>
                      {isRecommended && (
                        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-fg">
                          {t.test.mode.detailed.recommended}
                        </span>
                      )}
                    </span>
                    <span className="mt-2 block text-sm text-ink-2">{card.description}</span>
                    <span className="mt-4 inline-flex rounded-full border border-hairline px-3 py-1 text-xs font-semibold text-ink-3">
                      {card.countLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
```

- [ ] **Step 5: howTo 섹션 + 시작 CTA 오프화이트화**

143~177줄(howTo `<section>` + 시작 버튼)을 교체:

```tsx
          <section
            aria-label={t.test.setup.howTo.title}
            className="mt-6 rounded-2xl border border-hairline bg-paper p-4 sm:p-5"
          >
            <h3 className="text-sm font-semibold tracking-wide text-ink-3 uppercase">
              {t.test.setup.howTo.title}
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-2">
              <li className="flex gap-3">
                <span aria-hidden className="mt-0.5 text-base">
                  ↔
                </span>
                <span>{t.test.setup.howTo.swipe}</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-0.5 text-base">
                  ✦
                </span>
                <span>{t.test.setup.howTo.judge}</span>
              </li>
            </ul>
          </section>

          <button
            type="button"
            onClick={() =>
              onStart({
                mode: selectedMode,
                displayMode: selectedDisplay,
              })
            }
            className="mt-6 w-full rounded-lg bg-accent px-6 py-4 text-base font-bold text-accent-fg transition hover:opacity-90 active:scale-95"
          >
            {t.test.mode.startSelected}
          </button>
```

- [ ] **Step 6: 테스트 파일 정리 후 실행**

Step 1의 빈 `it`을 지우고 아래 최종형으로 `src/components/TestSetup.test.tsx`를 확정:

```tsx
// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { translations } from "../i18n/translations";
import { TestSetup } from "./TestSetup";

const ko = translations.ko;

describe("TestSetup", () => {
  it("starts with detailed mode selected by default", () => {
    const onStart = vi.fn();
    render(<TestSetup lang="ko" onToggleLang={() => {}} onHome={() => {}} onStart={onStart} />);
    fireEvent.click(screen.getByText(ko.test.mode.startSelected));
    expect(onStart).toHaveBeenCalledWith(expect.objectContaining({ mode: "detailed" }));
  });

  it("renders a recommended badge on the detailed card", () => {
    render(<TestSetup lang="ko" onToggleLang={() => {}} onHome={() => {}} onStart={() => {}} />);
    expect(screen.getByText(ko.test.mode.detailed.recommended)).toBeTruthy();
  });
});
```

Run: `npm run test:run -- TestSetup`
Expected: 2건 PASS.

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 전체 통과.

Run: `npm run dev` → `/test` (모드 선택 화면) 확인. 오프화이트, "세부 테스트" 카드가 더 크고 "권장" 배지, 기본 선택됨. 시작 CTA 검정 직사각형.

- [ ] **Step 7: 커밋**

```bash
git add src/components/TestSetup.tsx src/components/TestSetup.test.tsx src/i18n/translations.ts
git commit -m "feat(test-setup): 오프화이트화 + 세부 테스트 권장 배지/사이즈 차등 + 기본 선택"
```

---

## Task 6: 결과 — Best 풀폭 스트립 / 2nd·3rd 축소 / Worst 아코디언 (P0-1 + P1-6/7)

**Files:**
- Modify: `src/pages/Results.tsx`
- Test: `src/components/Results.test.tsx` (기존 보강)

라이트-플랫 ↔ 다크-글래스 단절을 없애고 오프화이트 한 시스템으로. Best를 풀폭 컬러 스트립 + 세리프 시즌명으로 강조, 2nd/3rd는 작게, Worst는 기본 닫힘 아코디언(콘텐츠는 마운트 유지).

- [ ] **Step 1: 실패 테스트 추가 — Worst 아코디언 토글**

[src/components/Results.test.tsx](../../../src/components/Results.test.tsx)에 아래 `it`을 `describe` 안에 추가 (기존 테스트는 그대로 둔다):

```tsx
  it("collapses the worst section by default and expands on toggle", () => {
    render(
      <Results
        mode="simple"
        likedChips={[getChip("base-warm-pink"), getChip("season-spring-orange")]}
        dislikedChips={[getChip("base-cool-blue"), getChip("season-winter-blue")]}
        onRetry={() => {}}
        lang="ko"
      />,
    );

    const toggle = screen.getByRole("button", { name: ko.results.worst });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });
```

상단 import에 `fireEvent` 추가:
```tsx
import { fireEvent, render, screen } from "@testing-library/react";
```

> 기존 첫 테스트는 Worst 칩 이름("인디고 다이")과 NOPE 배지가 DOM에 있음을 단언한다. 아코디언이 콘텐츠를 **언마운트하지 않고 CSS로만 숨기므로** 이 단언은 닫힌 상태에서도 통과한다. 이 제약을 Step 3 구현이 반드시 지켜야 한다.

- [ ] **Step 2: 토큰 기반 톤 카드 스타일로 교체**

[src/pages/Results.tsx](../../../src/pages/Results.tsx) 104~134줄 `toneCardStyles`를 무채색 토큰 기반으로 교체:

```tsx
const toneCardStyles: Record<ToneCardVariant, ToneCardStyle> = {
  best: {
    containerClass: "border-hairline bg-surface",
    labelClass: "text-ink-3",
    valueClass: "text-ink",
    badgeClass: "bg-accent text-accent-fg",
    borderClass: "border-hairline",
  },
  second: {
    containerClass: "border-hairline bg-surface",
    labelClass: "text-ink-3",
    valueClass: "text-ink",
    badgeClass: "bg-hairline text-ink-2",
    borderClass: "border-hairline",
  },
  third: {
    containerClass: "border-hairline bg-surface",
    labelClass: "text-ink-3",
    valueClass: "text-ink",
    badgeClass: "bg-hairline text-ink-2",
    borderClass: "border-hairline",
  },
  worst: {
    containerClass: "border-hairline bg-surface",
    labelClass: "text-ink-3",
    valueClass: "text-ink",
    badgeClass: "bg-hairline text-ink-2",
    borderClass: "border-hairline",
  },
};
```

- [ ] **Step 3: 페이지 컨테이너 + 헤더 + Best 스트립 + 2nd/3rd + Worst 아코디언 재구성**

먼저 상단에 useState는 이미 import됨. Worst 토글 상태를 컴포넌트 안에 추가한다 — 145줄 `selectedPaletteToneId` useState 다음 줄에 추가:

```tsx
  const [worstOpen, setWorstOpen] = useState(false);
```

다음으로 238~351줄(`return (` 의 최상위 `<div>` 부터 Worst PaletteSection 닫힘까지)을 교체:

```tsx
  return (
    <div className="min-h-screen w-full overflow-auto bg-paper p-6 pt-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-left">
          <h1 className="font-display text-4xl text-ink md:text-5xl">{t.results.header}</h1>
          <p className="mt-2 max-w-2xl text-ink-2">
            {mode === "simple" ? t.results.simpleIntro : t.results.paletteIntro}
          </p>
        </div>

        {/* Best — 풀폭 컬러 스트립 + 세리프 시즌명 */}
        {resultState.bestCard && (
          <section className="mb-8">
            <p className="text-sm font-semibold tracking-wide text-ink-3 uppercase">
              {resultState.bestCard.label}
            </p>
            <h2 className="mt-1 font-display text-4xl text-ink md:text-6xl">
              {resultState.bestCard.displayName}
            </h2>
            <div className="mt-5 flex h-20 w-full overflow-hidden rounded-2xl border border-hairline md:h-28">
              {resultState.bestCard.paletteColors.map((color) => (
                <span
                  key={`best-strip-${color.id}`}
                  className="h-full flex-1"
                  style={{ backgroundColor: color.hex }}
                  title={getChipName(color, lang)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 2nd / 3rd — Best의 1/3 크기, 단일 행 */}
        {resultState.comparisonCards.length > 0 && (
          <div className="mb-10 grid gap-3 sm:grid-cols-2">
            {resultState.comparisonCards.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-3 rounded-xl border border-hairline bg-surface p-3"
              >
                <div className="flex h-10 flex-1 overflow-hidden rounded-lg">
                  {card.previewColors.map((color) => (
                    <span
                      key={`${card.id}-${color.id}`}
                      className="h-full flex-1"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold text-ink-3">{card.label}</p>
                  <p className="text-sm font-bold text-ink">{card.displayName}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Best/비교 팔레트 상세 (탭 + 그리드) */}
        {topCards.length > 0 && (
          <div className="mb-10 rounded-3xl border border-hairline bg-surface p-6">
            {topCards.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {topCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedPaletteToneId(card.id)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                      card.id === activePaletteCard?.id
                        ? "border-transparent bg-accent text-accent-fg"
                        : "border-hairline bg-surface text-ink-2 hover:border-ink/40",
                    ].join(" ")}
                  >
                    {card.label}
                  </button>
                ))}
              </div>
            )}

            {activePaletteCard && (
              <PaletteSection
                title={mode === "simple" ? t.results.diagnosticChipTitle(activePaletteCard.label) : t.results.paletteTitle(activePaletteCard.label)}
                description={
                  mode === "simple"
                    ? t.results.simpleDiagnostics.best
                    : activePaletteCard.label === t.results.best
                      ? t.results.paletteDescriptions.best
                      : t.results.paletteDescriptions.comparison
                }
                badgeText={activePaletteCard.displayName}
                paletteColors={activePaletteCard.paletteColors}
                badgeClass={activePaletteCard.badgeClass}
                borderClass={activePaletteCard.borderClass}
                likedSelectionSet={likedSelectionSet}
                dislikedSelectionSet={dislikedSelectionSet}
                badgeMode="liked"
                t={t}
                lang={lang}
                insideCard
              />
            )}
          </div>
        )}

        {mode === "detailed" && (
          <StylingRecommendations
            bestType={resultState.bestCard.id as PersonalColorType}
            displayName={resultState.bestCard.displayName}
            lang={lang}
            t={t}
          />
        )}

        {/* Worst — 아코디언 (기본 닫힘, 콘텐츠는 마운트 유지) */}
        {resultState.worstCard && (
          <section className="mb-10 rounded-3xl border border-hairline bg-surface">
            <button
              type="button"
              aria-expanded={worstOpen}
              onClick={() => setWorstOpen((value) => !value)}
              className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left"
            >
              <span>
                <span className="block text-sm font-semibold tracking-wide text-ink-3 uppercase">
                  {resultState.worstCard.label}
                </span>
                <span className="mt-0.5 block font-display text-2xl text-ink">
                  {resultState.worstCard.displayName}
                </span>
              </span>
              <svg
                className={`h-5 w-5 shrink-0 text-ink-3 transition-transform ${worstOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={worstOpen ? "px-6 pb-6" : "hidden"}>
              <PaletteSection
                title={mode === "simple" ? t.results.diagnosticChipTitle(t.results.worst) : t.results.paletteTitle(t.results.worst)}
                description={mode === "simple" ? t.results.simpleDiagnostics.worst : t.results.paletteDescriptions.worst}
                badgeText={resultState.worstCard.displayName}
                paletteColors={resultState.worstCard.paletteColors}
                badgeClass={resultState.worstCard.badgeClass}
                borderClass={resultState.worstCard.borderClass}
                likedSelectionSet={likedSelectionSet}
                dislikedSelectionSet={dislikedSelectionSet}
                badgeMode="disliked"
                t={t}
                lang={lang}
                muted
                insideCard
              />
            </div>
          </section>
        )}
```

> 핵심: 닫힘 상태는 `hidden` 클래스(=`display:none`)로만 숨긴다 → PaletteSection은 항상 마운트 → 기존 테스트의 칩 이름·NOPE 배지 단언 통과. `insideCard` prop으로 Worst 팔레트도 카드 안 콘텐츠로 렌더(중복 테두리 제거).

- [ ] **Step 4: 분석 노트 박스 + 하단 버튼 토큰화**

353~386줄(분석 노트 + 버튼 두 개)을 교체:

```tsx
        <div className="mb-6 rounded-2xl border border-hairline bg-surface p-6">
          <h3 className="mb-2 font-display text-xl text-ink">{t.results.analysisTitle}</h3>
          <p className="mb-3 text-sm text-ink-2">{t.results.analysisIntro}</p>
          <ul className="space-y-1 text-sm text-ink-2">
            <li>✓ {resultState.bestCard.baseTone === "Warm" ? t.undertone.warm : t.undertone.cool}</li>
            {resultState.bestCard.season === "Spring" && <li>✓ {t.traits.spring}</li>}
            {resultState.bestCard.season === "Summer" && <li>✓ {t.traits.summer}</li>}
            {resultState.bestCard.season === "Autumn" && <li>✓ {t.traits.autumn}</li>}
            {resultState.bestCard.season === "Winter" && <li>✓ {t.traits.winter}</li>}
            {resultState.bestCard.detailTone === "Light" && <li>✓ {t.traits.light}</li>}
            {resultState.bestCard.detailTone === "Bright" && <li>✓ {t.traits.bright}</li>}
            {resultState.bestCard.detailTone === "Muted" && <li>✓ {t.traits.muted}</li>}
            {resultState.bestCard.detailTone === "Dark" && <li>✓ {t.traits.dark}</li>}
          </ul>
        </div>

        <div className="mb-8 flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 rounded-lg bg-accent py-3 font-bold text-accent-fg transition-opacity hover:opacity-90"
          >
            {t.results.tryAgain}
          </button>
          <button
            onClick={() => {
              const urlToShare = shareUrl || window.location.href;
              void navigator.clipboard.writeText(urlToShare);
              window.alert(t.results.copied);
            }}
            className="flex-1 rounded-lg border border-hairline bg-surface py-3 font-bold text-ink transition-colors hover:bg-hairline/40"
          >
            {t.results.share}
          </button>
        </div>
```

- [ ] **Step 5: noLikes 폴백 화면 토큰화**

224~236줄(`if (!resultState.bestCard)` 블록)을 교체:

```tsx
  if (!resultState.bestCard) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-paper">
        <p className="text-xl font-semibold text-ink">{t.results.noLikes}</p>
        <button
          onClick={onRetry}
          className="rounded-lg bg-accent px-6 py-3 font-bold text-accent-fg transition-opacity hover:opacity-90"
        >
          {t.results.tryAgain}
        </button>
      </div>
    );
  }
```

- [ ] **Step 6: ResultToneCard 미사용 정리 확인**

위 재구성으로 `ResultToneCard` 컴포넌트(392~420줄)는 더 이상 호출되지 않는다. lint가 미사용 경고를 낼 것이므로 **`ResultToneCard` 컴포넌트 정의와 그 props 인터페이스 `ResultToneCardProps`(66~71줄)를 삭제**한다. (내가 만든 변경이 만든 orphan이므로 제거 — 사용자 CLAUDE.md §3.)

Run: `grep -n "ResultToneCard" src/pages/Results.tsx`
Expected: 삭제 후 매치 0건.

- [ ] **Step 7: 검증**

Run: `npm run test:run -- Results`
Expected: 기존 1건 + 신규 아코디언 1건 = green.

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 전체 통과, 미사용 경고 0.

Run: `npm run dev` → `http://localhost:5173/?preview=results`
확인 항목:
- 배경 오프화이트, 보라/블루 그라데이션 카드 0.
- Best 시즌명이 세리프 큰 글자 + 풀폭 컬러 스트립.
- 2nd/3rd가 작은 단일 행.
- Worst가 닫힌 아코디언으로 페이지 하단, 클릭 시 펼쳐짐.
- 모바일 폭 가로 스크롤 없음.

- [ ] **Step 8: 커밋**

```bash
git add src/pages/Results.tsx src/components/Results.test.tsx
git commit -m "feat(results): 한 시스템 오프화이트 + Best 풀폭 스트립 + Worst 아코디언"
```

---

## Task 7: 전체 회귀 검증 + 최종 육안 점검

**Files:** 없음 (검증 전용)

- [ ] **Step 1: 전체 자동 검증**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 타입 0 에러, lint 0 에러, 모든 테스트 PASS.

- [ ] **Step 2: 프로덕션 빌드 확인**

Run: `npm run build`
Expected: 빌드 성공 (폰트 CDN 링크/토큰 CSS 정상 번들).

- [ ] **Step 3: 6개 화면 육안 점검 (dev 서버)**

Run: `npm run dev`, 각 경로 확인:
- `/` 홈 — 오프화이트, 좌측 세리프 헤드라인, 컬러칩 16, 검정 CTA, 체크마크 없음.
- `/about` — 오프화이트, 좌측정렬 본문, 검정 CTA.
- `/types` — 목록 보라 히어로 제거, 오프화이트.
- `/types/spring-bright` — 오프화이트 본문(타입 컬러 히어로는 유지).
- `/test` — 모드 선택 오프화이트, "세부(권장)" 배지·강조·기본 선택.
- `/?preview=results` — Best 스트립, 2nd/3rd 축소, Worst 아코디언.

AI 슬롭 체크리스트 (UI_FEEDBACK §2) 통과 확인:
- ✓ 풀스크린 보라–핑크 그라데이션 제거 (타입별 컨텐츠 히어로 제외)
- ✓ 흰 글씨×핫핑크 제거 (잉크/오프화이트, 대비 AA)
- ✓ 체크마크 4줄 제거
- ✓ Results와 나머지가 한 디자인 시스템
- ✓ CTA = 검정 솔리드 1종 + 텍스트 링크 1종

- [ ] **Step 4: 잔여 그라데이션 스캔**

Run: `grep -rn "bg-gradient\|from-blue-400\|via-purple\|to-pink" src/pages src/components`
Expected: 매치는 `colorTypeMeta.gradientClass`를 쓰는 타입별 컨텐츠 히어로(ColorTypes 카드 / ColorTypeDetail 히어로)에 국한. 홈/About/Test/Results/Header에는 0건.

- [ ] **Step 5: 최종 확인 커밋 (필요 시)**

검증만 한 경우 커밋 없음. 육안 점검 중 미세 수정이 생기면 해당 파일만 커밋:

```bash
git add -A
git commit -m "fix(ui): 리디자인 육안 점검 잔여 수정"
```

---

## Self-Review

**1. 스펙 커버리지 (UI_FEEDBACK §4 P0+P1):**
- P0-1 오프화이트 배경 → Task 2/3/4/5/6 ✓
- P0-2 솔리드 헤더+잉크 로고 → Task 1 ✓
- P0-3 흰×핫핑크 제거/대비 → 전 Task 토큰화 ✓
- P0-4 CTA 통일 → Task 1~5 검정 솔리드 + 텍스트 링크 ✓
- P1-5 홈 히어로 재구성 → Task 2 ✓
- P1-6 Best 풀폭 스트립 + 2nd/3rd 축소 → Task 6 ✓
- P1-7 Worst 아코디언 → Task 6 ✓
- P1-8 테스트 모드 권장 배지/사이즈 → Task 5 ✓

**2. 플레이스홀더 스캔:** TBD/추후구현 없음. 모든 코드 단계에 실제 className/JSX 포함. (Task 5 Step 1의 빈 `it`은 Step 6에서 명시적으로 제거하도록 지시함.)

**3. 타입/이름 일관성:**
- 토큰 유틸리티 이름(`bg-paper`/`text-ink`/`border-hairline`/`bg-accent`/`text-accent-fg`/`font-display`)이 Task 0 정의와 이후 모든 Task에서 동일하게 사용됨. ✓
- `worstOpen` 상태명 Task 6 내 일관. ✓
- `t.test.mode.detailed.recommended` 키가 Task 5 Step 2(번역 추가)·Step 4(사용)·Step 6(테스트)에서 동일. ✓
- `heroChips`(Task 2)는 `personalColorTypes`+`colorData`로 구성 — 둘 다 colorData.ts에서 export 확인됨. ✓

**4. 기존 테스트 보호:**
- Results.test 첫 테스트: Worst 콘텐츠를 `hidden`(display:none)으로만 숨겨 마운트 유지 → `getByText`/`getAllByText` 통과 (Task 6 Step 3 명시). ✓
- App.test: Home/About/Results/Header mock → 페이지 내부 변경 무관. ✓

**주의 (실행자에게):** 각 Task의 줄 번호는 본 플랜 작성 시점 기준. 앞 Task가 같은 파일을 수정하면 줄 번호가 밀릴 수 있으니, **줄 번호보다 인용한 코드 블록(old) 문자열 매칭을 우선**하라. Task는 파일이 거의 겹치지 않게 분리했으나(Header/Home/About/Types/TestSetup/Results), 한 Task 안에서는 위→아래 순서로 적용하면 안전하다.
