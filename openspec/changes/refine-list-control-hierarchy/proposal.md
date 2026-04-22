## Why

Admin list pages are currently splitting closely related view controls across two separate surfaces: sort and filters live in the toolbar, while page-size selection lives in the pagination footer. That weakens hierarchy, creates repeated layout drift between features, and makes list screens feel harder to scan and standardize as more management pages are added.

## What Changes

- Introduce a shared list-toolbar controls surface that standardizes how list pages arrange primary actions, search, filters, sort, and page-size selection.
- Move the `records per page` control into the same view-controls cluster as sort and filters when a list page adopts the shared toolbar pattern.
- Refine the shared pagination footer so it focuses on results summary and page navigation instead of also owning page-size selection.
- Standardize the API and responsive behavior of shared list controls so feature pages do not have to hand-compose slightly different toolbar layouts.
- Migrate representative admin list pages to the new control hierarchy without changing backend paging, search, or sort contracts.

## Capabilities

### New Capabilities
- `shared-list-toolbar-controls`: Provide a reusable, responsive control surface for admin list pages that groups primary actions and search on the left and view controls such as filters, sort, and page-size on the right.

### Modified Capabilities
- `shared-pagination-controls`: Update the shared pagination requirements so the footer can focus on summary and page navigation while page-size selection is composed with toolbar-level list controls.

## Impact

- Affected code: `components/app-pagination-controls.tsx`, `components/sort-select.tsx`, new shared toolbar composition component(s), and list pages that currently assemble toolbar controls and pagination independently.
- Affected UX: list pages that adopt the new pattern will get a clearer control hierarchy, more consistent responsive behavior, and less visual weight in the pagination footer.
- APIs: no backend API, DTO, or query-parameter contract changes; the solution continues to use existing `page`, `size`, search, and sort URL parameters.
- Dependencies and patterns: continues to rely on Next.js App Router navigation, existing shadcn primitives by composition only, and repository rules for professional Vietnamese user-facing copy.
