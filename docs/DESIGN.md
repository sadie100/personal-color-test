Overview

This project uses a Soft Glass UI (Glassmorphism-based) design system.

The goal is to create a calm, immersive, and emotional interface where UI elements blend into the experience rather than dominate it.

This system intentionally deprioritizes high contrast and rigid structure in favor of softness, depth, and visual cohesion.

⸻

Design Principles

1. Emotional over Functional

UI should feel light, soft, and atmospheric, not mechanical.
• Prioritize mood and immersion
• Avoid overly “system-like” components

⸻

2. Low Contrast by Default
   • Avoid extreme black/white contrast
   • UI should sit within the background, not on top of it

⸻

3. Floating Elements

All UI components should feel like they are:

“floating above the background, not attached to it”

Achieved via:
• transparency
• blur
• soft shadows

⸻

4. Material Consistency

All components must share the same material language:
• semi-transparent surfaces
• subtle borders
• blurred backgrounds

Mixing solid and glass styles is not allowed

⸻

Visual Language

Material
• Use semi-transparent layers
• Use background blur (glass effect)

```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

Avoid:
• solid white backgrounds
• opaque panels

⸻

Color
• Prefer soft, desaturated tones
• Avoid pure black / pure white

Usage Recommendation
Text rgba(0,0,0,0.6~0.8)
Surface rgba(255,255,255,0.1~0.25)
Border rgba(255,255,255,0.2)

⸻

Shadow

Use soft, diffused shadows to create depth.

```css
box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
```

Avoid:
• hard shadows
• strong elevation contrast

⸻

Shape
• Use rounded, organic shapes
• Prefer pill / circular forms

```css
border-radius: 9999px;
```

Avoid:
• sharp corners
• rigid rectangular UI

⸻

Components

Buttons

Required Style
Buttons must follow glass/soft style:
• semi-transparent OR ghost
• soft shadow
• rounded shape

Preferred Variants 1. Glass Button 2. Ghost Button 3. Icon Button

Not Allowed
• solid white buttons
• high contrast CTA buttons
• rectangular system-style buttons

⸻

Text
• Maintain soft readability
• Avoid maximum contrast

⸻

Layout
• Avoid boxed layouts
• Maintain spacing and air
• UI should feel breathable

⸻

Do / Don’t

DO
• Use blur and transparency
• Keep contrast soft
• Maintain visual consistency
• Make elements feel floating

⸻

DON’T
• Mix glass UI with solid UI
• Use pure white panels
• Use strong black text
• Introduce heavy system-like buttons

⸻

Anti-Patterns

The following break the system:
• White background + black text buttons
• Flat UI components without depth
• Mixed material styles (glass + solid)
• Overly functional/enterprise UI blocks

⸻

Heuristic (Quick Check)

If unsure, validate using this rule:

“Does this look like it belongs to the system UI (OS)? → Then it’s wrong”
“Does this look like it’s floating in the scene? → Then it’s correct”

⸻

One-line Definition

Soft, low-contrast glass UI with floating, emotional elements.

⸻

Notes

This system intentionally sacrifices some readability and strict hierarchy to achieve:
• immersion
• aesthetic consistency
• emotional tone

Design decisions should always align with these priorities.
