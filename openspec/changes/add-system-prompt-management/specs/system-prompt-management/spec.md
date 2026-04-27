## ADDED Requirements

### Requirement: System prompt data layer
The system SHALL provide a frontend data layer for the backend `system-prompts` API.

#### Scenario: List system prompts
- **WHEN** the system prompt list page loads with read permission
- **THEN** the frontend MUST call `GET /system-prompts` using authenticated fetch, URL-backed pagination, sort, and filter params

#### Scenario: Fetch system prompt detail
- **WHEN** the edit page loads for a specific `promptType`
- **THEN** the frontend MUST call `GET /system-prompts/{promptType}` using the URL-encoded prompt type

#### Scenario: Create system prompt
- **WHEN** a user submits the create form
- **THEN** the frontend MUST call `POST /system-prompts` with `promptType` and `content`

#### Scenario: Update system prompt
- **WHEN** a user submits the edit form
- **THEN** the frontend MUST call `PUT /system-prompts/{promptType}` with `content`

#### Scenario: Delete system prompt
- **WHEN** a user confirms deletion
- **THEN** the frontend MUST call `DELETE /system-prompts/{promptType}` and revalidate the list route

### Requirement: System prompt permission gating
The system SHALL gate system prompt surfaces and actions using the confirmed system prompt permission keys.

#### Scenario: Read permission is missing
- **WHEN** a user without `system-prompt:read` opens `/system-prompts`
- **THEN** the system MUST render an access denied state before loading protected system prompt data

#### Scenario: Create permission is missing
- **WHEN** a user without `system-prompt:create` views the list page
- **THEN** the system MUST NOT render the create action

#### Scenario: Update permission is missing
- **WHEN** a user without `system-prompt:update` views the list page or edit route
- **THEN** the system MUST NOT allow editing system prompt content

#### Scenario: Delete permission is missing
- **WHEN** a user without `system-prompt:delete` views the list page
- **THEN** the system MUST NOT render the delete action

### Requirement: System prompt list page
The system SHALL provide a `/system-prompts` list page that follows repo list conventions.

#### Scenario: Authorized user views list
- **WHEN** a user with `system-prompt:read` opens `/system-prompts`
- **THEN** the system MUST render a Card-based page with CardHeader, CardTitle, CardDescription, Separator, Suspense skeleton, toolbar, shared table surface, and pagination

#### Scenario: List has data
- **WHEN** the backend returns system prompts
- **THEN** the table MUST show prompt type, workflow group, content length, last modified date, created date, and row actions

#### Scenario: List is empty
- **WHEN** the backend returns an empty page
- **THEN** the system MUST render an `<Empty>` state inside the shared list table surface

#### Scenario: User searches prompts
- **WHEN** the user types into the search input
- **THEN** the system MUST debounce by 300ms, trim the query, reset `page` to `1`, and write the search filter to the URL

#### Scenario: User changes sort or page size
- **WHEN** the user changes sort or page size controls
- **THEN** the system MUST update URL-backed list state and fetch the list with the mapped backend query

### Requirement: System prompt create and edit forms
The system SHALL provide create and edit forms for system prompts.

#### Scenario: Create form renders
- **WHEN** a user with `system-prompt:create` opens `/system-prompts/create`
- **THEN** the system MUST render a form with editable `promptType` select and `content` textarea

#### Scenario: Edit form renders
- **WHEN** a user with `system-prompt:update` opens `/system-prompts/{promptType}`
- **THEN** the system MUST render a form with readonly prompt type context and editable `content` textarea

#### Scenario: Content validation
- **WHEN** a user submits create or edit form
- **THEN** the system MUST require non-empty trimmed content and MUST prevent content longer than `10000` characters

#### Scenario: Submit is pending
- **WHEN** create or update mutation is pending
- **THEN** the submit button MUST be disabled and show a `Spinner`

#### Scenario: Cancel edit
- **WHEN** a user clicks cancel in edit mode
- **THEN** the form MUST reset to the initial backend data or navigate safely without persisting changes

#### Scenario: Submit succeeds
- **WHEN** create or update succeeds
- **THEN** the system MUST show a Vietnamese success toast, navigate to `/system-prompts`, and refresh the route

### Requirement: System prompt deletion
The system SHALL protect deletion behind an explicit confirmation dialog.

#### Scenario: User opens delete confirmation
- **WHEN** a user with `system-prompt:delete` clicks delete for a prompt
- **THEN** the system MUST show an `AlertDialog` explaining that deleting a system prompt can affect AI workflows and cannot be undone from the UI

#### Scenario: Delete succeeds
- **WHEN** deletion succeeds
- **THEN** the system MUST show a Vietnamese success toast and refresh the current route

#### Scenario: Delete fails
- **WHEN** deletion fails
- **THEN** the system MUST show a Vietnamese error toast and keep the dialog or page in a recoverable state

### Requirement: System prompt navigation and documentation
The system SHALL expose system prompt management consistently in navigation and API mapping documentation.

#### Scenario: Navigation is available
- **WHEN** a user has `system-prompt:read`
- **THEN** the left navigation MUST show `Prompt hệ thống` under the `Cài đặt` group and link to `/system-prompts`

#### Scenario: API mapping is updated
- **WHEN** the feature is implemented
- **THEN** `docs/APIMAPPING.md` MUST mark the system prompt endpoints as implemented and list the new frontend files

### Requirement: System prompt Vietnamese UI copy
The system SHALL use professional Vietnamese copy for all user-facing system prompt UI.

#### Scenario: User views system prompt surfaces
- **WHEN** list, search, create, edit, delete, empty, loading, access denied, toast, or error states render
- **THEN** all user-facing labels, placeholders, descriptions, and messages MUST be Vietnamese with proper diacritics and no mojibake
