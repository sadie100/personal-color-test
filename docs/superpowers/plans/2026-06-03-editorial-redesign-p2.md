# 에디토리얼 갤러리 리디자인 (P2 일관성) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [docs/UI_FEEDBACK.md](../../UI_FEEDBACK.md) §4 P2(일관성) 액션 — About 시즌 섹션 1-Up 풀폭 재구성(#9), 8타입 카드 시즌별 그룹핑 + 시그니처 4색 띠(#10), PCCS 톤 차트 자체 그리드화(#11) — 를 구현하고, P0+P1에서 비차단 Minor로 남긴 잔여 3건을 함께 정리한다.

**Architecture:** 데이터·라우팅·분석 로직은 손대지 않고 프레젠테이션 레이어만 바꾼다. P0+P1에서 도입한 `@theme` 토큰(`paper`/`surface`/`hairline`/`ink`/`ink-2`/`ink-3`/`accent`/`font-display`)을 그대로 쓰되, 칩·태그·차트 셀 배경용 `--color-fill` 토큰 1개만 신규 추가한다. About 시즌 카드 그리드를 풀폭 스택 섹션으로, 8타입 카드의 그라데이션 헤더를 시그니처 4색 띠로, PCCS 외부 이미지(`pccs_tone_map.jpg`)를 토큰 기반 CSS 그리드 컴포넌트로 교체한다.

**Tech Stack:** React 19 + TypeScript, Tailwind CSS v4 (`@theme`), Vite, react-router-dom, Vitest + Testing Library, Google Fonts CDN.

---

## 적용 범위 (확정)

| #       | 항목                                        | 결정                                                                                        | 대상 Task |
| ------- | ------------------------------------------- | ------------------------------------------------------------------------------------------- | --------- |
| P2-9    | About 4계절 섹션 → 1-Up 풀폭 시즌 섹션      | **풀폭 스택 섹션**(h-screen 스냅 아님), 시즌당 칩 10개 풀폭 스트립                          | Task 3    |
| P2-10   | 8타입 카드 시즌별 2개 그룹핑 + 컬러 띠      | warm/cool 2그룹 → **시즌 4그룹**, 카드 헤더 그라데이션 → **시그니처 4색 띠**                | Task 2    |
| P2-11   | ~~PCCS 톤 차트 자체 제작~~ **(폐기 — 되돌림)** | ~~간소화 에디토리얼 그리드(채도×명도 4×4 CSS 그리드)~~ → 구현 후 가독성이 떨어져 되돌림. **외부 이미지(`pccs_tone_map.jpg`)를 헤어라인 카드에 액자화한 것이 최종**이며 교체 예정 없음. (Task 4 참조) | ~~Task 4~~ |
| Minor-1 | ColorTypes 키워드 칩 쿨그레이 seam          | `bg-slate-100 text-slate-700` → `--color-fill` 토큰                                         | Task 1    |
| Minor-2 | PaletteSection `insideCard=false` 데드 분기 | prop 제거 + 항상-insideCard 스타일 인라인                                                   | Task 1    |
| Minor-3 | PaletteSection 타이틀 `font-bold`           | → `font-display` (다른 제목과 통일)                                                         | Task 1    |

**범위 밖 (이번 플랜 제외 — 모두 P3):** 컬러칩 hover/focus 폴리시, 모바일 본문 좌측정렬, 결과 OG 이미지, `prefers-reduced-motion`, LangToggle 토큰화. (UI_FEEDBACK §4 P3)

**의도적으로 유지(=결함 아님):**

- ColorTypeDetail 히어로의 타입별 그라데이션(`meta.gradientClass`)과 시그니처 원 = 그 타입의 컨텐츠 색이라 P2 범위 밖. (UI_FEEDBACK은 상세 일러스트를 별도 이슈로 분류.)
- 8타입 카드 헤더만 4색 띠로 바꾸고, `gradientClass`/`heroTextClass` 메타 자체는 ColorTypeDetail이 계속 쓰므로 삭제하지 않는다.

---

## TDD 적용 방침

P2는 신규 동작(state/토글/분기)이 없는 **순수 시각(CSS/className/정적 마크업) 변경**이다. 따라서 red-green TDD는 부적합하다 (사용자 CLAUDE.md §4 "trivial → 판단", writing-plans는 사용자 지침 우선 — P0+P1 플랜과 동일 방침).

- **검증 = `npm run typecheck` + `npm run lint`(0 에러, 미사용 0) + `npm run test:run`(기존 테스트 green 유지) + `npm run build` + dev 서버 육안.**
- 신규 테스트 파일은 만들지 않는다.

**불변 제약 — 기존 테스트를 깨지 말 것:**

- [src/App.test.tsx](../../../src/App.test.tsx)는 Home/About/ColorTest/Results/Header를 mock 처리하고 ColorTypes(`types` 화면)는 **렌더하지 않는다.** 따라서 About·ColorTypes·translations·types 변경은 App.test에 영향 없음 (Task 작성 시 확인됨).
- [src/components/Results.test.tsx](../../../src/components/Results.test.tsx)는 PaletteSection을 통해 렌더된 칩 이름·LIKE/NOPE 배지를 단언한다. **Task 1의 PaletteSection 변경은 `insideCard` 분기 제거와 타이틀 폰트 교체뿐 — DOM 텍스트·구조·칩 렌더는 그대로**이므로 통과한다.
- [src/components/TestSetup.test.tsx](../../../src/components/TestSetup.test.tsx) / [ColorTest.test.tsx](../../../src/components/ColorTest.test.tsx)는 이번 변경 파일과 무관.

---

## File Structure

**생성:**

- `src/components/PccsToneMap.tsx` — PCCS 톤 차트(채도×명도 CSS 그리드). About에서만 사용. PCCS 톤 12개 데이터 + 축 라벨 렌더를 한 파일에 캡슐화. (Task 4)

**수정:**

- `src/index.css` — `--color-fill` 토큰 1개 추가 (Task 0)
- `src/pages/Results.tsx` — PaletteSection `insideCard` prop 제거 + 타이틀 `font-display` (Task 1)
- `src/pages/ColorTypes.tsx` — 키워드 칩 토큰화(Task 1) + 시즌 4그룹 + 시그니처 4색 띠(Task 2)
- `src/data/colorTypeMeta.ts` — `warmSlugs`/`coolSlugs` → `seasonSlugGroups`로 교체 (Task 2)
- `src/pages/About.tsx` — 시즌 섹션 1-Up 풀폭 + 톤 섹션 토큰화 + PCCS 컴포넌트 교체 (Task 3, Task 4)
- `src/types.ts` — `TypesNamespace`의 warm/cool 그룹 키 → 시즌 그룹 키, `AboutPccsCopy` 축 라벨 추가 (Task 2, Task 4)
- `src/i18n/translations.ts` — 위 두 스키마 변경에 대응하는 ko/en 카피 (Task 2, Task 4)

**손대지 않음:** `src/data/colorData.ts`, `src/utils/**`, `src/App.tsx`(라우팅), `src/hooks/**`, `src/components/Header.tsx`, `ColorTypeDetail.tsx`(타입 히어로 유지), `src/assets/pccs_tone_map.jpg`(import만 제거, 파일은 남김).

---

## Task 0: `--color-fill` 토큰 추가

**Files:**

- Modify: `src/index.css`

칩·태그·차트 셀 배경용 무채색 fill 토큰을 추가한다. `paper`(#fafaf7)와 `hairline`(#e6e4de) 사이의 따뜻한 중간톤. 이후 Task 1(키워드 칩)·Task 4(PCCS 셀)가 의존한다. 순수 토큰 추가라 별도 테스트 없음.

- [ ] **Step 1: @theme 블록에 fill 토큰 추가**

[src/index.css](../../../src/index.css)의 `@theme` 블록 안, `--color-accent-fg` 줄 다음에 추가:

```css
--color-accent-fg: #fafaf7; /* CTA 텍스트 */
--color-fill: #f0eee8; /* 칩/태그/차트 셀 배경 — paper와 hairline 사이 */
```

> 생성되는 유틸리티: `bg-fill` / `text-fill` / `border-fill`. (Tailwind v4가 `--color-fill` 토큰을 자동 유틸리티화.)

- [ ] **Step 2: 검증**

Run: `npm run typecheck && npm run lint`
Expected: 에러 0건 (CSS 토큰 추가는 타입/린트에 영향 없음).

- [ ] **Step 3: 커밋**

```bash
git add src/index.css
git commit -m "feat(design): 칩/태그/차트 셀용 fill 토큰 추가"
```

---

## Task 1: 잔여 Minor 3건 정리 (Minor-1/2/3)

**Files:**

- Modify: `src/pages/ColorTypes.tsx`
- Modify: `src/pages/Results.tsx`

P0+P1에서 비차단으로 남긴 3건을 정리한다. 모두 시각/정리 변경이며 동작·DOM 텍스트 불변 → 기존 테스트 green 유지.

- [ ] **Step 1: (Minor-1) ColorTypes 키워드 칩 토큰화**

[src/pages/ColorTypes.tsx](../../../src/pages/ColorTypes.tsx) 52~59줄의 키워드 칩 `<span>`을 교체. `bg-slate-100 text-slate-700`(쿨 그레이) → `bg-fill text-ink-2`(따뜻한 한 시스템):

```tsx
{
  copy.keywords.slice(0, 3).map((keyword) => (
    <span
      key={keyword}
      className="bg-fill text-ink-2 rounded-full px-2.5 py-1 text-[11px] font-semibold"
    >
      {keyword}
    </span>
  ));
}
```

- [ ] **Step 2: (Minor-2) PaletteSection `insideCard` prop 제거**

PaletteSection은 모든 호출처가 `insideCard`(=true)를 넘기므로 `false` 분기는 데드다. prop을 제거하고 컨테이너 className을 항상-insideCard 상태(테두리·그림자·좌우/하단 패딩 없음, 상단 패딩만)로 인라인한다.

[src/pages/Results.tsx](../../../src/pages/Results.tsx) `PaletteSectionProps` 인터페이스(76~80줄 부근)에서 `insideCard?: boolean;` 줄을 삭제:

```tsx
  lang: Lang;
  muted?: boolean;
}
```

PaletteSection 구조분해(436~443줄 부근)에서 `insideCard = false,` 줄을 삭제:

```tsx
  likedSelectionSet,
  dislikedSelectionSet,
  badgeMode = "liked",
  t,
  lang,
  muted = false,
}: PaletteSectionProps) => {
```

컨테이너 `<div>`(448~452줄)를 교체. (기존: `"rounded-3xl border border-hairline bg-surface p-6"` + insideCard 분기. insideCard가 항상 true였으므로 유효 스타일은 `bg-surface pt-6`):

```tsx
    <div className="bg-surface pt-6">
```

- [ ] **Step 3: (Minor-3) PaletteSection 타이틀 font-display 통일**

같은 파일 456줄 타이틀 `<h2>`를 교체. `text-2xl font-bold` → `font-display text-2xl`(다른 모든 제목과 통일):

```tsx
<h2 className="font-display text-ink text-2xl">{title}</h2>
```

- [ ] **Step 4: 두 호출처에서 `insideCard` prop 제거**

같은 파일에서 PaletteSection 호출 2곳의 `insideCard` 줄을 삭제한다 (prop이 사라졌으므로 넘기면 타입 에러).

Run: `grep -n "insideCard" src/pages/Results.tsx`
Expected: Step 2/4 적용 전 매치 — 인터페이스 1, 구조분해 1, 호출처 2 = 총 4건. **4건 모두 삭제 후 매치 0건.**

호출처 두 곳(Best/비교 팔레트, Worst 아코디언 내부) 각각에서 `t`/`lang` 다음의 `insideCard` 줄만 제거:

Best/비교 팔레트 호출:

```tsx
                t={t}
                lang={lang}
              />
```

Worst 아코디언 내부 호출 (이쪽은 `muted` 다음에 `insideCard`):

```tsx
                t={t}
                lang={lang}
                muted
              />
```

- [ ] **Step 5: 검증**

Run: `grep -n "insideCard" src/pages/Results.tsx`
Expected: 0건.

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 전체 통과 (Results.test green — DOM 텍스트·칩 구조 불변, App.test 무관).

Run: `npm run dev` → `http://localhost:5173/?preview=results` 와 `/types`
확인: 결과 팔레트 타이틀이 세리프, 카드 안 콘텐츠로 정상 렌더(중복 테두리 없음). 8타입 키워드 칩이 쿨그레이가 아닌 따뜻한 fill.

- [ ] **Step 6: 커밋**

```bash
git add src/pages/ColorTypes.tsx src/pages/Results.tsx
git commit -m "polish(p2): 잔여 Minor 정리 — 키워드 칩 토큰화 + PaletteSection 데드 prop 제거 + 타이틀 폰트 통일"
```

---

## Task 2: 8타입 카드 — 시즌 4그룹 + 시그니처 4색 띠 (P2-10)

**Files:**

- Modify: `src/data/colorTypeMeta.ts`
- Modify: `src/types.ts`
- Modify: `src/i18n/translations.ts`
- Modify: `src/pages/ColorTypes.tsx`

warm/cool 2그룹(각 4개)을 **시즌 4그룹(각 2개)**으로 바꾸고, 카드 헤더의 그라데이션 띠를 **그 타입 시그니처 4색 솔리드 띠**로 교체한다. `colorTypeMetas` 메타(gradientClass 등)는 ColorTypeDetail이 계속 쓰므로 삭제하지 않는다.

- [ ] **Step 1: colorTypeMeta에 시즌 그룹 구조 추가, warm/cool 제거**

[src/data/colorTypeMeta.ts](../../../src/data/colorTypeMeta.ts) 맨 아래 `warmSlugs`/`coolSlugs` 두 export(135~147줄)를 아래로 교체. (warm/cool은 ColorTypes.tsx에서만 쓰였고 이번에 대체되므로 제거 — 내 변경이 만든 orphan.)

상단 import에 `Season`이 이미 있는지 확인 — 1~7줄에 `Season`이 import되어 있다(현행 유지). 교체:

```ts
export interface SeasonSlugGroup {
  season: Season;
  slugs: ColorTypeSlug[];
}

/** 8타입을 시즌별 2개씩 묶는다 (UI_FEEDBACK §3.4 P2-10). */
export const seasonSlugGroups: SeasonSlugGroup[] = [
  { season: "Spring", slugs: ["spring-light", "spring-bright"] },
  { season: "Summer", slugs: ["summer-light", "summer-muted"] },
  { season: "Autumn", slugs: ["autumn-muted", "autumn-dark"] },
  { season: "Winter", slugs: ["winter-bright", "winter-dark"] },
];
```

- [ ] **Step 2: types.ts — TypesNamespace 그룹 키 교체**

[src/types.ts](../../../src/types.ts) `TypesNamespace`(353~371줄)에서 warm/cool 4개 키를 시즌 그룹 키로 교체. `warmGroupTitle`/`warmGroupDesc`/`coolGroupTitle`/`coolGroupDesc` 4줄을 삭제하고 `seasonGroups`를 추가:

```ts
export interface TypeGroupCopy {
  title: string;
  desc: string;
}

export interface TypesNamespace {
  pageTitle: string;
  pageSubtitle: string;
  pageIntro: string;
  seasonGroups: Record<AboutSeasonSlug, TypeGroupCopy>;
  cardViewDetail: string;
  detail: TypeDetailCopy;
  "spring-light": TypeContentCopy;
  "spring-bright": TypeContentCopy;
  "summer-light": TypeContentCopy;
  "summer-muted": TypeContentCopy;
  "autumn-muted": TypeContentCopy;
  "autumn-dark": TypeContentCopy;
  "winter-bright": TypeContentCopy;
  "winter-dark": TypeContentCopy;
}
```

> `AboutSeasonSlug`(= "spring"|"summer"|"autumn"|"winter")는 같은 파일 81줄에 이미 정의되어 있어 그대로 재사용한다. `TypeGroupCopy`는 `TypesNamespace` 바로 위에 둔다.

- [ ] **Step 3: translations.ts — ko/en 시즌 그룹 카피 교체**

[src/i18n/translations.ts](../../../src/i18n/translations.ts)에서 `types` 네임스페이스의 `warmGroupTitle`/`warmGroupDesc`/`coolGroupTitle`/`coolGroupDesc` 항목을 찾는다:

Run: `grep -n "warmGroupTitle\|coolGroupTitle" src/i18n/translations.ts`
Expected: ko 블록 1쌍 + en 블록 1쌍 = 4줄 위치 확인.

각 언어의 `types` 블록에서 그 4개 키(warmGroupTitle/warmGroupDesc/coolGroupTitle/coolGroupDesc)를 삭제하고 `seasonGroups`로 교체.

ko (`pageIntro` 다음, `cardViewDetail` 앞):

```ts
        seasonGroups: {
          spring: { title: "봄 — 따뜻하고 화사한", desc: "노랑기를 머금어 밝고 생기 있는 두 타입." },
          summer: { title: "여름 — 시원하고 부드러운", desc: "푸른기가 도는 맑고 차분한 두 타입." },
          autumn: { title: "가을 — 따뜻하고 깊은", desc: "노랑기에 무게가 더해진 그윽한 두 타입." },
          winter: { title: "겨울 — 시원하고 또렷한", desc: "푸른기에 선명함이 더해진 강렬한 두 타입." },
        },
```

en:

```ts
        seasonGroups: {
          spring: { title: "Spring — Warm & Vivid", desc: "Two yellow-based types that read bright and lively." },
          summer: { title: "Summer — Cool & Soft", desc: "Two blue-based types that read clear and calm." },
          autumn: { title: "Autumn — Warm & Deep", desc: "Two yellow-based types with added depth and weight." },
          winter: { title: "Winter — Cool & Crisp", desc: "Two blue-based types with sharp, vivid contrast." },
        },
```

- [ ] **Step 4: ColorTypes.tsx — TypeCard 헤더를 시그니처 4색 띠로**

[src/pages/ColorTypes.tsx](../../../src/pages/ColorTypes.tsx) `TypeCard`(17~79줄)를 교체. 헤더의 그라데이션(`meta.gradientClass`/`heroTextClass`)을 시그니처 4색 솔리드 띠(h-24=96px ≥ 80px)로 바꾸고, 타입명·시즌/톤 라벨은 띠 아래 오프화이트 영역에 잉크로 둔다:

```tsx
const TypeCard = ({ slug, lang }: TypeCardProps) => {
  const meta = colorTypeMetas[slug];
  const copy = translations[lang].types[slug];
  const palette = colorData[meta.type].slice(0, 6);
  const signature = colorData[meta.type].slice(0, 4);
  const cta = translations[lang].types.cardViewDetail;

  return (
    <li>
      <Link
        to={`/types/${slug}`}
        className={[
          "border-hairline bg-surface group flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm transition-all",
          "hover:-translate-y-0.5 hover:shadow-lg focus-visible:-translate-y-0.5 focus-visible:shadow-lg",
          "focus-visible:ring-ink focus-visible:outline-none focus-visible:ring-2",
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
            <p className="text-ink-3 text-xs font-semibold uppercase tracking-wide">
              {meta.season} · {meta.detailTone}
            </p>
            <h3 className="font-display text-ink mt-1 text-xl">{copy.title}</h3>
          </div>

          <p className="text-ink-2 break-keep text-sm leading-relaxed">{copy.tagline}</p>

          <div className="flex flex-wrap gap-1.5">
            {copy.keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="bg-fill text-ink-2 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              >
                {keyword}
              </span>
            ))}
          </div>

          <div className="flex gap-1.5" aria-hidden>
            {palette.map((color, index) => (
              <span
                key={`${color.hex}-${index}`}
                className="border-hairline h-6 flex-1 rounded-md border shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>

          <span className="text-ink mt-auto text-sm font-semibold transition-transform group-hover:translate-x-0.5">
            {cta}
          </span>
        </div>
      </Link>
    </li>
  );
};
```

> 변경 요지: `border-t-4 ... meta.borderClass` → `border border-hairline`(한 시스템), 그라데이션 헤더 → 시그니처 4색 띠, 키워드 칩 `bg-fill`(Task 1과 동일 — 여기서도 일관 적용), 팔레트 칩 테두리 `border-white/60` → `border-hairline`, 타입명 `font-display`. `meta.gradientClass`/`heroTextClass`/`borderClass`는 이 컴포넌트에서 미사용이 되지만 ColorTypeDetail이 쓰므로 메타 정의는 유지.

- [ ] **Step 5: ColorTypes.tsx — 본문 그룹을 시즌 4그룹으로**

같은 파일 import(1~6줄)에서 `warmSlugs, coolSlugs`를 `seasonSlugGroups`로 교체:

```tsx
import { colorTypeMetas, seasonSlugGroups } from "../data/colorTypeMeta";
```

본문 그룹 영역(96~124줄, warm `<section>` + cool `<section>`을 감싼 `<div class="...space-y-14...">`)을 시즌 4그룹 map으로 교체:

```tsx
<div className="mx-auto max-w-5xl space-y-14 px-4 py-12">
  {seasonSlugGroups.map((group) => {
    const groupCopy = t.seasonGroups[group.season.toLowerCase() as keyof typeof t.seasonGroups];
    const groupId = `group-${group.season.toLowerCase()}`;
    return (
      <section key={group.season} aria-labelledby={groupId}>
        <header className="mb-5">
          <h2 id={groupId} className="font-display text-ink text-2xl md:text-3xl">
            {groupCopy.title}
          </h2>
          <p className="text-ink-2 mt-1 text-sm md:text-base">{groupCopy.desc}</p>
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
```

> `t.seasonGroups`의 키는 소문자 슬러그(`spring` 등)이고 `group.season`은 `"Spring"`이라 `.toLowerCase()`로 매핑한다. 결과 타입은 `AboutSeasonSlug`와 동일하므로 `keyof typeof t.seasonGroups` 캐스팅으로 타입 안전. 그리드는 시즌당 2개라 `sm:grid-cols-2`(2열)로 단순화.

- [ ] **Step 6: 검증**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 전체 통과, 미사용 경고 0 (warmSlugs/coolSlugs 잔존 참조 없음). 만약 lint가 `gradientClass`/`heroTextClass` 관련 경고를 내지 않음 — 메타 객체 프로퍼티라 미사용 검사 대상 아님.

Run: `grep -rn "warmSlugs\|coolSlugs\|warmGroupTitle\|coolGroupTitle" src`
Expected: 0건.

Run: `npm run dev` → `/types`
확인:

- 4개 시즌 그룹(봄/여름/가을/겨울), 각 2개 카드.
- 카드 헤더가 그라데이션이 아닌 시그니처 4색 솔리드 띠.
- 카드 테두리 헤어라인, 타입명 세리프, 키워드 칩 따뜻한 fill.
- 모바일 폭 가로 스크롤 없음.

- [ ] **Step 7: 커밋**

```bash
git add src/data/colorTypeMeta.ts src/types.ts src/i18n/translations.ts src/pages/ColorTypes.tsx
git commit -m "feat(types): 8타입 시즌 4그룹 + 시그니처 4색 띠 (P2-10)"
```

---

## Task 3: About 시즌 섹션 1-Up 풀폭 + 톤 섹션 토큰화 (P2-9)

**Files:**

- Modify: `src/pages/About.tsx`

파스텔 시즌 카드 4개(2×2 그리드)를 **풀폭 스택 시즌 섹션**으로 재구성한다. 각 시즌 = 큰 세리프 시즌명 + 설명 + 그 시즌 2개 타입의 칩 10개를 **풀폭 가로 스트립**으로. 톤 섹션(라이트/브라이트/뮤트/다크)도 파스텔(`bg-*-50`/`text-gray-*`)을 한 시스템 오프화이트로 토큰화한다. About은 App.test에서 mock이라 영향 없음.

- [ ] **Step 1: import 및 설정 데이터 정리**

[src/pages/About.tsx](../../../src/pages/About.tsx) 상단을 교체. `seasonConfig`(그라데이션/파스텔 메타)는 1-Up에선 색 메타가 불필요하므로 시즌→타입 매핑만 남긴다. `ColorSwatches`는 풀폭 스트립으로 대체되므로 제거한다.

1~37줄(import + 인터페이스 + ColorSwatches 전까지)을 교체:

```tsx
import { PccsToneMap } from "../components/PccsToneMap";
import { colorData } from "../data/colorData";
import { translations } from "../i18n/translations";
import type { AboutSeasonSlug, AboutToneSlug, Lang, PersonalColorType } from "../types";

interface AboutProps {
  lang: Lang;
  onStart: () => void;
}

interface SeasonSectionItem {
  slug: AboutSeasonSlug;
  types: [PersonalColorType, PersonalColorType];
}

interface ToneItem {
  slug: AboutToneSlug;
  sampleKey: PersonalColorType;
  icon: string;
}

const seasonSections: ReadonlyArray<SeasonSectionItem> = [
  { slug: "spring", types: ["Spring Light", "Spring Bright"] },
  { slug: "summer", types: ["Summer Light", "Summer Muted"] },
  { slug: "autumn", types: ["Autumn Muted", "Autumn Dark"] },
  { slug: "winter", types: ["Winter Bright", "Winter Dark"] },
];

const toneItems: ReadonlyArray<ToneItem> = [
  { slug: "light", sampleKey: "Spring Light", icon: "☀" },
  { slug: "bright", sampleKey: "Spring Bright", icon: "✦" },
  { slug: "muted", sampleKey: "Autumn Muted", icon: "◐" },
  { slug: "dark", sampleKey: "Winter Dark", icon: "◼" },
];
```

> `pccsImage` import는 Task 4에서 PCCS 섹션을 컴포넌트로 바꾸며 제거되므로, 위 교체에서 이미 빠져 있다. (Task 3·4를 순서대로 적용.) `Color`/`AboutToneSlug` 등 미사용 타입 import는 위에서 정리됨.

- [ ] **Step 2: 시즌 섹션을 풀폭 1-Up 스택으로 교체**

같은 파일에서 시즌 `<section>`(156~176줄 부근, `t.about.seasons.title` 헤더 + 카드 그리드)을 교체:

```tsx
<section>
  <h2 className="font-display text-ink mb-8 text-2xl md:text-3xl">{t.about.seasons.title}</h2>
  <div className="space-y-12">
    {seasonSections.map((season) => {
      const chips = season.types.flatMap((type) => colorData[type]);
      const copy = t.about.seasons[season.slug];
      return (
        <article key={season.slug}>
          <h3 className="font-display text-ink text-3xl md:text-4xl">{copy.title}</h3>
          <p className="text-ink-2 mt-2 max-w-2xl break-keep text-sm leading-relaxed md:text-base">
            {copy.desc}
          </p>
          <div className="border-hairline mt-4 flex h-16 w-full overflow-hidden rounded-2xl border md:h-20">
            {chips.map((color, index) => (
              <span
                key={`${season.slug}-${color.hex}-${index}`}
                className="h-full flex-1"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </article>
      );
    })}
  </div>
</section>
```

> 시즌당 칩 = 2개 타입 × 5칩 = **10칩** 풀폭 스트립(타입당 5칩이 실제 데이터). 큰 세리프 시즌명이 위계를 만들고, 스트립이 그 시즌의 "작품"이 된다 (UI_FEEDBACK §3.5 "컬러칩이 주인공").

- [ ] **Step 3: 톤 섹션 파스텔 → 한 시스템 토큰화**

같은 파일 톤 `<section>`(178~199줄 부근)을 교체. 파스텔 `bg-*-50`/`border-*`/`text-gray-*`를 헤어라인 오프화이트 카드로:

```tsx
<section>
  <h2 className="font-display text-ink mb-8 text-2xl md:text-3xl">{t.about.tones.title}</h2>
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    {toneItems.map((tone) => {
      const copy = t.about.tones[tone.slug];
      const swatches = colorData[tone.sampleKey].slice(0, 4);
      return (
        <div key={tone.slug} className="border-hairline bg-surface rounded-2xl border p-6">
          <div className="text-ink-3 mb-2 text-2xl" aria-hidden>
            {tone.icon}
          </div>
          <h3 className="font-display text-ink mb-2 text-lg">{copy.title}</h3>
          <p className="text-ink-2 break-keep text-sm leading-relaxed">{copy.desc}</p>
          <div className="mt-3 flex gap-1.5">
            {swatches.map((color, index) => (
              <span
                key={`${tone.slug}-${color.hex}-${index}`}
                className="border-hairline h-8 w-8 rounded-full border"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      );
    })}
  </div>
</section>
```

- [ ] **Step 4: 검증 (Task 4 적용 전 중간 점검)**

> 주의: 이 시점에는 Task 1의 import(`PccsToneMap`)가 아직 존재하지 않으면 typecheck가 실패한다. **Task 3과 Task 4는 연속 적용**하되, 중간 검증은 Task 4 Step 4에서 통합 수행한다. 만약 Task 3만 먼저 커밋하려면, Step 1의 `import { PccsToneMap }` 줄을 잠시 빼고 PCCS `<img>` 섹션을 그대로 둔 뒤 Task 4에서 함께 교체한다.

이 플랜은 **Task 3 → Task 4를 한 흐름으로 진행**하고 Task 4 끝에서 함께 커밋하는 것을 기본으로 한다. 따라서 여기서는 별도 커밋 없이 Task 4로 진행한다.

---

## Task 4: PCCS 톤 차트 자체 그리드 컴포넌트 (P2-11)

> ⚠️ **이 Task는 되돌려졌다 (DO NOT IMPLEMENT).** 자체 CSS 그리드(`PccsToneMap.tsx`)를 한 번 구현했으나 원본 휠 차트보다 가독성이 떨어져 폐기하고 외부 이미지(`pccs_tone_map.jpg`)로 되돌렸다. About은 지금도 이미지를 헤어라인 `bg-surface` 카드에 액자화해 쓰며, **교체 예정 없음.** 아래 단계는 시도 기록으로만 남겨둔다. (디자인 시스템 문서: [docs/DESIGN.md](../../DESIGN.md) PCCS tone chart 항목.)

**Files:**

- Create: `src/components/PccsToneMap.tsx`
- Modify: `src/types.ts`
- Modify: `src/i18n/translations.ts`
- Modify: `src/pages/About.tsx`

외부 이미지 `pccs_tone_map.jpg`(스타일 이질 — UI_FEEDBACK §1.2/§2-9)를 토큰 기반 **CSS 그리드 컴포넌트**로 교체한다. 채도(가로 4)×명도(세로 4) 그리드에 12개 PCCS 톤을 배치하고, 각 셀은 대표색 1개 + 약자/이름. 원본의 12색 휠을 그대로 옮기는 대신(SVG 144+ 세그먼트, 유지비 큼) 단일 대표색 라더로 간소화한다 — "에디토리얼 갤러리" 컨셉(무채색 액자 + 컬러가 컨텐츠)에 부합. SVG 대신 CSS 그리드 div를 쓰는 이유: 반응형·접근성(텍스트 셀렉션/스크린리더)·토큰 색 적용이 SVG보다 단순.

- [ ] **Step 1: types.ts — AboutPccsCopy 축 라벨 추가**

[src/types.ts](../../../src/types.ts) `AboutPccsCopy`(264~266줄)를 교체. 외부 이미지를 제거하므로 `imageAlt`는 더 이상 쓰지 않지만, 축/범례 라벨이 필요하다. `imageAlt`를 제거하고 축 라벨을 추가:

```ts
export interface AboutPccsCopy extends AboutSectionCopy {
  axisSaturation: string;
  axisLightness: string;
  low: string;
  high: string;
}
```

- [ ] **Step 2: translations.ts — ko/en PCCS 축 라벨**

[src/i18n/translations.ts](../../../src/i18n/translations.ts)에서 `about.pccs` 블록을 찾는다:

Run: `grep -n "imageAlt" src/i18n/translations.ts`
Expected: ko/en 각 1건 = 2건.

각 언어 `about.pccs` 블록의 `imageAlt: ...` 줄을 삭제하고 축 라벨 4개로 교체.

ko:

```ts
        pccs: {
          title: "PCCS 톤 시스템", // 기존 title 값 유지 — 실제 파일의 값 그대로 둘 것
          desc: "…", // 기존 desc 값 유지
          axisSaturation: "채도",
          axisLightness: "명도",
          low: "낮음",
          high: "높음",
        },
```

en:

```ts
        pccs: {
          title: "…", // 기존 값 유지
          desc: "…", // 기존 값 유지
          axisSaturation: "Saturation",
          axisLightness: "Lightness",
          low: "Low",
          high: "High",
        },
```

> `title`/`desc`는 **기존 값을 그대로 두고** `imageAlt`만 4개 축 라벨로 교체한다. 위 `"…"`는 기존 문자열 보존 표시이며, 실제 편집 시 기존 줄은 건드리지 말고 `imageAlt` 줄만 치환할 것.

- [ ] **Step 3: PccsToneMap 컴포넌트 생성**

`src/components/PccsToneMap.tsx` 생성. 12개 PCCS 톤을 채도(col 1~4)×명도(row 1~4, 위=높음) 좌표에 배치. 대표색은 단일 휴(레드 계열) 톤 라더로 illustrative하게 정의:

```tsx
import { translations } from "../i18n/translations";
import type { Lang } from "../types";

interface PccsToneMapProps {
  lang: Lang;
}

interface PccsTone {
  abbr: string;
  name: string;
  /** 채도 버킷 1(낮음)~4(높음) */
  col: number;
  /** 명도 버킷 1(높음)~4(낮음) */
  row: number;
  hex: string;
}

// PCCS 12톤 — 채도×명도 좌표 + 대표색(단일 휴 라더, illustrative).
const pccsTones: ReadonlyArray<PccsTone> = [
  { abbr: "p", name: "Pale", col: 1, row: 1, hex: "#EBD3D0" },
  { abbr: "lt", name: "Light", col: 2, row: 1, hex: "#E8A9A0" },
  { abbr: "b", name: "Bright", col: 3, row: 1, hex: "#E4574C" },
  { abbr: "ltg", name: "Light grayish", col: 1, row: 2, hex: "#C9B6B2" },
  { abbr: "sf", name: "Soft", col: 2, row: 2, hex: "#C98579" },
  { abbr: "s", name: "Strong", col: 3, row: 2, hex: "#C0392B" },
  { abbr: "v", name: "Vivid", col: 4, row: 2, hex: "#E8301A" },
  { abbr: "g", name: "Grayish", col: 1, row: 3, hex: "#8C7A75" },
  { abbr: "d", name: "Dull", col: 2, row: 3, hex: "#9C5B50" },
  { abbr: "dp", name: "Deep", col: 3, row: 3, hex: "#8E2B20" },
  { abbr: "dkg", name: "Dark grayish", col: 1, row: 4, hex: "#4A3D3A" },
  { abbr: "dk", name: "Dark", col: 2, row: 4, hex: "#5C2A22" },
];

export const PccsToneMap = ({ lang }: PccsToneMapProps) => {
  const t = translations[lang].about.pccs;

  return (
    <figure className="m-0">
      <div className="flex gap-3">
        {/* 세로 축: 명도 */}
        <div
          className="text-ink-3 flex flex-col items-center justify-between py-1 text-xs"
          aria-hidden
        >
          <span>{t.high}</span>
          <span className="tracking-wide [writing-mode:vertical-rl]">{t.axisLightness}</span>
          <span>{t.low}</span>
        </div>

        <div className="flex-1">
          {/* 톤 그리드 */}
          <div className="grid grid-cols-4 grid-rows-4 gap-2">
            {pccsTones.map((tone) => (
              <div
                key={tone.abbr}
                className="border-hairline bg-fill flex flex-col rounded-xl border p-2"
                style={{ gridColumn: tone.col, gridRow: tone.row }}
              >
                <span
                  className="border-hairline h-10 w-full rounded-md border"
                  style={{ backgroundColor: tone.hex }}
                />
                <span className="font-display text-ink mt-1.5 text-sm">{tone.abbr}</span>
                <span className="text-ink-3 text-[11px] leading-tight">{tone.name}</span>
              </div>
            ))}
          </div>

          {/* 가로 축: 채도 */}
          <div className="text-ink-3 mt-2 flex items-center justify-between text-xs" aria-hidden>
            <span>{t.low}</span>
            <span className="tracking-wide">{t.axisSaturation}</span>
            <span>{t.high}</span>
          </div>
        </div>
      </div>
    </figure>
  );
};
```

> 그리드는 `grid-cols-4 grid-rows-4`에 각 톤이 `gridColumn`/`gridRow`로 명시 배치되어 12셀 채움·4셀 공백 — 원본의 계단식 달걀형 배치를 재현. `bg-fill` 셀 + `border-hairline`로 무채색 액자, 대표색만 컨텐츠. 대표색 hex는 단일 레드 휴의 톤 라더(illustrative)이며, PCCS 톤은 본래 휴 독립이므로 단일 휴 표현임을 컴포넌트 주석에 명시.

- [ ] **Step 4: About.tsx — PCCS img를 컴포넌트로 교체**

[src/pages/About.tsx](../../../src/pages/About.tsx) PCCS `<section>`(140~154줄 부근)의 `<img>` 블록을 `<PccsToneMap>`으로 교체:

```tsx
<section className="border-hairline bg-surface rounded-2xl border p-6 md:p-10">
  <h2 className="font-display text-ink mb-6 text-2xl md:text-3xl">{t.about.pccs.title}</h2>
  <div className="mb-6">
    <PccsToneMap lang={lang} />
  </div>
  <p className="text-ink-2 break-keep text-base leading-relaxed md:text-lg">{t.about.pccs.desc}</p>
</section>
```

> `pccsImage` import는 Task 3 Step 1에서 이미 제거됨. `pccs_tone_map.jpg` 파일 자체는 삭제하지 않는다(다른 참조 확인 전까지 보존 — 사용자 CLAUDE.md §3 "미리 지우지 말 것"). `PccsToneMap` import는 Task 3 Step 1에서 추가됨.

- [ ] **Step 5: 통합 검증 (Task 3 + Task 4)**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 전체 통과, 미사용 경고 0 (`pccsImage`/`imageAlt`/`ColorSwatches`/`seasonConfig`/`toneConfig` 잔존 참조 없음).

Run: `grep -rn "pccsImage\|imageAlt\|ColorSwatches" src`
Expected: 0건.

Run: `npm run build`
Expected: 빌드 성공. (이미지 import 제거로 번들에서 jpg 빠짐 — 정상.)

Run: `npm run dev` → `/about` 또는 `http://localhost:5173/?preview=about`
확인:

- 시즌 섹션: 봄/여름/가을/겨울이 큰 세리프 제목 + 풀폭 컬러 스트립(시즌당 10칩)으로 세로 스택. 파스텔 박스 그리드 사라짐.
- 톤 섹션: 파스텔(`bg-yellow-50` 등) 사라지고 헤어라인 오프화이트 카드.
- PCCS: 외부 이미지 대신 채도×명도 그리드(12 톤 셀), 무채색 프레임 + 대표색, 축 라벨(채도/명도, 낮음/높음).
- 모바일 폭 가로 스크롤 없음.

- [ ] **Step 6: 커밋**

```bash
git add src/pages/About.tsx src/components/PccsToneMap.tsx src/types.ts src/i18n/translations.ts
git commit -m "feat(about): 시즌 1-Up 풀폭 스트립 + 톤 토큰화 + PCCS 자체 그리드 (P2-9/11)"
```

---

## Task 5: 전체 회귀 검증 + 최종 육안 점검

**Files:** 없음 (검증 전용)

- [ ] **Step 1: 전체 자동 검증**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 타입 0 에러, lint 0 에러·미사용 0, 모든 테스트 PASS (기존 카운트 유지 — 신규 테스트 없음).

- [ ] **Step 2: 프로덕션 빌드**

Run: `npm run build`
Expected: 빌드 성공.

- [ ] **Step 3: 화면 육안 점검 (dev 서버)**

Run: `npm run dev`, 경로별 확인:

- `/types` — 시즌 4그룹, 각 2카드, 헤더 시그니처 4색 띠, 헤어라인 카드, 키워드 칩 fill.
- `/about` (`/?preview=about`) — 시즌 1-Up 풀폭 스트립, 톤 한 시스템 카드, PCCS 자체 그리드.
- `/?preview=results` — Task 1 회귀: 팔레트 타이틀 세리프, 카드 안 콘텐츠 정상.

P2 AI 슬롭 시그널(UI_FEEDBACK §2) 해소 확인:

- ✓ #6 동일 가중치 파스텔 카드 그리드 제거 (About 시즌 1-Up·톤 토큰화, 8타입 시즌 그룹핑)
- ✓ #9 PCCS 외부 차트 이미지 제거 (자체 그리드)

- [ ] **Step 4: 잔여 그라데이션/파스텔 스캔**

Run: `grep -rn "bg-gradient\|bg-amber-50\|bg-sky-50\|bg-rose-50\|bg-stone-50\|bg-yellow-50\|bg-slate-50\|bg-indigo-50\|bg-orange-50\|text-gray-600\|text-gray-800\|bg-slate-100" src/pages/About.tsx src/pages/ColorTypes.tsx`
Expected: 0건. (타입별 컨텐츠 그라데이션은 ColorTypeDetail.tsx에만 잔존 — 의도된 유지, 스캔 대상 아님.)

- [ ] **Step 5: 최종 확인 커밋 (필요 시)**

검증만 한 경우 커밋 없음. 육안 점검 중 미세 수정 발생 시 해당 파일만 커밋:

```bash
git add -A
git commit -m "fix(p2): 육안 점검 잔여 수정"
```

---

## Self-Review

**1. 스펙 커버리지 (UI_FEEDBACK §4 P2 + 잔여 Minor):**

- P2-9 About 시즌 1-Up 풀폭 → Task 3 ✓ (+ 톤 섹션 토큰화로 #6 파스텔 그리드 동반 해소)
- P2-10 8타입 시즌 그룹핑 + 컬러 띠 → Task 2 ✓ (시즌 4그룹 + 시그니처 4색 띠)
- P2-11 PCCS 자체 차트 → Task 4 ✓ (CSS 그리드 컴포넌트)
- P2-12 타이포(세리프 디스플레이) → P0+P1에서 이미 도입(`font-display`), 본 플랜은 잔여 적용처(About 시즌명·톤 제목·타입명·PCCS 약자)에 `font-display` 일관 적용 ✓
- Minor-1/2/3 → Task 1 ✓

**2. 플레이스홀더 스캔:** TBD/추후구현 없음. 모든 코드 단계에 실제 className/JSX/데이터 포함. translations Step 2/3의 `"…"`(기존 값 유지) 표기는 "건드리지 말 것" 지시이며 신규 작성 대상 아님 — 명시적으로 보존 지시함.

**3. 타입/이름 일관성:**

- 토큰 유틸리티(`bg-paper`/`bg-surface`/`bg-fill`/`text-ink`/`text-ink-2`/`text-ink-3`/`border-hairline`/`bg-accent`/`text-accent-fg`/`font-display`) — `bg-fill`은 Task 0에서 정의, Task 1·2·4에서 동일 사용. ✓
- `seasonSlugGroups`(colorTypeMeta, Task 2) ↔ `seasonSections`(About 로컬, Task 3): 둘 다 시즌→타입 매핑이나 **다른 파일·다른 책임**(타입 목록 그룹 vs About 스트립). 의도적 분리, 이름 충돌 없음. ✓
- `t.seasonGroups`(TypesNamespace) 키 = `AboutSeasonSlug`(spring/summer/autumn/winter), Task 2 Step 2(types)·Step 3(translations)·Step 5(사용)에서 동일. ✓
- `AboutPccsCopy` 축 라벨(`axisSaturation`/`axisLightness`/`low`/`high`) — Task 4 Step 1(types)·Step 2(translations)·Step 3(PccsToneMap 사용)에서 동일. ✓
- `PccsToneMap` export 이름 = About import 이름, Task 3 Step 1(import)·Task 4 Step 3(정의)·Step 4(사용) 일치. ✓

**4. 기존 테스트 보호:**

- App.test: ColorTypes/About mock·미렌더 → translations/types 스키마 변경 무관. Results는 mock. ✓
- Results.test: Task 1의 PaletteSection 변경은 prop·타이틀 className뿐, 칩/배지 DOM 텍스트 불변 → green. ✓
- 신규 동작 없음 → 신규 테스트 불필요(TDD 방침 섹션 참조). ✓

**주의 (실행자에게):** 각 Task의 줄 번호는 본 플랜 작성 시점 기준. 앞 Task가 같은 파일을 수정하면 줄 번호가 밀리니 **인용한 코드 블록(old) 문자열 매칭을 우선**하라. 특히 **Task 3 → Task 4는 같은 About.tsx를 연속 수정**하므로 한 흐름으로 적용하고 Task 4 끝에서 통합 검증·커밋한다. Task 2의 types.ts·translations.ts 스키마 변경은 typecheck가 누락을 즉시 잡아주므로 Step 2→3을 연속 적용할 것.
