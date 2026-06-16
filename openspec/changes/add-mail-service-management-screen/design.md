## Context

The protected Signapse app lives under `app/[lang]/(main)` and already provides authenticated layout, permissions, localized routing, breadcrumbs, shared list surfaces, form shells, shadcn wrappers, and sonner toast feedback. Mail service management should follow the existing operational list pattern while staying smaller than a full CRUD detail feature because the current backend contract identifies mail records by `email` and does not expose an id or detail endpoint.

The backend owns the important invariant:

```text
At any time, only one mail account has is_default = true.
```

When create or update sets `is_default=true`, the backend unsets the previous default. The frontend must refresh the list after successful mutations instead of trying to locally infer the final state.

## Goals / Non-Goals

**Goals:**

- Provide `/mail-service` under the protected localized main route group.
- Show the route in the sidebar as `Quản lý email dịch vụ` only when the current user has `mail-service:all`.
- Gate the page itself with `mail-service:all`.
- Render configured mail accounts in a shared table without a page-level main Card shell.
- Show the active sender clearly with a compact status treatment.
- Let operators create a mail account with email, provider, password, and default state.
- Let operators update only password and default state for an existing email.
- Keep email and provider read-only in update flows.
- Let operators delete a mail account after confirming a destructive action.
- Refresh from `GET /mail-service` after every successful mutation.

**Non-Goals:**

- Do not add search, sort, pagination, or filters in the first version.
- Do not add a canonical `/mail-service/{email}` detail route.
- Do not allow changing an existing record's email or provider.
- Do not expose stored passwords or password previews.
- Do not add a test-send-email action.
- Do not create UI routes outside `app/[lang]`.
- Do not silently fix multiple-default backend anomalies in local UI state.

## Route And Navigation

The route should be created under:

```text
app/[lang]/(main)/mail-service/
├── page.tsx
├── error.tsx
├── mail-service-list.tsx
└── mail-service-form-dialog.tsx
```

The runtime URL is `/{lang}/mail-service`.

`config/site.ts` should add the item under the closest existing administration/settings group:

```text
Quản lý email dịch vụ -> /mail-service
```

The item should require `mail-service:all`. `AppBreadcrumb` should map `mail-service` to the localized navigation label.

## Permissions

The route should use `getCurrentPermissions()` and `hasPermission(permissions, "mail-service:all")`. If permission is missing, render `AccessDenied` with localized copy and the required permission.

The client components should also hide create/update/delete controls when `useHasPermission("mail-service:all")` is false, but the server route gate remains the primary protection.

## Backend Contract

### Get Providers

Use:

```text
GET /mail-service/provider
```

Expected response:

```ts
string[]
```

Provider strings should be displayed as returned unless a later backend contract provides localized labels.

### List Mail Accounts

Use:

```text
GET /mail-service
```

Expected response:

```ts
Array<{
  email: string
  provider: string
  password?: string
  is_default: boolean
}>
```

The frontend should map the backend snake_case field to an internal camelCase view model, or keep the raw API type at the boundary and normalize before rendering.

The frontend should sort the normalized list so records with `is_default=true` appear before standby records.

### Create Mail Account

Use:

```text
POST /mail-service
```

Request:

```ts
{
  email: string
  provider: string
  password: string
  is_default: boolean
}
```

Response:

```ts
{
  email: string
  provider: string
  is_default: boolean
}
```

After success, revalidate or refresh `/mail-service`, close the dialog, reset form state, and reload the list from the backend.

### Update Mail Account

Use:

```text
PATCH /mail-service
```

`email` identifies the record. Existing mail accounts cannot change `email` or `provider`.

Request:

```ts
{
  email: string
  provider: string
  password: string
  is_default: boolean
}
```

Response:

```ts
{
  email: string
  provider: string
  is_default: boolean
}
```

The update dialog should render email and provider as read-only. It should submit the original email/provider plus the new password and default state. After success, refresh `/mail-service` so the backend default transition is reflected.

Setting a non-default account as default can use the same update action with the existing email/provider and `is_default=true`. If the UI offers a row-level "Đặt mặc định" action, it must not require the operator to re-enter the password unless the backend requires password on every PATCH. If password is required by backend validation for all PATCH requests, the row-level set-default shortcut should be omitted and the operator should use the update dialog.

### Delete Mail Account

Assumed backend contract:

```text
DELETE /mail-service/{email}
```

The email path segment must be URL-encoded. After success, refresh `/mail-service`.

If the deleted mail is the default sender, backend behavior should either reject the request or select a new default according to backend rules. The frontend should display backend errors directly through localized action error fallback and should not invent a local replacement default.

## Data And Validation

Use Zod v4 for client form validation.

Create validation:

- `email`: required valid email.
- `provider`: required and selected from provider options.
- `password`: required non-empty string.
- `is_default`: boolean.

Update validation:

- `email`: present from selected row, read-only.
- `provider`: present from selected row, read-only.
- `password`: required non-empty string unless backend later allows password omission.
- `is_default`: boolean.

The password field should use `type="password"` by default, provide a button to reveal or hide the value, and prefill from `password` when the backend includes it in the selected list record.

## List Layout

The page remains cardless and renders shared toolbar and shared table directly.

Suggested columns:

- Email: primary identifier, long values wrapped/truncated safely.
- Provider: provider returned by backend.
- Trạng thái: compact default/standby treatment.
- Actions: edit, set default if feasible, delete.

When `is_default=true`, render a compact status such as `Đang sử dụng`. Non-default rows can render `Dự phòng`.

If the backend returns zero records, render `<Empty>` through `AppListTableEmptyState`.

If the backend returns multiple records with `is_default=true`, render the returned data but surface a localized warning in the list area or through a subdued inline notice so operators know the backend invariant is broken. Do not pick a winner locally.

Long emails or provider names must not expand the table horizontally. Use `min-w-0`, `truncate`, `break-all`, or `whitespace-normal` where appropriate.

## Dialogs And Actions

Use shadcn `Dialog` wrappers for create/update and `AlertDialog` for delete confirmation. All visible copy must come from dictionaries.

### Create Dialog

Opened from `Tạo mail`.

Fields:

- Email
- Provider
- Password
- Default switch

Submit to `POST /mail-service`.

### Update Dialog

Opened from the row edit action.

Fields:

- Email, read-only
- Provider, read-only
- Password
- Default switch

Submit to `PATCH /mail-service`.

Cancel should use `variant="ghost"` and reset form state or safely close without persisting changes.

### Delete Confirmation

Opened from the row delete action.

The confirmation must clearly identify the email being deleted and use destructive action styling. The action calls `DELETE /mail-service/{email}`.

## I18n And Copy

All user-facing copy must come from dictionaries via `getServerDictionary()` or `useLocalization()`.

Vietnamese copy should be professional and direct:

- `Quản lý email dịch vụ`
- `Tạo mail`
- `Cập nhật mail`
- `Địa chỉ email`
- `Nhà cung cấp`
- `Mật khẩu`
- `Đặt làm mail gửi mặc định`
- `Đang sử dụng`
- `Dự phòng`
- `Đặt mặc định`
- `Xóa mail`

Avoid body headings that duplicate breadcrumb identity.

## Risks / Trade-offs

- `PATCH /mail-service` requires `password` in the provided contract. If backend requires password even when only toggling default, row-level set-default is awkward; implementation should either omit the shortcut or confirm backend supports preserving password server-side.
- Email in a path segment for delete must be encoded carefully.
- Provider labels may not be localized if backend returns arbitrary provider names.
- If backend returns multiple defaults, the UI should expose the inconsistency instead of masking it.
- Delete behavior for the current default account needs backend ownership; the UI should display backend rejection if deletion is not allowed.

## Migration Plan

1. Add mail service definitions for provider strings, mail response, create request, update request, and action result shapes.
2. Add server actions for provider list, mail list, create, update, and delete using `fetchAuthenticated()`.
3. Add sidebar and breadcrumb dictionary entries.
4. Add `/mail-service` route with `mail-service:all` access gate, Suspense skeleton, provider loading, and mail list loading.
5. Build the mail list table, empty state, create/update dialog, and delete confirmation.
6. Add localized validation and toast copy.
7. Verify lint, typecheck, static review, and OpenSpec validation when CLI is available.

## Open Questions

- Does backend allow `PATCH /mail-service` to omit password when only setting `is_default=true`? If not, the first implementation should skip row-level set-default and require update dialog submission with password.
- Should deleting the current default mail be rejected by backend, or should backend promote another mail automatically?
