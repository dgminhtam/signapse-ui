## Why

List screens currently let the toolbar own the vertical spacing below it through `mb-6`, while table-to-pagination spacing uses `mt-4`. This makes the search/action cluster feel farther from the table than the table footer rhythm, even though the toolbar directly controls the table.

## What Changes

- Move the toolbar-to-table spacing ownership from `AppListToolbar` to `AppListTable`.
- Remove the default bottom margin from `AppListToolbar` so it only manages internal toolbar layout, alignment, gap, and responsive behavior.
- Add `mt-4` to `AppListTable` so list table surfaces consistently sit 16px below the toolbar or preceding list controls.
- Keep `AppPaginationControls` using `mt-4` so table and pagination/footer spacing share the same rhythm.
- Audit active list pages and list skeletons to avoid double spacing from surrounding `gap-6` wrappers after `AppListTable` owns `mt-4`.
- Update `AGENTS.md` with the list spacing ownership rule.
- Exclude graph view, market query workbench, detail pages, form shells, dialogs, and unrelated surfaces.

## Capabilities

### New Capabilities
- `list-table-spacing-ownership`: Defines spacing ownership between list toolbar, list table surface, and list pagination/footer.

### Modified Capabilities

## Impact

- Affected code: `components/app-list-toolbar.tsx`, `components/app-list-table.tsx`, active list page/skeleton wrappers where spacing would otherwise be doubled, and `AGENTS.md`.
- Affected UX: search/action controls sit closer to the table and list screens use a consistent 16px rhythm between toolbar, table, and pagination/footer.
- Not affected: backend APIs, query params, table columns, pagination behavior, graph/market workbench visual direction, form shells, and shadcn primitives under `components/ui`.
