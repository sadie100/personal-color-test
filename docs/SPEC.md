# Personal Color Test — Specification

## Overview

Personal Color Test is a single-page React + TypeScript application that helps users discover a likely personal color type through a like/dislike color test.

The app presents one full-screen color at a time, records liked and disliked selections, and maps those selections to one of 12 `SeasonTone` categories:

- `Spring Light`
- `Spring Bright`
- `Spring Muted`
- `Summer Light`
- `Summer Bright`
- `Summer Muted`
- `Autumn Light`
- `Autumn Bright`
- `Autumn Muted`
- `Winter Light`
- `Winter Bright`
- `Winter Muted`

The current implementation is state-driven rather than route-driven. Screen transitions are controlled by a `screen` state in `src/App.tsx`.

The app supports Korean and English. Language state is global, defaults to `ko`, and is shared across all screens.

---

## Architecture

### Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Vitest (used for utility tests)

### Navigation Model

There is no routing library. The application uses a `Screen` union type:

```ts
type Screen = "home" | "test" | "results" | "about";
```

Navigation is handled by the root `App` component:

- `home` -> landing page
- `about` -> educational page about personal color
- `test` -> full-screen color preference test
- `results` -> ranked results and palette comparison

### Global Header

The `Header` component is shown on all screens except `test`.

Desktop header includes:

- brand button that navigates to `home`
- `about` navigation button
- `test` CTA button
- language dropdown

Mobile header includes:

- brand button
- language dropdown
- hamburger menu for `about` and `test`

---

## Screens

### Home

**Purpose**

Introduces the product and lets the user either start the test immediately or read the educational content first.

**UI Elements**

- hero quote and supporting introduction copy
- short subtitle
- four-item feature list
- usage tip
- primary CTA to start the test
- secondary text link to the About screen

**User Actions**

| Action | Trigger | Result |
|--------|---------|--------|
| Start test | Click primary CTA | Transitions to `test` |
| Learn more | Click secondary link | Transitions to `about` |
| Toggle language | Use header dropdown | Switches all UI text |

**State**

- Stateless component
- Receives `lang`, `onStart`, and `onAbout`

---

### About

**Purpose**

Explains what personal color means, introduces the PCCS tone system, summarizes the 4-season model and 3 tone categories, and encourages the user to start the test.

**UI Elements**

- hero section
- explanation of personal color analysis
- PCCS tone map image
- four season cards with sample swatches
- three tone cards with sample swatches
- three-step explanation of how the test works
- CTA button to start the test

**Behavior**

- seasonal preview swatches are pulled from `colorData` using representative `SeasonTone` keys
- tone preview swatches are also pulled from `colorData`
- all descriptive copy is localized through `translations`

---

### ColorTest

**Purpose**

Runs the main preference test by showing one color card at a time and collecting positive/negative reactions.

**UI Elements**

- `ProgressBar` at the top
- full-screen `ColorCard`
- selection counter and liked count in the top-left
- Home button and language dropdown in the top-right
- two floating action buttons:
  - dislike: `✕`
  - like: `♥`
- early exit button shown once `currentIndex >= 10`

**User Actions**

| Action | Trigger | Result |
|--------|---------|--------|
| Like | Click `♥` or press `ArrowRight` | Appends current color to `likedColors`, advances |
| Dislike | Click `✕` or press `ArrowLeft` | Appends current color to `dislikedColors`, advances |
| Early exit | Click early exit button | Completes test with selections made so far |
| Go home | Click Home button | Clears selections and transitions to `home` |
| Toggle language | Use local dropdown | Switches all UI text |

**State**

- `currentIndex: number`
- `likedColors: ColorWithSeason[]`
- `dislikedColors: ColorWithSeason[]`
- `isTransitioning: boolean`
- `shuffledColors: ColorWithSeason[]`

**Behavior**

- All colors from the 12 palettes are flattened into a single list of `ColorWithSeason`
- The list is shuffled once on mount using `sort(() => Math.random() - 0.5)`
- Input is locked for 300ms during transitions to prevent double submission
- The current card fades out while transitioning
- When the last card is processed, the component calls `onComplete` with both liked and disliked selections
- If there is no current color, a loading state is shown

---

### Results

**Purpose**

Shows the strongest matching `SeasonTone`, two runner-up matches, an optionally derived worst match from disliked selections, and the full palette data for those results.

**Inputs**

- `likedColors: ColorWithSeason[]`
- `dislikedColors?: ColorWithSeason[]`
- `onRetry: () => void`
- `lang: Lang`

**Primary Result Areas**

- page title and localized intro text
- best match card
- second-best and third-best cards when available
- palette switcher for the top-ranked cards
- currently selected palette section
- worst-match card and palette section when available
- localized explanation block describing inferred undertone and tone traits
- retry and share buttons

**Palette Display Behavior**

- The best/runner-up palette area is tab-like: users can switch between the top-ranked cards
- Each palette shows:
  - palette title
  - descriptive copy
  - tone badge
  - total number of colors
  - count of liked matches or disliked matches when applicable
  - full grid of the 15 colors in that palette
- Palette cards add sticker badges when the user previously selected a color from that same `SeasonTone` palette:
  - `LIKE` for liked overlap
  - `NOPE` for disliked overlap

**User Actions**

| Action | Trigger | Result |
|--------|---------|--------|
| Retry | Click retry button | Clears selections and transitions to `test` |
| Share | Click share button | Copies localized summary text to clipboard, then shows alert |
| Change palette tab | Click best/runner-up chip | Updates visible palette section |
| Toggle language | Use header dropdown | Switches all UI text |

**Edge Cases**

- If `likedColors` is empty, no best result can be derived
- In that case the screen shows:
  - localized error message
  - retry button

---

## Core Logic

### Current Analysis Strategy

The current implementation no longer derives the result from averaged HSL values.

Instead, the result is based on the `seasonTone` already attached to each selected color.

### `getBestResults(likedColors, limit = 3)`

Returns the top-ranked `SeasonTone` values from liked selections.

**Ranking rules**

1. Higher selection count ranks first
2. If tied, the tone that reached that count earlier ranks first
3. If still tied, the tone first seen earlier ranks first
4. If still tied, alphabetical order of `seasonTone` is used

**Output**

- Array of up to `limit` `SeasonTone` values
- Default limit is 3

### `analyzePersonalColor(likedColors)`

Returns the first result from `getBestResults(likedColors, 1)`.

**Output**

- Best `SeasonTone`
- `null` if there are no liked colors

### `getWorstResult(dislikedColors, bestResult)`

Ranks disliked colors using the same rules as liked colors, then returns the highest-ranked disliked `SeasonTone` that is different from the best result.

**Output**

- Worst `SeasonTone`
- `null` if no valid alternative exists

### Palette Helpers

The codebase still includes palette helper functions:

- `getRecommendedColors(personalColorType, allColors)`
- `getAvoidColors(worstColorType, allColors)`

These convert a `SeasonTone` into an array of `ColorWithSeason` using `colorData`.

### Chroma / Turbidity Helpers

`src/utils/analyzer.ts` also includes utility helpers for HSL-derived metrics:

- `calculateChromaFromHsl(hsl)`
- `calculateTurbidityFromHsl(hsl)`

These are currently covered by Vitest tests, but they are not part of the main result-ranking flow shown in the UI.

---

## Internationalization

All user-facing text is centralized in `src/i18n/translations.ts`.

### Supported Languages

- `ko`
- `en`

### Translation Shape

The translation object is strongly typed via `TranslationSchema` and includes:

- navigation labels
- home/about/test/results copy
- palette descriptions
- trait labels
- share text formatter functions

### Language Toggle

`LangToggle` is a custom dropdown, not a native `<select>`.

**Props**

```ts
{
  lang: Lang;
  onToggle: (value: Lang) => void;
}
```

**Behavior**

- opens/closes local dropdown state
- closes on outside click
- renders `한국어` and `English`

---

## Data Model

### Core Types

```ts
type Lang = "ko" | "en";

type Screen = "home" | "test" | "results" | "about";

type SeasonTone =
  | "Spring Light"
  | "Spring Bright"
  | "Spring Muted"
  | "Summer Light"
  | "Summer Bright"
  | "Summer Muted"
  | "Autumn Light"
  | "Autumn Bright"
  | "Autumn Muted"
  | "Winter Light"
  | "Winter Bright"
  | "Winter Muted";
```

### Color

```ts
interface Hsl {
  h: number;
  s: number;
  l: number;
}

interface Color {
  name: string;
  hex: string;
  hsl: Hsl;
}

interface ColorWithSeason extends Color {
  seasonTone: SeasonTone;
}
```

### Color Data

`colorData` is a `Record<SeasonTone, Color[]>`.

Implementation details:

- 12 season-tone keys
- 15 colors per key
- total dataset size: 180 colors

`seasonTones` exports the canonical ordered list of valid keys.

### Test Completion Payload

```ts
interface TestCompletePayload {
  likedColors: ColorWithSeason[];
  dislikedColors: ColorWithSeason[];
}
```

The root app also supports a legacy-compatible completion shape:

```ts
type TestCompleteResult = TestCompletePayload | ColorWithSeason[];
```

When an array is passed, it is normalized to:

- `likedColors = result`
- `dislikedColors = []`

### Root App State

`App` manages:

```ts
screen: Screen;
likedColors: ColorWithSeason[];
dislikedColors: ColorWithSeason[];
lang: Lang;
```

---

## Preview Modes

The app reads `preview` from `window.location.search`.

Supported preview values:

- `?preview=results`
  - opens directly on `results`
  - injects a hardcoded liked/disliked sample dataset
- `?preview=about`
  - opens directly on `about`

If no preview value is present, the app starts on `home`.
