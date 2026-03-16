# Personal Color Test — Specification

## Overview

Single-page React app that determines a user's personal color type through a color preference quiz. Users are shown full-screen color swatches one at a time and rate each as liked or disliked. After going through the colors (or early after 10+), the app analyzes the liked colors and classifies the user into one of 12 seasonal color types (e.g. "Spring Light", "Winter Bright"), then presents recommended and colors-to-avoid palettes.

The app supports **Korean and English** simultaneously. A language toggle button persists across all screens. The default language is Korean (`'ko'`).

---

## Screens

### Home

**Purpose**
Landing screen. Introduces the test concept and prompts the user to begin.

**UI Elements**
- Language toggle (top-right): `한국어 / EN` — switches the app language globally
- Title: "퍼스널 컬러 테스트" / "Personal Color Test"
- Description: Brief explanation of the 12-season system
- Feature list: bullet points summarizing what the test involves
- Tip: Suggests holding the screen up to the face during testing
- Start button: "컬러 테스트 시작" / "Start Color Test"

**User Actions**
| Action | Trigger | Result |
|--------|---------|--------|
| Start test | Click start button | Transitions to ColorTest screen |
| Toggle language | Click language toggle | Switches all UI text between Korean and English |

**State**
- Manages: nothing (stateless, receives `lang` and `onToggleLang` as props)
- Transitions to: `test` when Start is clicked

---

### ColorTest

**Purpose**
Main quiz screen. Displays colors one at a time for the user to rate.

**UI Elements**
- ColorCard: Full-screen background filled with the current color; shows color name and hex value in the bottom-left
- ProgressBar: Thin bar at the top, fills left-to-right as the user advances
- Counter (top-left): `{currentIndex + 1} / {total}` and liked count label ("좋아요" / "Liked")
- SwipeButtons (bottom-center): Dislike (✕), Like (♥)
- Early exit button: "중간 결과 보기 →" / "See Results →" — appears after 10 colors have been seen
- Home button (top-right): "← 처음으로" / "← Home" — returns to Home screen, resetting progress
- Language toggle: adjacent to the Home button or consistent position with other screens

**User Actions**
| Action | Trigger | Result |
|--------|---------|--------|
| Like | Click ♥ or press → | Adds color to liked list, advances to next |
| Dislike | Click ✕ or press ← | Adds color to disliked list, advances to next |
| Early exit | Click early exit button | Completes test with liked colors so far |
| Go home | Click home button | Resets all progress, transitions to `home` |
| Toggle language | Click language toggle | Switches all UI text between Korean and English |

**State**
- Manages: `currentIndex`, `likedColors[]`, `dislikedColors[]`, `isTransitioning`, `shuffledColors[]`
- Receives: `lang` as prop
- Transitions to: `results` when last color is rated or early exit is triggered

**Behavior**
- All ~180 colors are shuffled randomly on mount (Fisher-Yates via `Array.sort(() => Math.random() - 0.5)`)
- A 300ms transition lock (`isTransitioning`) prevents double-input during card fade animations
- Color card fades out (opacity 0) on advance, then the next card appears
- Loading state shown if shuffled colors aren't ready yet
- Keyboard listeners are added/removed on mount/unmount

---

### Results

**Purpose**
Shows the user's diagnosed personal color type and derived color recommendations.

**UI Elements**
- Language toggle: consistent position with other screens
- Result header: "당신의 퍼스널 컬러" / "Your Personal Color" with the color type string (e.g. "Autumn Muted") with gradient text
- "좋아한 색상" / "Colors You Liked" grid: All liked colors shown as swatches with names
- "추천 색상" / "Recommended Colors" grid: Top 6 colors from the diagnosed type's palette
- "피해야 할 색상" / "Colors to Avoid" grid: Top 6 colors from the opposite type's palette (60% opacity)
- "내 컬러 타입 분석" / "About Your Color Type" panel: Bullet traits based on season and tone keywords
- Action buttons: "다시 시작" / "Try Again" and "결과 공유" / "Share Result"

**User Actions**
| Action | Trigger | Result |
|--------|---------|--------|
| Retry | Click retry button | Resets `likedColors`, transitions to `test` |
| Share | Click share button | Copies result text to clipboard, shows alert |
| Toggle language | Click language toggle | Switches all UI text between Korean and English |

**State**
- Manages: nothing (derived from props)
- Receives: `lang` as prop
- Transitions to: `test` on retry

**Behavior**
- If `likedColors` is empty, analysis returns `null` and an error state is shown with a retry button
  - Korean: "좋아요한 색이 없어서 분석할 수 없어요."
  - English: "No liked colors to analyze."
- The "About Your Color Type" traits panel renders conditionally based on season and tone keywords in the result string
- Share clipboard text is also localized:
  - Korean: `내 퍼스널 컬러는 {type}입니다! 🎨`
  - English: `My Personal Color is {type}! 🎨`

---

## Core Logic

### Personal Color Analysis (`analyzePersonalColor`)

- **Input**: Array of liked color objects (`{ hex, hsl: { h, s, l } }`)
- **Process**:
  1. Calculate average lightness and saturation across all liked colors
  2. Calculate circular mean of hue values (using sin/cos to handle 0°/360° wrap-around)
  3. Determine warm/cool: avg hue in 0–60° or 300–360° → warm; otherwise cool
  4. Determine season: warm + lightness > 65 → Spring; warm + lightness ≤ 65 → Autumn; cool + lightness > 65 → Summer; cool + lightness ≤ 65 → Winter
  5. Determine tone: avg lightness > 75 → Light; avg saturation > 65 → Bright; otherwise → Muted
- **Output**: Season-tone string (e.g. `"Spring Light"`)
- **Edge cases**: Empty array → returns `null`

### Color Recommendations (`getRecommendedColors` / `getAvoidColors`)

- **Input**: Personal color type string, `colorData` map
- **Process (recommended)**: Returns `colorData[type]` — the palette for the diagnosed type
- **Process (avoid)**: Looks up the opposite type via a hardcoded map (e.g. `"Spring Light"` → `"Autumn Muted"`), returns that palette
- **Output**: Array of color objects (up to 15); Results screen slices the first 6
- **Edge cases**: Unknown type → returns `[]`

### Circular Hue Averaging (`calculateAverageHue`)

- **Input**: Array of hue values (0–360)
- **Process**: Converts each hue to unit-circle coordinates (sin/cos), averages the components, then uses `atan2` to recover the angle
- **Output**: Average hue in 0–360°
- **Edge cases**: Empty array → returns `0`

---

## Internationalization (i18n)

All user-facing strings are stored in a centralized translations object at `src/i18n/translations.js`. Keys cover all screens: Home, ColorTest, Results, and season/tone trait descriptions.

### Language Select Component

A small `LangToggle` component (`src/components/LangToggle.jsx`) renders a `<select>` dropdown and is included in all three screens.

```tsx
// props
{ lang: 'ko' | 'en', onToggle: (newLang: 'ko' | 'en') => void }

// renders a <select> with options: "한국어" (ko), "English" (en)
// current lang is pre-selected
```

---

## Data Model

### Color

Represents a single color swatch.

```ts
{
  name: string       // display name (e.g. "Peach Blossom")
  hex:  string       // CSS hex (e.g. "#FFCBA4")
  hsl: {
    h: number        // hue, 0–360
    s: number        // saturation, 0–100
    l: number        // lightness, 0–100
  }
}
```

### Color Data (`colorData`)

~180 colors organized by season-tone key. 12 keys total.

```ts
{
  [seasonTone: string]: Color[]
}
// Keys: "Spring Light" | "Spring Bright" | "Spring Muted"
//     | "Summer Light" | "Summer Bright" | "Summer Muted"
//     | "Autumn Light" | "Autumn Bright" | "Autumn Muted"
//     | "Winter Light" | "Winter Bright" | "Winter Muted"
// Each array contains 15 colors.
```

### App State (in `App.jsx`)

```ts
screen:      'home' | 'test' | 'results'
likedColors: Color[]   // populated when ColorTest completes
lang:        'ko' | 'en'  // default 'ko'; toggled globally
```

### Dev Preview Mode

Appending `?preview=results` to the URL skips to the Results screen immediately, using a hardcoded set of warm-tone liked colors. Useful for iterating on Results UI without running the full test.
