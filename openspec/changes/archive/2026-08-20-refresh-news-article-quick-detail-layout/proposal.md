## Why

News article Quick detail drawer still presents an older article-reading layout than the current full detail page. Analysts opening an article from Graph View or Market Charts encounter inconsistent visual hierarchy, metadata treatment, and media behavior while the overlay is meant to be a focused reader-first surface.

## What Changes

- Refresh the News article Quick detail body against the current detail-page reading hierarchy for description, provenance, optional original-source access, feature image, and Markdown content.
- Keep the Quick detail drawer shell and article presentation independent from the full detail page; this is a baseline alignment, not a shared-component or long-term parity contract.
- Preserve the local workspace overlay lifecycle and omit page shell, canonical-detail navigation, linked events, and event-navigation behavior from News article Quick detail.
- Document `Quick detail drawer` as the canonical term and record the News article-specific exception that intentionally omits a full-detail action.
- Correct the API mapping ledger so it does not imply that article linked events are rendered by detail or Quick detail surfaces.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `workspace-local-quick-detail-overlays`: Align the reader-first News article Quick detail body with the current detail-page baseline while keeping drawer-specific scope and navigation boundaries.
- `entity-quick-detail-overlay-documentation`: Document the News article-specific exception to the usual full-detail escalation guidance.
- `financial-command-surface-design`: Preserve a durable design-rule exception for a complete News article Quick detail reading surface.
- `api-mapping-ledger`: Make the documented News article linked-event rendering status match the actual frontend surfaces.
- `dashboard-event-news-quick-detail`: Keep dashboard News article Quick detail local and focused without a full-page escalation action, while preserving Event behavior.
- `dashboard-latest-news`: Remove the obsolete News article drawer full-page-action expectation from dashboard Latest News behavior.
- `graph-view-quick-detail-overlay`: Align Graph View News article Quick detail content and navigation boundaries with the focused reader-first policy.
- `graph-view-quick-detail-drawer-refinement`: Preserve canonical full-page behavior while limiting the explicit escalation action to entity types that provide it.

## Impact

- Affects the News article Quick detail presentation used by analytical workspaces, plus related glossary, quick-detail pattern, design-policy, and API-mapping documentation.
- Adds focused component coverage for visible drawer behavior.
- Does not change APIs, DTOs, permissions, routes, dependencies, Event Quick detail, or the canonical News article detail page.
