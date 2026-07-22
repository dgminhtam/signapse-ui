## Why

The news article quick-detail drawer still presents processing status, labeled content chrome, linked-event review, and duplicate source actions, making a focused reading overlay denser than the canonical reader-first detail page. Simplifying the drawer will let users scan the article while preserving an explicit path to the full detail route for deeper work.

## What Changes

- Align news article quick detail with the canonical detail page's reading hierarchy: description, provenance, feature image, and article content.
- Remove processing status, linked-event cards and empty states, redundant content labels and borders, and the duplicate trailing original-article action.
- Place original-article access beside outlet and publication metadata.
- Increase the shared local drawer height to provide more reading space while keeping scrolling inside the drawer.
- Render full article content with the same safe Typeset Markdown treatment as the canonical detail page.
- Let Typeset content use the full news article drawer width while preserving the canonical detail page's readable `72ch` measure.
- Preserve the shared drawer shell, local loading/error/access states, canonical full-detail action, and close behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `workspace-local-quick-detail-overlays`: Change focused news article quick detail from linked-event review content to a simplified reader-first article composition.

## Impact

- Affects the news article quick-detail content component, shared drawer sizing, the reusable article Markdown renderer and its detail-page import, and any now-unused localized quick-detail copy.
- Requires no API, backend payload, permission, routing, drawer-shell, dependency, event quick-detail, or canonical detail-page changes.
