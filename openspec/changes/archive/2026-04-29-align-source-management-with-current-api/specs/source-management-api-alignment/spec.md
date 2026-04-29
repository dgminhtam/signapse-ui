## ADDED Requirements

### Requirement: Source mutations MUST use the current backend request schema
The system SHALL submit create and update requests for `sources` using only the fields currently supported by backend `CreateSourceRequest` and `UpdateSourceRequest`: `name`, `type`, `description`, `url`, `rssUrl`, and `active`.

#### Scenario: Create source with supported fields only
- **WHEN** an authorized user creates a source from the frontend form
- **THEN** the request payload MUST include only `name`, `type`, `description`, `url`, `rssUrl`, and `active`

#### Scenario: Update source with supported fields only
- **WHEN** an authorized user updates an existing source from the frontend form
- **THEN** the request payload MUST exclude removed advanced fields such as provider, crawl, fetch-limit, and raw configuration values

### Requirement: Source forms MUST expose only fields supported by the current contract
The system SHALL render the `sources` create and edit form using only the currently supported source fields, and MUST remove advanced provider or crawl inputs that no longer map to the backend contract.

#### Scenario: Render create form
- **WHEN** a user opens the create source screen
- **THEN** the form MUST show only the supported basic fields and active-state control required by the current backend schema

#### Scenario: Render edit form
- **WHEN** a user opens the edit source screen for an existing source
- **THEN** the form MUST load and render only the supported current-contract fields plus read-only ingest metadata already returned by the backend

### Requirement: Source management surfaces MUST reflect system-managed state
The system SHALL map `systemManaged` from `SourceResponse` and `SourceListResponse`, surface it visibly in the UI, and use it to reduce unsupported manual actions.

#### Scenario: Identify system-managed source in the list
- **WHEN** a source item has `systemManaged = true`
- **THEN** the source list MUST show a visible badge or equivalent indicator that the source is managed by the system

#### Scenario: Identify system-managed source in the detail screen
- **WHEN** a source detail response has `systemManaged = true`
- **THEN** the detail screen MUST show a visible indicator that the source is managed by the system

### Requirement: System-managed sources MUST be protected from manual mutation affordances
The system SHALL disable or hide manual edit, delete, and active-toggle controls for sources marked as system-managed, while preserving backend error handling as the final authority.

#### Scenario: Block list-level mutations for system-managed sources
- **WHEN** a source item has `systemManaged = true`
- **THEN** the list UI MUST prevent direct edit, delete, and active-toggle interactions for that item

#### Scenario: Render system-managed edit screen as read-only
- **WHEN** a user opens the edit route for a source with `systemManaged = true`
- **THEN** the screen MUST keep the source visible for inspection and MUST disable manual form submission controls

#### Scenario: Preserve legacy behavior for user-managed sources
- **WHEN** `systemManaged` is absent or `false`
- **THEN** the UI MUST preserve the existing permission-based edit, delete, and toggle behavior
