# FunnelCOD - Design System

Last updated: 2026-03-06

## 1) Design direction

FunnelCOD uses a modern SaaS visual language with:
- Light premium surfaces.
- Cyan/blue accents for action and emphasis.
- High contrast typography with clear hierarchy.
- Rounded cards, soft depth, and subtle gradients.

## 2) Typography

- Base font: `Inter`.
- Display font: `Sora` (`.font-display`) for headings and key metrics.

Guidelines:
- Use display font only for hero titles, section headings, prices, and key numbers.
- Keep body copy in Inter for readability.

## 3) Color tokens (landing)

Primary accents:
- Cyan 700 (`text-cyan-700`) for labels and highlights.
- Blue/Cyan gradient (`from-cyan-600 to-blue-600`) for primary CTA.

Surface palette:
- Page background: `#f6f8fb`.
- Primary cards: `bg-white` + `border-slate-200`.
- Secondary muted text: `text-slate-500` / `text-slate-600`.

## 4) Layout principles

- Container width: `max-w-6xl`.
- Hero: 2 columns on desktop (`lg:grid-cols-[1.05fr_0.95fr]`) and stacked on mobile.
- Sections: clear vertical rhythm (`py-20` to `py-24`).
- Information is grouped in cards to improve scannability.

## 5) Components and styling patterns

- Primary CTA:
  - Rounded large button.
  - Cyan/blue gradient.
  - Medium shadow.

- Secondary CTA:
  - White background.
  - Slate border.
  - Subtle hover state.

- Content cards:
  - Rounded corners (`rounded-2xl` to `rounded-3xl`).
  - Border + soft shadow.
  - Lightweight hover/scroll depth effects.

- Testimonials:
  - Horizontal snap scroll on mobile and desktop.
  - Arrow controls on desktop.

## 6) Motion

- Entrance animations with `framer-motion`:
  - small Y offset + opacity transition.
  - duration around 0.45s-0.65s.
- Keep animations subtle and avoid heavy motion loops.

## 7) Responsive rules

- Mobile-first structure.
- Do not rely on fixed widths that can cause overflow.
- Keep tap targets comfortable (`h-9`+ for controls/buttons).
- Preserve readability with clear spacing and max-width constraints.

## 8) Accessibility baseline

- Preserve semantic headings and section landmarks.
- Keep visible focus styles for interactive controls.
- Maintain adequate text contrast against white and tinted surfaces.
- Keep language switch and navigation keyboard accessible.
