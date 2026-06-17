# user-management Specification

## Purpose
TBD - created by archiving change add-user-management-screen. Update Purpose after archive.
## Requirements
### Requirement: Authorized operators can access user management
The system SHALL provide a protected user management screen inside the localized main application route group for operators with `user:update`.

#### Scenario: Navigation is shown to authorized operators
- **WHEN** the current user has `user:update`
- **THEN** the settings sidebar shows `Quản lý người dùng`
- **AND** the item links to the localized `/users` route

#### Scenario: Navigation is hidden from unauthorized users
- **WHEN** the current user does not have `user:update`
- **THEN** the settings sidebar does not show the user management item

#### Scenario: User management route is protected
- **WHEN** a user without `user:update` visits `/{lang}/users`
- **THEN** the app renders an access denied state
- **AND** the access denied state identifies `user:update` as the required permission

#### Scenario: User management page is rendered
- **WHEN** an authorized operator visits `/{lang}/users`
- **THEN** the page renders inside the existing protected main sidebar and header layout
- **AND** the page does not add a main card shell that duplicates breadcrumb identity

### Requirement: Operators can search users by keyword
The system SHALL let authorized operators search users from one URL-backed keyword input that matches email, first name, last name, or phone.

#### Scenario: Search input is displayed
- **WHEN** the user management page loads
- **THEN** the toolbar shows one search input
- **AND** the search input has an accessible label
- **AND** the search input is initialized from the current URL search param
- **AND** the input placeholder communicates that email, first name, last name, or phone can be searched

#### Scenario: Search value is persisted in the URL
- **WHEN** the operator enters a keyword search value and presses Enter
- **THEN** the app stores the non-empty trimmed value in the URL param named `email[containsIgnoreCase],firstName[containsIgnoreCase],lastName[containsIgnoreCase],phone[containsIgnoreCase]`
- **AND** the app resets `page` to `1`
- **AND** the app updates the URL without changing it on every keystroke

#### Scenario: Empty search value is omitted from the URL
- **WHEN** the search input is empty after trimming and the operator presses Enter
- **THEN** the multi-field search URL param is removed
- **AND** the URL does not contain an empty keyword search param

#### Scenario: Search request is sent
- **WHEN** the user list is loaded
- **THEN** the frontend requests user data from `GET /user`
- **AND** the request includes a filter generated from `buildFilterQuery`
- **AND** the filter matches the keyword against email, first name, last name, or phone using `containsIgnoreCase`

### Requirement: Operators can inspect users in a shared list table
The system SHALL render user search results in the shared list table pattern.

#### Scenario: Users are returned
- **WHEN** the backend returns user data
- **THEN** the table shows each user's name and email
- **AND** the table shows phone when available
- **AND** the table shows `role_name` when available
- **AND** the table shows current workspace name when available
- **AND** each row provides an edit action

#### Scenario: Optional user data is missing
- **WHEN** phone, role, workspace, birthday, preferred language, image, or permissions are missing
- **THEN** the UI renders localized fallbacks where those values are displayed
- **AND** missing optional data does not break the row layout

#### Scenario: No users match the search
- **WHEN** the backend returns no user records
- **THEN** the table renders an `<Empty>` state through the shared table empty-state surface

#### Scenario: Long user data is displayed
- **WHEN** names, emails, role names, or workspace names are long
- **THEN** the table prevents page-level horizontal overflow
- **AND** long content is truncated, clamped, or wrapped according to the column's layout strategy

### Requirement: Operators can create Clerk accounts from a dialog
The system SHALL let authorized operators create Clerk accounts from the user management list without navigating away.

#### Scenario: Create dialog is opened
- **WHEN** the operator activates `Tạo người dùng`
- **THEN** the app opens a dialog for creating a user account
- **AND** the dialog includes only email, last name, and first name fields
- **AND** the dialog does not include phone, birthday, or role fields

#### Scenario: Clerk account is created
- **WHEN** the operator submits valid create values
- **THEN** the app calls Clerk from server-side code
- **AND** the Clerk request includes `emailAddress`, `firstName`, and `lastName`
- **AND** the app does not call `POST /user` from the create flow
- **AND** the submit button is disabled and shows a spinner while pending
- **AND** the app shows localized success or error feedback
- **AND** the success feedback communicates that the application user appears after backend synchronization
- **AND** the user list refreshes after success

#### Scenario: Backend sync creates the application user
- **WHEN** Clerk emits `user.created` for the created account
- **THEN** the backend webhook creates or updates the application user record
- **AND** the application user can later be found by user management search

#### Scenario: Create is cancelled
- **WHEN** the operator cancels the create dialog
- **THEN** no Clerk create request is sent
- **AND** the form state is cleared or reset before the next create attempt

### Requirement: Operators can update editable user fields from a dialog
The system SHALL let authorized operators update user first name, last name, phone, birthday, and role from a dialog while keeping email read-only.

#### Scenario: Update dialog is opened
- **WHEN** the operator activates a row edit action
- **THEN** the app opens a dialog for the selected user
- **AND** the dialog pre-fills email, last name, first name, phone, birthday, and role
- **AND** the email field is disabled or read-only
- **AND** the role field loads options from `GET /roles`

#### Scenario: User is updated
- **WHEN** the operator submits valid update values
- **THEN** the app calls `PATCH /user/{id}` for the selected user
- **AND** the request includes `firstName`, `lastName`, `phone`, `birthday`, and `roleId`
- **AND** the request does not include email
- **AND** `roleId` is the selected role's `id` value
- **AND** the submit button is disabled and shows a spinner while pending
- **AND** the app shows localized success or error feedback
- **AND** the user list refreshes after success

#### Scenario: Update is cancelled
- **WHEN** the operator changes update form values and cancels
- **THEN** no update request is sent
- **AND** the form resets to the selected user's initially loaded values or closes safely without persisting changes

### Requirement: User management follows Signapse UI and localization policies
The system SHALL compose the user management screen with existing Signapse UI, i18n, and accessibility patterns.

#### Scenario: User management UI is rendered
- **WHEN** the user management screen, table, search controls, or dialogs are displayed
- **THEN** user-facing copy comes from dictionaries instead of hardcoded component strings
- **AND** internal links preserve the active locale
- **AND** shadcn components are used through local wrappers
- **AND** buttons with icons follow the project's icon treatment

#### Scenario: Dialog form controls are displayed
- **WHEN** create or update dialog fields are rendered
- **THEN** each form control has a visible or screen-reader label
- **AND** validation errors are associated with their fields
- **AND** cancel actions use the ghost button treatment
- **AND** submit actions provide pending feedback with `<Spinner>`

