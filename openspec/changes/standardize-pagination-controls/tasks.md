## 1. Shared Navigation Semantics

- [x] 1.1 Refactor `PaginationNavigation` in `components/app-pagination-controls.tsx` so previous, next, and numbered page controls render real `Button type="button"` controls instead of `PaginationLink` anchors with `href="#"`.
- [x] 1.2 Keep `Pagination`, `PaginationContent`, `PaginationItem`, and `PaginationEllipsis` for structure, but remove app-level dependence on `PaginationLink`, `PaginationPrevious`, and `PaginationNext`.
- [x] 1.3 Preserve current `onPageChange` behavior, 1-indexed page query updates, and unrelated query parameters through `useAppPaginationQuery`.

## 2. Visual State Contract

- [x] 2.1 Render the current page with `Button variant="default" size="icon"` and `aria-current="page"`.
- [x] 2.2 Render inactive numbered pages with `Button variant="outline" size="icon"`.
- [x] 2.3 Render previous and next as icon-only `Button variant="outline" size="icon"` controls.
- [x] 2.4 Use real `disabled` for previous/next bounds and pending route transitions instead of pointer-event-only classes.
- [x] 2.5 Keep the existing pending summary feedback in `AppPaginationControls`.
- [x] 2.6 Remove static page/result-count badges from `AppPaginationControls`; keep the visible item range summary and pending feedback.

## 3. Accessibility And Copy

- [x] 3.1 Add Vietnamese `aria-label` values for previous, next, and each numbered page button.
- [x] 3.2 Ensure icon-only previous/next controls have no visible text but remain understandable to screen readers.
- [x] 3.3 Ensure ellipsis remains non-interactive and exposes the existing screen-reader fallback.
- [x] 3.4 Ensure `totalPages <= 1` footers do not show redundant `n kết quả` or `0 kết quả` badges.

## 4. List Page Consistency

- [x] 4.1 Add `AppSelectPageSize` to `sources` list toolbar if it is still missing.
- [x] 4.2 Add `AppSelectPageSize` to `topics` list toolbar if it is still missing.
- [x] 4.3 Keep page-size controls in the trailing toolbar area and do not reintroduce page-size controls in pagination footers.

## 5. Verification

- [x] 5.1 Run lint for touched pagination and list files.
- [x] 5.2 Run `pnpm typecheck`.
- [ ] 5.3 Smoke check pagination on a list with multiple pages, first page, last page, and during a pending transition if a local authenticated session is available.
