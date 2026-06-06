## 1. User Management Contract

- [x] 1.1 Add user management response and request types under `app/lib/users/definitions.ts`, including `roleId` for create/update requests.
- [x] 1.2 Add server actions for searching users through `GET /user`, creating users through `POST /user`, and updating users through `PATCH /user/{id}` with `fetchAuthenticated()`.
- [x] 1.3 Ensure user search omits empty email, name, and phone values from the backend request.
- [x] 1.4 Reuse `getRoles()` from `app/api/roles/action.ts` for role dropdown data.
- [x] 1.5 If backend API mapping changes are available, update `docs/api_mapping.json` and regenerate `docs/APIMAPPING.md` with the api mapping sync workflow. No updated backend mapping was available in this change.

## 2. Navigation And Access

- [x] 2.1 Add localized navigation and breadcrumb copy for `Quản lý người dùng`.
- [x] 2.2 Add a settings sidebar item at `/users` gated by `user:update`.
- [x] 2.3 Create `app/[lang]/(main)/users/page.tsx` with `user:update` access gating and no page-level main Card shell.
- [x] 2.4 Create `app/[lang]/(main)/users/error.tsx` for local route errors.

## 3. Search And List

- [x] 3.1 Add `user-search.tsx` with three controlled search inputs for email, name, and phone.
- [x] 3.2 Persist non-empty search params on the URL, remove empty params, debounce updates by 300ms, and reset `page` to `1` on search changes.
- [x] 3.3 Render the user list with `AppListToolbar`, `AppListTable`, `AppListTableEmptyState`, page size controls, and pagination behavior aligned with the backend response shape.
- [x] 3.4 Keep long names, emails, workspace names, and role names from expanding the table horizontally.
- [x] 3.5 Add Suspense skeletons that mirror the final toolbar, table, and pagination layout.

## 4. Create And Update Dialogs

- [x] 4.1 Add a `Tạo người dùng` toolbar button that opens a create dialog.
- [x] 4.2 Add row edit actions that open an update dialog for the selected user.
- [x] 4.3 Build the shared dialog form field primitives for email, first name, last name, phone, birthday, and role.
- [x] 4.4 In create mode, submit `email`, `firstName`, `lastName`, `phone`, `birthday`, and `roleId` to `POST /user`.
- [x] 4.5 In update mode, render email as disabled/read-only and submit only `firstName`, `lastName`, `phone`, `birthday`, and `roleId` to `PATCH /user/{id}`.
- [x] 4.6 Add pending submit spinners, disabled submit states, ghost cancel actions, form reset behavior, and localized sonner toast feedback.

## 5. Verification

- [x] 5.1 Run OpenSpec validation for `add-user-management-screen` when the CLI is available. Attempted; OpenSpec CLI is not available in PATH.
- [x] 5.2 Run typecheck.
- [x] 5.3 Run lint.
- [x] 5.4 Static-review the implementation for URL search state, omitted empty params, `fetchAuthenticated()` usage, role `id` to `roleId` mapping, disabled update email exclusion, shadcn wrapper composition, i18n usage, permission gating, table overflow handling, and skeleton layout parity.

User-owned manual QA note: confirm with the backend that `GET /user` accepts search values in a `fetch`-compatible way, that the user response is either a list or paginated page as expected, and that `GET /roles` is accessible to operators with `user:update`.

## 6. Keyword Search Refinement

- [x] 6.1 Replace the three user search inputs with one keyword search input following the cronjob `useOptimistic`, debounce, `router.replace()`, and `InputGroup` pattern.
- [x] 6.2 Use `email[containsIgnoreCase],firstName[containsIgnoreCase],lastName[containsIgnoreCase],phone[containsIgnoreCase]` as the single user search URL param key and remove it when the trimmed keyword is empty.
- [x] 6.3 Update the `/users` page data loading to build a filter with `buildFilterQuery(filterParams)` and pass that filter to the user search server action.
- [x] 6.4 Update user search API typing/action shape so `GET /user` receives the generated filter instead of separate email, name, and phone values.
- [x] 6.5 Update user search dictionary copy, toolbar layout, and skeleton to reflect one search input.
- [x] 6.6 Run typecheck, lint, static review, and OpenSpec validation when the CLI is available.

## 7. Search Input Stability Refinement

- [x] 7.1 Replace debounce-on-change user search URL updates with local input state that commits the URL only when the operator presses Enter.
- [x] 7.2 Keep URL synchronization for refresh and Back/Forward navigation by syncing local input state from the current search param.
- [x] 7.3 Update search placeholder copy and OpenSpec scenarios to communicate Enter-to-search behavior.
- [x] 7.4 Run typecheck, lint, static review, and OpenSpec validation when the CLI is available.
