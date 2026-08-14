## 1. Remove Dashboard Create UI

- [x] 1.1 Remove the `Tạo người dùng` toolbar action, create-mode state, create handler, and create-only imports from the user list while preserving search, page-size selection, pagination, and row edit behavior.
- [x] 1.2 Simplify the existing user form dialog to update-only behavior: remove the mode prop and create branches, keep email read-only, retain phone/birthday/role fields, and preserve pending, validation, cancel, focus, and error behavior.

## 2. Remove Clerk Create Boundary

- [x] 2.1 Remove the `createUser` server action and its now-unused Clerk create, Clerk error, and create-permission imports while leaving user reads, managed-user updates, profile updates, and route revalidation intact.
- [x] 2.2 Remove `CreateUserRequest` and any remaining active-code references to direct Clerk user creation without changing Clerk authentication or backend user contracts.

## 3. Update Localized User-Management Content

- [x] 3.1 Remove create-only user dictionary entries from Vietnamese and English dictionaries and rewrite the user-list empty description so it offers search recovery without suggesting dashboard account creation.
- [x] 3.2 Review the implementation against the delta spec and confirm it does not add a `/sign-up` route, invitation flow, approval flow, initial role/workspace assignment, backend API change, or permission-model change.

## 4. Verify The Removal

- [x] 4.1 Run strict OpenSpec validation for `remove-dashboard-user-creation`.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run `pnpm lint`.
- [x] 4.4 Run static searches across active user-management code for `createUser`, `CreateUserRequest`, create-mode branches, direct `client.users.createUser` calls, and removed create-copy keys, then review the final diff for unrelated changes.
