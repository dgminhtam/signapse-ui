## Why

Administrators with user management permission need a protected screen to search, create, and update application users from the Signapse sidebar settings area. The current app has personal account profile support through `/me`, role permission management through `/roles`, and Clerk authentication, but it does not provide an operator workflow for managing other users.

The create workflow should treat Clerk as the account source of truth. When an operator creates a user from User Management, the frontend should create the Clerk account from server-side code using only Clerk-native account fields. The backend will then receive Clerk's `user.created` webhook and create the application user record. Application-specific fields such as phone, birthday, and role are edited later after the user appears in the application user list.

## What Changes

- Add a protected user management route at `app/[lang]/(main)/users/`.
- Add a sidebar settings item labeled `Quản lý người dùng` that links to `/users` and is visible only to users with `user:update`.
- Gate the user management page with `user:update`.
- Add a user list with one keyword search input that searches email, first name, last name, and phone.
- Persist the non-empty keyword search value, page, and page size in the URL; omit the search param when the keyword is empty.
- Load users through `GET /user` using the generated `containsIgnoreCase` OR filter for email, first name, last name, and phone.
- Add a `Tạo người dùng` toolbar action that opens a simplified create dialog.
- Create Clerk accounts from the create dialog through a server-side Clerk call using `email`, `firstName`, and `lastName`.
- Rely on the backend Clerk `user.created` webhook to create the application user record.
- Add a row edit action that opens an update dialog.
- Update application user profile and role fields through `PATCH /user/{id}`.
- Load role dropdown options from the existing `GET /roles` API for update only.
- Submit selected roles as `roleId` during update.
- Keep email editable on create but read-only and excluded from update requests.

## Capabilities

### New Capabilities
- `user-management`: Enables authorized operators to search, create Clerk accounts for, and update application users.

### Modified Capabilities
- `sidebar-navigation-hierarchy`: Adds the user management entry under settings.

## Impact

- Affects `config/site.ts` and navigation dictionaries for the settings sidebar item.
- Affects breadcrumb mapping for `/users`.
- Adds user management API actions and TypeScript definitions under `app/api/user/` and `app/lib/users/`.
- Adds a server-side Clerk account creation action using `CLERK_SECRET_KEY`; Clerk must never be called directly from the client.
- Reuses existing role API action `getRoles()` from `app/api/roles/action.ts` for the update role picker.
- Adds route files and client components under `app/[lang]/(main)/users/`.
- Requires localized Vietnamese and English copy for search labels, table columns, dialog fields, validation, actions, pending states, toast messages, and access-denied copy.
- Requires shadcn wrapper composition for Dialog, Select, Field, Input, Button, Spinner, Empty, and shared table/toolbar/pagination components.
- Does not add a full user detail route in this change.
- Does not allow updating a user's email after creation.
- Does not manage permissions directly from the user management screen; role assignment is handled through `roleId`.
- Does not create the application user record directly during create; backend sync owns database creation through Clerk webhook processing.
