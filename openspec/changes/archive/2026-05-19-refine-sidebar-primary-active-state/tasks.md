## 1. Theme Tokens

- [x] 1.1 Review `app/globals.css` sidebar tokens in light and dark themes before editing.
- [x] 1.2 Change dark `--sidebar-primary` from the blue/purple preset value to a neutral-consistent value aligned with the app's neutral primary/foreground model.
- [x] 1.3 Confirm `--sidebar-primary-foreground` remains readable against `--sidebar-primary` in light and dark themes.
- [x] 1.4 Confirm global `--primary`, `--accent`, chart tokens, and non-sidebar tokens are unchanged unless directly required by this proposal.

## 2. Sidebar State Styling

- [x] 2.1 Update top-level current-page sidebar items in `components/app-sidebar.tsx` to use `bg-sidebar-primary` and `text-sidebar-primary-foreground`.
- [x] 2.2 Update active child sidebar items to use `bg-sidebar-primary` and `text-sidebar-primary-foreground`.
- [x] 2.3 Keep hover treatment on `sidebar-accent` / `sidebar-accent-foreground` for non-active items.
- [x] 2.4 Keep expanded parent and parent-with-active-child treatment on `sidebar-accent` / `sidebar-accent-foreground`.
- [x] 2.5 Ensure parent rows with active children use contextual emphasis only and do not use `sidebar-primary`.
- [x] 2.6 Preserve focus-visible behavior from the shadcn sidebar primitive so focus continues to use `sidebar-ring`.

## 3. Preserve Sidebar Layout

- [x] 3.1 Preserve accepted parent/top-level row height and radius.
- [x] 3.2 Preserve accepted child row height and radius.
- [x] 3.3 Preserve child list left indentation, right-side width expansion, and `py-1` spacing.
- [x] 3.4 Preserve collapsed sidebar icon, tooltip, and route matching behavior.
- [x] 3.5 Confirm `components/ui/sidebar.tsx` is not modified.

## 4. Guidance

- [x] 4.1 Update `AGENTS.md` theme/sidebar guidance to allow current-page sidebar items to use `sidebar-primary` after `sidebar-primary` is neutral-consistent.
- [x] 4.2 Document the finalized sidebar state hierarchy: hover accent, focus ring, open parent accent, parent-with-active-child accent/context, active item primary.
- [x] 4.3 Keep the guidance discouraging custom active tokens, global `accent` hacks, and silent theme token drift.

## 5. Verification

- [x] 5.1 Run `openspec validate refine-sidebar-primary-active-state --strict`.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run targeted lint for `components/app-sidebar.tsx`, `app/globals.css` where applicable, and any touched guidance files if lintable.
- [x] 5.4 Run grep checks for `oklch(0.488 0.243 264.376)` to confirm it is not used as `--sidebar-primary`.
- [x] 5.5 Run grep checks to confirm `components/ui/sidebar.tsx` was not modified.
- [x] 5.6 Smoke review light and dark sidebar states: top-level active, child active, parent open, parent with active child, hover, focus-visible, and collapsed mode.

Verification note: `openspec validate refine-sidebar-primary-active-state --strict`, `pnpm typecheck`, targeted `pnpm lint -- 'components/app-sidebar.tsx'`, and `pnpm build` passed. Grep confirmed the blue/purple value remains only as `--chart-1`, not `--sidebar-primary`, and `components/ui/sidebar.tsx` has no diff. Smoke review was static from token/class behavior because no browser session was started for this change.
