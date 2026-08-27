## Why

The public landing Hero's static market-context diagram no longer expresses the approved product story that the Market Knowledge Graph and price action are complementary ways to read market context. The approved v9 visualization provides that relationship, but it must be adapted to Signapse's localized, accessible, theme-aware, text-first landing contract instead of being copied as a standalone WebGL Hero.

## What Changes

- Replace only the Hero's current static conceptual diagram with a localized interactive market-context figure derived from the approved v9 graph-to-price-action visual.
- Preserve the surrounding Hero copy, CTA model, trust note, proof points, layout order, remaining landing sections, metadata, authentication behavior, and locale routing.
- Provide equivalent hover, click, tap, drag, keyboard, pause/resume, reduced-motion, light/dark, responsive, and screen-reader behavior without using application-mode semantics.
- Server-render a static dual-view fallback and progressively enhance it with a bounded Three.js client renderer that returns to the fallback when WebGL is unavailable or lost.
- Clarify the public claim boundary: the Market Knowledge Graph and price action are complementary views; the figure is not a product capture and does not imply graph-generated prices, prediction, trading signals, or automated execution.
- Replace the old figure-specific markup and styling completely, and update the landing design contract, localized copy, behavior-focused coverage, domain glossary, and architectural decision record.
- Keep application-host implementation separate from the existing apex-cutover workflow.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `public-landing-page`: Replace the non-interactive Hero conceptual-figure requirement with an accessible progressive interactive market-context figure while preserving the landing story, claim boundaries, responsive behavior, and static fallback.

## Impact

- Affected runtime: the public landing Hero figure, its localized dictionary entries, route-local styling, and client-side rendering boundary.
- Affected dependencies: add pinned `three@0.180.0` and `@types/three@0.180.0`; do not copy the demo's Next.js or React versions.
- Affected documentation: the landing-specific design contract, public-surface glossary, and the accepted progressive-WebGL ADR.
- Affected verification: existing localized landing component coverage and P0 public landing browser coverage.
- No backend, API, database, auth, metadata, analytics, social-card, or apex-cutover changes.
