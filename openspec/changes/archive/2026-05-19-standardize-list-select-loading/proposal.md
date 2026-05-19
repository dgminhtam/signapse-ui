## Why

Sort and record-per-page selects currently show a pending spinner inside or near the select while URL transitions are running, which adds visual noise for a secondary list control. The page-size options also mix grid-oriented and table-oriented values (`12, 20, 40, 80`), making the list density standard less predictable across admin table pages.

## What Changes

- Use disable-only pending feedback for shared list select controls such as sort and page-size selectors.
- Remove spinner indicators from `SortSelect` and `PaginationPageSizeSelect`.
- Keep select width and toolbar layout stable during pending transitions.
- Standardize shared page-size options to `10, 20, 50, 100`.
- Change the default page size from `12` to `10` for shared list pagination helpers.
- Preserve URL-driven behavior: changing sort or page size still updates query params, resets `page` to `1` when appropriate, and preserves unrelated filters.
- Do not change shadcn primitives in `components/ui`.

## Capabilities

### New Capabilities

### Modified Capabilities
- `shared-pagination-controls`: Clarifies default page-size options and pending-state behavior for shared list select controls.

## Impact

- Affected code: `components/sort-select.tsx`, `components/app-pagination-controls.tsx`, `components/app-select-page-size.tsx`, `components/app-pagination-utils.ts`, and list pages that still rely on the shared default page size.
- Affected guidance: `AGENTS.md` may document that toolbar select controls should use disable-only pending feedback rather than embedded spinners.
- APIs/dependencies: none.
