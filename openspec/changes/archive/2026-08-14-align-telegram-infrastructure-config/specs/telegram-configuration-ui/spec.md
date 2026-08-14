## ADDED Requirements

### Requirement: Telegram infrastructure uses responsive configuration surfaces
The system SHALL present Bot Telegram and Điểm nhận as two responsive configuration Cards inside the cardless Telegram workspace, with compact Item-based records instead of data tables.

#### Scenario: Wide workspace presents two infrastructure boundaries
- **WHEN** the Telegram infrastructure area has enough horizontal space
- **THEN** the system presents the Bot Telegram and Điểm nhận Cards in a two-column grid
- **AND** each Card header contains its title, description, and at most one primary action

#### Scenario: Narrow workspace reflows without page overflow
- **WHEN** the workspace is rendered at a narrow supported viewport or at 200 percent zoom
- **THEN** the two Cards stack vertically and each Item reflows its identity, metadata, status, and contextual actions without causing horizontal page overflow

#### Scenario: Operational records follow lifecycle priority
- **WHEN** Bot Telegram or Điểm nhận records are rendered
- **THEN** the system shows actionable `INVALID`, `ACTIVE`, and `DISABLED` records using applicable statuses in operational priority order
- **AND** the system omits `REMOVED` records from the operational list

#### Scenario: Loading state matches final composition
- **WHEN** Telegram configuration data is pending
- **THEN** the loading skeleton preserves the Card and Item footprint of the final Bot Telegram and Điểm nhận surfaces

#### Scenario: Empty state does not duplicate the primary action
- **WHEN** a Bot Telegram or Điểm nhận Card has no operational records
- **THEN** the system renders the localized first-use Empty state inside that Card
- **AND** it does not repeat a primary action already present in the Card header

### Requirement: Telegram infrastructure identity is backend-owned and resilient
The system SHALL treat backend-returned labels and Telegram metadata as read-only identity data and SHALL provide deterministic fallbacks when optional fields are absent.

#### Scenario: Bot identity uses deterministic fallback order
- **WHEN** a Bot Telegram record is rendered
- **THEN** the primary identity uses `displayLabel`, then `botUsername`, then `botFirstName`, then the localized `Bot #<id>` fallback
- **AND** the system does not display its bot token or raw webhook URL

#### Scenario: Invalid bot exposes actionable validation context
- **WHEN** a Bot Telegram record has status `INVALID`
- **THEN** the system exposes its available `failureReason` and latest validation metadata without relying on color as the only status signal

#### Scenario: Destination identity uses deterministic fallback order
- **WHEN** a Điểm nhận record is rendered
- **THEN** the primary identity uses `displayLabel`, then `chatTitle`, then `username`, then the localized `Điểm nhận #<id>` fallback
- **AND** secondary metadata identifies its chat type, linked Bot Telegram, status, and last update when available

### Requirement: Telegram infrastructure permissions preserve understandable read-only states
The system SHALL keep Telegram infrastructure understandable when read and manage permissions differ.

#### Scenario: Read-only infrastructure omits mutation controls
- **WHEN** a user can read a Bot Telegram or Điểm nhận section but lacks its manage permission
- **THEN** the system renders the records without create, disable, or delete controls
- **AND** it shows a localized section-level explanation that the section is read-only

#### Scenario: Missing section read permission remains localized
- **WHEN** the user can open the Telegram workspace but cannot read one infrastructure section
- **THEN** the system renders the existing localized access-limited state for that section without breaking the other authorized sections

#### Scenario: Linking explains why no bot can be selected
- **WHEN** the user can manage Điểm nhận but cannot form a valid link-token request
- **THEN** the `Liên kết điểm nhận` action remains visible but unavailable
- **AND** its localized explanation distinguishes missing Bot Telegram read permission from having no `ACTIVE` Bot Telegram record

### Requirement: Telegram mutation feedback remains truthful and recoverable
The system SHALL keep configuration input and recovery controls available until the backend confirms the requested outcome.

#### Scenario: Failed bot connection preserves a retry path
- **WHEN** Bot Telegram creation fails after client validation succeeds
- **THEN** the Dialog remains open, shows the backend error or localized fallback, and retains the entered token for retry
- **AND** the token is cleared when the Dialog closes or creation succeeds and is never persisted, logged, cached, or rendered in the resulting record

#### Scenario: Client validation identifies the token field
- **WHEN** the user submits an empty Bot Telegram token
- **THEN** the system renders a field-local error associated with the labelled token input and moves focus to that input

#### Scenario: Destructive mutation keeps recovery available
- **WHEN** disable or delete is pending or fails
- **THEN** its AlertDialog remains open, prevents duplicate submission while pending, and presents retry and cancel recovery after failure
- **AND** it closes and refreshes Telegram data only after the backend confirms success

#### Scenario: Success copy reflects only confirmed state
- **WHEN** a Telegram mutation or refresh completes
- **THEN** the system reports only the state confirmed by that operation
- **AND** link-token creation or list refresh does not claim that a Điểm nhận was successfully linked

## MODIFIED Requirements

### Requirement: Telegram bot connections are API-backed
The system SHALL support Bot Telegram listing, creation, disable, and removal using the current backend multi-bot contract without exposing an update operation.

#### Scenario: Bot connection list renders real records
- **WHEN** `GET /telegram/bot-connections` succeeds
- **THEN** the Bot Telegram Card shows returned backend-owned identity, username, lifecycle status, validation metadata, and available contextual actions

#### Scenario: Bot token is the complete create request
- **WHEN** the user creates a Bot Telegram record
- **THEN** the system submits exactly `botToken` to `POST /telegram/bot-connections`
- **AND** it does not submit `displayLabel` or display the token after creation

#### Scenario: Backend display label remains read-only
- **WHEN** a created or listed Bot Telegram response includes `displayLabel`
- **THEN** the system uses that value for display identity and exposes no label edit control or update request

#### Scenario: Bot disable uses terminal UI language
- **WHEN** an authorized user chooses to disable an `ACTIVE` Bot Telegram record
- **THEN** the system presents the localized `Vô hiệu hóa` action in an AlertDialog without implying that the UI can reactivate the record

#### Scenario: Bot replacement remains guided but manual
- **WHEN** a bot token must be replaced or a Bot Telegram record becomes `INVALID`
- **THEN** the system provides concise guidance to connect a new bot, relink Điểm nhận records, and update dependent routing or schedules before removing the old record
- **AND** it does not expose token editing, automatic migration, or a replacement wizard

#### Scenario: Bot destructive actions remain backend-authoritative
- **WHEN** the user disables or removes a Bot Telegram record
- **THEN** the system requires an AlertDialog confirmation, calls the matching documented backend endpoint, and refreshes the workspace after confirmed success
- **AND** known destination dependencies may enrich confirmation copy but do not replace backend conflict enforcement

### Requirement: Telegram destinations and link tokens are API-backed
The system SHALL support Điểm nhận listing, link-token generation, Private and Group Telegram handoff, disable, and removal through the current destination APIs and active Bot Telegram data without exposing destination update or channel-creation operations.

#### Scenario: Destination list renders real records
- **WHEN** `GET /telegram/destinations` succeeds
- **THEN** the Điểm nhận Card shows backend-owned identity, chat type, chat metadata, linked Bot Telegram, lifecycle status, and available contextual actions

#### Scenario: Link token command is generated by backend
- **WHEN** the user starts the linking flow for an `ACTIVE` Bot Telegram record
- **THEN** the system calls `POST /telegram/destinations/link-token` with `botConnectionId`
- **AND** it progressively reveals the returned `startCommand`, `expiresAt`, copy control, and available Telegram handoff actions

#### Scenario: Exactly one active bot is preselected
- **WHEN** the linking Dialog opens with exactly one `ACTIVE` Bot Telegram record
- **THEN** the system preselects that record for link-token generation

#### Scenario: Multiple active bots require explicit selection
- **WHEN** the linking Dialog opens with more than one `ACTIVE` Bot Telegram record
- **THEN** the system requires the user to select a Bot Telegram record before link-token generation

#### Scenario: Private deep-link uses the matching bot and token
- **WHEN** the user has generated a link token and activates the Private handoff
- **THEN** the system opens `https://t.me/<botUsername>?start=<token>` in a new external target using the matching bot username and returned token
- **AND** it does not refresh the workspace or claim linking success on outbound activation

#### Scenario: Group deep-link uses the matching bot and token
- **WHEN** the user has generated a link token and activates the Group handoff
- **THEN** the system opens `https://t.me/<botUsername>?startgroup=<token>` in a new external target using the matching bot username and returned token
- **AND** it does not refresh the workspace or claim linking success on outbound activation

#### Scenario: Destination verification is refreshed explicitly
- **WHEN** the user returns after completing the external Telegram flow and activates `Đã liên kết, làm mới`
- **THEN** the system closes the linking Dialog and refreshes destination data without creating an optimistic destination
- **AND** its feedback states only that the list was refreshed

#### Scenario: Expired link token can be regenerated
- **WHEN** the returned `expiresAt` is known to be in the past
- **THEN** the system makes open and copy actions unavailable and provides a way to generate a new link token without running a countdown

#### Scenario: Deep-link actions are guarded when required data is missing
- **WHEN** the generated token or matching bot username is unavailable
- **THEN** the system does not expose an actionable malformed Telegram deep-link and keeps a localized copy-command or error fallback where valid

#### Scenario: Changing the bot invalidates the displayed token
- **WHEN** the user changes the selected bot after a link token has been generated
- **THEN** the system clears the prior token and requires a new link-token request before exposing Private or Group handoff actions

#### Scenario: Existing channel destination remains visible
- **WHEN** `GET /telegram/destinations` returns a record with chat type `CHANNEL`
- **THEN** the system renders that record using the same identity and lifecycle rules
- **AND** the linking Dialog does not claim to create a Channel destination from the current token contract

#### Scenario: Destination mutations match the current contract
- **WHEN** the user disables or removes a Điểm nhận record
- **THEN** the system calls only the matching documented backend endpoint, shows confirmed mutation feedback, and refreshes the workspace
- **AND** it exposes no destination label-edit request or control

### Requirement: Telegram destination row actions preserve task hierarchy
The system SHALL place only supported Điểm nhận lifecycle actions in each Item's contextual overflow menu.

#### Scenario: Destination item exposes no removed-contract actions
- **WHEN** an authorized user views a Điểm nhận Item
- **THEN** the Item does not present test-message or edit-label controls
- **AND** its primary content remains identity, status, linked bot, and operational metadata rather than action chrome

#### Scenario: Active destination actions remain confirmed
- **WHEN** the user opens an `ACTIVE` Điểm nhận overflow menu
- **THEN** the menu presents `Vô hiệu hóa`, a separator, and `Xóa` in that order
- **AND** either selection opens the localized AlertDialog before invoking the mutation

#### Scenario: Disabled destination exposes only valid lifecycle actions
- **WHEN** the user opens a `DISABLED` Điểm nhận overflow menu
- **THEN** the menu does not expose a reactivate or repeated disable action and keeps the supported delete action available

#### Scenario: Destination action focus is restored
- **WHEN** a Điểm nhận menu or confirmation flow closes
- **THEN** focus returns safely to the originating overflow trigger when that trigger remains mounted

## REMOVED Requirements

### Requirement: Telegram destinations support test messages
**Reason**: The backend removed `POST /telegram/destinations/{destinationId}/test-message`, so the frontend can no longer promise or invoke this capability.

**Migration**: Remove the test-message action, server action, localized copy, and active references; no replacement UI is provided.

### Requirement: Test-message action exposes accessible availability and feedback
**Reason**: The underlying test-message capability and endpoint no longer exist, so its availability and feedback states are obsolete.

**Migration**: Delete the standalone test-message control and rely on the remaining Item, permission, and mutation feedback requirements for supported actions.
