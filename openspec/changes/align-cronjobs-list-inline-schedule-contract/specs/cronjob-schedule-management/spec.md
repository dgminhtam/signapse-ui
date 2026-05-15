## ADDED Requirements

### Requirement: Cronjob List Represents Backend-Defined Jobs
The system SHALL present cronjobs as existing backend-defined system jobs on the list page, without frontend create or delete controls.

#### Scenario: User views cronjob list
- **WHEN** a user with `cronjob:read` opens `/cronjobs`
- **THEN** the page displays existing cronjobs with their name, group, status, cron expression, description when present, and next trigger time
- **AND** the page does not display a create cronjob action
- **AND** each row does not display a delete cronjob action

#### Scenario: User lacks removed create and delete permissions
- **WHEN** a user opens `/cronjobs`
- **THEN** the UI does not check or rely on `cronjob:create` or `cronjob:delete` to render active cronjob controls

### Requirement: Cronjob Schedule Is Updated Inline
The system SHALL allow users with `cronjob:update` to update only a cronjob's cron expression directly from the list page.

#### Scenario: User starts editing a cron expression
- **WHEN** a user with `cronjob:update` activates the edit control for a cronjob
- **THEN** the edit control appears in the cron expression area for that row
- **AND** the row shows an inline expression input initialized from the current `cronExpression`
- **AND** the user remains on `/cronjobs`

#### Scenario: User saves a cron expression
- **WHEN** a user submits a new cron expression from the inline editor
- **THEN** the frontend sends `PATCH /cronjobs/{id}` with a request body containing only `expression`
- **AND** the save control is disabled while the request is pending
- **AND** the save control shows pending feedback while the request is pending
- **AND** the list refreshes after a successful update
- **AND** a Vietnamese success toast is shown

#### Scenario: User cancels cron expression editing
- **WHEN** a user cancels inline editing
- **THEN** the inline editor closes without calling the backend
- **AND** the displayed cron expression returns to the value from the current row data

#### Scenario: User lacks update permission
- **WHEN** a user without `cronjob:update` opens `/cronjobs`
- **THEN** cron expressions are displayed as read-only text
- **AND** no inline edit control is available

### Requirement: Cronjob Detail Edit Flow Is Removed
The system SHALL remove the current dedicated cronjob detail/update page from the active schedule editing flow.

#### Scenario: User scans cronjob row actions
- **WHEN** a user views cronjob row actions on `/cronjobs`
- **THEN** the row does not display an edit action that navigates to `/cronjobs/{id}`
- **AND** schedule editing is available only through the inline list editor when permitted

#### Scenario: User uses active navigation
- **WHEN** a user navigates through cronjob controls exposed by the UI
- **THEN** the user stays within the `/cronjobs` list page for schedule management

### Requirement: Runtime Controls Exclude Stop
The system SHALL keep supported start, pause, and resume runtime controls while excluding the backend stop operation from the frontend UI.

#### Scenario: User views runtime actions
- **WHEN** a user views a cronjob row on `/cronjobs`
- **THEN** the row may display start, pause, or resume controls according to the cronjob status and user permissions
- **AND** the row does not display a stop control

#### Scenario: Frontend API actions are aligned
- **WHEN** the cronjob frontend API module is reviewed
- **THEN** it contains actions for documented frontend-supported list, get when still needed by implementation, update schedule, start, pause, and resume behavior
- **AND** it does not add a `stopCronjob()` frontend action for this change
