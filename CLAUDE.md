# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

No test framework is configured.

## Architecture

Single-page React app with no routing library. Screen transitions are managed by a `screen` state in [App.jsx](src/App.jsx) with three values: `'home'`, `'test'`, `'results'`.

**Data flow:**
1. `Home` → calls `onStart` → switches to `'test'`
2. `ColorTest` → calls `onComplete(likedColors)` → switches to `'results'`
3. `Results` → calls `onRetry` → switches back to `'test'`

**Color data** ([src/data/colorData.js](src/data/colorData.js)): ~180 colors organized as `colorData[seasonTone]` (e.g. `colorData["Spring Light"]`). Each color has `{ name, hex, hsl: { h, s, l } }`. The 12 keys are the combinations of Spring/Summer/Autumn/Winter × Light/Bright/Muted.

**Analysis algorithm** ([src/utils/analyzer.js](src/utils/analyzer.js)): Takes the array of liked colors and returns a season-tone string (e.g. `"Spring Light"`). Uses circular mean for hue averaging. Warm vs. cool is determined by hue range (0–60° or 300–360° = warm). Light/Bright/Muted thresholds: lightness > 75 → Light, saturation > 65 → Bright, else Muted.

**ColorTest component** ([src/components/ColorTest.jsx](src/components/ColorTest.jsx)): Shuffles all colors on mount, tracks liked/disliked separately, exposes keyboard shortcuts (←/→/Space). After index ≥ 10, a "중간 결과 보기" button appears to exit early.

## Tailwind CSS

Uses Tailwind v4. The import in [src/index.css](src/index.css) is `@import "tailwindcss"` (v4 syntax, not `@tailwind base/components/utilities`). Avoid using v3 directive syntax.

## Dev Preview Mode

Append `?preview=results` to the URL to jump directly to the Results screen with sample warm-tone liked colors (useful for iterating on the Results UI without running through the full test).
