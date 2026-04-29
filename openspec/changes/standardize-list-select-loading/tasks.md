## 1. Select Pending Feedback

- [x] 1.1 Remove spinner rendering from `components/sort-select.tsx`.
- [x] 1.2 Remove spinner rendering from `PaginationPageSizeSelect` in `components/app-pagination-controls.tsx`.
- [x] 1.3 Keep select controls disabled while URL transitions are pending.
- [x] 1.4 Confirm no spinner is rendered inside or beside shared sort/page-size select triggers.

## 2. Page Size Defaults

- [x] 2.1 Change `DEFAULT_PAGE_SIZE_OPTIONS` to `10, 20, 50, 100`.
- [x] 2.2 Change shared page-size defaults from `12` to `10`.
- [x] 2.3 Grep list pages and shared pagination usage for explicit old default `size = "12"` or `defaultSize={12}`.
- [x] 2.4 Update explicit old default `12` usages to `10` when they represent the shared table/list default rather than a product-specific override.

## 3. Guidance

- [x] 3.1 Update `AGENTS.md` so shared toolbar select controls use disable-only pending feedback instead of inline select spinners.
- [x] 3.2 Update `AGENTS.md` so list page-size options are `10, 20, 50, 100` with default `10` unless a product-specific reason is documented.

## 4. Verification

- [x] 4.1 Run `pnpm typecheck`.
- [x] 4.2 Run `git diff --check`.
- [x] 4.3 Run targeted grep checks for inline select spinner usage and old page-size defaults.
- [ ] 4.4 Smoke-check sort and page-size transitions when a browser session is available. Not run in this session because no local browser/dev session was available.
