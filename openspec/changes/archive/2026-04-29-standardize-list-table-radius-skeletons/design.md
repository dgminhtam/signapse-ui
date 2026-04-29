## Context

The app already has a shared table surface through `components/app-list-table.tsx` and a shared pagination/footer surface through `components/app-pagination-controls.tsx`. After prior list cleanup, most active list pages resolve into the shared table surface, but the radius tier is still inconsistent: the table shell is `rounded-md` while the footer uses `rounded-xl`.

Several Suspense/list skeletons still hand-build a table placeholder with `rounded-md border` and custom header bars. These skeletons can visually disagree with the final list table surface, especially once the shared table radius changes.

Graph view and market query workbench intentionally use larger and sometimes arbitrary radii to support their canvas/workbench visual direction. They should not be normalized as part of CRUD list table cleanup.

## Goals / Non-Goals

**Goals:**
- Align `AppListTable` with list footer/pagination radius by using `rounded-xl`.
- Ensure list skeleton table shells mirror the shared list table surface rather than self-owned `rounded-md border` wrappers.
- Keep pagination/footer at `rounded-xl`.
- Keep in-table empty states on `AppListTableEmptyState`.
- Preserve all list data fetching, search, sort, pagination, permissions, and action behavior.

**Non-Goals:**
- Do not change graph view or market query workbench radii.
- Do not change form shells, detail surfaces, dashboard tiles, dialogs, or shadcn primitives.
- Do not redesign table row density, columns, copy, empty-state content, or pagination behavior.
- Do not migrate legacy redirect-only list pages unless their skeleton is still active and rendered.

## Decisions

### 1. Promote `AppListTable` to the list surface radius tier

`AppListTable` should use `rounded-xl` because it is a list surface container, not a compact control. This matches `AppPaginationControls`, page-level list skeleton footers, and the current page surface language.

Alternative considered: change pagination/footer to `rounded-md`. Rejected because pagination/footer is already a broader surface container and would visually regress from the newer list hierarchy.

### 2. Use shared table composition for skeleton shells

List skeletons should use `AppListTable` and the shared header row/head pieces where practical. If repeated skeleton rows become noisy, a small helper outside `components/ui` can be introduced, but it should remain list-specific and not hide page-specific column density.

Alternative considered: keep page-local skeleton wrappers and only change `rounded-md` to `rounded-xl`. Rejected because it fixes radius but not header/shell drift.

### 3. Keep empty state ownership unchanged

`AppListTableEmptyState` remains the only in-table empty row pattern for adopted list tables. This change does not need to redesign empty copy or iconography.

Alternative considered: introduce a new empty skeleton/empty helper together with radius cleanup. Rejected as unnecessary scope expansion.

### 4. Explicitly exclude workbench visual direction

Graph and market query screens keep their large or arbitrary radii because they are not CRUD list tables. Their visual language is intentionally more canvas-like and should be handled through feature-specific design changes only.

Alternative considered: global radius cleanup across all `rounded-*` usage. Rejected because it would blur distinct screen identities and create large visual regression risk.

## Risks / Trade-offs

- [Risk] Skeleton helpers may over-abstract column layout -> Mitigation: keep helper optional and allow page-local row skeletons inside the shared shell.
- [Risk] Some active list pages may still use legacy direct table shells -> Mitigation: grep for `rounded-md border`, `border rounded-md`, and direct table wrappers during implementation.
- [Risk] Radius-only change may reveal row/header clipping issues -> Mitigation: rely on existing `overflow-hidden` in `AppListTable` and verify adopted tables visually through build/smoke checks.
- [Risk] Workbench radii may be accidentally included by broad search/replace -> Mitigation: explicitly exclude `app/(main)/graph-view` and `app/(main)/market-query` from implementation tasks.
