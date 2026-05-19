## 1. Revert Color Treatment

- [x] 1.1 Remove `--sidebar-active` and `--sidebar-active-foreground` from light theme variables.
- [x] 1.2 Remove `--sidebar-active` and `--sidebar-active-foreground` from dark theme variables.
- [x] 1.3 Remove `--color-sidebar-active` and `--color-sidebar-active-foreground` mappings from `@theme inline`.
- [x] 1.4 Confirm global `--accent`, `--sidebar-accent`, and non-sidebar active treatments are unchanged.

## 2. Preserve Height And Spacing

- [x] 2.1 Preserve top-level and expandable parent sidebar row height at the accepted density.
- [x] 2.2 Preserve child sidebar row height at the accepted density.
- [x] 2.3 Preserve child list right expansion and left indentation.
- [x] 2.4 Preserve parent-child spacing with `py-1` on the child list.

## 3. Navigation Styling Cleanup

- [x] 3.1 Remove custom `bg-sidebar-active`, `text-sidebar-active-foreground`, ring, and shadow classes from sidebar navigation items.
- [x] 3.2 Return active top-level and child items to the original sidebar accent selected treatment.
- [x] 3.3 Remove now-unused `cn` import from `components/app-sidebar.tsx` if no conditional sidebar styling remains.
- [x] 3.4 Preserve collapsed sidebar icon/tooltip behavior and route matching behavior.

## 4. Guidance

- [x] 4.1 Update `AGENTS.md` sidebar guidance so active color follows shadcn/sidebar-accent behavior.
- [x] 4.2 Document that sidebar height, child width, and spacing are the custom AppSidebar concerns.

## 5. Verification

- [x] 5.1 Run grep checks to ensure `sidebar-active` definitions and usages are gone.
- [x] 5.2 Run grep checks to ensure `--accent` and `--sidebar-accent` values were not changed.
- [x] 5.3 Run `pnpm typecheck`.
- [x] 5.4 Smoke inspect expanded and collapsed sidebar states if a local authenticated session is available.

Verification note: `pnpm typecheck` passed. Grep confirmed `sidebar-active` is gone from active implementation files and `--accent` / `--sidebar-accent` values remain unchanged. Browser smoke inspection was not run because no local authenticated session was available in this turn.
