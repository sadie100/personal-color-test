# Design System — Editorial Gallery

## Overview

This project uses an **Editorial Gallery** design system.

The product is a personal-color diagnosis tool. A tool for working with color should not wear color itself. Like the white walls of a gallery, the interface stays achromatic and quiet so that the **color chips become the artwork**. Hierarchy is built from typography, whitespace, and alignment — not from gradients, glass panels, or boxes nested inside boxes.

> One-line definition: **An off-white paper canvas with a serif editorial voice, where achromatic UI frames the color chips as content.**

This replaces the previous "Soft Glass / Glassmorphism" system entirely. Full-screen gradients, frosted-glass cards, and decorative blur are gone. The redesign rationale lives in [UI_FEEDBACK.md](UI_FEEDBACK.md) (home / about / types / results) and [UI_FEEDBACK_TEST.md](UI_FEEDBACK_TEST.md) (test screen).

⸻

## Design Principles

1. **Color is content, not decoration.** The UI itself is achromatic (paper / ink / hairline). The 180 season chips are the brand. UI color exists only to frame them.
2. **Hierarchy through type, space, and alignment.** A large serif headline + one emphasized element carries a page. No competing pastel boxes of equal weight.
3. **One system across every screen.** Home, About, Types, Test, and Results share the same tokens, surfaces, and CTA language. No screen runs its own theme.
4. **Hairlines, not shadows or blur.** Surfaces are separated by a 1px hairline border, not by elevation or frosted glass.
5. **Readability first (WCAG AA).** Ink-on-paper contrast clears 4.5:1. No white text on saturated fills.

⸻

## Design Tokens

Defined as a Tailwind v4 `@theme` block in [src/index.css](../src/index.css). Tailwind auto-generates the utilities (`bg-paper`, `text-ink`, `border-hairline`, `font-display`, …). Use tokens — never raw hex or arbitrary grays.

| Token | Value | Utility | Role |
|---|---|---|---|
| `--color-paper` | `#fafaf7` | `bg-paper` | Global background — paper |
| `--color-surface` | `#ffffff` | `bg-surface` | Card / panel surface |
| `--color-fill` | `#f0eee8` | `bg-fill` | Chip / tag / chart-cell background (between paper and hairline) |
| `--color-hairline` | `#e6e4de` | `border-hairline` | 1px separator (replaces shadow) |
| `--color-ink` | `#14110f` | `text-ink` | Titles — near-black |
| `--color-ink-2` | `#555049` | `text-ink-2` | Body text |
| `--color-ink-3` | `#8a857c` | `text-ink-3` | Captions, labels, axis text |
| `--color-accent` | `#1f1b16` | `bg-accent` | CTA background — near-black |
| `--color-accent-fg` | `#fafaf7` | `text-accent-fg` | CTA text |

⸻

## Typography

Loaded via Google Fonts CDN in [index.html](../index.html).

| Role | Font | Token / class | Notes |
|---|---|---|---|
| Display / titles | `Instrument Serif`, `Noto Serif KR` | `font-display` | Editorial voice. Used for all headings, season names, type names, hero headlines. |
| Body / UI | `Pretendard`, system-ui | default | Set on `body`. Labels, descriptions, buttons. |
| Numbers / codes | monospace | `font-mono` | Hex codes (`#FF5747`), counters — tabular feel. |

- Korean headlines use `break-keep` to avoid awkward mid-word wraps.
- Body stays left-aligned (see Layout); only the hero headline may grow large.

⸻

## Color Usage

- **The UI is achromatic.** Backgrounds, surfaces, borders, and text all come from the paper/ink/hairline tokens above.
- **Brand color must never beat content color.** The season palettes (4 seasons × tones, 180 chips) are the only saturated color on the page; the UI is their frame.
- When emphasis is needed, reach for **type size, weight, and the near-black accent** — not gradients or saturated fills.

**Permitted color accents (functional, not decorative):**

- **Type-signature color** — a type's own colors are *content*: the 4-color signature band on type cards, the gradient signature circle on the type-detail hero, and the per-type detail hero. These are intentionally retained.
- **Results overlap stickers** — on the Results palette, chips the user liked/disliked carry a small `LIKE` / `NOPE` sticker badge (`bg-rose-500` / `bg-red-500`) and a matching count pill (`bg-rose-50` / `bg-red-50`). This is the one place small saturated UI accents are allowed, because they mark a functional overlap relationship. See [src/pages/Results.tsx](../src/pages/Results.tsx).

⸻

## Surfaces & Elevation

```css
/* Card / panel */
background: var(--color-surface);   /* or bg-paper / bg-fill for nested cells */
border: 1px solid var(--color-hairline);
border-radius: 1rem;                /* rounded-2xl / rounded-3xl */
```

- Separate surfaces with a **hairline border**, not shadows.
- A faint `shadow-sm` is acceptable on raised chips/cards (e.g. hero chips, type cards) but never the soft, diffuse glass shadow of the old system.
- **No `backdrop-filter` / blur.** Blur is reserved for genuine background-dismiss surfaces (modals/sheets), which this app does not use.

Avoid: glassmorphism, semi-transparent frosted panels, decorative blur, layered "box inside a box inside a box."

⸻

## Shape

- Cards / panels: `rounded-2xl`–`rounded-3xl`.
- Color chips in grids: `rounded-xl`; full-width palette **strips** use a single rounded container with hard internal seams (chips sit flush).
- **CTA buttons: `rounded-lg` (≈8px).** Solid rectangles with generous padding — not pills.
- Round controls (`rounded-full`) are reserved for the test swipe buttons, the counter/home pills on the test screen, and tone-swatch dots.

⸻

## Components

### Header
[src/components/Header.tsx](../src/components/Header.tsx) — fixed, solid `bg-paper`, bottom `border-hairline`. Serif ink wordmark. Nav links are `text-ink-2` (active = ink underline). The "테스트 시작" CTA is a small accent rectangle. On mobile it collapses to a hamburger + icon-only language toggle. Hidden on the `test` screen.

### CTA buttons
Exactly two variants, used everywhere:
- **Primary** — `bg-accent text-accent-fg rounded-lg`, `hover:opacity-90 active:scale-95`. One per screen.
- **Text link** — underlined `text-ink-2 hover:text-ink` (e.g. "퍼스널 컬러에 대해 알아보기").

No gradient pills, no semi-transparent CTAs.

### Color chips & strips
The hero of the product.
- **Hero grid** (Home): real chip data in a `rounded-xl` grid with hairline borders.
- **Palette strip** (Results best, About seasons, type-card headers): a single hairline-bordered container; chips fill flush as equal flex columns, so the strip reads as one band of color.
- **Adaptive label contrast**: on the full-bleed test screen the chip name uses [src/utils/contrast.ts](../src/utils/contrast.ts) `getReadableInkColor()` to pick ink or paper text by the chip's relative luminance — never hardcoded white. The label is `font-display`; the hex is `font-mono`.

### Test screen controls
[src/pages/ColorTest.tsx](../src/pages/ColorTest.tsx) + [src/components/SwipeButtons.tsx](../src/components/SwipeButtons.tsx) — background is the full-bleed chip color; everything on top is **opaque solid + hairline** (an opaque surface stays legible over any chip color, which decorative blur cannot guarantee).
- **Swipe buttons (achromatic hierarchy, not red/green):** Like = `bg-accent` solid (primary, ♥), Dislike = `bg-surface border-hairline` (secondary, ✕). Meaning is carried by SVG icon + left/right position, not hue. `active:scale-95` only.
- **Counter** (top-left) and **처음으로** (top-right): solid `bg-surface` + hairline pills.
- **Progress bar**: `bg-accent` fill over a `bg-hairline` track.

### Cards (Types / Detail / About / Results)
Hairline `bg-surface` cards, serif titles, `text-ink-2` body. Keyword chips use `bg-fill text-ink-2` rounded-full tags. Attribute cells and prev/next nav share the same hairline-surface language.

### Type cards
[src/pages/ColorTypes.tsx](../src/pages/ColorTypes.tsx) — the 8 types are grouped into **4 season sections** (Spring/Summer/Autumn/Winter, 2 cards each). Each card header is a **signature 4-color solid band** (its type's content color), with name, season·tone label, keywords, a 6-chip palette row, and a CTA.

### Worst accordion
[src/pages/Results.tsx](../src/pages/Results.tsx) — the worst-match section is a hairline card collapsed by default, expanded by an `aria-expanded` toggle with a rotating chevron. Content stays mounted (hidden via `display:none`), demoting secondary info without hiding it from users who want it.

### PCCS tone chart
[src/pages/About.tsx](../src/pages/About.tsx) — an imported reference image (`pccs_tone_map.jpg`) framed inside a hairline `bg-surface` card with a rounded hairline border. This is the intended treatment: a self-built CSS-grid version was tried and reverted (it read poorly), and there is no plan to replace the framed image.

⸻

## Layout

- **Body copy is left-aligned.** Only a hero headline may be large and prominent; long Korean paragraphs are never center-aligned.
- Content width is capped (`max-w-3xl`–`max-w-5xl`) to keep line length readable.
- Generous, breathable whitespace between sections; cards pad `24/32px`.
- **Responsive:** multi-column grids (hero, type sections) stack to a single column on mobile with no horizontal scroll; the header collapses to a hamburger.

⸻

## Motion

- Subtle and purposeful: `active:scale-95` press feedback, small `hover:-translate-y-0.5` / `hover:opacity-90`, color transitions.
- No full-screen gradient animation, no floating-blur drift.
- `prefers-reduced-motion: reduce` is honored globally in [src/index.css](../src/index.css) (animations/transitions collapsed, smooth-scroll off).

⸻

## Do / Don't

**DO**
- Frame color chips with achromatic paper/ink/hairline UI.
- Build hierarchy with serif type, whitespace, and a single accent.
- Separate surfaces with hairlines.
- Keep ink-on-paper contrast at AA.
- Keep one system across all screens.

**DON'T**
- Use full-screen gradient backgrounds (per-type signature color is the only exception, and it is content).
- Use glassmorphism / frosted panels / decorative blur.
- Use saturated CTAs or gradient pills (CTA = near-black solid rectangle).
- Use red/green swipe buttons or hardcoded white chip labels.
- Center long body paragraphs.
- Nest equal-weight boxes to fake depth.

⸻

## Anti-Patterns (these break the system)

- Full-screen purple/pink gradient as a page background.
- Frosted-glass card stacked on glass stacked on glass.
- White text on a saturated fill (fails contrast).
- A pastel card grid where every item has equal weight (no hierarchy).
- One screen (e.g. an old flat Results page) running a different theme from the rest.

⸻

## Heuristic (Quick Check)

> "Does the UI compete with the color chips for attention? → Then it's wrong."
> "Does the UI recede like a gallery wall so the chips read as the artwork? → Then it's correct."

⸻

## Notes

This system trades the previous immersive, mood-driven glass aesthetic for an editorial, content-first one. The priorities are now:

- color chips as the visual hero,
- clear typographic and spatial hierarchy,
- AA readability,
- and a single consistent system across every screen.

Design decisions should align with these priorities.
