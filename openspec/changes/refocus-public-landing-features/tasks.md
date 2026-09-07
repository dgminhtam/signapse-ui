## 1. Contract and localization

- [x] 1.1 Update the Vietnamese and English landing dictionaries with the approved Hero copy, four feature labels/links, four chapter copy sets, Telegram setup copy, revised navigation labels, and the approved three-step AnalysisFlow copy.
- [x] 1.2 Remove obsolete landing dictionary keys for the two Hero proofs, four-step AnalysisFlow, standalone WorkspaceAssistant, standalone Reaction & Evidence chapter, and removed `#workspace-ai` anchor.
- [x] 1.3 Update the landing access model and locale/hash helpers so the Hero secondary CTA targets `#product`, feature anchors are supported, and removed/unknown hashes are dropped while query strings are preserved.
- [x] 1.4 Synchronize the landing design document and domain glossary with the approved four-feature story, Telegram claim boundary, media slots, section order, and terminology.

## 2. Landing composition

- [x] 2.1 Reorder the route-local landing composition to Hero → ProductStory → AnalysisFlow → TrustBoundary → FinalAccessCta, with the existing public header and footer.
- [x] 2.2 Replace the Hero proof blocks with the four feature links and update the Hero secondary CTA while preserving auth-aware primary CTA behavior and the conceptual figure contract.
- [x] 2.3 Replace the three product chapters with Knowledge Graph, Live Charts, AI Assistant, and Telegram chapters, keeping reaction/source content inside Live Charts and workspace/history content inside AI Assistant.
- [x] 2.4 Remove the standalone WorkspaceAssistant section, standalone Reaction & Evidence chapter, old four-step flow presentation, repeated AnalysisFlow intro/arrow/AI note, and unused route-local helpers.
- [x] 2.5 Implement the four chapter media-slot composition with complete text-first fallbacks, copy-before-media DOM order, localized captions/alt text, and no synthetic product UI.
- [x] 2.6 Apply the responsive layout rules: single-column feature chapters below 1200px, editorial copy/media composition at wide desktop, wrapped feature links, and no page-level horizontal overflow.

## 3. Product-proof media

- [x] 3.1 Add the route-local media slot contract for `knowledge-graph`, `live-charts`, `ai-assistant`, and `telegram`, including locale-independent slot IDs and text-first fallback behavior.
- [x] 3.2 Confirm that no approved product captures are present in the workspace and keep all four slots text-first without integrating unapproved Graph View, chart, AI, or Telegram assets.
- [x] 3.3 Verify each text-first slot's localized description, adjacent feature copy, stable DOM order, and absence of private data, fake metrics, or unapproved claims.

## 4. Contract and browser coverage

- [x] 4.1 Update component/static landing tests for the four-feature Hero, four product chapters, new section order, three AnalysisFlow steps, exact approved copy, removed legacy keys, and feature anchors in both locales.
- [x] 4.2 Update CTA and locale policy tests for `#product`, the four feature anchors, `#how-it-works`, query preservation, unsupported-hash removal, and anonymous/authenticated access destinations.
- [x] 4.3 Update landing browser tests for feature navigation, new responsive chapter order, mobile disclosure, keyboard focus, reduced motion, light/dark rendering, no-overflow breakpoints, and text-first media fallback.
- [x] 4.4 Add static checks that reject obsolete Hero proof copy, four-step AnalysisFlow copy, `#workspace-ai`, standalone Reaction & Evidence chapter, old Market Query claims, public Telegram-channel claims, and exclusivity claims.

## 5. Verification and handoff

- [x] 5.1 Run targeted landing component, policy, and browser tests and record any environment-only failures separately from implementation failures.
- [x] 5.2 Run `openspec validate --change "refocus-public-landing-features"` and confirm the delta specs contain complete MODIFIED/REMOVED requirement blocks with valid scenarios.
- [x] 5.3 Run lint, typecheck, production build, and repository diff checks for encoding/newline or unlocalized-copy regressions.
- [x] 5.4 Review the final diff for unchanged public-route protection, CTA destinations, Hero figure semantics, Telegram runtime boundaries, and absence of unrelated cleanup.

User-owned manual QA:

- Approve the four product-proof captures for seeded data, privacy, licensing, attribution, locale, crop, and claims.
- Confirm Telegram destination linking, configured alert routes, scheduled market analysis, and external delivery in an authorized environment.
- Review Vietnamese/English visual hierarchy in light/dark themes at the required breakpoints and 200% zoom.
