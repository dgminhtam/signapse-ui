## 1. Shared Component Foundation

- [x] 1.1 Create a shared pagination composition component that owns summary, page-size selection, and page navigation for list pages.
- [x] 1.2 Extract or adapt the existing pagination range and query-update logic so page and size transitions use one consistent URL-driven flow.
- [x] 1.3 Replace the current page-size dropdown menu interaction with a select-based control styled through existing shadcn primitives and theme tokens.
- [x] 1.4 Keep `components/ui` unchanged and implement all redesign work in wrapper or shared app-level components.

## 2. UI Rollout

- [x] 2.1 Migrate representative list pages to the new shared pagination surface and remove duplicated summary and page-size markup from those screens.
- [x] 2.2 Roll out the new component to the remaining protected list pages that currently use `AppPagination` and `AppSelectPageSize`.
- [x] 2.3 Standardize shared pagination copy, active states, disabled states, and responsive layout across migrated pages.

## 3. Verification

- [x] 3.1 Verify page navigation preserves unrelated query parameters and blocks invalid page transitions.
- [x] 3.2 Verify page-size updates reset `page` to `1` while preserving search and sort query parameters.
- [x] 3.3 Run typecheck and perform responsive smoke testing for single-page and multi-page result sets.
