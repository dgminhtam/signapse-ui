## Context

The current cronjob frontend was built around a broader CRUD contract: create a job, edit job identity and implementation fields on a dedicated page, delete a job, and control runtime state from the list. The current backend snapshot narrows that surface. Cronjobs are backend-defined system jobs; the frontend can list them, read one by id, update only the cron schedule expression, and start/pause/resume them. `POST /cronjobs/{id}/stop` exists in the backend snapshot, but this change intentionally does not expose it.

This means the list becomes the primary workspace. Editing a schedule should feel like changing one field on an existing system job, not entering a full maintenance page.

## Goals / Non-Goals

**Goals:**

- Align frontend cronjob requests and controls with the current backend API.
- Remove unsupported create and delete affordances.
- Remove the dedicated cronjob detail/update page from the active user flow.
- Let users with `cronjob:update` update `cronExpression` directly from the list.
- Keep start, pause, and resume controls available according to their current permissions.
- Keep the list layout stable, scan-friendly, and consistent with shared list table and toolbar conventions.

**Non-Goals:**

- Do not implement `POST /cronjobs/{id}/stop` or expose `cronjob:stop` in the UI.
- Do not add a replacement detail page for cronjobs.
- Do not allow editing `jobName`, `jobGroup`, `jobClass`, or `description`.
- Do not add frontend create/delete support behind feature flags or hidden compatibility paths.
- Do not change backend endpoint paths, permissions, global theme tokens, or shadcn primitive chrome.

## Decisions

1. Treat cronjobs as backend-defined system jobs.

   Remove the create route/action and delete action/dialog instead of hiding them behind unavailable permissions. The backend no longer documents those operations, so retaining dead frontend paths would create drift and misleading UI. Alternative considered: keep the UI but disable create/delete. That would still imply unsupported product capabilities and add unnecessary empty states.

2. Use the list as the only cronjob management surface.

   Remove `/cronjobs/create` and the current `/cronjobs/[id]` edit page from normal navigation. The list already contains the context operators need: job name, group, status, schedule, and next trigger time. Alternative considered: keep `/cronjobs/[id]` as a read-only detail page. The current backend response is small enough that a separate page would mostly repeat the table and fight the user's request to update directly on the list.

3. Put schedule editing in the cron expression cell.

   The edit affordance should sit beside the displayed cron expression in the `Biểu thức cron` column, not in the trailing row-action cluster. When activated, that cell becomes a compact inline editor for the expression with save and cancel controls. This keeps the edit action visually attached to the field being changed. Alternative considered: keep an edit icon in the action column. That makes the action look like page navigation and separates the control from the value being edited.

4. Keep row action controls for runtime state only.

   The trailing `Thao tác` column should contain start, pause, and resume controls. With create/delete removed and schedule edit moved into the schedule cell, the action column becomes narrower and easier to scan. Alternative considered: merge all controls into a menu. That would hide the high-frequency runtime actions and add interaction cost without solving the contract drift.

5. Send the minimal schedule update request.

   Change `CronjobRequest` or introduce a narrower update request type so `updateCronjob(id, request)` sends only `{ expression }`. The inline form should initialize from `cronjob.cronExpression`, validate non-empty expression length, show pending spinner/disabled state while saving, call `router.refresh()` after success, and show Vietnamese `sonner` toasts. Alternative considered: keep the old request shape and rely on backend ignoring extra fields. That is brittle and contradicts the documented contract.

6. Leave backend stop unimplemented.

   Even though the backend exposes `POST /cronjobs/{id}/stop`, this proposal follows the product decision not to add a stop button. Documentation should mark stop as intentionally not integrated rather than an accidental gap. Alternative considered: add a stop button for `RUNNING` jobs. Stop semantics may be operationally sharper than pause/resume and have not been accepted into the UI scope.

## Risks / Trade-offs

- Inline editing inside a table can cause layout shift -> Keep stable column widths, replace only the cron expression cell content, and mirror the final shape in skeletons if skeleton columns change.
- Cron expression validation may be too shallow -> Start with frontend non-empty/length validation that matches the documented schema and rely on backend validation for cron semantics.
- Removing `/cronjobs/[id]` can break bookmarked edit URLs -> Redirect or return not found according to the chosen Next.js route cleanup path, and keep all active navigation on `/cronjobs`.
- Multiple row edits can become noisy -> Allow one active inline editor at a time or make row-local editing clearly isolated with disabled save states.
- Not implementing stop can be mistaken for an oversight -> Document it in `docs/APIMAPPING.md` as intentionally out of frontend scope for this change.
