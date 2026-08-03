## 1. Dashboard Surface

- [x] 1.1 Refactor `app/[lang]/(main)/dashboard/page.tsx` so the successful state renders live workspace and tracked-asset data in the prototype's Current Workspace Card and Item hierarchy while preserving existing permission, error, empty, and management behavior.
- [x] 1.2 Remove the dashboard narrative permission check, request, state, rendering helpers, and unused imports without changing the narrative API action or domain contracts.
- [x] 1.3 Reduce `WorkspaceOverviewSkeleton` to one Current Workspace card whose header, action, metadata, and responsive item grid mirror the final surface.

## 2. Verification

- [x] 2.1 Run targeted static searches confirming the production dashboard has no narrative preview/request references and does not import prototype mock or scenario code.
- [x] 2.2 Run `pnpm lint` and `pnpm typecheck`.
- [x] 2.3 Run strict OpenSpec validation for `simplify-dashboard-current-workspace`.
