## Context

The shared local quick-detail drawer loads events and news articles for Graph View and Market Charts, then delegates entity-specific rendering to focused content components. The first implementation pass simplified news article quick detail to description, provenance, feature image, and line-clamped plain text, but the drawer remains shorter than desired and displays Markdown syntax instead of the formatted reading surface already used by the canonical detail route.

The drawer shell already owns loading, access-denied, error, full-detail, close, height, and scroll behavior. The change should remain inside the local drawer composition and news article feature.

## Goals / Non-Goals

**Goals:**

- Present article description, provenance, feature image, and content in a calm single-column reading flow.
- Put original-source access beside outlet and publication time.
- Remove status, linked-event review, redundant section chrome, and duplicate source access.
- Give the shared local drawer more vertical reading space while preserving internal scroll containment.
- Render the complete article body through the existing safe Typeset Markdown pipeline.
- Preserve the drawer's canonical full-detail escalation.

**Non-Goals:**

- Changing article data loading, API contracts, permissions, routing, or drawer state.
- Changing event quick-detail content or canonical news article detail behavior.
- Adding a second Markdown renderer, dependency, or new responsive breakpoint.

## Decisions

### Simplify the existing article content component in place

Keep the reader-first description, provenance, feature image, and content composition from the first implementation pass. Keep the shared drawer and event content component unchanged apart from the shared shell height.

### Reuse one Markdown renderer across detail and quick detail

Move `NewsArticleMarkdown` from the `[id]` route folder to the news article feature root and reuse it from both surfaces. The quick-detail client component will lazy-load this existing renderer so `react-markdown` and `remark-gfm` are not added to the initial Graph View or Market Charts bundle. A second Typeset configuration was rejected because it would duplicate safe HTML, heading, table, and typography behavior.

Give the renderer an optional layout `className` merged through the existing `cn()` helper. Keep `max-w-[72ch]` as the detail-page default and pass `max-w-none` only from quick detail so drawer content fills its `max-w-5xl` body without widening the canonical reading route.

### Override height on the local drawer instance

Increase the shared event/news drawer to `min(90svh, 960px)` and set both height and max-height locally so the shadcn wrapper's bottom-drawer `80vh` maximum does not cap it. Keep the existing header, scrolling body, footer, and shared wrapper unchanged. Editing the global drawer primitive was rejected because this is feature layout, not default chrome.

### Reuse existing primitives and payload

Continue using `AppTimeMetadata`, the localized date formatter, existing image selection and alt fallback, and the article URL already present in `NewsArticleResponse`. Reuse the canonical empty-content copy and remove the quick-only fallback once it has no caller.

## Risks / Trade-offs

- **Markdown dependencies could inflate analytical workspace bundles** → Lazy-load the shared renderer only when news article quick detail renders.
- **Long articles require more client rendering and scrolling** → Keep parsing inside the selected article drawer and retain the canonical full-detail action.
- **The taller shared shell also affects event quick detail** → Accept one consistent local drawer height rather than adding entity-specific shell branches.
- **Removing linked events reduces context inside the drawer** → Preserve the full-detail action and event-focused workflows rather than duplicating review UI in quick detail.
