## Why

The backend cronjob API no longer supports frontend-created or frontend-deleted cronjobs, and `PATCH /cronjobs/{id}` now updates only the schedule expression. The current UI still exposes create/delete and a full edit page, so it can send unsupported payloads and present cronjobs as user-managed entities instead of backend-defined system jobs.

## What Changes

- Remove the cronjob create flow from the frontend, including the create route, create action, toolbar action, and `cronjob:create` UI gate.
- Remove the cronjob delete flow from the frontend, including the delete action, row delete control, confirmation dialog, and `cronjob:delete` UI gate.
- Remove the current cronjob detail/update page as an editing destination.
- Replace detail-page schedule editing with inline cron expression editing directly from the cronjob list.
- Keep the list focused on existing backend cronjobs: name, group, status, cron expression, description, and next trigger time.
- Update the cronjob request type and update action so the frontend sends only `{ expression }` to `PATCH /cronjobs/{id}`.
- Keep existing start, pause, and resume actions.
- Do not implement the backend `POST /cronjobs/{id}/stop` operation in this change.
- Reconsider the edit affordance position for inline editing so the action is visually tied to the cron expression rather than treated as a page-level navigation action.
- Update documentation and verification notes so cronjobs are described as schedule-managed system jobs rather than CRUD entities.

## Capabilities

### New Capabilities

- `cronjob-schedule-management`: Covers the frontend cronjob list, permission-gated controls, and inline schedule-expression updates for backend-defined cronjobs.

### Modified Capabilities

- None.

## Impact

- Affects `app/(main)/cronjobs`, `app/api/cronjobs/action.ts`, `app/lib/cronjobs/definitions.ts`, cronjob permission usage, and cronjob API mapping documentation.
- Removes unsupported frontend calls to `POST /cronjobs` and `DELETE /cronjobs/{id}`.
- Does not add dependencies, change backend endpoints, change global theme tokens, or edit shared shadcn primitives.
