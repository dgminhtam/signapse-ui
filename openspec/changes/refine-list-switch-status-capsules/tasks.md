## 1. Repo Rule Update

- [x] 1.1 Add `AGENTS.md` guidance for list/table row switch controls to use a compact status capsule when toggling a row boolean state inline.
- [x] 1.2 Document that list row switch capsules must keep label and switch in one surface, preserve row-specific `aria-label`, avoid layout shift while pending, and mirror the final shape in skeletons.
- [x] 1.3 Clarify that the rule applies to list/table row toggles, not form switches, dialog switches, or toolbar switches.

## 2. News Outlet List Switch Refinement

- [x] 2.1 Inspect the current news outlet list active column and the market chart event switch capsule for class, spacing, disabled, and accessibility patterns.
- [x] 2.2 Update `ToggleNewsOutletActiveSwitch` so `Đang bật` / `Tạm dừng` and the `Switch` render inside one stable capsule surface.
- [x] 2.3 Preserve `toggleNewsOutletActive`, pending state, permission disabled behavior, per-row `aria-label`, success/error toast, and `router.refresh()`.
- [x] 2.4 Ensure pending feedback does not change column width or shift the row layout.

## 3. Skeleton and Layout Consistency

- [x] 3.1 Update the news outlet list skeleton active column to use a capsule-like placeholder matching the final control width and height.
- [x] 3.2 Confirm the active column width remains stable and does not crowd the primary/source or action columns.

## 4. Verification

- [x] 4.1 Run targeted search to confirm no loose label + switch pattern remains in the news outlet list active column.
- [x] 4.2 Run targeted lint/type validation for the touched news outlet list/page and rule files.
- [ ] 4.3 Smoke check the news outlet list when a local authenticated browser session is available.
