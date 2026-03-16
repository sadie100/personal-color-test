# Personal Color Test — Specification

## Overview

Single-page React app that determines a user's personal color type through a color preference quiz. Users are shown full-screen color swatches one at a time and rate each as liked, disliked, or skipped. After going through the colors (or early after 10+), the app analyzes the liked colors and classifies the user into one of 12 seasonal color types (e.g. "Spring Light", "Winter Bright"), then presents recommended and colors-to-avoid palettes.

---

## Screens

### Home

**Purpose**
Landing screen. Introduces the test concept and prompts the user to begin.

**UI Elements**
- Title: "Personal Color Test"
- Description: Brief explanation of the 12-season system
- Feature list: bullet points summarizing what the test involves
- Tip: Suggests holding the screen up to the face during testing
- Start button: Begins the test

**User Actions**
| Action | Trigger | Result |
|--------|---------|--------|
| Start test | Click "Start Color Test" | Transitions to ColorTest screen |

**State**
- Manages: nothing (stateless)
- Transitions to: `test` when Start is clicked

---

### ColorTest

**Purpose**
Main quiz screen. Displays colors one at a time for the user to rate.

**UI Elements**
- ColorCard: Full-screen background filled with the current color; shows color name and hex value in the bottom-left
- ProgressBar: Thin bar at the top, fills left-to-right as the user advances
- Counter (top-left): `{currentIndex + 1} / {total}` and liked count
- SwipeButtons (bottom-center): Dislike (✕), Like (♥)
- Early exit button: "중간 결과 보기 →" — appears after 10 colors have been seen
- Home button (top-right): "← 처음으로" — returns to Home screen, resetting progress

**User Actions**
| Action | Trigger | Result |
|--------|---------|--------|
| Like | Click ♥ or press → | Adds color to liked list, advances to next |
| Dislike | Click ✕ or press ← | Adds color to disliked list, advances to next |
| Early exit | Click "중간 결과 보기 →" | Completes test with liked colors so far |
| Go home | Click "← 처음으로" | Resets all progress, transitions to `home` |

**State**
- Manages: `currentIndex`, `likedColors[]`, `dislikedColors[]`, `isTransitioning`, `shuffledColors[]`
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
- Result header: Displays the color type string (e.g. "Autumn Muted") with gradient text
- "Colors You Liked" grid: All liked colors shown as swatches with names
- "Recommended Colors" grid: Top 6 colors from the diagnosed type's palette
- "Colors to Avoid" grid: Top 6 colors from the opposite type's palette (60% opacity)
- "About Your Color Type" panel: Bullet traits based on season and tone keywords
- Action buttons: "Try Again" and "Share Result"

**User Actions**
| Action | Trigger | Result |
|--------|---------|--------|
| Retry | Click "Try Again" | Resets `likedColors`, transitions to `test` |
| Share | Click "Share Result" | Copies "My Personal Color is {type}! 🎨" to clipboard, shows alert |

**State**
- Manages: nothing (derived from props)
- Transitions to: `test` on retry

**Behavior**
- If `likedColors` is empty (no likes during the test), analysis returns `null` and an error state is shown: "좋아요한 색이 없어서 분석할 수 없어요." with a retry button
- The "About Your Color Type" traits panel renders conditionally based on season and tone keywords in the result string

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
```

### Dev Preview Mode

Appending `?preview=results` to the URL skips to the Results screen immediately, using a hardcoded set of warm-tone liked colors. Useful for iterating on Results UI without running the full test.
