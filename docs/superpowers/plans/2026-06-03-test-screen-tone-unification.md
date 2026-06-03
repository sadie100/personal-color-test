# 테스트 화면 톤 통일 (에디토리얼 갤러리) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 테스트(스와이프) 화면의 컨트롤·라벨·진행바를 "에디토리얼 갤러리" 디자인 시스템(무채색 솔리드 + 헤어라인 + 세리프)으로 통일하고, 불필요한 LangToggle을 제거한다.

**Architecture:** 풀블리드 컬러 배경 위 컨트롤은 글래스/blur 대신 **불투명 솔리드 표면**으로 바꿔 180색 어디서든 대비를 보장한다. 컬러명 라벨은 칩 hex의 WCAG 대비로 ink/paper를 자동 선택한다. 색 연산은 이미 설치된 `culori`, 아이콘은 이미 쓰는 `lucide-react`를 재사용한다.

**Tech Stack:** React 19 + TypeScript, Tailwind v4(`@theme` 토큰: `paper/surface/accent/fill/ink/ink-2/ink-3/hairline`, `font-display`), Vitest + @testing-library/react(jsdom), culori, lucide-react.

**근거 문서:** [docs/UI_FEEDBACK_TEST.md](../../UI_FEEDBACK_TEST.md) (P0 + P1 범위). P2(카메라 모드·reduced-motion)는 본 플랜 범위 밖, 마지막에 후속으로 명시.

---

## File Structure

| 파일 | 책임 | 작업 |
|---|---|---|
| `src/utils/contrast.ts` | hex → 가독 텍스트색(ink/paper) 순수 함수 | Create |
| `src/utils/contrast.test.ts` | 위 함수 테스트 | Create |
| `src/i18n/translations.ts` | `test.like` / `test.dislike` aria-label 키 추가 (ko/en) | Modify |
| `src/components/SwipeButtons.tsx` | 무채색 위계 버튼 + lucide 아이콘 + aria-label | Modify |
| `src/components/SwipeButtons.test.tsx` | 버튼 라벨/클릭 동작 | Create |
| `src/components/ColorCard.tsx` | 컬러명 라벨 자동 대비 + 세리프 + 모노 hex | Modify |
| `src/components/ColorCard.test.tsx` | 라벨 텍스트색이 대비에 따라 바뀌는지 | Create |
| `src/components/ProgressBar.tsx` | 채움 `bg-accent`, 트랙 `bg-hairline` | Modify |
| `src/pages/ColorTest.tsx` | 카운터/처음으로/조기종료 솔리드화, LangToggle 제거, SwipeButtons에 lang 전달 | Modify |

---

## Task 1: 가독 텍스트색 유틸 (`getReadableInkColor`)

칩 hex에 대해 ink(#14110f)와 paper(#fafaf7) 중 **WCAG 대비가 더 높은 쪽**을 고른다. 매직 임계값 없이 `culori`의 `wcagContrast`로 두 후보를 비교한다.

**Files:**
- Create: `src/utils/contrast.ts`
- Test: `src/utils/contrast.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/utils/contrast.test.ts`:
```ts
import { describe, expect, it } from "vitest";

import { getReadableInkColor } from "./contrast";

const INK = "#14110f";
const PAPER = "#fafaf7";

describe("getReadableInkColor", () => {
  it("밝은 칩에는 잉크(거의 검정) 텍스트를 고른다", () => {
    expect(getReadableInkColor("#FFDACA")).toBe(INK); // 밝은 살구
    expect(getReadableInkColor("#ffffff")).toBe(INK);
  });

  it("어두운 칩에는 페이퍼(오프화이트) 텍스트를 고른다", () => {
    expect(getReadableInkColor("#0F3D2E")).toBe(PAPER); // 딥 그린
    expect(getReadableInkColor("#000000")).toBe(PAPER);
  });

  it("# 없는 입력도 처리한다", () => {
    expect(getReadableInkColor("FFDACA")).toBe(INK);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm run test:run -- src/utils/contrast.test.ts`
Expected: FAIL — `getReadableInkColor` is not defined / Cannot find module './contrast'

- [ ] **Step 3: 최소 구현 작성**

`src/utils/contrast.ts`:
```ts
import { wcagContrast } from "culori";

export const INK = "#14110f";
export const PAPER = "#fafaf7";

/**
 * 칩 배경색 위에서 더 잘 읽히는 텍스트색을 고른다.
 * ink/paper 두 후보 중 WCAG 대비가 높은 쪽을 반환한다.
 */
export const getReadableInkColor = (hex: string): typeof INK | typeof PAPER => {
  const bg = hex.startsWith("#") ? hex : `#${hex}`;
  return wcagContrast(bg, INK) >= wcagContrast(bg, PAPER) ? INK : PAPER;
};
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm run test:run -- src/utils/contrast.test.ts`
Expected: PASS (3 passed)

- [ ] **Step 5: 커밋**

```bash
git add src/utils/contrast.ts src/utils/contrast.test.ts
git commit -m "feat(test-ui): 칩 명도 기반 가독 텍스트색 유틸 추가"
```

---

## Task 2: aria-label용 i18n 키 추가

스와이프 버튼은 아이콘만 있으므로 다국어 aria-label이 필요하다(`aria-labels` 룰). `test` 블록에 `like`/`dislike`를 추가한다.

**Files:**
- Modify: `src/i18n/translations.ts` (ko: `test:` 블록 ~26행, en: `test:` 블록 ~414행)

- [ ] **Step 1: 한국어 키 추가**

ko `test:` 블록에서 `liked: "좋아요",` 줄 바로 아래에 추가:
```ts
    liked: "좋아요",
    like: "좋아요",
    dislike: "싫어요",
```

- [ ] **Step 2: 영어 키 추가**

en `test:` 블록에서 `liked: "Liked",` 줄 바로 아래에 추가:
```ts
    liked: "Liked",
    like: "Like",
    dislike: "Dislike",
```

- [ ] **Step 3: 타입 체크 통과 확인**

Run: `npm run typecheck`
Expected: 에러 없음 (ko/en 두 객체 모양이 동일해야 통과 — 한쪽만 추가하면 실패하므로 양쪽 확인됨)

- [ ] **Step 4: 커밋**

```bash
git add src/i18n/translations.ts
git commit -m "feat(test-ui): 스와이프 버튼 aria-label용 like/dislike 번역 키 추가"
```

---

## Task 3: SwipeButtons 무채색 위계로 재구성

빨강/초록 → 좋아요=검정 솔리드(primary), 싫어요=흰 솔리드+헤어라인(secondary). 아이콘은 lucide `X`/`Heart`, aria-label 추가, 바운스 호버·`shadow-lg` 제거.

**Files:**
- Modify: `src/components/SwipeButtons.tsx`
- Test: `src/components/SwipeButtons.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/components/SwipeButtons.test.tsx`:
```tsx
// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { translations } from "../i18n/translations";
import { SwipeButtons } from "./SwipeButtons";

const ko = translations.ko.test;

describe("SwipeButtons", () => {
  it("좋아요/싫어요 버튼에 다국어 aria-label을 단다", () => {
    render(<SwipeButtons lang="ko" onLike={vi.fn()} onDislike={vi.fn()} />);

    expect(screen.getByRole("button", { name: ko.like })).toBeTruthy();
    expect(screen.getByRole("button", { name: ko.dislike })).toBeTruthy();
  });

  it("클릭 시 해당 핸들러를 호출한다", () => {
    const onLike = vi.fn();
    const onDislike = vi.fn();
    render(<SwipeButtons lang="ko" onLike={onLike} onDislike={onDislike} />);

    fireEvent.click(screen.getByRole("button", { name: ko.like }));
    fireEvent.click(screen.getByRole("button", { name: ko.dislike }));

    expect(onLike).toHaveBeenCalledTimes(1);
    expect(onDislike).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm run test:run -- src/components/SwipeButtons.test.tsx`
Expected: FAIL — `lang` prop 미지원 / aria-label 없어 `getByRole({ name })` 매칭 실패

- [ ] **Step 3: 구현 작성**

`src/components/SwipeButtons.tsx` 전체 교체:
```tsx
import { Heart, X } from "lucide-react";

import { translations } from "../i18n/translations";
import type { Lang } from "../types";

interface SwipeButtonsProps {
  onDislike: () => void;
  onLike: () => void;
  lang: Lang;
}

export const SwipeButtons = ({ onDislike, onLike, lang }: SwipeButtonsProps) => {
  const t = translations[lang].test;

  return (
    <div className="absolute right-0 bottom-8 left-0 flex items-center justify-center gap-5 px-4">
      <button
        onClick={onDislike}
        aria-label={t.dislike}
        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-hairline bg-surface text-ink shadow-sm transition-all hover:bg-fill active:scale-95"
      >
        <X size={26} strokeWidth={2} />
      </button>

      <button
        onClick={onLike}
        aria-label={t.like}
        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-fg shadow-sm transition-all hover:opacity-90 active:scale-95"
      >
        <Heart size={24} fill="currentColor" strokeWidth={0} />
      </button>
    </div>
  );
};
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm run test:run -- src/components/SwipeButtons.test.tsx`
Expected: PASS (2 passed)

- [ ] **Step 5: 커밋**

```bash
git add src/components/SwipeButtons.tsx src/components/SwipeButtons.test.tsx
git commit -m "feat(test-ui): 스와이프 버튼 무채색 위계 + lucide 아이콘 + aria-label"
```

> ⚠️ 이 시점에 `ColorTest.tsx`의 `<SwipeButtons .../>` 호출은 아직 `lang`을 안 넘겨 타입 에러가 난다. Task 6에서 호출부를 고친다. 본 태스크 직후 `npm run typecheck`는 일부러 실패할 수 있음 — Task 6 완료 후 통과시킨다.

---

## Task 4: ColorCard 라벨 — 자동 대비 + 세리프

흰 글씨 하드코딩 제거. Task 1 유틸로 텍스트색을 정하고, 제목은 `font-display`(세리프), hex는 `font-mono`로.

**Files:**
- Modify: `src/components/ColorCard.tsx`
- Test: `src/components/ColorCard.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/components/ColorCard.test.tsx`:
```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { diagnosticChips, getChipName } from "../data/colorData";
import type { DiagnosticChip } from "../types";
import { ColorCard } from "./ColorCard";

// 실제 데이터 칩에서 hex만 덮어써 타입을 만족시킨다(손수 만든 mock은 ColorChip 필드가 깨지기 쉬움)
const chipWithHex = (hex: string): DiagnosticChip => ({ ...diagnosticChips[0]!, hex });
const name = getChipName(diagnosticChips[0]!, "ko");

describe("ColorCard label", () => {
  it("밝은 칩 위에서는 라벨이 잉크색이다", () => {
    render(<ColorCard color={chipWithHex("#FFDACA")} lang="ko" dragX={0} isDragging={false} exitDirection={null} />);
    const label = screen.getByText(name);
    // 라벨 컨테이너(부모)에 color 인라인 스타일 적용
    expect((label.parentElement as HTMLElement).style.color).toBe("rgb(20, 17, 15)"); // #14110f
  });

  it("어두운 칩 위에서는 라벨이 페이퍼색이다", () => {
    render(<ColorCard color={chipWithHex("#0F3D2E")} lang="ko" dragX={0} isDragging={false} exitDirection={null} />);
    const label = screen.getByText(name);
    expect((label.parentElement as HTMLElement).style.color).toBe("rgb(250, 250, 247)"); // #fafaf7
  });
});
```

> `ColorChip`은 `id/name/nameKo/nameEn/hex/oklch/hueCategory`, `DiagnosticChip`은 거기에 `diagnosticPhase/targetTypes`를 더한다([src/types.ts:49-62](../../../src/types.ts#L49-L62)). 그래서 실제 칩 스프레드 + hex 오버라이드가 가장 안전하다. `getChipName`은 `nameKo/nameEn`만 읽는다([colorData.ts:180](../../../src/data/colorData.ts#L180)). 브라우저는 인라인 `color: #14110f`를 `rgb(20, 17, 15)`로 직렬화한다. `diagnosticChips`가 export인지 확인(App.tsx에서 사용 중).

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm run test:run -- src/components/ColorCard.test.tsx`
Expected: FAIL — 현재 라벨은 항상 흰색(`text-white`)이라 `rgb(20, 17, 15)` 기대와 불일치

- [ ] **Step 3: 구현 작성**

`src/components/ColorCard.tsx`의 라벨 블록(현재 39–42행)을 교체. 파일 상단에 import 추가:
```tsx
import { getChipName } from "../data/colorData";
import type { DiagnosticChip, Lang } from "../types";
import { getReadableInkColor } from "../utils/contrast";
```

`return (...)` 내부, `transform` div 안의 라벨을:
```tsx
      <div
        className="absolute bottom-8 left-8"
        style={{ color: getReadableInkColor(color.hex) }}
      >
        <p className="font-display text-3xl leading-tight">{getChipName(color, lang)}</p>
        <p className="mt-1 font-mono text-sm tracking-wide opacity-80">{color.hex}</p>
      </div>
```
(기존 `text-white drop-shadow-lg` / `text-2xl font-bold` / `text-lg`는 제거됨)

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm run test:run -- src/components/ColorCard.test.tsx`
Expected: PASS (2 passed)

- [ ] **Step 5: 커밋**

```bash
git add src/components/ColorCard.tsx src/components/ColorCard.test.tsx
git commit -m "feat(test-ui): 컬러명 라벨 명도 자동 대비 + 세리프/모노 적용"
```

---

## Task 5: ProgressBar 무채색화

흰 채움(밝은 칩에서 안 보임) → `bg-accent`, 트랙 → `bg-hairline`.

**Files:**
- Modify: `src/components/ProgressBar.tsx`

- [ ] **Step 1: 구현 교체**

`src/components/ProgressBar.tsx`의 `return` 내부 두 클래스명을 교체:
```tsx
    <div className="absolute top-0 right-0 left-0 h-1 bg-hairline">
      <div
        className="h-full bg-accent transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
```
(`bg-gray-300/30` → `bg-hairline`, `bg-white` → `bg-accent`)

- [ ] **Step 2: 타입/린트 확인**

Run: `npm run typecheck && npm run lint`
Expected: 에러 없음

> 순수 CSS 토큰 교체라 단위 테스트는 두지 않는다(className 스냅샷은 깨지기 쉬움). 시각 검증은 마지막 통합 검증에서.

- [ ] **Step 3: 커밋**

```bash
git add src/components/ProgressBar.tsx
git commit -m "feat(test-ui): 진행바 채움/트랙을 무채색 토큰으로"
```

---

## Task 6: ColorTest 화면 크롬 솔리드화 + LangToggle 제거

`ActiveColorTest`의 글래스 컨트롤을 솔리드+헤어라인으로 바꾸고, LangToggle과 그에 딸린 `onToggleLang` prop을 제거하고, `SwipeButtons`에 `lang`을 넘긴다.

> LangToggle은 [TestSetup.tsx](../../../src/components/TestSetup.tsx)(모드 선택 화면)에는 그대로 둔다. 여기서 제거하는 건 스와이프 진행 화면(`ActiveColorTest`)뿐이다.

**Files:**
- Modify: `src/pages/ColorTest.tsx`

- [ ] **Step 1: LangToggle 부재 검증 테스트 추가**

`src/components/ColorTest.test.tsx`의 `describe(...)` 안에 테스트 추가:
```tsx
  it("스와이프 화면에는 언어 토글을 노출하지 않는다", () => {
    render(<ColorTest onComplete={vi.fn()} onHome={vi.fn()} lang="ko" onToggleLang={vi.fn()} />);

    // 모드 선택(setup) 화면에는 언어 토글이 있다
    expect(screen.queryByText("한국어")).not.toBeNull();

    // 테스트 시작 → 스와이프 화면 진입
    fireEvent.click(screen.getByRole("button", { name: ko.test.mode.startSelected }));

    // 스와이프 화면에는 언어 토글 라벨이 없어야 한다
    expect(screen.getByText("1 / 39")).toBeTruthy();
    expect(screen.queryByText("한국어")).toBeNull();
  });
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm run test:run -- src/components/ColorTest.test.tsx`
Expected: FAIL — 스와이프 화면에 아직 LangToggle("한국어")이 남아 `queryByText("한국어")`가 null이 아님

- [ ] **Step 3: `ActiveColorTest`에서 LangToggle + onToggleLang 제거**

`src/pages/ColorTest.tsx`:

(a) 상단 import에서 LangToggle 제거:
```tsx
// 삭제: import { LangToggle } from "../components/LangToggle";
```

(b) `ActiveColorTestProps` / 구조분해에서 `onToggleLang` 제거. `ActiveColorTest`는 `ColorTestProps`를 확장하므로, `onToggleLang`을 빼려면 인터페이스를 Omit으로 바꾼다:
```tsx
interface ActiveColorTestProps extends Omit<ColorTestProps, "onToggleLang"> {
  configuration: TestConfiguration;
  onBackToSetup: () => void;
}
```
구조분해에서 `onToggleLang` 제거:
```tsx
const ActiveColorTest = ({
  configuration,
  onComplete,
  onHome,
  lang,
  onBackToSetup,
}: ActiveColorTestProps) => {
```

(c) 우상단 블록(현재 249–257행)을 "처음으로" 단독 솔리드 버튼으로 교체:
```tsx
      <div className="absolute top-4 right-4">
        <button
          onClick={onHome}
          className="cursor-pointer rounded-full border border-hairline bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-all hover:bg-fill active:scale-95"
        >
          {t.test.home}
        </button>
      </div>
```

(d) 좌상단 카운터(현재 240–247행)를 솔리드로 교체:
```tsx
      <div className="absolute top-4 left-4 rounded-xl border border-hairline bg-surface px-4 py-2.5 shadow-sm">
        <p className="text-sm font-semibold text-ink">
          {currentIndex + 1} / {orderedColors.length}
        </p>
        <p className="text-xs text-ink-3">
          {t.test.liked}: {likedChips.length}
        </p>
      </div>
```

(e) 조기종료 버튼(현재 259–272행)을 솔리드+보조 위계로 교체:
```tsx
      {currentIndex >= 10 && (
        <button
          onClick={() =>
            onComplete({
              mode: configuration.mode,
              likedChips,
              dislikedChips,
            })
          }
          className="absolute right-6 bottom-6 cursor-pointer rounded-full border border-hairline bg-surface px-4 py-2.5 text-sm font-medium text-ink-2 shadow-sm transition-all hover:bg-fill active:scale-95"
        >
          {t.test.earlyExit}
        </button>
      )}
```

(f) `SwipeButtons` 호출(현재 238행)에 `lang` 추가:
```tsx
      <SwipeButtons lang={lang} onDislike={() => advance(false)} onLike={() => advance(true)} />
```

- [ ] **Step 4: 부모 `ColorTest`에서 ActiveColorTest로의 onToggleLang 전달 제거**

`ColorTest` 컴포넌트의 `<ActiveColorTest .../>` 렌더(현재 291–299행)에서 `onToggleLang={onToggleLang}` 줄을 제거한다. `ColorTest` 자체는 여전히 `onToggleLang`을 받아 `<TestSetup ... onToggleLang={onToggleLang} />`로 넘기므로 prop 시그니처는 그대로 둔다.

```tsx
  return (
    <ActiveColorTest
      configuration={configuration}
      onComplete={onComplete}
      onHome={onHome}
      lang={lang}
      onBackToSetup={() => setConfiguration(null)}
    />
  );
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npm run test:run -- src/components/ColorTest.test.tsx`
Expected: PASS (기존 + 신규 테스트 모두)

- [ ] **Step 6: 전체 타입/린트 통과 확인 (Task 3의 보류 에러 해소 포함)**

Run: `npm run typecheck && npm run lint`
Expected: 에러 없음 (SwipeButtons `lang` 전달로 Task 3 보류 에러 해소, LangToggle/onToggleLang orphan 없음)

- [ ] **Step 7: 커밋**

```bash
git add src/pages/ColorTest.tsx src/components/ColorTest.test.tsx
git commit -m "feat(test-ui): 스와이프 화면 크롬 솔리드화 + LangToggle 제거"
```

---

## Task 7: 통합 검증 (전체 스위트 + 시각)

**Files:** 없음 (검증만)

- [ ] **Step 1: 전체 테스트 + 빌드**

Run: `npm run test:run && npm run typecheck && npm run lint && npm run build`
Expected: 전부 PASS / 에러 없음

- [ ] **Step 2: 브라우저 시각 검증**

Run: `npm run dev` 후 테스트 시작 → 스와이프 화면 확인. 체크:
- 스와이프 버튼이 검정(♥)/흰(✕) 솔리드인가
- 밝은 칩(예: `#FFDACA`)에서 컬러명이 **검정**으로 읽히는가, 어두운 칩에서 **오프화이트**인가
- 좌상단 카운터·우상단 "처음으로"가 솔리드 흰 알약 + 헤어라인인가
- 우상단에 언어 토글이 **없는가**
- 진행바가 보이는가(밝은 칩에서도)
- index 10 이후 조기종료 버튼이 솔리드인가

> 가능하면 validate-ui 스킬 / Chrome DevTools MCP로 스크린샷 + 콘솔 에러 확인.

- [ ] **Step 3: (검증 통과 시) 최종 상태 확인**

Run: `git status`
Expected: working tree clean (모든 변경 커밋됨)

---

## Self-Review 결과

- **스펙 커버리지** (UI_FEEDBACK_TEST.md P0+P1):
  - P0-1 스와이프 버튼 무채색 → Task 3 ✅
  - P0-2 라벨 자동 대비 + 세리프 → Task 1 + Task 4 ✅
  - P1-3 LangToggle 제거 → Task 6 ✅
  - P1-4 떠있는 컨트롤 솔리드 → Task 6 ✅
  - P1-5 진행바 무채색 → Task 5 ✅
  - P2(카메라/SVG 추가/reduced-motion) → **범위 밖**, 아래 후속 참고.
- **타입 일관성:** `getReadableInkColor`(Task 1) → ColorCard(Task 4)에서 사용, `INK/PAPER` export를 테스트에서 재사용. `SwipeButtonsProps.lang`(Task 3) ↔ 호출부 `lang` 전달(Task 6) 일치. `ActiveColorTestProps`에서 `onToggleLang` 제거(Task 6 b/d)로 orphan 없음.
- **순서 의존성:** Task 3 직후 typecheck는 일부러 실패 가능(호출부 미수정) — Task 6 Step 6에서 해소된다고 명시함.

## 후속 (P2, 본 플랜 범위 밖)

- 카메라 모드([CameraStage.tsx](../../../src/components/CameraStage.tsx)) 오버레이 동일 점검
- 카드 슬라이드 트랜지션의 `prefers-reduced-motion` 처리 확인
</content>
