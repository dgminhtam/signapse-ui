## 1. Theme Baseline

- [x] 1.1 Update `components.json` so `tailwind.baseColor` is `neutral`.
- [x] 1.2 Restore `app/globals.css` global, chart, and sidebar CSS variables to the shadcn neutral default scaffold.
- [x] 1.3 Restore light `--sidebar-accent` to the shadcn neutral default value.
- [x] 1.4 Confirm no custom `sidebar-active` token or mapping exists.

## 2. Sidebar Color Treatment

- [x] 2.1 Remove app-level selected/current sidebar row overrides that force `sidebar-primary`.
- [x] 2.2 Preserve existing sidebar density, radius, child width, and parent-child spacing improvements in `components/app-sidebar.tsx`.
- [x] 2.3 Confirm hover, open, and selected sidebar row color treatment follows shadcn `sidebar-accent` semantics without editing `components/ui/sidebar.tsx`.

## 3. Guidance

- [x] 3.1 Update `AGENTS.md` to document that global theme tokens use the shadcn neutral default baseline.
- [x] 3.2 Update `AGENTS.md` sidebar guidance so selected/current sidebar color treatment follows the default shadcn neutral sidebar token model unless a future proposal changes it.
- [x] 3.3 Ensure the guidance discourages local component fixes from silently mutating global theme tokens.

## 4. Verification

- [x] 4.1 Run `pnpm typecheck`.
- [x] 4.2 Run `git diff --check`.
- [x] 4.3 Run targeted grep checks for `baseColor`, `sidebar-active`, `data-active:bg-sidebar-primary`, and the shadcn neutral sidebar tokens.
- [x] 4.4 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke-check light and dark sidebar states when a browser session is available. Not run in this session because no local browser/dev session was available.
