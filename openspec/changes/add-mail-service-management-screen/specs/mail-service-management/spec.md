## ADDED Requirements

### Requirement: Authorized operators can access mail service management
The system SHALL provide a protected mail service management screen inside the localized main application route group for operators with `mail-service:all`.

#### Scenario: Navigation is shown to authorized operators
- **WHEN** the current user has `mail-service:all`
- **THEN** the sidebar shows `Quản lý email dịch vụ`
- **AND** the item links to the localized `/mail-service` route

#### Scenario: Navigation is hidden from unauthorized users
- **WHEN** the current user does not have `mail-service:all`
- **THEN** the sidebar does not show the mail service management item

#### Scenario: Mail service route is protected
- **WHEN** a user without `mail-service:all` visits `/{lang}/mail-service`
- **THEN** the app renders an access denied state
- **AND** the access denied state identifies `mail-service:all` as the required permission

#### Scenario: Mail service page is rendered
- **WHEN** an authorized operator visits `/{lang}/mail-service`
- **THEN** the page renders inside the existing protected main sidebar and header layout
- **AND** the page does not add a main card shell that duplicates breadcrumb identity

### Requirement: Operators can inspect configured host mail accounts
The system SHALL render configured host mail accounts from the backend in the shared list table pattern.

#### Scenario: Mail accounts are loaded
- **WHEN** the mail service page loads for an authorized operator
- **THEN** the frontend requests provider options from `GET /mail-service/provider`
- **AND** the frontend requests configured mail accounts from `GET /mail-service`

#### Scenario: Mail accounts are returned
- **WHEN** the backend returns mail account records
- **THEN** the table shows each account's email
- **AND** the table shows each account's provider
- **AND** the table shows whether each account is the active default sender
- **AND** accounts with `is_default=true` are listed before standby accounts
- **AND** each row provides update and delete actions

#### Scenario: No mail accounts exist
- **WHEN** the backend returns no mail records
- **THEN** the table renders an `<Empty>` state through the shared table empty-state surface

#### Scenario: Long mail account data is displayed
- **WHEN** email or provider values are long
- **THEN** the table prevents page-level horizontal overflow
- **AND** long content is truncated, clamped, or wrapped according to the column's layout strategy

#### Scenario: Backend returns multiple default mail accounts
- **WHEN** more than one returned mail record has `is_default=true`
- **THEN** the UI surfaces a localized warning that the backend default state is inconsistent
- **AND** the UI does not locally choose a single default winner

### Requirement: Operators can create host mail accounts
The system SHALL let authorized operators create a host mail account with a provider, password, and optional default status.

#### Scenario: Create dialog is opened
- **WHEN** the operator activates `Tạo mail`
- **THEN** the app opens a create dialog
- **AND** the dialog includes email, provider, password, and default switch fields
- **AND** provider options come from `GET /mail-service/provider`

#### Scenario: Mail account is created
- **WHEN** the operator submits valid create values
- **THEN** the app calls `POST /mail-service`
- **AND** the request includes `email`, `provider`, `password`, and `is_default`
- **AND** the submit button is disabled and shows a spinner while pending
- **AND** the app shows localized success or error feedback
- **AND** the mail list refreshes from `GET /mail-service` after success

#### Scenario: Create is cancelled
- **WHEN** the operator cancels the create dialog
- **THEN** no create request is sent
- **AND** the form state is cleared or reset before the next create attempt

### Requirement: Operators can update host mail password and active default state
The system SHALL let authorized operators update only password and default state for an existing host mail account.

#### Scenario: Update dialog is opened
- **WHEN** the operator activates a row edit action
- **THEN** the app opens an update dialog for the selected mail account
- **AND** the dialog pre-fills email and provider as read-only values
- **AND** the dialog includes password and default switch fields
- **AND** the password field is prefilled from the selected list record when the backend includes `password`
- **AND** the password field can be revealed or hidden with an accessible icon button

#### Scenario: Mail account is updated
- **WHEN** the operator submits valid update values
- **THEN** the app calls `PATCH /mail-service`
- **AND** the request includes the selected account's original `email`
- **AND** the request includes the selected account's original `provider`
- **AND** the request includes the submitted `password` and `is_default`
- **AND** the UI does not allow changing email or provider
- **AND** the submit button is disabled and shows a spinner while pending
- **AND** the app shows localized success or error feedback
- **AND** the mail list refreshes from `GET /mail-service` after success

#### Scenario: Backend switches active default mail
- **WHEN** the operator updates a mail account with `is_default=true`
- **THEN** the backend unsets the previously default mail account
- **AND** the refreshed list shows the backend's latest default state

#### Scenario: Update is cancelled
- **WHEN** the operator changes update form values and cancels
- **THEN** no update request is sent
- **AND** the form resets to the selected mail account's initially loaded values or closes safely without persisting changes

### Requirement: Operators can delete host mail accounts
The system SHALL let authorized operators delete a host mail account after explicit destructive confirmation.

#### Scenario: Delete confirmation is opened
- **WHEN** the operator activates a row delete action
- **THEN** the app opens an alert dialog
- **AND** the dialog identifies the selected email
- **AND** the dialog communicates that deletion is destructive

#### Scenario: Mail account is deleted
- **WHEN** the operator confirms deletion
- **THEN** the app calls `DELETE /mail-service/{email}`
- **AND** the email path segment is URL-encoded
- **AND** the destructive action button is disabled and shows a spinner while pending
- **AND** the app shows localized success or error feedback
- **AND** the mail list refreshes from `GET /mail-service` after success

#### Scenario: Delete is cancelled
- **WHEN** the operator cancels the delete confirmation
- **THEN** no delete request is sent

### Requirement: Mail service management follows Signapse UI and localization policies
The system SHALL compose the mail service management screen with existing Signapse UI, i18n, and accessibility patterns.

#### Scenario: Mail service UI is rendered
- **WHEN** the mail service screen, table, dialogs, or confirmation actions are displayed
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
