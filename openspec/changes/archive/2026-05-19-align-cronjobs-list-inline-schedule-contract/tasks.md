## 1. Contract And API Cleanup

- [x] 1.1 Re-read `docs/APIMAPPING.md` and `docs/api_mapping.json` for the current cronjob endpoints before editing code.
- [x] 1.2 Update `app/lib/cronjobs/definitions.ts` so the cronjob update request type contains only `expression`.
- [x] 1.3 Remove `createCronjob()` and `deleteCronjob()` from `app/api/cronjobs/action.ts`.
- [x] 1.4 Keep `startCronjob()`, `pauseCronjob()`, and `resumeCronjob()` unchanged except for any needed shared type cleanup.
- [x] 1.5 Do not add `stopCronjob()` or any frontend integration for `POST /cronjobs/{id}/stop`.
- [x] 1.6 Remove unused cronjob create/delete permission checks and imports from cronjob frontend code.

## 2. Route And Page Removal

- [x] 2.1 Remove the `/cronjobs/create` page and create form files.
- [x] 2.2 Remove the current `/cronjobs/[id]` update page and update form files.
- [x] 2.3 Remove list-row edit navigation to `/cronjobs/{id}`.
- [x] 2.4 Verify breadcrumbs, links, and imports no longer reference removed cronjob create/detail routes.

## 3. Inline Schedule Editing

- [x] 3.1 Add a row-scoped inline cron expression editor inside the cron expression table cell.
- [x] 3.2 Place the edit affordance adjacent to the displayed cron expression, not in the trailing row-action cluster.
- [x] 3.3 Gate inline editing with `cronjob:update`; users without permission see read-only cron expressions.
- [x] 3.4 Validate the inline expression as required and bounded to the documented request length.
- [x] 3.5 On save, call `updateCronjob(id, { expression })`, disable controls while pending, show pending feedback, refresh the route, and show Vietnamese success/error toasts.
- [x] 3.6 On cancel, close the editor without calling the backend and restore the displayed value from row data.
- [x] 3.7 Keep the trailing action column focused on start, pause, and resume controls only.
- [x] 3.8 Adjust column widths, empty state, and skeletons so the list remains stable after create/delete/detail actions are removed.

## 4. Documentation And Verification

- [x] 4.1 Update `docs/APIMAPPING.md` so cronjob create/delete are no longer described as active frontend drift after implementation.
- [x] 4.2 Document `POST /cronjobs/{id}/stop` as intentionally not integrated in this frontend change.
- [x] 4.3 Run `pnpm typecheck`.
- [x] 4.4 Run targeted lint for touched cronjob files.
- [x] 4.5 Run `openspec validate align-cronjobs-list-inline-schedule-contract --strict`.
- [x] 4.6 Review the diff for scope drift, especially accidental stop integration, leftover create/delete route code, detail-page navigation, or unrelated shadcn/global theme changes.
