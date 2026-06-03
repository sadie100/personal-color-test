# 에디토리얼 갤러리 리디자인 (P3 폴리시) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [docs/UI_FEEDBACK.md](../../UI_FEEDBACK.md) §4 P3(폴리시) 중 **의존성·아키텍처 추가가 없는** 항목 — `prefers-reduced-motion` 지원(#16) — 과 P2에서 P3로 미룬 LangToggle 토큰화를 구현한다. (#15 결과 공유 OG 이미지는 빌드 파이프라인·신규 의존성이 필요한 별도 서브시스템이므로 [2026-06-03-editorial-redesign-p3-share-og.md](2026-06-03-editorial-redesign-p3-share-og.md)로 분리.)

**Architecture:** 데이터·라우팅·분석·컴포넌트 구조는 손대지 않고 프레젠테이션 레이어(className·CSS)만 바꾼다. P0~P2에서 도입한 `@theme` 토큰(`paper`/`surface`/`hairline`/`ink`/`ink-2`/`ink-3`/`accent`/`accent-fg`/`fill`/`font-display`)을 그대로 쓴다. 신규 토큰·신규 파일·신규 의존성 없음. reduced-motion은 `src/index.css`에 미디어 쿼리 1블록으로 전역 처리한다.

**Tech Stack:** React 19 + TypeScript, Tailwind CSS v4 (`@theme` / `motion-reduce` 변형 가용), Vite, react-router-dom v7, Vitest + Testing Library.

---

## 적용 범위 (확정)

| #     | 항목                                | 결정                                                                                                          | 대상 Task |
| ----- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------- |
| P3-16 | `prefers-reduced-motion` 지원        | `index.css`에 미디어 쿼리 1블록 — `scroll-behavior:auto` + 전역 `transition/animation-duration` 무력화(`!important`) | Task 1    |
| (P2→P3) | LangToggle 토큰화                   | `bg-white`/`text-gray-*`/`bg-purple-50/60 text-purple-600`(잔존 퍼플 액센트) → 한 시스템 토큰                       | Task 2    |

**범위에서 제외 (사용자 결정):**

- **#13 컬러칩 hover/focus 상태 — 제외.** 검토 결과 (a) 컬러칩은 전부 `aria-hidden` 장식이라 상태가 불필요하고, (b) 전역으로 외곽선을 죽이는 코드가 없어(App.css의 `.counter` 규칙은 미import 템플릿 잔재) **모든 버튼/링크는 브라우저 기본 포커스 외곽선이 이미 표시된다.** 즉 접근성상 "포커스 안 보임" 결함이 아니다. 커스텀 링 ↔ 브라우저 기본의 *생김새 불일치*는 선택적 미관 폴리시이며 사용자 결정으로 뺀다.
- **#14 모바일 본문 좌측 정렬 — 제외.** P0/P1에서 본문 문단은 이미 전부 좌측 정렬됐고(Home `text-left` 21줄, About 섹션 `text-left` 등), 잔여는 AttributionNote 푸터 저작권 한 줄뿐이라 사용자 결정으로 뺀다. (참고: AttributionNote 라이트 변형의 `text-slate-400`는 비토큰 색으로 남지만 본 플랜 범위 밖.)
- **#15 OG 이미지 — 별도 플랜**(share-og).

---

## TDD 적용 방침

P3 폴리시는 신규 동작(state/분기/이벤트)이 없는 **순수 시각(CSS/className) 변경**이다. red-green TDD는 부적합하다(사용자 CLAUDE.md §4 "trivial → 판단", P0~P2 플랜과 동일 방침).

- **검증 = `npm run typecheck` + `npm run lint`(0 에러·미사용 0) + `npm run test:run`(기존 테스트 green 유지) + `npm run build` + dev 서버 육안.**
- 신규 테스트 파일은 만들지 않는다.

**불변 제약 — 기존 테스트를 깨지 말 것:**

- [src/App.test.tsx](../../../src/App.test.tsx)는 Home/About/ColorTest/Results/Header를 **mock 처리**한다 → 이 플랜의 변경은 App.test에 무관.
- [src/components/Results.test.tsx](../../../src/components/Results.test.tsx) / [TestSetup.test.tsx](../../../src/components/TestSetup.test.tsx) / [ColorTest.test.tsx](../../../src/components/ColorTest.test.tsx)는 DOM 텍스트·role·배지를 단언한다. **className/CSS 변경은 DOM 텍스트·role·구조를 바꾸지 않으므로** 전부 green 유지.

---

## File Structure

**수정만 (생성/삭제 없음):**

- `src/index.css` — reduced-motion 미디어 쿼리 1블록 추가 (Task 1)
- `src/components/LangToggle.tsx` — 비토큰 색(`bg-white`/`text-gray-*`/퍼플) → 토큰 (Task 2)

**손대지 않음:** `src/data/**`, `src/utils/**`, `src/types.ts`, `src/i18n/**`, `src/App.tsx`, `src/hooks/**`, `ColorCard.tsx`/`ShirtSwatch.tsx`(인라인 transition은 Task 1 CSS가 전역으로 무력화하므로 컴포넌트 편집 불필요), 그 외 버튼/링크의 focus(브라우저 기본 유지 — #13 제외), AttributionNote(#14 제외).

---

## Task 1: `prefers-reduced-motion` 전역 지원 (P3-16)

**Files:**

- Modify: `src/index.css`

전역 미디어 쿼리 1블록으로 모든 모션을 무력화한다. CSS `!important`는 인라인 `style={{ transition }}`(ColorCard/ShirtSwatch 스와이프 카드)보다 우선하므로, 컴포넌트를 건드리지 않고 인라인 트랜지션까지 함께 잡힌다. Tailwind `transition-*`/`duration-*`/`animate-*`, `scroll-behavior: smooth`(현행 index.css 20줄)도 모두 포함된다.

- [ ] **Step 1: index.css 끝에 reduced-motion 블록 추가**

[src/index.css](../../../src/index.css) 맨 아래(`#root { ... }` 블록 다음)에 추가:

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

> 효과: 스와이프 카드(ColorCard/ShirtSwatch)의 300ms transform 트랜지션, ProgressBar width 트랜지션, LangToggle/Results 셰브론 회전, 모든 hover/active 트랜지션, `html` 부드러운 스크롤이 reduce 환경에서 즉시(0.01ms) 처리된다. transform/scale 자체(상태)는 유지되나 애니메이션 시간만 제거 — WCAG `prefers-reduced-motion` 권고에 부합.

- [ ] **Step 2: 검증**

Run: `npm run typecheck && npm run lint`
Expected: 0 에러(CSS 추가는 타입/린트 무관).

dev 서버에서 OS의 "동작 줄이기"를 켜거나 DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce"로 토글 후 `/test` 진입 → 카드 스와이프가 애니메이션 없이 즉시 전환되는지 육안 확인.

- [ ] **Step 3: 커밋**

```bash
git add src/index.css
git commit -m "a11y(p3): prefers-reduced-motion 전역 지원 (#16)"
```

---

## Task 2: LangToggle 토큰화 (P2→P3 잔여)

**Files:**

- Modify: `src/components/LangToggle.tsx`

LangToggle은 P0~P2 토큰화에서 빠진 마지막 비토큰 컴포넌트다. `bg-white/90`/`text-gray-800`/`text-gray-500`/`border-gray-100`/`hover:bg-gray-50`/`text-gray-700`와 **잔존 퍼플 액센트** `bg-purple-50/60 text-purple-600`(AI 슬롭 시그널 #10 계열)를 한 시스템 토큰으로 바꾼다. (포커스는 브라우저 기본 유지 — #13 제외 방침에 맞춰 focus 링은 추가하지 않는다.)

- [ ] **Step 1: 토글 버튼 토큰화**

[src/components/LangToggle.tsx](../../../src/components/LangToggle.tsx) 39줄을 교체. `border-white/50 bg-white/90 text-gray-800 ... backdrop-blur-sm`(그라데이션 시대 잔재 — 헤더가 솔리드 paper이므로 블러/반투명 불필요) → 솔리드 surface + hairline:
```tsx
        className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface py-2.5 pr-3 pl-4 text-sm font-semibold text-ink shadow-sm transition-all hover:bg-fill active:scale-95"
```

- [ ] **Step 2: 지구본 아이콘 색 토큰화**

42줄:
```tsx
          className="h-4 w-4 shrink-0 text-ink-3"
```

- [ ] **Step 3: 셰브론 아이콘 색 토큰화**

68줄(`text-gray-500`→`text-ink-3`, 나머지 유지):
```tsx
          className={`h-3.5 w-3.5 text-ink-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
```

- [ ] **Step 4: 드롭다운 메뉴 컨테이너 토큰화**

78줄(`border-gray-100 bg-white`→토큰):
```tsx
        <div className="absolute right-0 z-50 mt-1.5 min-w-full overflow-hidden rounded-xl border border-hairline bg-surface shadow-xl">
```

- [ ] **Step 5: 메뉴 옵션 토큰화 — 퍼플 액센트 제거**

86줄(템플릿 리터럴). `hover:bg-gray-50` → `hover:bg-fill`, 선택 상태 `bg-purple-50/60 text-purple-600` → `bg-fill text-ink`(한 시스템 강조), 비선택 `text-gray-700` → `text-ink-2`:
```tsx
              className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-fill ${lang === option.value ? "bg-fill text-ink" : "text-ink-2"}`}
```

- [ ] **Step 6: 검증 — 비토큰 색 0 확인**

Run: `grep -rn "gray-\|purple-\|bg-white\|border-white" src/components/LangToggle.tsx`
Expected: 0건.

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 전체 통과(App.test는 Header를 mock하므로 무관, LangToggle 전용 테스트 없음).

`npm run dev` → 헤더 언어 토글 열기/선택. 솔리드 흰 드롭다운, 선택 항목이 퍼플이 아닌 fill+ink 확인.

- [ ] **Step 7: 커밋**

```bash
git add src/components/LangToggle.tsx
git commit -m "polish(p3): LangToggle 토큰화 — 잔존 퍼플/그레이 제거"
```

---

## Task 3: 회귀 검증 + 최종 육안 점검

**Files:** 없음 (검증 전용)

- [ ] **Step 1: 전체 자동 검증**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 타입 0 에러, lint 0 에러·미사용 0, 모든 테스트 PASS(기존 카운트 유지 — 신규 테스트 없음).

- [ ] **Step 2: 프로덕션 빌드**

Run: `npm run build`
Expected: 빌드 성공.

- [ ] **Step 3: reduced-motion 동작 확인**

`npm run dev` + DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" 활성화:
- `/test` 스와이프 카드가 애니메이션 없이 즉시 전환.
- 페이지 이동 시 부드러운 스크롤 대신 즉시 스크롤.
- 토글 안 한 상태(기본)에서는 기존 애니메이션 정상 동작.

- [ ] **Step 4: 잔여 퍼플 스캔(회귀 확인)**

Run: `grep -rn "bg-purple\|text-purple" src/components/LangToggle.tsx`
Expected: 0건.

- [ ] **Step 5: 최종 확인 커밋 (필요 시)**

검증만 한 경우 커밋 없음. 육안 점검 중 미세 수정 발생 시 해당 파일만 커밋:

```bash
git add -A
git commit -m "fix(p3-polish): 육안 점검 잔여 수정"
```

---

## Self-Review

**1. 스펙 커버리지 (UI_FEEDBACK §4 P3 폴리시 중 본 플랜 범위):**

- #16 `prefers-reduced-motion` → Task 1 ✓ (전역 CSS 1블록, 인라인 transition 포함 무력화)
- LangToggle 토큰화(P2가 P3로 미룸) → Task 2 ✓
- #13 컬러칩 hover/focus → **제외**(브라우저 기본 포커스가 이미 동작, 접근성 결함 아님 — 사용자 결정).
- #14 모바일 본문 좌측 정렬 → **제외**(본문은 P0/P1에서 완료, 잔여 푸터 1줄뿐 — 사용자 결정).
- #15 OG 이미지 → **본 플랜 범위 밖**(share-og 플랜으로 분리) — Goal에 명시.

**2. 플레이스홀더 스캔:** TBD/추후구현 없음. 모든 편집 단계에 교체 후 전체 className 문자열 포함. 줄 번호는 작성 시점 기준이며 각 단계가 "현재 문자열 매칭" 지시.

**3. 타입/이름 일관성:**

- 토큰 유틸리티(`bg-surface`/`bg-fill`/`text-ink`/`text-ink-2`/`text-ink-3`/`border-hairline`)는 P0~P2에서 정의된 `@theme` 토큰에서 자동 생성 — 신규 토큰 없음. ✓
- reduced-motion 블록은 셀렉터·속성만 추가하는 전역 CSS — 컴포넌트 식별자 의존 없음. ✓

**4. 기존 테스트 보호:**

- App.test: Header/Home/About/Results/ColorTest mock → 무관. ✓
- Results/TestSetup/ColorTest.test: CSS/className 변경만, DOM 텍스트·role·구조 불변 → green. ✓
- 신규 동작 없음 → 신규 테스트 불필요(TDD 방침 절). ✓

**주의 (실행자에게):** 줄 번호는 작성 시점 기준. 템플릿 리터럴 className(LangToggle 셰브론·메뉴 옵션)은 **백틱 내부 정적 부분만** 교체하고 `${...}` 동적 분기는 보존한다(각 Step에 위치 명시). Task 1↔2는 독립적이라 재배열 가능하나, Task 3(회귀)은 마지막에 둘 것.
