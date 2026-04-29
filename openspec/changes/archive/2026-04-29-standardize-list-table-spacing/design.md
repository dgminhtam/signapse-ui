## Context

The list layout is now centered around shared primitives: `AppListToolbar` for search/actions/view controls, `AppListTable` for the table surface, and `AppPaginationControls` for footer/pagination. The current spacing ownership is uneven: `AppListToolbar` owns `mb-6`, while pagination is placed with `mt-4`.

This creates a visual rhythm where toolbar-to-table spacing is 24px and table-to-footer spacing is 16px. Since the toolbar directly controls the table, the table should sit closer to it and spacing ownership should live on the surface that follows.

## Goals / Non-Goals

**Goals:**
- Make list toolbar-to-table spacing 16px through `AppListTable mt-4`.
- Remove default bottom margin from `AppListToolbar`.
- Preserve internal toolbar gaps, responsive behavior, control heights, table radius, and pagination footer spacing.
- Update active list skeletons/wrappers if `AppListTable mt-4` would combine with parent `gap-6` and create double spacing.
- Document the spacing ownership rule in `AGENTS.md`.

**Non-Goals:**
- Do not redesign toolbar layout, search width, sort/page-size controls, table columns, row density, pagination behavior, or empty states.
- Do not change graph view, market query workbench, detail pages, create/update form shells, dialogs, or dashboard surfaces.
- Do not change shadcn primitives in `components/ui`.

## Decisions

### 1. Table owns the gap above the table

`AppListTable` should receive `mt-4`, making the list table surface responsible for its distance from preceding list controls. This mirrors the existing `AppPaginationControls className="mt-4"` pattern, where the footer owns its distance from the table.

Alternative considered: replace toolbar `mb-6` with `mb-4`. Rejected because it still makes the toolbar own spacing to whatever follows, even though `AppListToolbar` should only manage toolbar internals.

### 2. Toolbar becomes layout-only

`AppListToolbar` should keep `flex`, `gap`, alignment, and responsive classes, but should not include a default outer margin. This keeps it reusable when a page needs different follow-up content.

Alternative considered: add a prop such as `spacing="list"`. Rejected because all current list usage wants the same rhythm and the simpler shared primitive is enough.

### 3. Audit wrapper gaps after moving spacing

Some Suspense skeletons use page wrappers like `flex flex-col gap-6`. Once `AppListTable` owns `mt-4`, those wrappers may create extra spacing between toolbar skeleton and table skeleton. Implementation should tighten those wrappers only where needed.

Alternative considered: leave skeleton wrappers as-is. Rejected because loading states should mirror final list rhythm.

### 4. Keep pagination/footer unchanged

`AppPaginationControls` should remain `mt-4` at usage sites because it already matches the desired 16px rhythm and acts as the surface following the table.

Alternative considered: move pagination spacing inside the component globally. Rejected for now because current usage already expresses footer spacing clearly and this change is focused on toolbar/table distance.

## Risks / Trade-offs

- [Risk] `AppListTable mt-4` could add unexpected top spacing in non-toolbar contexts -> Mitigation: audit active usages and allow `className` override if a rare context needs no top margin.
- [Risk] Skeleton wrappers with `gap-6` could double the spacing -> Mitigation: explicitly audit and adjust scoped list skeletons.
- [Risk] Existing pages without `AppListToolbar` but with `AppListTable` gain top margin -> Mitigation: verify if those are list skeleton/fallback contexts or page-local static list tables, and override only when the extra gap is wrong.
- [Risk] Broad cleanup could drift into workbench/detail/form screens -> Mitigation: limit implementation to shared list primitives and active list/skeleton wrappers.
