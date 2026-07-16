## Why

The news article detail page still reads like an operational review workspace: wide text measures, labeled cards, balanced description/media columns, and secondary controls compete with the article itself. It should instead provide a calm, single-column reading experience that prioritizes the headline, provenance, summary, image, and article body.

## What Changes

- Constrain the detail page to an editorial reading shell with a narrower long-form text measure, larger body text, and comfortable line height.
- Replace the desktop description/image grid with a single reading flow: headline and provenance, summary, feature image, then body content.
- Remove redundant section labels and card chrome around summary, image, and article body where they do not aid comprehension.
- Surface original-article access beside source and publication metadata while keeping destructive administration in the compact action menu.
- Keep the responsive layout single-column and update the loading skeleton to mirror the simplified reading hierarchy.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `news-article-detail-review-ux`: Reframe the detail route from an operational review surface to a reading-first article surface.
- `news-article-detail-review-alignment`: Replace linked-event-first ordering and status-centric metadata with a consistent editorial reading hierarchy and matching skeleton.
- `news-article-detail-action-media-composition`: Replace primary derivation/reload controls and balanced summary columns with reader-oriented actions and a single-column summary/media flow.
- `news-article-detail-technical-identifier-minimization`: Remove the visible technical information section while retaining original-source access in the primary provenance row.

## Impact

- Affects the `/news-articles/{id}` page, its action menu, loading skeleton, and associated localized copy.
- Requires no API, backend payload, permission, dependency, or list-page changes.
- Supersedes archived detail-page requirements that mandated linked-event review, operational status, derivation/reload actions, and a visible technical metadata section.
