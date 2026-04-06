# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev         # Start dev server (http://localhost:5173)
npm run build       # Production build to dist/
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript type checking
npm run test        # Run Vitest in watch mode
npm run test:run    # Run Vitest once
npm run format      # Format files with Prettier
```

## Architecture

Single-page React + TypeScript app with no routing library. Screen transitions are managed by a `screen` state in [src/App.tsx](src/App.tsx) with four values: `'home'`, `'about'`, `'test'`, `'results'`.

**Data flow:**

1. `Home` → `onStart()` → switches to `'test'`
2. `Home` → `onAbout()` → switches to `'about'`
3. `About` → `onStart()` → switches to `'test'`
4. `ColorTest` → `onComplete({ likedColors, dislikedColors })` → switches to `'results'`
5. `Results` → `onRetry()` → resets selections and switches back to `'test'`

**Global navigation**: `Header` is rendered on every screen except `test`. It contains the brand link, About/Test navigation, and the language dropdown.

**Type definitions** ([src/types.ts](src/types.ts)): Shared app types live here, including `Lang`, `Screen`, `SeasonTone`, `Color`, `ColorWithSeason`, and `TestCompletePayload`. Prefer importing and reusing these types instead of redefining shapes locally.

**Color data** ([src/data/colorData.ts](src/data/colorData.ts)): 180 colors organized as `Record<SeasonTone, Color[]>`. Each of the 12 `SeasonTone` keys contains 15 colors. `seasonTones` exports the canonical ordered list of valid keys.

**Analysis algorithm** ([src/utils/analyzer.ts](src/utils/analyzer.ts)): The current result logic is ranking-based, not HSL-average based. Each selected color already includes a `seasonTone`, and results are derived by counting the most frequent `SeasonTone` values in liked/disliked selections. Tie-breaking uses count, the time a tone reached that count, first appearance, then alphabetical order.

**ColorTest component** ([src/components/ColorTest.tsx](src/components/ColorTest.tsx)): Flattens all palettes into `ColorWithSeason[]`, shuffles once on mount, tracks liked/disliked selections separately, and supports keyboard shortcuts for `ArrowLeft` and `ArrowRight`. After index `>= 10`, a localized early-exit button appears.

**Results component** ([src/components/Results.tsx](src/components/Results.tsx)): Shows the best match, second/third best matches, and a worst match derived from disliked colors when available. It also renders full palette sections with overlap badges for previously liked/disliked colors.

## Tailwind CSS

Uses Tailwind v4. The import in [src/index.css](src/index.css) is `@import "tailwindcss"` (v4 syntax, not `@tailwind base/components/utilities`). Avoid using v3 directive syntax.

## Dev Preview Mode

Append one of the following query parameters to the URL:

- `?preview=results` to jump directly to the Results screen with sample liked/disliked data
- `?preview=about` to jump directly to the About screen
