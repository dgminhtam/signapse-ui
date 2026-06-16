## Why

Administrators need a protected screen to manage the host mail accounts used by Signapse to send notification emails to users. The backend supports multiple mail accounts and a single active default account, but the UI does not yet provide an operator workflow for adding accounts, rotating passwords, switching the active sender, or removing obsolete accounts.

The screen should make the active sender obvious, keep secret handling scoped to create/update forms, and refresh from the backend after every mutation so the UI reflects the backend-owned `is_default` invariant.

## What Changes

- Add a protected mail service management route at `app/[lang]/(main)/mail-service/`.
- Add a sidebar settings item labeled `Quản lý email dịch vụ` that links to `/mail-service` and is visible only to users with `mail-service:all`.
- Gate the mail service management page with `mail-service:all`.
- Load provider options from `GET /mail-service/provider`.
- Load configured mail accounts from `GET /mail-service`.
- Sort configured mail accounts so the active default account is always shown first.
- Render mail accounts in a shared list table with email, provider, active/default state, and row actions.
- Add a `Tạo mail` toolbar action for creating a new mail account.
- Create mail accounts through `POST /mail-service` with `email`, `provider`, `password`, and `is_default`.
- Allow updating only `password` and `is_default` for an existing mail account; `email` identifies the record and `provider` is read-only after create.
- Prefill the update password field from the latest list response when the backend includes `password`.
- Update mail accounts through `PATCH /mail-service` with `email`, `provider`, `password`, and `is_default`, preserving the existing provider in the request body.
- Add a destructive delete action using `DELETE /mail-service/{email}`.
- After create, update, set-default, or delete succeeds, refresh the route so the list is reloaded from `GET /mail-service`.
- Do not add search or pagination in the first version unless the backend later returns a paginated contract.

## Capabilities

### New Capabilities

- `mail-service-management`: Enables authorized operators to manage notification sender mail accounts.

### Modified Capabilities

- `sidebar-navigation-hierarchy`: Adds the mail service management entry under settings or the closest existing administration group.

## Impact

- Affects `config/site.ts` and navigation dictionaries for the settings/sidebar item.
- Affects breadcrumb mapping for `/mail-service`.
- Adds mail service API actions under `app/api/mail-service/action.ts`.
- Adds mail service TypeScript definitions under `app/lib/mail-service/definitions.ts`.
- Adds route files and client components under `app/[lang]/(main)/mail-service/`.
- Requires localized Vietnamese and English copy for table columns, form fields, validation, actions, pending states, toast messages, destructive confirmation, empty state, and access-denied copy.
- Requires shadcn wrapper composition for Button, Select, Field, Input, AlertDialog, Dialog or form shell, Spinner, Empty, and shared table/toolbar components.
- Does not add delete backend implementation; this proposal assumes the backend will provide `DELETE /mail-service/{email}`.
- Does not allow editing `email` or `provider` after creation.
- Does not add mail sending test/verification workflow.
