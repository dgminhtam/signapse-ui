## 1. Audit Scope

- [x] 1.1 Audit active list pages that use `AppListTable` and confirm the final table surface is shared.
- [x] 1.2 Audit active list skeletons that still hand-build `rounded-md border` table shells.
- [x] 1.3 Confirm `app/(main)/graph-view` and `app/(main)/market-query` are excluded from implementation.
- [x] 1.4 Confirm pagination/footer surfaces already use `rounded-xl` and should remain unchanged.

## 2. Shared Table Surface

- [x] 2.1 Change `AppListTable` from `rounded-md` to `rounded-xl`.
- [x] 2.2 Verify `AppListTable` keeps border, background, and `overflow-hidden` clipping behavior.
- [x] 2.3 Verify `AppListTableEmptyState` remains the shared in-table empty-state path.

## 3. Skeleton Migration

- [x] 3.1 Migrate `blogs/page.tsx` list skeleton away from a hand-built `rounded-md border` table shell.
- [x] 3.2 Migrate `cronjobs/page.tsx` list skeleton away from a hand-built `rounded-md border` table shell.
- [x] 3.3 Migrate `ai-provider-configs/page.tsx` list skeleton away from a hand-built `rounded-md border` table shell.
- [x] 3.4 Add a small shared list-table skeleton helper outside `components/ui` only if repeated skeleton shell/header markup becomes noisy.
- [x] 3.5 Keep page-specific skeleton row density and column widths where needed.

## 4. Verification

- [x] 4.1 Run grep checks for active list skeletons still using `rounded-md border` or `border rounded-md` table shells.
- [x] 4.2 Run grep checks to confirm graph/market arbitrary radii were not modified by this change.
- [x] 4.3 Run `pnpm typecheck`.
- [x] 4.4 Run `pnpm build` if the implementation touches multiple list page fallbacks.
- [x] 4.5 Smoke inspect representative list loading/final states if a local authenticated session is available.
