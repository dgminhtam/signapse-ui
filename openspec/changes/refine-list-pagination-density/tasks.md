## 1. Pagination Density

- [x] 1.1 Update `PaginationNavigation` in `components/app-pagination-controls.tsx` so previous, next, and numbered page buttons use compact icon button density.
- [x] 1.2 Align pagination ellipsis visual size with the compact page navigation controls.
- [x] 1.3 Update the shared pagination summary copy to `text-xs text-muted-foreground`.

## 2. Scope Guardrails

- [x] 2.1 Confirm toolbar controls, search input, sort select, and page-size select keep their existing default shadcn control height and typography.
- [x] 2.2 Avoid global Button, theme token, and unrelated `components/ui` changes unless implementation proves an app-level ellipsis override is not possible.

## 3. Verification

- [x] 3.1 Run `pnpm typecheck`.
- [x] 3.2 Run targeted lint for `components/app-pagination-controls.tsx`.
- [x] 3.3 Run `openspec validate refine-list-pagination-density --strict`.
- [x] 3.4 Review at least one multi-page list footer to confirm the pagination footer feels visually secondary and remains readable.
