## Why

Administrators with user management permission need a protected screen to search, create, and update application users from the Signapse sidebar settings area. The current app has personal account profile support through `/me`, and role permission management through `/roles`, but it does not provide an operator workflow for managing other users.

The user management workflow should be compact and operational: search users from a single keyword input across email, first name, last name, and phone; inspect the returned users in a shared list table; create users from the list toolbar; and update editable user information without leaving the list context. Email is account identity and must not be editable during update.

## What Changes

- Add a protected user management route at `app/[lang]/(main)/users/`.
- Add a sidebar settings item labeled `Quản lý người dùng` that links to `/users` and is visible only to users with `user:update`.
- Gate the user management page with `user:update`.
- Add a user list with one keyword search input that searches email, first name, last name, and phone.
- Persist the non-empty keyword search value, page, and page size in the URL; omit the search param when the keyword is empty.
- Load users through `GET /user` using the generated `containsIgnoreCase` OR filter for email, first name, last name, and phone.
- Add a `Tạo người dùng` toolbar action that opens a create dialog.
- Add a row edit action that opens an update dialog.
- Create users through `POST /user`.
- Update users through `PATCH /user/{id}`.
- Load role dropdown options from the existing `GET /roles` API.
- Submit selected roles as `roleId`.
- Keep email editable on create but read-only and excluded from update requests.

## Capabilities

### New Capabilities
- `user-management`: Enables authorized operators to search, create, and update users.

### Modified Capabilities
- `sidebar-navigation-hierarchy`: Adds the user management entry under settings.

## Impact

- Affects `config/site.ts` and navigation dictionaries for the settings sidebar item.
- Affects breadcrumb mapping for `/users`.
- Adds user management API actions and TypeScript definitions under `app/api/user/` and `app/lib/users/`.
- Reuses existing role API action `getRoles()` from `app/api/roles/action.ts` for the role picker.
- Adds route files and client components under `app/[lang]/(main)/users/`.
- Requires localized Vietnamese and English copy for search labels, table columns, dialog fields, validation, actions, pending states, toast messages, and access-denied copy.
- Requires shadcn wrapper composition for Dialog, Select, Field, Input, Button, Spinner, Empty, and shared table/toolbar/pagination components.
- Does not add a full user detail route in this change.
- Does not allow updating a user's email after creation.
- Does not manage permissions directly from the user management screen; role assignment is handled through `roleId`.
