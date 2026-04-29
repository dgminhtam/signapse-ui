## Why

List table surfaces currently use mixed radius and loading shells: the shared table wrapper uses `rounded-md` while pagination/footer surfaces use `rounded-xl`, and several page skeletons still hand-build `rounded-md border` table placeholders. This makes list screens feel subtly inconsistent and lets skeletons drift away from the final table UI.

## What Changes

- Update `AppListTable` to use `rounded-xl`, matching the list pagination/footer surface tier.
- Keep `AppPaginationControls` and list footer treatment at `rounded-xl`; this surface is a list footer container, not an input/control primitive.
- Replace old list skeleton table shells that hand-build `rounded-md border` with shared table-surface composition.
- Prefer `AppListTable`, `AppListTableHeaderRow`, and `AppListTableHead` in list skeletons, or introduce a small shared skeleton helper outside `components/ui` if it reduces repeated markup.
- Keep table empty states routed through `AppListTableEmptyState`; do not let pages create independent empty-state wrappers inside table bodies.
- Exclude graph view and market query workbench radius cleanup. Their large or arbitrary radius values are screen-specific visual direction, not CRUD/list table surface debt.

## Capabilities

### New Capabilities
- `list-table-radius-skeleton-parity`: Defines the radius tier and skeleton parity contract for list table surfaces.

### Modified Capabilities

## Impact

- Affected code: `components/app-list-table.tsx`, active list-page skeletons such as blogs, cronjobs, and AI provider configs, and optionally a small shared list-table skeleton helper outside `components/ui`.
- Affected UX: loaded table surfaces and loading table skeletons align on shell radius, clipping, header treatment, and footer rhythm.
- Not affected: backend APIs, query params, pagination behavior, graph view, market query workbench, form shells, and shadcn primitives under `components/ui`.
