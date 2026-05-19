## Context

`docs/pdp-quick-view-drawer-nextjs-shadcn.md` currently explains a product-detail quick view pattern using ecommerce concepts such as PDP, product card, cart actions, SKU/slug, and shadcn Drawer. The architectural idea is still valuable for Signapse, but the document does not match the admin dashboard domain or repository conventions.

Signapse has analytical workspaces where context is expensive to rebuild:

- Graph View lets users inspect event and news-article nodes while preserving canvas context.
- Market Charts lets users inspect annotation markers that refer to events, evidence, and source articles.
- Full detail pages for events and news articles already exist and should remain canonical for direct navigation.

This proposal only documents the Signapse pattern. It does not implement parallel routes, intercepted routes, shared detail content, or quick detail UI.

## Goals / Non-Goals

**Goals:**

- Reframe the document around Signapse entity quick detail overlays instead of ecommerce PDP.
- Define when quick detail is appropriate: analytical surfaces where users need detail without losing graph/chart context.
- Document `event` and `news-article` as the first supported entity types.
- Recommend shadcn `Sheet` as the first overlay shell because the repo already has `components/ui/sheet.tsx` and no Drawer primitive.
- Preserve the canonical full-page detail model for reload, copied links, browser history, and accessible full context.
- Capture scope boundaries clearly so a later implementation proposal can reuse the document without re-deciding the pattern.

**Non-Goals:**

- No app code changes in this change.
- No route creation under `app/(main)/@quickDetail`.
- No refactor of event/news article detail pages into reusable content components.
- No new shadcn primitive installation or edits under `components/ui`.
- No changes to graph view, market chart, event, news article, or source-document APIs.

## Decisions

### Use Signapse Entity Quick Detail Terminology

The document will use "entity quick detail overlay" rather than "PDP quick view". The primary entity examples are events and news articles because those are the entities users encounter from graph nodes and market-chart annotations.

Alternative considered: keep the PDP document and add a Signapse appendix. This would preserve the original ecommerce reference, but it would keep irrelevant product/cart language near the implementation guidance and make the document easier to misuse.

### Recommend Sheet Before Drawer

The document will recommend a right-side `Sheet` for Signapse quick detail overlays. This fits the dashboard mental model better than a bottom Drawer, gives more vertical reading space for event/article content, and uses the existing shadcn primitive in this repo.

Alternative considered: add shadcn Drawer. Drawer is useful for mobile-first product quick views, but this change is documentation-only and should not introduce a primitive that the repo does not currently use.

### Keep Full Detail Pages Canonical

The document will describe the route model as one canonical entity URL with two presentations:

- Soft navigation from a supported workspace can render an overlay.
- Hard navigation, reload, or copied link renders the full detail page.

This preserves deep linking and prevents quick detail from becoming a separate URL model.

### Prefer a Shared Main Slot in Future Implementation

The document will describe a future implementation shape using a parallel route slot under `app/(main)/@quickDetail`, with intercepted routes for canonical entity detail URLs. This is guidance only, not an implementation task in this change.

Alternative considered: implement separate quick-detail slots under each workspace such as `graph-view/@quickDetail` and `market-charts/@quickDetail`. That would duplicate route overlays and make reuse harder when more analytical surfaces need the same behavior.

### Keep Popup/Inspector as Summary, Not Full Detail

The document will distinguish between existing local summaries and future quick detail:

- Graph node inspector and chart annotation popup should remain lightweight context summaries.
- Quick detail overlay is the reading surface for richer event/article detail.
- Full detail page remains the complete workspace with all actions and sections.

## Risks / Trade-offs

- Documentation may imply a future implementation commitment before API/page refactors are planned. → Mitigation: mark implementation as future scope and keep this change documentation-only.
- A global quick-detail slot may be technically more involved than per-page overlays. → Mitigation: document it as the recommended future architecture, not a code change in this round.
- Reusing full detail content in a Sheet may lead to cramped or duplicated UI if not refactored carefully later. → Mitigation: document that future implementation should extract focused content components and keep page shell separate.
- Intercepted route behavior can be subtle in App Router. → Mitigation: document smoke checks for soft navigation, hard navigation, reload, copied URL, Back, and Forward.
