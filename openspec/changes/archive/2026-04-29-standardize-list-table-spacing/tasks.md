## 1. Scope Audit

- [x] 1.1 Audit active list usages of `AppListToolbar`, `AppListTable`, and `AppPaginationControls`.
- [x] 1.2 Audit active list skeletons using `AppListTable` inside parent `gap-6` wrappers.
- [x] 1.3 Identify any `AppListTable` usage without a preceding toolbar where default `mt-4` would be visually wrong.
- [x] 1.4 Confirm graph view, market query workbench, detail pages, form shells, and dialogs are out of scope.

## 2. Shared Primitive Spacing

- [x] 2.1 Remove default `mb-6` from `AppListToolbar` while preserving internal `gap-4`, alignment, and responsive behavior.
- [x] 2.2 Add default `mt-4` to `AppListTable` while preserving radius, border, background, and clipping behavior.
- [x] 2.3 Keep `AppPaginationControls` spacing behavior unchanged.
- [x] 2.4 Add an override through existing `className` only for any audited `AppListTable` context that should not receive top spacing.

## 3. List Skeleton And Wrapper Cleanup

- [x] 3.1 Adjust `blogs/page.tsx` skeleton wrapper if `AppListTable mt-4` creates double spacing.
- [x] 3.2 Adjust `cronjobs/page.tsx` skeleton wrapper if `AppListTable mt-4` creates double spacing.
- [x] 3.3 Adjust `ai-provider-configs/page.tsx` skeleton wrapper if `AppListTable mt-4` creates double spacing.
- [x] 3.4 Audit other active list skeletons/fallbacks for double toolbar-to-table spacing.

## 4. Guidance

- [x] 4.1 Update `AGENTS.md` toolbar guidance so `AppListToolbar` owns internal layout only, not external vertical spacing.
- [x] 4.2 Update `AGENTS.md` table/list guidance so `AppListTable` owns the default `mt-4` spacing from toolbar/list controls.
- [x] 4.3 Update `AGENTS.md` review expectations to flag page-local toolbar margins and double-spacing wrappers.

## 5. Verification

- [x] 5.1 Run grep checks for `AppListToolbar` default bottom margin and page-local toolbar margin drift.
- [x] 5.2 Run grep checks for list skeleton wrappers that still double the toolbar-to-table gap.
- [x] 5.3 Run `pnpm typecheck`.
- [x] 5.4 Run `pnpm build` if multiple list pages or skeletons are touched.
- [x] 5.5 Smoke inspect representative list loaded and loading states if a local authenticated session is available.
