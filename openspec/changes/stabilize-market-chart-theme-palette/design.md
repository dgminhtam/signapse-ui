## Context

The market chart canvas currently rebuilds KLineCharts when `resolvedTheme` changes, but chart styles are built by reading CSS variables from `document.documentElement` at initialization time. KLineCharts snapshots those color strings into canvas styles; it does not keep them reactive to CSS class changes.

Because `next-themes` applies the light/dark class in an effect, the chart effect can read CSS variables before the DOM class has fully settled. The adapter also converts OKLCH CSS colors through a small canvas and caches the converted value, adding another non-shadcn color layer. Together, this can produce the visible issue where light → dark → light does not restore the original candle/grid palette.

## Goals / Non-Goals

**Goals:**

- Make KLineCharts core colors deterministic from an explicit chart theme mode.
- Keep light → dark → light palette transitions stable and reversible.
- Keep chart colors aligned with the Signapse neutral/shadcn visual language.
- Keep KLineCharts-specific style construction inside the market chart canvas adapter.
- Preserve all chart data, live updates, annotations, lazy loading, drawing tools, and toolbar behavior.

**Non-Goals:**

- Do not change global `app/globals.css` shadcn theme tokens.
- Do not change `next-themes` provider behavior.
- Do not add a chart dependency or migrate to `@klinecharts/pro`.
- Do not redesign chart toolbar, event markers, popups, or drawing tools.
- Do not change backend market chart API contracts.

## Decisions

### Derive chart palette from explicit theme mode

Introduce a chart-local palette helper keyed by `resolvedTheme === "dark" ? "dark" : "light"`. The helper should return stable color values for core KLineCharts styles: candle up/down/no-change, grid, axis text, crosshair labels, tooltip text, last price mark, volume, and drawing overlay colors.

Alternative considered: continue reading CSS variables and wait one animation frame after theme changes. This reduces timing risk but still couples canvas colors to DOM read timing and keeps the OKLCH-to-canvas conversion path.

### Avoid CSS variable conversion for core chart colors

Use explicit hex/rgba values for the chart-local palette. This avoids relying on browser canvas support for OKLCH parsing and avoids stale `colorCache` values. Font family can continue to use a CSS text variable because it is not theme-color sensitive and does not explain the observed light/dark palette drift.

Alternative considered: use `getComputedStyle()` for all colors and clear `colorCache` on theme changes. This keeps the same root coupling and is more likely to regress when theme transitions or `next-themes` timing changes.

### Apply style updates through KLineCharts style boundary

Prefer applying the deterministic palette through the existing chart style creation path. If the existing chart lifecycle rebuilds the chart on `resolvedTheme`, the rebuilt chart should receive the deterministic palette for the current theme. If implementation can update the active instance safely with `chart.setStyles()`, it may do so as a narrow optimization, but the required behavior is stable palette selection rather than a lifecycle refactor.

### Keep fallback behavior simple

When `resolvedTheme` is undefined during initial client hydration, use the light palette. Once `resolvedTheme` resolves, the existing theme dependency path can apply the correct palette.

## Risks / Trade-offs

- [Risk] Explicit chart palette can drift from future global theme token changes. → Mitigation: keep palette values local, small, and named by semantic chart roles so future token sync is straightforward.
- [Risk] Hardcoded chart colors may feel less token-driven than other UI. → Mitigation: use colors already visually aligned with current chart choices and shadcn neutral surfaces; avoid changing global tokens.
- [Risk] Rebuilding chart on theme change can still reset transient canvas state. → Mitigation: this proposal fixes color determinism first; chart lifecycle optimization can be separate if reset behavior becomes a product issue.
- [Risk] Drawing overlay colors also need theme consistency. → Mitigation: route drawing overlay style creation through the same chart theme palette rather than reading theme-sensitive CSS vars directly.
