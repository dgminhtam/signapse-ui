## Context

The protected Signapse app lives under `app/[lang]/(main)` and already provides the authenticated sidebar/header shell, permission context, localized routing, breadcrumbs, and shared list/form building blocks. List screens such as news outlets use `AppListToolbar`, `AppListTable`, URL-backed filters, page size controls, and pagination. Roles are already available through `getRoles()` which calls `GET /roles` and returns `RoleResponse` values with `key` and `name`.

User management should use the same operational list pattern, but create and update should happen in local dialogs rather than separate detail routes. This keeps administrators in the list context while editing short user profile records.

## Goals / Non-Goals

**Goals:**

- Provide `/users` under the protected localized main route group.
- Show the route in the settings sidebar as `Quản lý người dùng` only when the current user has `user:update`.
- Gate the page itself with `user:update`.
- Let operators search by one keyword that matches email, first name, last name, or phone.
- Persist search, page, and size in the URL.
- Omit empty search values from the URL and reset `page` to `1` when search changes.
- Render user results in the shared list table surface with action controls.
- Let operators create users through a dialog.
- Let operators update users through a dialog.
- Load role options from `GET /roles`.
- Submit role selection as `roleId`.
- Keep update email read-only and out of the update payload.

**Non-Goals:**

- Do not add a canonical `/users/{id}` detail route in this change.
- Do not edit user permissions directly; roles remain the assignment mechanism.
- Do not add delete/deactivate user actions unless a later backend contract requires them.
- Do not add avatar upload or media management for users.
- Do not change the existing role permission management screen.
- Do not create UI routes outside `app/[lang]`.

## Route And Navigation

The route should be created under:

```text
app/[lang]/(main)/users/
├── page.tsx
├── error.tsx
├── user-list.tsx
├── user-search.tsx
└── user-form-dialog.tsx
```

The runtime URL is `/{lang}/users`.

`config/site.ts` should add a settings child item:

```text
Cài đặt
└── Quản lý người dùng -> /users
```

The item should require `user:update`. `AppBreadcrumb` should map `users` to the localized navigation label rather than falling back to a generated segment.

## Permissions

The route should use `getCurrentPermissions()` and `hasPermission(permissions, "user:update")`. If permission is missing, render `AccessDenied` with localized copy and the required permission.

The role dropdown uses `GET /roles`. Because the user management route is authorized by `user:update`, backend access should allow a user with `user:update` to retrieve role options for assignment. If `GET /roles` is restricted to `role:update`, the implementation should surface that as a backend permission contract issue rather than silently hiding role assignment.

## Backend Contract

### Search Users

The agreed endpoint is:

```text
GET /user
```

The user management list should follow the cronjob search pattern: search UI owns one URL-backed input, and the page converts remaining filter params through `buildFilterQuery(filterParams)`.

Use one multi-field filter param:

```text
email[containsIgnoreCase],firstName[containsIgnoreCase],lastName[containsIgnoreCase],phone[containsIgnoreCase]
```

When the operator enters `nguyen`, the URL should contain that single encoded key:

```text
/users?email%5BcontainsIgnoreCase%5D%2Cname%5BcontainsIgnoreCase%5D%2Cphone%5BcontainsIgnoreCase%5D=nguyen&page=1&size=10
```

The page should call `buildFilterQuery(filterParams)`, producing:

```text
(containsIgnoreCase(email,'nguyen') or containsIgnoreCase(firstName,'nguyen') or containsIgnoreCase(lastName,'nguyen') or containsIgnoreCase(phone,'nguyen'))
```

Then pass that filter to the user search server action for `GET /user`. This avoids `GET` request bodies and aligns user management search with the shared list filtering convention used by cronjobs.

The response is a list of users:

```ts
type UserResponse = {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  birthday: string | null
  currentWorkspace: BackendWorkspaceSummary | null
  preferredLanguage: string | null
  mainImage: BackendMediaResponse | null
  role_name: string | null
  permissions: PermissionResponse[]
}
```

If the backend later returns a paginated `Page<UserResponse>` instead of a plain list, the frontend should map directly to the actual contract and keep URL `page` and `size` behavior.

### Create User

Use:

```text
POST /user
```

Submit:

```ts
{
  email: string
  firstName: string
  lastName: string
  phone?: string
  birthday?: string
  roleId: number
}
```

### Update User

Use:

```text
PATCH /user/{id}
```

Submit:

```ts
{
  firstName: string
  lastName: string
  phone?: string
  birthday?: string
  roleId: number
}
```

Email must not be included in the update payload.

### Role Picker

Use the existing:

```text
GET /roles
```

Display `role.name`. Use `role.id` as the Select value and submit it as `roleId`.

## Search URL Model

Search should use one controlled client component initialized from `useSearchParams()` and synchronized when URL params change. The input value should be local state while the operator types, and the URL should only be committed when the operator presses Enter. Use a single constant key:

```ts
const SEARCH_PARAM_KEY =
  "email[containsIgnoreCase],firstName[containsIgnoreCase],lastName[containsIgnoreCase],phone[containsIgnoreCase]"
```

Examples:

```text
/users?email%5BcontainsIgnoreCase%5D%2Cname%5BcontainsIgnoreCase%5D%2Cphone%5BcontainsIgnoreCase%5D=nguyen&page=1&size=10
/users?page=1&size=10
```

An empty keyword should remove the multi-field search param. The implementation should not emit an empty search param.

When the operator presses Enter in the search input:

- Trim the value.
- Remove `SEARCH_PARAM_KEY` if the trimmed value is empty.
- Set `SEARCH_PARAM_KEY` when the trimmed value is non-empty.
- Reset `page` to `1`.
- Update the URL with `useTransition` and `router.replace()`.

Search should not update the URL on every keystroke. It should follow the shared list input composition with `InputGroup`, `InputGroupInput`, leading `InputGroupAddon`, idle search icon, pending spinner for the Enter-triggered transition, `type="search"`, an `sr-only` label, and a single wrapper `w-full sm:w-80 lg:w-96`.

## List Layout

The page should remain cardless and render the shared toolbar, shared table, and pagination surface directly.

Suggested desktop layout:

```text
[Tạo người dùng] [Tìm email, tên hoặc số điện thoại]          [10/trang]

┌────────────────────────────────────────────────────────────────────────┐
│ Người dùng              Số điện thoại   Vai trò      Workspace  Thao tác │
├────────────────────────────────────────────────────────────────────────┤
│ Nguyễn Văn A            090...          Admin       Default    [Sửa]    │
│ a@example.com                                                           │
└────────────────────────────────────────────────────────────────────────┘
```

Suggested columns:

- User identity: full name first, email as secondary text, avatar if available.
- Phone: secondary operational contact.
- Role: display `role_name` or a localized fallback.
- Workspace: display `currentWorkspace.name` or a localized fallback.
- Actions: edit button that opens update dialog.

Long text must not expand the table horizontally. Identity cells should use `min-w-0`, `truncate`, `line-clamp-*`, or `break-words` as appropriate.

Empty results should use `<Empty>` inside `AppListTableEmptyState`.

## Dialogs

Use shadcn `Dialog` wrappers. Dialog composition must keep submit buttons disabled while pending, show `Spinner`, and use localized sonner toast feedback.

### Create Dialog

Opened from `Tạo người dùng`.

Fields:

- Email
- Last name
- First name
- Phone
- Birthday
- Role

Submit `POST /user` with `email`, `firstName`, `lastName`, `phone`, `birthday`, and `roleId`.

### Update Dialog

Opened from the row edit action.

Fields:

- Email, disabled/read-only
- Last name
- First name
- Phone
- Birthday
- Role

Submit `PATCH /user/{id}` with `firstName`, `lastName`, `phone`, `birthday`, and `roleId`. Do not submit email.

Cancel should be `variant="ghost"` and should reset form values or safely close without persisting changes.

## I18n And Copy

All visible user-facing copy must come from dictionaries via `getServerDictionary()` or `useLocalization()`. Vietnamese copy should be professional and direct:

- `Quản lý người dùng`
- `Tạo người dùng`
- `Cập nhật người dùng`
- `Địa chỉ email`
- `Họ`
- `Tên`
- `Số điện thoại`
- `Ngày sinh`
- `Vai trò`
- `Workspace hiện tại`
- `Cập nhật`

Avoid extra body headings that duplicate breadcrumb identity.

## Risks / Trade-offs

- `GET /user` with a request body conflicts with `fetch`; query params or a search POST endpoint would be safer.
- `GET /roles` may be permissioned for role administration rather than user management; backend should allow role catalog access for `user:update` users or expose a dedicated role picker endpoint.
- Backend response shape is currently described as a list, but frontend list policy expects URL pagination. If backend does not paginate, the implementation can still preserve search params and hide pagination until a paginated contract exists, or adapt once the contract is updated.
- Create user email flow may require backend/Clerk invitation or verification behavior. This change only captures the admin form and API call, not email verification UX.

## Migration Plan

1. Add user management definitions for user list records and create/update requests.
2. Add user management server actions for search, create, and update through `fetchAuthenticated()`.
3. Reuse `getRoles()` for role picker options.
4. Add sidebar and breadcrumb dictionary entries.
5. Add `/users` route with access gate, Suspense skeleton, search URL parsing, and initial data load.
6. Build the single keyword user search control, user list table, create dialog, and update dialog.
7. Add localized validation and toast copy.
8. Verify lint, typecheck, static review, and OpenSpec validation when CLI is available.

## Open Questions

- Will `GET /user` return a plain list or a paginated `Page<UserResponse>`?
- Is phone and birthday required for create/update, or optional? The current design treats them as editable fields and keeps request fields optional unless backend validation requires otherwise.
