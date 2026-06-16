## 1. Mail Service Contract

- [x] 1.1 Add mail service response and request types under `app/lib/mail-service/definitions.ts`.
- [x] 1.2 Add server actions under `app/api/mail-service/action.ts` for `GET /mail-service/provider`, `GET /mail-service`, `POST /mail-service`, `PATCH /mail-service`, and `DELETE /mail-service/{email}` using `fetchAuthenticated()`.
- [x] 1.3 Ensure delete URL-encodes the email path segment.
- [x] 1.4 Revalidate or refresh `/mail-service` after create, update, and delete mutations.
- [x] 1.5 If backend API mapping changes are available, update `docs/api_mapping.json` and regenerate `docs/APIMAPPING.md` with the api mapping sync workflow. No updated backend mapping was available in this change.

## 2. Navigation And Access

- [x] 2.1 Add localized navigation and breadcrumb copy for `Quản lý host mail`.
- [x] 2.2 Add a sidebar item at `/mail-service` gated by `mail-service:all`.
- [x] 2.3 Create `app/[lang]/(main)/mail-service/page.tsx` with `mail-service:all` access gating and no page-level main Card shell.
- [x] 2.4 Create `app/[lang]/(main)/mail-service/error.tsx` for local route errors.

## 3. List Screen

- [x] 3.1 Load providers and mail accounts on the server page.
- [x] 3.2 Render the mail list with `AppListToolbar`, `AppListTable`, and `AppListTableEmptyState`.
- [x] 3.3 Add a `Tạo mail` toolbar button.
- [x] 3.4 Show email, provider, default/standby status, and row actions.
- [x] 3.5 Keep long email/provider values from expanding the table horizontally.
- [x] 3.6 Add Suspense skeletons that mirror the final toolbar and table layout.
- [x] 3.7 Surface a localized warning if the backend returns more than one `is_default=true` record.

## 4. Create, Update, And Delete Actions

- [x] 4.1 Add a create dialog with email, provider, password, and `is_default` fields.
- [x] 4.2 Add an update dialog with read-only email/provider plus password and `is_default` fields.
- [x] 4.3 Ensure update submits the original email/provider and does not allow editing them.
- [x] 4.4 Add pending submit spinners, disabled submit states, ghost cancel actions, form reset behavior, and localized sonner toast feedback.
- [x] 4.5 Add a delete row action using `AlertDialog` with destructive confirmation and `DELETE /mail-service/{email}`.
- [x] 4.6 Add a row-level set-default shortcut only if backend allows updating `is_default` without resubmitting password; otherwise keep default switching inside the update dialog. PATCH currently requires password, so default switching stays inside the update dialog.

## 5. Verification

- [x] 5.1 Run OpenSpec validation for `add-mail-service-management-screen` when the CLI is available. Attempted; OpenSpec CLI is not available in PATH.
- [x] 5.2 Run typecheck.
- [x] 5.3 Run lint.
- [x] 5.4 Static-review the implementation for permission gating, `fetchAuthenticated()` usage, create/update/delete refresh behavior, read-only update email/provider, encoded delete email, shadcn wrapper composition, i18n usage, table overflow handling, skeleton layout parity, and default-state invariant handling.

User-owned manual QA note: confirm with the backend that `DELETE /mail-service/{email}` is implemented, that `PATCH /mail-service` accepts the proposed update body, and whether setting `is_default=true` can be done without re-entering the password.

## 6. Email Service Refinement

- [x] 6.1 Rename navigation and breadcrumb copy to `Quản lý email dịch vụ`.
- [x] 6.2 Sort mail records so `is_default=true` records appear at the top of the list.
- [x] 6.3 Add optional `password` to list response typing and normalize it into the edit form model.
- [x] 6.4 Prefill the edit password field from the selected mail record when available.
- [x] 6.5 Add an accessible eye toggle to show or hide the password field.
- [x] 6.6 Update OpenSpec proposal, design, and spec scenarios for the refinement.
