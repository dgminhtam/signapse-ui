## Why

The refocused public landing names Signapse's four primary features, but the chapters need a clearer evidence hierarchy. Knowledge Graph and Live Charts benefit from approved product captures, while AI Assistant and Telegram communicate their value more clearly through concise text.

## What Changes

- Restore the Hero-only historical `8ae5336` baseline, including its two proof points, `#how-it-works` secondary CTA, and `lg` layout breakpoint; preserve the four-feature order, three-step AnalysisFlow, trust boundary, remaining CTA destinations, and interactive market-context figure behavior.
- Give Knowledge Graph, Live Charts, AI Assistant, and Telegram feature-specific editorial compositions instead of one repeated two-column treatment.
- Make each approved outcome statement the chapter heading and treat the feature name as a supporting label.
- Remove text-only media placeholders; when an active locale lacks an approved capture, render a complete text-first chapter without an empty media surface.
- Use approved Vietnamese and English captures only for Knowledge Graph and Live Charts, with per-feature provenance, dimensions, localized captions/alternative text, and explicit owner approval status.
- Keep AI Assistant and Telegram intentionally text-only; their lack of media is the approved composition rather than an incomplete capture state.
- Render each approved capture inline with localized alt text, captions, and Knowledge Graph annotations where applicable; keep inline image failures subordinate to chapter copy.
- Update component and browser coverage for chapter hierarchy, feature-specific responsive composition, locale-aware media states, and the absence of enlargement controls.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `public-landing-page`: Refine the four-feature chapter composition, approved-capture fallback behavior, capture governance, and inline image presentation.
- `product-localization`: Add localized capture captions, alternative text, annotations, and inline failure feedback while preserving Vietnamese/English parity.

## Impact

- Updates the localized public landing composition and removes the unnecessary image-enlargement interaction.
- Updates Vietnamese and English dictionaries and existing component/browser tests.
- May add approved WebP/AVIF product captures and a non-sensitive approval manifest or equivalent build-time record; no capture is public until its source and final image are approved.
- Reuses Next.js image handling, semantic design tokens, and current landing test seams; no new UI dependency is required.
- Does not change backend APIs, authentication, permissions, product feature behavior, Telegram routing or delivery, Hero WebGL behavior, deployment policy, or apex cutover.
