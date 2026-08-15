## MODIFIED Requirements

### Requirement: Scheduled market analysis schedules are API-backed

The system SHALL support scheduled asset analysis schedule listing and management through the Telegram schedule APIs while keeping the schedule surface nested under `SCHEDULED_MARKET_ANALYSIS` and aligned with the live single-asset contract.

#### Scenario: Schedule list renders real records

- **WHEN** `GET /telegram/market-analysis-schedules` succeeds
- **THEN** the nested scheduled asset analysis area shows schedule name, current workspace, destination, timezone, local send times, one scheduled asset, optional output language, status, and applicable row actions from backend data
- **AND** the system does not render `REMOVED` records returned by an incompatible or stale response

#### Scenario: Schedule form submits the documented request

- **WHEN** an authorized user creates or updates a schedule
- **THEN** the system submits `name`, the current `workspaceId`, an active `destinationId`, one required `assetId`, a valid `timezone`, one to four `localTimes`, and an optional `outputLanguageIsoCode`
- **AND** the system does not submit schedule `assetIds` or parse asset symbols as a substitute for IDs

#### Scenario: Schedule form uses current workspace context

- **WHEN** the user opens the schedule form
- **THEN** the system constrains the workspace to the current workspace and loads the complete current workspace watchlist under the accepted small-watchlist assumption
- **AND** the asset picker does not include assets from the global catalog

#### Scenario: Schedule form follows backend time and timezone rules

- **WHEN** the user submits schedule configuration
- **THEN** the system accepts only one to four distinct minute-precision `HH:mm` local times in chronological order and a valid IANA timezone
- **AND** it rejects missing, duplicate, malformed, or over-limit local times before the request is sent

#### Scenario: Schedule output language is preserved

- **WHEN** the user creates a schedule with the default language option
- **THEN** the system omits `outputLanguageIsoCode`
- **AND** when the user edits a schedule with an existing output-language override, the system preselects and resubmits that override unless the user changes it

#### Scenario: Stale schedule scope is recoverable

- **WHEN** a schedule's current asset is no longer in the workspace watchlist or its current destination is no longer active
- **THEN** the form keeps the current value visible as unavailable
- **AND** it prevents save until the user selects a valid watchlist asset and active destination

#### Scenario: Disabled schedules do not reactivate through edit

- **WHEN** a schedule has status `DISABLED`
- **THEN** the operational list exposes no edit or reactivation action for that schedule
- **AND** the schedule remains disabled until a separately supported backend lifecycle changes it

#### Scenario: Schedule mutations are confirmed and refreshed

- **WHEN** an authorized user disables or removes a schedule
- **THEN** the system requires the matching intent-specific `AlertDialog`, calls the documented backend endpoint, shows confirmed feedback, and refreshes the Telegram workspace only after success

### Requirement: Telegram API integration preserves frontend safety boundaries

The system SHALL keep backend-only Telegram webhook handling and Telegram Bot API update schemas out of the frontend configuration surface while validating and mapping schedule requests and responses at the authenticated server-action boundary.

#### Scenario: Webhook endpoint is not user callable

- **WHEN** Telegram API integration is implemented
- **THEN** the system does not expose `/webhooks/telegram/{connectionId}` as a frontend action or control

#### Scenario: Server actions use authenticated fetch

- **WHEN** the frontend calls Telegram schedule endpoints
- **THEN** those calls use `fetchAuthenticated()` from server-side actions and preserve the existing response-text parsing behavior

#### Scenario: Schedule validation rejects malformed form input

- **WHEN** a user submits an empty name, missing destination, missing asset, invalid timezone, missing or duplicate local time, more than four local times, or an unsupported output-language code
- **THEN** the system rejects the request with localized validation feedback before sending it to the backend

#### Scenario: Schedule definitions preserve the live response shape

- **WHEN** a schedule response includes a singular scheduled asset or output language
- **THEN** the frontend models and renders `asset` and `outputLanguage` without converting them into the retired plural asset collection or discarding the language override

## ADDED Requirements

### Requirement: Telegram schedule form uses structured repository controls

The system SHALL provide a focused Dialog form whose controls map directly to the scheduled asset analysis contract and the repository's shadcn form conventions.

#### Scenario: Schedule form opens in a Dialog

- **WHEN** an authorized user starts creating or editing a schedule
- **THEN** the system opens a shadcn Dialog with a labelled title, description, grouped fields, and footer actions
- **AND** the system does not use a Sheet or duplicate full-page form shell inside the overlay

#### Scenario: User selects one workspace asset

- **WHEN** the user opens the asset field
- **THEN** the system presents a required single-select list of the complete current workspace watchlist with symbol and name
- **AND** the submitted value is the selected asset ID

#### Scenario: User configures local send times

- **WHEN** the user edits local send times
- **THEN** the system renders shadcn time Inputs with minute precision, starts with one row, allows at most four rows, and provides accessible add/remove controls
- **AND** each removable row uses the destructive Button variant while the final remaining row stays disabled rather than removable

#### Scenario: User selects a timezone

- **WHEN** the user opens the timezone field
- **THEN** the system presents a grouped shadcn Combobox with region labels, separators, an empty state, human-readable GMT labels, and IANA IDs
- **AND** each item keeps its display label separate from its IANA value while following the grouped `ComboboxGroup`/`ComboboxCollection` pattern
- **AND** selecting an item stores its IANA ID directly, without requiring an exact display-label lookup
- **AND** selecting an item keeps the containing schedule Dialog open and updates its controlled form value

#### Scenario: User selects output language

- **WHEN** the language catalog is available
- **THEN** the system presents a localized language Select with a default-language option and backend-supported languages
- **AND** it does not hardcode a language list in the form

#### Scenario: Current workspace prerequisites are missing

- **WHEN** there is no valid current workspace, active destination, or watchlist asset
- **THEN** the create action remains visible but disabled
- **AND** the form or surrounding schedule surface explains the missing prerequisite

### Requirement: Telegram schedule form preserves input and exposes recoverable states

The system SHALL provide field-level, keyboard-accessible, and recoverable form behavior for schedule creation and update.

#### Scenario: Client validation identifies the invalid field

- **WHEN** the user submits malformed schedule input
- **THEN** the system renders the localized error beside the associated field, sets the field invalid state and description relationship, and moves focus to the first invalid field

#### Scenario: Dirty form close is confirmed

- **WHEN** the user attempts to close a schedule Dialog after changing a field without saving
- **THEN** the system asks for confirmation before discarding the changes
- **AND** a clean form closes without an additional confirmation

#### Scenario: Backend save failure preserves the form

- **WHEN** schedule create or update fails after client validation succeeds
- **THEN** the Dialog remains open, shows the backend error or localized fallback, and retains all user-entered values for retry

#### Scenario: Pending save prevents duplicate interaction

- **WHEN** schedule create or update is pending
- **THEN** the system disables fields, close controls, and duplicate submission while showing the repository spinner treatment

#### Scenario: Successful save closes and refreshes

- **WHEN** the backend confirms schedule creation or update
- **THEN** the system shows localized success feedback, closes the Dialog, and refreshes the Telegram workspace

### Requirement: Telegram schedule lifecycle actions are status truthful

The system SHALL expose schedule actions according to backend lifecycle semantics and use distinct confirmation intent for disabling and deleting.

#### Scenario: Active schedule actions are available

- **WHEN** an authorized manager views an `ACTIVE` schedule
- **THEN** the row exposes Edit, `Vô hiệu hóa`, and Xóa actions

#### Scenario: Disabled schedule exposes only delete

- **WHEN** an authorized manager views a `DISABLED` schedule
- **THEN** the row exposes only Xóa
- **AND** it does not expose Edit, Vô hiệu hóa, or reactivation

#### Scenario: Disable uses a non-delete AlertDialog

- **WHEN** the user chooses `Vô hiệu hóa` for an active schedule
- **THEN** the system opens an AlertDialog with warning intent, explicit terminal-in-UI copy, cancel action, and a pending state
- **AND** it does not use the delete icon or imply that the schedule can be resumed from the UI

#### Scenario: Delete uses a destructive AlertDialog

- **WHEN** the user chooses Xóa for a schedule
- **THEN** the system opens a separate destructive AlertDialog with explicit no-undo copy and a destructive confirmation action

#### Scenario: Lifecycle mutation failure remains recoverable

- **WHEN** disable or delete fails
- **THEN** the AlertDialog remains open with the error, prevents duplicate submission, and provides retry and cancel recovery
- **AND** focus returns to the originating trigger when the dialog closes

### Requirement: Telegram schedule operational states are explicit and responsive

The system SHALL keep schedule data understandable across permissions, viewport sizes, loading, empty, and API failure states.

#### Scenario: Read-only schedule access omits mutation controls

- **WHEN** a user can read schedules but lacks schedule manage permission
- **THEN** the system renders schedule data and a localized read-only explanation
- **AND** it does not render create, edit, disable, or delete controls

#### Scenario: Missing schedule read permission is localized

- **WHEN** the user lacks schedule read permission
- **THEN** the schedule surface shows the existing access-limited state without presenting an empty schedule list

#### Scenario: Loading preserves table composition

- **WHEN** schedule data is loading
- **THEN** the system renders a skeleton with the same table footprint and action-column structure as the settled schedule list

#### Scenario: Empty schedule state avoids duplicate actions

- **WHEN** schedule loading succeeds with no records
- **THEN** the system renders a localized empty state inside the existing table surface
- **AND** it does not duplicate the create action already provided by the schedule header

#### Scenario: Schedule API failure offers recovery

- **WHEN** schedule loading fails
- **THEN** the system renders a localized error state distinct from an empty state
- **AND** it provides a retry action without claiming that no schedules exist

#### Scenario: Schedule table remains usable at narrow widths

- **WHEN** the schedule table is rendered at a narrow viewport or 200 percent zoom
- **THEN** its columns, metadata, status, and action triggers reflow or use safe overflow without page-level horizontal clipping

#### Scenario: Removed schedules are absent from operations

- **WHEN** the backend returns a schedule with status `REMOVED`
- **THEN** the system omits it from the operational table and does not expose lifecycle actions for it

## MODIFIED Requirements

### Requirement: Refined Telegram hierarchy reflects shared infrastructure and feature workflows

The system SHALL present bot connections and destinations as shared Telegram infrastructure, and feature routing as the place where workflow-specific Telegram behavior is managed.

#### Scenario: Top-level configuration order is simplified

- **WHEN** the Telegram configuration workspace is displayed
- **THEN** the top-level content order is readiness summary, bot connections, destinations, and feature routing
- **AND** scheduled asset analysis controls remain nested within the `SCHEDULED_MARKET_ANALYSIS` route

#### Scenario: Market analysis readiness belongs to routing

- **WHEN** the readiness summary communicates scheduled asset analysis state
- **THEN** the copy or placement indicates it is part of route readiness rather than a separate setup pillar

#### Scenario: Nested schedule controls are backend-backed and truthful

- **WHEN** the user opens create, edit, or lifecycle controls from the scheduled asset analysis route area
- **THEN** the system calls the documented schedule backend mutation through the authenticated server action
- **AND** it reports only the state confirmed by the backend

### Requirement: Telegram setup hierarchy is visible

The system SHALL present the Telegram setup dependency chain as Bot Telegram, Điểm nhận, feature routing, and scheduled asset analysis nested inside the scheduled market analysis route.

#### Scenario: Configuration sections render in dependency order

- **WHEN** the Telegram configuration workspace is displayed
- **THEN** the top-level sections appear in the order bot connections, destinations, and feature routing
- **AND** the scheduled asset analysis surface appears inside `SCHEDULED_MARKET_ANALYSIS` rather than as a peer-level section

#### Scenario: Readiness state summarizes setup progress

- **WHEN** the Telegram configuration workspace is displayed
- **THEN** the system shows a compact readiness summary that identifies which setup areas are ready, missing, or blocked
