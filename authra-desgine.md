name: Authra Design System
description: Core design guidelines and principles for the Authra platform. Gives preference to a minimal white theme while fully supporting a premium dark mode that auto-switches based on system preferences. Melds futuristic custom branding with Linear-inspired precision.
---

# Authra Design System Skill

This document outlines the core design principles, typography, color palettes, and component styles for the Authra platform. It fuses a modern, minimal SaaS aesthetic with futuristic brand elements and high-precision typography.

## 1. Visual Theme & Atmosphere

- **Theme Strategy:** Implement an auto-switching theme based on system preferences. 
- **Light Mode (Primary):** Clean, minimal, and spacious white theme. Focus on high legibility, subtle gray borders, and striking blue brand accents.
- **Dark Mode:** A sleek, futuristic palette utilizing deep midnight blacks (`#000000`) and steel blue accents. Emphasize luminance stacking (using slightly lighter background tints for elevated surfaces) rather than heavy drop shadows.
- **Brand Personality:** Futuristic, Intelligent, Reliable, Elegant, and Premium.

## 2. Color Palette & Roles

### Core Brand Palette (Authra Signature)
- **Deep Midnight:** `#000000` (Dark mode main background)
- **Surface Card (Dark):** `#0D0F16`
- **Steel Blue:** `#5F6EB7` (Secondary buttons, borders)
- **Periwinkle:** `#7387C5` (Primary actions, highlights)
- **Soft Sky Blue:** `#92B8D4` (Hover states, cards, subtle accents)
- **Ice Blue:** `#A8D3E8` (Bright accents, glow effects)

### Signature Gradient
Use the following top-to-bottom gradient for brand moments, primary CTAs, and highlight effects:
```css
linear-gradient(180deg, #A8D3E8 0%, #92B8D4 35%, #7387C5 70%, #5F6EB7 100%)
```

### UI System Colors
- **Divider/Border (Dark):** `#2A3155` or semi-transparent `rgba(255,255,255,0.08)`
- **Main Text (Dark):** `#F5F8FF` (Never use pure `#ffffff` to prevent eye strain)
- **Secondary Text (Dark):** `#9AA8D6`
- **Main Text (Light):** `#111522`
- **Secondary Text (Light):** `#62666d`

### Premium Accents
- **Silver:** `#D9E4F2` (Neutral premium contrast)
- **Neon Cyan:** `#6EE7FF` (Tech energy / CTA)
- **Royal Purple:** `#6C63FF` (Luxury innovation tone)

## 3. Typography Rules

Built around **Inter**, optimized for a technical, clean aesthetic. 
- **Headings & UI:** `Inter` (alternatives: Sora, Space Grotesk). Enable OpenType features `"cv01"` and `"ss03"` for a geometric look.
- **Body:** `Inter` (alternatives: DM Sans, Manrope).
- **Code/Data:** `JetBrains Mono` or `Berkeley Mono`.

### Typographic Hierarchy & Letter Spacing
- Use aggressive negative letter-spacing for large display text (e.g., `-1.584px` at 72px, `-1.056px` at 48px).
- Use Inter's `510` weight for default emphasis (buttons, navigation) to create a subtly bold feel without traditional heaviness.
- Use `400` weight for reading and `590` weight for strong emphasis.

## 4. Component Stylings

### Buttons
- **Primary Buttons:** Background `#7387C5` (or signature gradient), text `#ffffff`, `14px` border radius. Soft shadow `rgba(115,135,197,0.25)`. Hover state: `#92B8D4`.
- **Secondary/Ghost Buttons:** Translucent background (`rgba(255,255,255,0.02)` in dark mode), subtle border (`1px solid #2A3155`), text `#9AA8D6`.
- **Padding:** Comfortable (e.g., `8px 16px` for standard).

### Cards & Containers
- **Dark Mode Background:** `#0D0F16`
- **Border:** `1px solid #2A3155` or `rgba(255,255,255,0.08)`
- **Radius:** `20px` for main cards (large panels), `8px` for smaller elements.
- **Effects:** Optional blur/glassmorphism effects on floating panels. Use subtle inset shadows for depth instead of large drop shadows in dark mode.

### Inputs & Forms
- **Dark Mode Background:** `#111522`
- **Focus State:** Border color `#92B8D4` with a subtle glow.
- **Text Color:** `#F5F8FF`

## 5. Implementation Do's and Don'ts

### Do
- Give preference to the minimal white theme as the default, while respecting `prefers-color-scheme: dark`.
- Apply `"cv01", "ss03"` OpenType features to Inter font.
- Tighten letter-spacing on larger heading sizes.
- Use semi-transparent borders for subtle structural separation instead of solid, heavy lines.
- Apply luminance stacking for elevation in dark mode (slightly lighter backgrounds for higher elevated elements).

### Don't
- Don't use pure white (`#ffffff`) or pure black (`#000000`) for text; use off-white/off-black to reduce eye strain.
- Don't over-saturate layouts with the brand gradient. Use it intentionally for hero sections, primary CTAs, and active states.
- Don't use positive letter-spacing on display headings.
- Don't rely on thick, dark drop shadows in dark mode.

## 6. Prompt Examples
- *Creating a Dashboard Panel:* "Build a card panel with a `20px` border radius. In dark mode, use background `#0D0F16` with a `1px solid #2A3155` border. Ensure typography uses Inter with `"cv01"` and `"ss03"`, text color `#F5F8FF`."
- *Creating a Hero Button:* "Design a primary CTA button using Authra's signature gradient (`#A8D3E8` to `#5F6EB7`). Set the border radius to `14px` and add a soft shadow using `rgba(115,135,197,0.25)`."
