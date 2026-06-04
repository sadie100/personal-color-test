# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev            # Start dev server (http://localhost:5173)
pnpm build          # Production build to dist/
pnpm preview        # Preview production build
pnpm lint           # Run ESLint
pnpm typecheck      # Run TypeScript type checking
pnpm test           # Run Vitest in watch mode
pnpm test:run       # Run Vitest once
pnpm format         # Format files with Prettier
```

## Architecture

Single-page React 19 + TypeScript app. Routing uses **react-router-dom v7** ([src/App.tsx](src/App.tsx)): `<Routes>` define `/`, `/about`, `/types`, `/types/:typeId`, `/test`, `/results` (unknown paths redirect to `/`). The logical `screen` is *derived* from `location.pathname` via `getScreenFromPathname`, not stored in state. `lang`, `testMode`, and `likedChips`/`dislikedChips` selections live in `App` state.

**Global navigation**: `Header` is rendered on every screen except `test`. It contains the brand link, navigation, and the language dropdown.

**Results sharing**: completed results are encoded into the `/results` URL query string ([src/utils/resultShare.ts](src/utils/resultShare.ts)). `App` canonicalizes the query and can reconstruct a result purely from the URL, so result links are shareable.

**Type definitions** ([src/types.ts](src/types.ts)): `Lang`, `Screen`, `PersonalColorType` (8 types), `SimpleResultType` (4 types), `ColorChip`, `DiagnosticChip`, `TestMode` (`simple` | `detailed`), `TestDisplayMode` (`chip` | `camera`), `TestCompletePayload`, and the i18n `TranslationSchema`. Prefer importing these over redefining shapes locally.

**Color space**: colors use **OKLCH** (`oklch: { l, c, h }`), with `culori` for conversions. (Not HSL.)

**Color data** ([src/data/colorData.ts](src/data/colorData.ts)): chips are built via `createChip`/`createDiagnosticChip`. A `DiagnosticChip` carries a `diagnosticPhase` (`base` | `season` | `detail`) and `targetTypes` (the `PersonalColorType`s it points to). Two test sets are exported: `simpleDiagnosticChips` and `detailedDiagnosticChips` (combined as `diagnosticChips`). `colorData` is the per-type display palette (`Record<PersonalColorType, ColorChip[]>`). `personalColorTypes` / `simpleResultTypes` are the canonical ordered key lists.

**Analysis algorithm** ([src/utils/analyzer.ts](src/utils/analyzer.ts)): target-type scoring. Each liked chip adds +1 to every type in its `targetTypes`; each disliked chip subtracts 1. Types are ranked by score, tie-broken by declaration order in `personalColorTypes`. `getWorstResult` ranks ascending. Simple mode maps each type to its `Season + BaseTone` `SimpleResultType` first.

**Test flow** ([src/pages/ColorTest.tsx](src/pages/ColorTest.tsx)): `TestSetup` picks the `TestMode` and `TestDisplayMode`; `getSelectedDiagnosticChips` returns the chip set for that mode. Supports pointer/touch swipe, `ArrowLeft`/`ArrowRight` shortcuts, and an early-exit button. `camera` display mode uses [src/hooks/useCamera.ts](src/hooks/useCamera.ts) + [src/components/CameraStage.tsx](src/components/CameraStage.tsx).

**Results** ([src/pages/Results.tsx](src/pages/Results.tsx)): best / 2nd / 3rd matches plus a worst match, palette sections with liked/disliked overlap badges, styling recommendations, and a copyable share link.

**Color-type encyclopedia** ([src/pages/ColorTypes.tsx](src/pages/ColorTypes.tsx), [src/pages/ColorTypeDetail.tsx](src/pages/ColorTypeDetail.tsx)): browse all types at `/types`, slugged detail pages at `/types/:typeId` (slugs from [src/utils/colorTypeSlug.ts](src/utils/colorTypeSlug.ts)).

**i18n** ([src/i18n/translations.ts](src/i18n/translations.ts)): `ko`/`en` copy keyed by `TranslationSchema`; `lang` is threaded from `App` into each page.

## Tailwind CSS

Uses Tailwind v4. The import in [src/index.css](src/index.css) is `@import "tailwindcss"` (v4 syntax, not `@tailwind base/components/utilities`). Avoid using v3 directive syntax.

## Dev Preview Mode

Append one of the following query parameters to the URL:

- `?preview=results` to jump directly to the Results screen with sample liked/disliked data
- `?preview=about` to jump directly to the About screen
