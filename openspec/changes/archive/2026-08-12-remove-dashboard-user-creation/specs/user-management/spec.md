## MODIFIED Requirements

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
- **AND** the empty state does not offer or suggest creating a Clerk account from Signapse

#### Scenario: Long user data is displayed
- **WHEN** names, emails, role names, or workspace names are long
- **THEN** the table prevents page-level horizontal overflow
- **AND** long content is truncated, clamped, or wrapped according to the column's layout strategy

### Requirement: User management follows Signapse UI and localization policies
The system SHALL compose the user management screen with existing Signapse UI, i18n, and accessibility patterns.

#### Scenario: User management UI is rendered
- **WHEN** the user management screen, table, search controls, or update dialog are displayed
- **THEN** user-facing copy comes from dictionaries instead of hardcoded component strings
- **AND** internal links preserve the active locale
- **AND** shadcn components are used through local wrappers
- **AND** buttons with icons follow the project's icon treatment

#### Scenario: Update dialog form controls are displayed
- **WHEN** update dialog fields are rendered
- **THEN** each form control has a visible or screen-reader label
- **AND** validation errors are associated with their fields
- **AND** cancel actions use the ghost button treatment
- **AND** submit actions provide pending feedback with `<Spinner>`

## REMOVED Requirements

### Requirement: Operators can create Clerk accounts from a dialog
**Reason**: Public Clerk registration is the supported account creation path, Clerk Dashboard covers exceptional testing accounts, and the Signapse dialog adds no role, workspace, approval, invitation, or other domain onboarding behavior.

**Migration**: Remove the Signapse create action and dialog. Existing and future users continue to enter Signapse through public Clerk registration or manual Clerk Dashboard creation, with the existing `user.created` webhook provisioning the backend user record.
