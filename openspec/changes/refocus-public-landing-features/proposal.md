## Why

The public landing page does not currently make Signapse's four main product capabilities clear: Knowledge Graph exploration, live market charts, AI conversation with Knowledge Graph context, and Telegram updates. The current page gives too much weight to supporting concepts and leaves Telegram absent, so visitors cannot quickly understand the product's primary reasons to use it.

## What Changes

- **BREAKING** Replace the current landing message hierarchy with four primary feature chapters: Knowledge Graph, Live Charts, AI Assistant, and Telegram.
- Update the Hero headline and supporting copy so the four capabilities are visible in the first scan.
- Replace the two Hero proof blocks with feature links to `#knowledge-graph`, `#live-charts`, `#ai-assistant`, and `#telegram`.
- Change the Hero secondary CTA to “Khám phá tính năng” / “Explore features” linking to `#product`.
- Reorder the landing story to Hero → Product Story → Analysis Flow → Trust Boundary → Final CTA, with the public header and footer surrounding it.
- Replace the three existing product chapters with four editorial chapters and media surfaces for the four primary features.
- Fold reaction/source inspection into Live Charts and fold workspace/history support into AI Assistant; remove the standalone Workspace Assistant section and standalone Reaction & Evidence chapter.
- Add Telegram landing content covering linked destinations, configurable alert routes, economic-calendar updates, and scheduled per-asset market analysis from Signapse.
- Keep the approved three-step AnalysisFlow copy, move it after the feature chapters, and remove the obsolete four-step flow, intro repetition, and repeated AI note.
- Prepare localized product-proof media slots for Graph View, live chart, AI conversation, and Telegram message examples, with text-first fallback until each locale-appropriate asset is approved.
- Update supported feature anchors, locale-switch preservation, Vietnamese/English dictionaries, landing tests, and obsolete landing copy contracts.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `public-landing-page`: Change the public landing positioning, Hero copy, CTA destination, feature story topology, AnalysisFlow order/content, Telegram claims, approved media slots, and supported anchors.
- `product-localization`: Change the required localized landing dictionary contract to cover the four feature chapters, new Hero/CTA copy, three-step AnalysisFlow, feature anchors, media alternatives, and removal of obsolete landing keys.

## Impact

- Updates the public localized landing composition, its Vietnamese and English dictionaries, route-local styling, and feature-anchor behavior.
- Updates localized landing metadata-adjacent copy contracts only where required; no backend API, authentication, permission, or persistence changes.
- Adds landing media preparation/integration work for four product-proof surfaces. Approved assets must be locale-correct, privacy-safe, licensed, dimensioned, and accompanied by localized text alternatives.
- Updates component, browser, localization, and static contract tests that currently assert the old eight-part topology, four-step AnalysisFlow, two Hero proofs, three product chapters, and legacy anchors.
- Preserves the existing auth-aware request-access/dashboard destinations, public-route protection, Hero conceptual figure behavior, metadata policy, and Telegram configuration runtime.
