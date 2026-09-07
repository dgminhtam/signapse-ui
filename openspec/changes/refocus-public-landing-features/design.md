## Context

The current public landing page is a route-local server-rendered story with a client-only conceptual Hero figure, localized dictionaries, an auth-aware access model, and browser coverage for public routing, section order, locale switching, responsive overflow, and accessibility. Its content contract currently presents three product chapters and a separate Workspace/Assistant section, while Telegram is excluded from the primary story.

The approved direction makes four capabilities the primary product story: Knowledge Graph exploration, live market charts, AI conversation with Knowledge Graph context, and Telegram updates. The existing landing route, CTA destinations, Hero figure behavior, public-route policy, and shared design system remain the technical base. The change is a content and composition migration, with approved product media prepared as four explicit proof slots.

Constraints:

- Keep the landing public and the dashboard/application/API routes protected.
- Preserve the existing request-access, sign-in, dashboard, metadata, locale, and Hero interaction contracts unless explicitly changed by this design.
- Use only runtime-supported claims. Telegram copy may describe configured alerts and scheduled per-asset analysis, but must not imply a public channel, arbitrary threshold alerts, manual AI delivery, guaranteed delivery, or commercial exclusivity.
- Keep Vietnamese and English copy dictionary-backed and semantically equivalent.
- Keep the landing text-first until a locale-appropriate product capture is approved; do not create synthetic product screenshots.

## Goals / Non-Goals

**Goals:**

- Make the four primary capabilities recognizable in the first scan and through direct feature anchors.
- Give each capability one editorial chapter with a concrete outcome, concise explanation, and product-proof media slot.
- Move the three-step AnalysisFlow after the feature story while preserving its approved copy.
- Explain Telegram as a configured delivery channel for news alerts, economic-calendar updates, and scheduled market analysis.
- Preserve truthful AI, chart, Knowledge Graph, Telegram, access, localization, accessibility, and responsive behavior.
- Replace obsolete landing copy, anchors, section topology, and test expectations in one coherent change.

**Non-Goals:**

- Changing backend contracts, Telegram configuration behavior, AI conversation behavior, Graph View behavior, market-chart behavior, permissions, or authentication.
- Building Telegram onboarding, a public Telegram channel, threshold-alert configuration, or a manual “send this AI answer” workflow.
- Adding graph-node-to-chat behavior, automatic chart-context handoff to AI, streaming tokens, evidence sheets, pricing, CRM, analytics, or request forms.
- Redesigning the Hero WebGL figure or adding a new interactive demo.
- Deploying the landing, changing the public origin, or performing apex cutover.

## Decisions

### 1. Keep one route-local landing composition and change the story topology

The existing landing page remains the composition owner. Its named sections are reorganized to render Hero, ProductStory, AnalysisFlow, TrustBoundary, FinalAccessCta, and Footer. The standalone WorkspaceAssistant section is removed, and Reaction & Evidence becomes supporting content inside the Live Charts chapter.

Alternatives considered:

- Add a second marketing page for the four features: rejected because it would split the public product story and duplicate CTA/locale behavior.
- Keep the current three chapters and add Telegram as a fifth chapter: rejected because the agreed product hierarchy has four primary features and supporting concepts should not compete with them.

### 2. Use four editorial chapters instead of a feature-card grid

ProductStory uses four sufficiently wide chapters in this order: Knowledge Graph, Live Charts, AI Assistant, Telegram. Each chapter contains a localized eyebrow/name, outcome heading, concise body, and a media slot. On desktop, copy and media may alternate; on narrow viewports, copy precedes media. Reaction/source inspection belongs to Live Charts, and workspace/history details belong to AI Assistant.

Alternatives considered:

- Four equal compact cards: rejected because the content is too important for small card copy and the landing direction calls for editorial product chapters.
- Keep a separate section for every supporting concept: rejected because it recreates the current dilution problem.

### 3. Use feature anchors and one feature CTA path

The Hero replaces the old two proof blocks with links to `#knowledge-graph`, `#live-charts`, `#ai-assistant`, and `#telegram`. The Hero secondary CTA goes to `#product`; the header keeps “How to use” / `#how-it-works` as navigation. Locale switching preserves the supported feature anchors and drops unknown hashes.

Alternatives considered:

- Keep the Hero secondary CTA on `#how-it-works`: rejected because the new first action is feature discovery; the usage flow follows the feature proof.
- Use separate routes for each feature: rejected because the current landing is a single public product story and no new routes are required.

### 4. Keep approved copy and claims in the landing design contract

The Hero and four chapters use the Vietnamese and English copy recorded in `docs/design/LANDING.md`. The AI chapter describes Knowledge Graph context for text conversation and persisted workspace history. The Telegram chapter describes linking a destination, choosing configured content routes, and scheduling analysis for a tracked asset. It uses “bản phân tích từ Signapse” / “market analysis from Signapse” and does not imply exclusivity.

Alternatives considered:

- Use broader “AI-powered” or “exclusive analysis” marketing claims: rejected because they do not map cleanly to runtime evidence and would weaken the claim boundary.
- Describe Telegram only as a generic integration: rejected because the actual value is the three configured update flows.

### 5. Treat four product images as explicit, approval-gated media slots

The implementation prepares slots for a Graph View capture, live chart capture, AI conversation capture, and Telegram message example. Every locale-dependent image requires a matching Vietnamese and English asset from an approved demo scenario. If a slot is not approved, the surrounding text remains complete and the slot falls back to text-first composition; it must remain visible in the asset handoff as incomplete.

Alternatives considered:

- Generate illustrative screenshots: rejected by the landing media policy and because they could be mistaken for runtime proof.
- Use the existing design reference images: rejected because they are design references, not approved product evidence.

### 6. Reuse the existing verification seams

Component/static rendering tests continue to assert localized composition and exact section semantics. Browser tests continue to cover public routes, CTA state, locale switching, mobile disclosure, figure interaction, responsive overflow, reduced motion, metadata, and axe checks. New assertions cover the four feature chapters, three AnalysisFlow steps, feature anchors, CTA destination, removed legacy section/key names, media slot semantics, and the updated order. Asset approval and real Telegram delivery remain user-owned manual checks.

Alternatives considered:

- Add a separate landing test harness: rejected because the existing component and Playwright seams already observe the external behavior at the right level.

## Risks / Trade-offs

- [Risk] Four chapters make the page longer → Use concise copy, alternate media and copy, and keep supporting details inside the relevant chapter.
- [Risk] Media is unavailable when implementation starts → Preserve complete text-first chapters and track each asset slot with locale, source, dimensions, and approval state.
- [Risk] Telegram copy overpromises delivery or exclusivity → Keep the claim matrix tied to configured routes, active destinations, schedules, and backend-owned content.
- [Risk] Removing old sections breaks anchors or callers → Update route-local composition, dictionaries, locale hash allow-list, tests, and static searches together; do not keep hidden compatibility anchors.
- [Risk] Live-chart wording implies universal real-time coverage → Use live wording for chart updates while retaining availability and stale/disconnected/market-closed boundaries in detailed copy.
- [Risk] AI wording implies graph-node chat or complete evidence → State that the Assistant uses Knowledge Graph context for text conversation and retain the existing exclusions.

## Migration Plan

1. Apply the delta specs to update the landing contract and localization contract.
2. Update dictionaries, route-local section composition, feature anchors, CTA behavior, and responsive layout.
3. Remove obsolete WorkspaceAssistant, old Hero proof, old four-step flow, Reaction & Evidence chapter, copy keys, and test assertions that no longer have callers.
4. Prepare and integrate the four approved-gated media slots; keep text-first fallback for missing locale assets.
5. Run targeted component/browser tests, localization checks, static forbidden-copy searches, lint, typecheck, build, and OpenSpec validation.
6. Perform manual review for product-capture approval, Telegram delivery, light/dark visual quality, and localized media before release approval.

Rollback is a source change rollback before deployment. No backend or data migration is required. Apex cutover remains a separate change.

## Open Questions

None for the approved scope. The exact demo data, crops, captions, and alt text for the four media slots are asset-preparation decisions constrained by the approval checklist, not product-requirement decisions.
