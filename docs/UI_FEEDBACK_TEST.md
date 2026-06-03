# UI 디자인 피드백 — 테스트 화면 톤 통일 가이드

> 작성일: 2026-06-03
> 검토 대상: 테스트(스와이프) 화면 — `displayMode === "chip"` 풀블리드 컬러 모드
> 기준 디자인 시스템: "에디토리얼 갤러리" ([src/index.css](../src/index.css) 토큰), 홈/About/결과는 이미 이행 완료
> 평가 기준: WCAG AA, ui-ux-pro-max 룰셋(`color-contrast`, `color-only`, `effects-match-style`, `blur-purpose`, `primary-action`)

---

## TL;DR — 테스트 화면만 옛 톤에 남아있다

홈·About·결과는 오프화이트 종이 배경 + 세리프 + 무채색 컨트롤 + 검정 솔리드 CTA로 이미 넘어갔다. 그런데 테스트 화면([src/pages/ColorTest.tsx](../src/pages/ColorTest.tsx))은 리디자인을 하나도 안 받았다. 깨지는 건 **배경(풀블리드 컬러)이 아니라 그 위에 얹힌 컨트롤/크롬 전부**다.

1. **틴더식 형광 빨강/초록 스와이프 버튼** — 전 화면이 무채색인데 여기만 채도 만렙. 가장 큰 이질감.
2. **글래스모피즘 알약** — 좌상단 카운터(`bg-black/25 backdrop-blur`), 우상단 "처음으로"(`bg-white/90 backdrop-blur`), 조기종료 버튼까지 전부 반투명+blur. 새 시스템은 솔리드 surface + 헤어라인.
3. **컬러명 라벨이 무조건 흰 글씨** — 밝은 칩(`#FFDACA` 등) 위에서 안 읽힘. `color-contrast` 4.5:1 위반.
4. **산세리프 bold 라벨** — 다른 화면 제목은 세리프 디스플레이. 컬러명에 에디토리얼 톤 0.
5. **바운스 호버(`hover:scale-105/110`) + `shadow-lg`** — 새 시스템은 차분한 평면 + `active:scale-95`만.

**핵심 처방**: 컨트롤을 전부 **불투명 솔리드 + 헤어라인**으로 바꾸고(글래스 금지), 빨강/초록을 **무채색 위계(검정 솔리드 = 좋아요 / 흰 솔리드 = 싫어요)**로 치환하고, 컬러명을 **칩 명도 기반 자동 대비 + 세리프**로 만든다.

---

## 1. 진단 — 요소별

| 요소 | 위치 | 지금 | 문제 | 위반 룰 |
|---|---|---|---|---|
| 스와이프 버튼 | [SwipeButtons.tsx:11,19](../src/components/SwipeButtons.tsx#L11) | `bg-red-500` ✕ / `bg-green-500` ♥, `hover:scale-110` | 소개팅 앱 시그니처. 무채색 시스템에 채도 충돌. 색만으로 의미 전달 | `color-only`, `effects-match-style`, `consistency` |
| 좌상단 카운터 | [ColorTest.tsx:240](../src/pages/ColorTest.tsx#L240) | `bg-black/25 backdrop-blur` 글래스, 흰 글씨 | 장식용 blur. 새 시스템 표면 규칙(솔리드+헤어라인) 위반 | `blur-purpose`, `effects-match-style` |
| "처음으로" 버튼 | [ColorTest.tsx:252](../src/pages/ColorTest.tsx#L252) | `bg-white/90 backdrop-blur` 반투명 알약 + `hover:scale-105` | 장식용 blur + 바운스 호버. 솔리드 표면 규칙 위반 | `effects-match-style`, `state-clarity` |
| LangToggle | [ColorTest.tsx:256](../src/pages/ColorTest.tsx#L256) | 우상단에 floating | **불필요 — 제거.** 언어는 진입 전 결정, 테스트는 몰입 플로우. 전역 Header도 test에선 일부러 빠지는데 이것만 잔존 | `content-priority`, `consistency` |
| 컬러명 라벨 | [ColorCard.tsx:39](../src/components/ColorCard.tsx#L39) | 무조건 흰 글씨 + `drop-shadow-lg` | 밝은 칩에서 대비 미달. 180색 중 절반 이상이 밝은 파스텔 | `color-contrast`, `color-accessible-pairs` |
| 라벨 타이포 | [ColorCard.tsx:40](../src/components/ColorCard.tsx#L40) | 기본 산세리프 `font-bold` | 다른 화면 제목은 `font-display` 세리프 | `consistency`, `font-pairing` |
| 진행바 | [ProgressBar.tsx:13](../src/components/ProgressBar.tsx#L13) | `bg-white` 채움 / `bg-gray-300/30` 트랙 | 밝은 칩 위에서 흰 채움이 안 보임 | `contrast-readability` |
| 조기종료 버튼 | [ColorTest.tsx:268](../src/pages/ColorTest.tsx#L268) | `bg-white/90 backdrop-blur` 알약 | 위와 동일 글래스 패턴 | `effects-match-style` |

---

## 2. 핵심 설계 판단 — "글래스" 대신 "불투명 솔리드"

테스트 화면이 글래스/blur를 쓴 이유는 분명하다: **배경이 180가지 색으로 매 카드 바뀌니까**, 반투명으로 깔면 어떤 색 위에서든 대충 읽힌다. 적응형 트릭이다.

문제는 이 트릭이 에디토리얼 톤(평면·헤어라인·무채색)과 정면으로 충돌한다는 것. 해법은 적응형을 포기하는 게 아니라 **더 단단한 적응형**으로 바꾸는 것이다:

> **불투명(opaque) 솔리드 표면은 그 자체가 어떤 배경색 위에서도 100% 읽힌다.**
> 흰색(`bg-surface`) 알약, 검정(`bg-accent`) 알약은 칩 색과 무관하게 항상 대비가 확보된다.
> blur는 `blur-purpose` 룰상 "배경 dismiss(모달/시트)" 신호일 때만 쓴다 — 여기선 장식이므로 제거.

즉 **솔리드가 글래스보다 톤도 맞고 가독성도 우월하다.** 단 하나 어려운 건 "컬러명 라벨"처럼 배경에 직접 얹히는 텍스트인데, 이건 명도 자동 대비로 푼다(§3.3).

---

## 3. 처방 — 컴포넌트별

토큰은 전부 [src/index.css](../src/index.css)에 이미 있다. 새 색 추가 없이 기존 토큰만 쓴다.

```
bg-paper #fafaf7 · bg-surface #fff · bg-accent #1f1b16 · bg-fill #f0eee8
text-ink #14110f · text-ink-2 #555049 · text-ink-3 #8a857c · text-accent-fg #fafaf7
border-hairline #e6e4de · font-display "Instrument Serif"/"Noto Serif KR"
```

### 3.1 스와이프 버튼 — 무채색 위계로

빨강/초록을 버린다. 의미는 **아이콘(✕/♥) + 좌우 위치**가 이미 전달하므로(`color-only` 룰: 색에만 의존 금지) 채도는 불필요하다. 대신 **좋아요 = 검정 솔리드(primary), 싫어요 = 흰 솔리드 + 헤어라인(secondary)** 으로 위계를 준다(`primary-action`: 화면당 주 액션 1개).

| | 지금 | 바뀔 모습 |
|---|---|---|
| 싫어요 | `bg-red-500` 흰 ✕ | `bg-surface border-hairline` + `text-ink` ✕ |
| 좋아요 | `bg-green-500` 흰 ♥ | `bg-accent` + `text-accent-fg` ♥ (primary) |
| 호버 | `hover:scale-110` + `hover:bg-*-600` | `hover:bg-fill`(싫어요) / `hover:opacity-90`(좋아요), `active:scale-95` |
| 그림자 | `shadow-lg` | `shadow-sm` (홈 칩과 동일 수준) |
| a11y | `title`만 | `aria-label` 추가 |

```tsx
// SwipeButtons.tsx — 제안
export const SwipeButtons = ({ onDislike, onLike, lang }: SwipeButtonsProps) => {
  const t = translations[lang].test;
  return (
    <div className="absolute right-0 bottom-8 left-0 flex items-center justify-center gap-5 px-4">
      <button
        onClick={onDislike}
        aria-label={t.dislike}
        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-hairline bg-surface text-ink shadow-sm transition-all hover:bg-fill active:scale-95"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <button
        onClick={onLike}
        aria-label={t.like}
        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-fg shadow-sm transition-all hover:opacity-90 active:scale-95"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21s-7.5-4.9-10-9.3C.4 8.4 2 5 5.3 5c2 0 3.3 1.2 3.7 2 .4-.8 1.7-2 3.7-2C16 5 17.6 8.4 16 11.7 19.5 16.1 12 21 12 21z" />
        </svg>
      </button>
    </div>
  );
};
```

> 이모지/유니코드 글리프(`✕`/`♥`) 대신 SVG 권장(`no-emoji-icons`): 플랫폼별 렌더 편차 제거 + 두께·크기 토큰화. Heroicons/Lucide 사용 중이면 거기서 가져온다.
>
> ⚠️ `t.test.like` / `t.test.dislike` 키는 [translations.ts](../src/i18n/translations.ts)에 아직 없다(현재 `liked`/`home`/`earlyExit`만 존재). aria-label은 다국어여야 하므로 ko/en 양쪽에 `like: "좋아요"/"Like"`, `dislike: "싫어요"/"Dislike"` 두 키를 추가해야 한다.

### 3.2 떠있는 컨트롤 (카운터 / 처음으로 / 조기종료) — 솔리드+헤어라인

**먼저 LangToggle을 제거한다.** 언어는 진입 전(홈/About)에 결정되고, 테스트는 짧고 몰입적인 플로우다. 전역 Header도 `test` 화면에선 일부러 빠지는데(CLAUDE.md) LangToggle만 floating으로 잔존한 것이라 설계 의도와 모순된다. 제거해도 선택 언어는 App 레벨 상태로 유지되며, 전환이 필요하면 "처음으로"로 나가면 된다. 우상단은 **"처음으로" 단 하나**로 정리한다.

남은 컨트롤은 LangToggle이 다른 화면에서 쓰는 표면 규칙([LangToggle.tsx:39](../src/components/LangToggle.tsx#L39): `border-hairline bg-surface text-ink shadow-sm`)을 그대로 따라 통일한다.

**좌상단 카운터** — 글래스 → 솔리드:
```tsx
<div className="absolute top-4 left-4 rounded-xl border border-hairline bg-surface px-4 py-2.5 shadow-sm">
  <p className="text-sm font-semibold text-ink">{currentIndex + 1} / {orderedColors.length}</p>
  <p className="text-xs text-ink-3">{t.test.liked}: {likedChips.length}</p>
</div>
```

**"처음으로" 버튼** — 우상단 단독. LangToggle 트리거와 동일 클래스:
```tsx
<button
  onClick={onHome}
  className="cursor-pointer rounded-full border border-hairline bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-all hover:bg-fill active:scale-95"
>
  {t.test.home}
</button>
```

**조기종료 버튼**(index ≥ 10) — 주 액션이 아니므로 보조 위계로. 솔리드 알약이되 텍스트 강조는 약하게(`text-ink-2`), 또는 밑줄 텍스트 링크로:
```tsx
<button
  onClick={...}
  className="absolute right-6 bottom-6 cursor-pointer rounded-full border border-hairline bg-surface px-4 py-2.5 text-sm font-medium text-ink-2 shadow-sm transition-all hover:bg-fill active:scale-95"
>
  {t.test.earlyExit}
</button>
```

### 3.3 컬러명 라벨 — 명도 자동 대비 + 세리프

흰 글씨 하드코딩을 버리고 **칩 hex의 상대 명도로 ink(검정)/paper(흰색)를 자동 선택**한다(`color-contrast`/`color-accessible-pairs`). `drop-shadow`는 명도 대비가 본문제를 해결하므로 제거하되, 중간 명도 칩 안전판으로 약한 텍스트 섀도 하나만 옵션으로 남길 수 있다.

```ts
// utils/contrast.ts — WCAG 상대 명도 기반
export const getReadableInkColor = (hex: string): "#14110f" | "#fafaf7" => {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.55 ? "#14110f" : "#fafaf7"; // 밝은 칩 → 잉크, 어두운 칩 → 페이퍼
};
```

```tsx
// ColorCard.tsx — 라벨 부분
const textColor = getReadableInkColor(color.hex);
...
<div className="absolute bottom-8 left-8" style={{ color: textColor }}>
  <p className="font-display text-3xl leading-tight">{getChipName(color, lang)}</p>
  <p className="mt-1 font-mono text-sm tracking-wide opacity-80">{color.hex}</p>
</div>
```

- 제목: `font-display`(세리프)로 다른 화면과 통일.
- hex 코드: 숫자이므로 `font-mono` tabular 권장(`number-tabular`).
- 임계값 0.55는 시작점 — 실제 180색으로 한 번 훑어 경계 칩 몇 개 눈으로 확인 권장.

### 3.4 진행바 — 잉크 채움

밝은 칩에서 흰 채움이 사라지는 문제. 채움을 `bg-accent`(검정)로, 트랙을 헤어라인으로:
```tsx
<div className="absolute top-0 right-0 left-0 h-1 bg-hairline">
  <div className="h-full bg-accent transition-all duration-300" style={{ width: `${percentage}%` }} />
</div>
```
> 다만 어두운 칩(`#14110f`류) 위에선 검정 진행바가 묻힌다. 진행바를 헤어라인 트랙 위 검정 채움으로 두면 트랙(밝은 회색)이 위치를 잡아주므로 대부분 OK. 완벽히 하려면 카운터처럼 명도 자동 대비를 줄 수도 있으나, 1px 요소라 과설계 위험 — 우선 솔리드로 통일하고 실측 후 판단.

### 3.5 카메라 모드

[CameraStage.tsx](../src/components/CameraStage.tsx)의 오버레이 컨트롤도 같은 원칙으로 점검(이번 캡처는 chip 모드였음). 동일하게 글래스 알약 → 솔리드, 빨강/초록 → 무채색.

---

## 4. 우선순위 액션

### 🔴 P0 — 이질감의 핵심 (반나절)
1. **스와이프 버튼 빨강/초록 → 무채색 위계**(검정/흰 솔리드). `aria-label` 추가. (§3.1)
2. **컬러명 라벨 흰글씨 → 명도 자동 대비 + `font-display`.** (§3.3)

### 🟠 P1 — 톤 통일 (반나절)
3. **LangToggle 제거** → 우상단은 "처음으로" 하나로. (§3.2)
4. **떠있는 컨트롤 글래스 → 솔리드+헤어라인** (카운터/처음으로/조기종료). `backdrop-blur`·`hover:scale-*`·`shadow-lg` 제거. (§3.2)
5. **진행바 채움 → `bg-accent`, 트랙 → `bg-hairline`.** (§3.4)

### 🟡 P2 — 마감 (옵션)
6. 카메라 모드 오버레이 동일 점검. (§3.5)
7. ✕/♥ 유니코드 → SVG 아이콘 세트로 교체.
8. `prefers-reduced-motion`에서 카드 슬라이드 트랜지션 축소(이미 전역 처리되어 있는지 확인).

---

## 5. 비포 / 애프터 한 줄

| | Before | After |
|---|---|---|
| 버튼 | 형광 빨강·초록 (소개팅 앱) | 검정·흰 무채색 위계 |
| 크롬 | 반투명 글래스 알약 + 바운스 | 솔리드 surface + 헤어라인 |
| 컬러명 | 무조건 흰글씨 (밝은 칩 안 읽힘) | 명도 자동 대비 + 세리프 |
| 인상 | 테스트만 따로 노는 옛 톤 | 홈/결과와 한 시스템 |

---

## 6. 참고 — 룰 매핑 (ui-ux-pro-max)

- `color-contrast`, `color-accessible-pairs` — 흰글씨 라벨 / 흰 진행바 (4.5:1 미달)
- `color-only` — 빨강/초록만으로 좋아요·싫어요 의미 전달
- `effects-match-style`, `blur-purpose` — 장식용 glass/blur (배경 dismiss 신호 아님)
- `primary-action` — 좋아요·싫어요 동일 가중 → 검정 솔리드로 주 액션 1개화
- `consistency` — 테스트 화면만 별도 디자인 시스템
- `no-emoji-icons`, `number-tabular` — SVG 아이콘 / hex 모노 숫자

— 끝.
</content>
</invoke>
