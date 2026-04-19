## Why

Pagination is reused across many admin list pages, but the current experience is fragmented into separate building blocks: page links, page-size controls, and summary text are assembled manually in each screen. That makes it hard to keep layout hierarchy, loading feedback, responsive behavior, and Vietnamese user-facing copy consistent across the dashboard.

This change is needed now because pagination sits on the interaction path of nearly every data-heavy management screen. A stronger shared design will reduce repeated page-level markup, make future list pages easier to build, and create a clearer admin experience without changing backend contracts.

## What Changes

- Introduce a shared pagination controls surface that combines page summary, page-size selection, and page navigation into one reusable component for list pages.
- Redesign the pagination UI to feel more intentional for admin screens, with stronger visual hierarchy, clearer active and disabled states, and responsive behavior that works on narrow and wide layouts.
- Standardize URL-synced pagination behavior using the existing `page` and `size` query parameters, including resetting to page `1` when page size changes.
- Preserve the current data contract and navigation semantics so feature teams can adopt the redesigned pagination without backend changes.
- Keep the redesign strictly at the composition layer and SHALL NOT require changes to core shadcn components under `components/ui`.
- Reduce page-level duplication by moving common pagination copy and layout rules out of individual list screens and into the shared core component.

## Capabilities

### New Capabilities

- `shared-pagination-controls`: Provide a reusable, URL-driven pagination experience for admin list pages that bundles summary, page-size selection, and page navigation into a single responsive control surface.

### Modified Capabilities

- None.

## Impact

- Affected code: `components/app-pagination.tsx`, `components/app-select-page-size.tsx`, new shared pagination composition component(s), and list pages that currently assemble pagination controls manually.
- Affected UX: all list pages that use shared pagination will get consistent layout, copy, pending feedback, and responsive behavior.
- APIs: no backend API or DTO changes; the solution continues to use the existing `page` and `size` query parameters with 1-indexed URLs.
- Dependencies and patterns: continues to rely on Next.js App Router navigation, existing shadcn primitives by composition only, and theme tokens already present in the design system.
