## Context

The protected Signapse app lives under `app/[lang]/(main)` and already provides the authenticated sidebar/header shell, permission context, localized routing, breadcrumbs, Clerk authentication, and shared list/form building blocks. User management should use the existing operational list pattern: toolbar, URL-backed search, shared table, pagination, and local dialogs.

Create and update have different ownership:

- Create provisions a Clerk account from server-side code.
- Backend listens to Clerk `user.created` webhook and creates the application user record.
- Update edits application user fields through the backend after the user exists in the application database.

This keeps Clerk as the account source of truth while keeping application-specific fields such as phone, birthday, and role inside the backend domain.

## Goals / Non-Goals

**Goals:**

- Provide `/users` under the protected localized main route group.
- Show the route in the settings sidebar as `Quản lý người dùng` only when the current user has `user:update`.
- Gate the page itself with `user:update`.
- Let operators search by one keyword that matches email, first name, last name, or phone.
- Persist search, page, and size in the URL.
- Omit empty search values from the URL and reset `page` to `1` when search is committed.
- Render user results in the shared list table surface with action controls.
- Let operators create Clerk accounts through a simplified dialog with email, first name, and last name.
- Let operators update application user fields through a dialog.
- Load role options from `GET /roles` for update.
- Submit role selection as `roleId` during update.
- Keep update email read-only and out of the update payload.

**Non-Goals:**

- Do not add a canonical `/users/{id}` detail route in this change.
- Do not edit user permissions directly; roles remain the assignment mechanism.
- Do not add delete/deactivate user actions unless a later backend contract requires them.
- Do not add avatar upload or media management for users.
- Do not change the existing role permission management screen.
- Do not create UI routes outside `app/[lang]`.
- Do not create the application user record directly during create; backend webhook sync owns database creation from Clerk events.
- Do not send phone, birthday, or role during create.

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

The server-side Clerk create action should also be reachable only from authenticated app code and should be triggered by operators who can access this screen. `CLERK_SECRET_KEY` must never be exposed to client components.

The role dropdown uses `GET /roles` for update. If `GET /roles` is restricted to `role:update`, the implementation should keep the list usable and surface role catalog unavailability in the update dialog rather than letting the page fail.

## Backend And Clerk Contract

### Search Users

Use:

```text
GET /user
```

The user management list uses one multi-field filter param:

```text
email[containsIgnoreCase],firstName[containsIgnoreCase],lastName[containsIgnoreCase],phone[containsIgnoreCase]
```

When the operator enters `nguyen`, the URL should contain that single encoded key:

```text
/users?email%5BcontainsIgnoreCase%5D%2CfirstName%5BcontainsIgnoreCase%5D%2ClastName%5BcontainsIgnoreCase%5D%2Cphone%5BcontainsIgnoreCase%5D=nguyen&page=1&size=10
```

The page should call `buildFilterQuery(filterParams)`, producing:

```text
(containsIgnoreCase(email,'nguyen') or containsIgnoreCase(firstName,'nguyen') or containsIgnoreCase(lastName,'nguyen') or containsIgnoreCase(phone,'nguyen'))
```

Then pass that filter to the user search server action for `GET /user`.

The response is expected to be a paginated page or a list of users. The frontend should normalize either shape into the shared `Page<UserResponse>` view model.

### Create Clerk Account

Use a server-side Clerk Backend API/SDK call. Do not call Clerk directly from the client.

Create input:

```ts
{
  email: string
  firstName: string
  lastName: string
}
```

The server-side action should create a Clerk user with:

```ts
{
  emailAddress: [email],
  firstName,
  lastName
}
```

After Clerk creates the account, Clerk emits `user.created`. The backend receives that webhook and creates the application user record from Clerk data such as Clerk user id, email, first name, and last name.

The create action should not call `POST /user`.

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

Display `role.name`. Use `role.id` as the Select value and submit it as `roleId` during update.

## Search URL Model

Search uses one controlled client component initialized from `useSearchParams()` and synchronized when URL params change. The input value is local state while the operator types, and the URL is committed only when the operator presses Enter.

```ts
const SEARCH_PARAM_KEY =
  "email[containsIgnoreCase],firstName[containsIgnoreCase],lastName[containsIgnoreCase],phone[containsIgnoreCase]"
```

Examples:

```text
/users?email%5BcontainsIgnoreCase%5D%2CfirstName%5BcontainsIgnoreCase%5D%2ClastName%5BcontainsIgnoreCase%5D%2Cphone%5BcontainsIgnoreCase%5D=nguyen&page=1&size=10
/users?page=1&size=10
```

When the operator presses Enter in the search input:

- Trim the value.
- Remove `SEARCH_PARAM_KEY` if the trimmed value is empty.
- Set `SEARCH_PARAM_KEY` when the trimmed value is non-empty.
- Reset `page` to `1`.
- Update the URL with `useTransition` and `router.replace()`.

Search should not update the URL on every keystroke. It should use `InputGroup`, `InputGroupInput`, leading `InputGroupAddon`, idle search icon, pending spinner for the Enter-triggered transition, `type="search"`, an `sr-only` label, and wrapper `w-full sm:w-80 lg:w-96`.

## List Layout

The page remains cardless and renders the shared toolbar, shared table, and pagination surface directly.

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

Submit to the server-side Clerk create action with `email`, `firstName`, and `lastName`.

The success toast should communicate that the account creation request was sent and the application user will appear after backend synchronization. The page can refresh after success, but the newly created user may not appear immediately because webhook processing is asynchronous.

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

- Create user is eventually consistent: Clerk creation can succeed before the backend webhook creates the application user row.
- If backend webhook processing fails, Clerk may contain a user that does not yet exist in the application database; backend webhook processing must be idempotent and retry-safe.
- Clerk create user behavior depends on the project's sign-in/sign-up configuration. If email-only accounts require invitation or password setup, that account activation UX must be handled by Clerk/backend configuration.
- `GET /roles` may be permissioned for role administration rather than user management; frontend should not let that fail the whole list page.
- Backend response shape may be a list or paginated page; frontend should map directly to the actual contract.

## Migration Plan

1. Add user management definitions for user list records, Clerk create request, and backend update request.
2. Add user management server actions for search and update through `fetchAuthenticated()`.
3. Add a server-side Clerk create action for account requests with email, first name, and last name.
4. Reuse `getRoles()` for update role picker options.
5. Add sidebar and breadcrumb dictionary entries.
6. Add `/users` route with access gate, Suspense skeleton, search URL parsing, and initial data load.
7. Build the single keyword user search control, user list table, simplified create dialog, and update dialog.
8. Add localized validation and toast copy.
9. Verify lint, typecheck, static review, and OpenSpec validation when CLI is available.

## Open Questions

- Should the Clerk account be created as immediately usable email-only user, or should the system send an invitation or password setup flow?
- What exact success/error copy should the create dialog use for eventual backend synchronization?
