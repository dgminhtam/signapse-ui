# telegram-configuration-ui Specification

## Purpose
TBD - created by archiving change integrate-telegram-configuration-api. Update Purpose after archive.
## Requirements
### Requirement: Telegram configuration uses backend data
The system SHALL load Telegram bot connections, destinations, feature settings, and market analysis schedules from the documented Telegram backend APIs instead of local fixtures.

#### Scenario: Authorized section data is loaded
- **WHEN** a user opens the Telegram configuration workspace with a Telegram read permission
- **THEN** the system fetches only the Telegram collections allowed by that user's read permissions and renders those sections from backend responses

#### Scenario: Missing section permission does not break page
- **WHEN** a user has access to at least one Telegram read area but lacks another Telegram read permission
- **THEN** the system keeps the workspace available and shows an access-limited or disabled state for the section the user cannot read

#### Scenario: Backend data replaces fixture data
- **WHEN** Telegram backend responses are available
- **THEN** the system displays real bot connection, destination, feature setting, and schedule metadata rather than static review rows

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
- **WHEN** the user starts the destination linking flow for an `ACTIVE` Bot Telegram record
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
- **THEN** the system clears the prior token and requires a new link-token request before exposing Private or Group deep-link actions

#### Scenario: Existing channel destination remains visible
- **WHEN** `GET /telegram/destinations` returns a record with chat type `CHANNEL`
- **THEN** the system renders that record using the same identity and lifecycle rules
- **AND** the linking Dialog does not claim to create a Channel destination from the current token contract

#### Scenario: Destination mutations match the current contract
- **WHEN** the user disables or removes a Điểm nhận record
- **THEN** the system calls only the matching documented backend endpoint, shows confirmed mutation feedback, and refreshes the workspace
- **AND** it exposes no destination label-edit request or control

### Requirement: Telegram destinations support test messages
The system SHALL allow an authorized operator to send a backend-generated test message to an active Telegram destination through the documented destination test-message endpoint.

#### Scenario: Active destination test message succeeds
- **WHEN** a user with `telegram-destination:manage` activates `Gửi thử` for an `ACTIVE` Telegram destination
- **THEN** the system sends an authenticated `POST` request to `/telegram/destinations/{destinationId}/test-message` without a request body
- **AND** the system treats `204 No Content` as confirmation that the Telegram API accepted the send
- **AND** the system shows localized success feedback naming the Telegram destination without claiming that a person received or read the message

#### Scenario: Test message content remains backend-owned
- **WHEN** the user sends a test message
- **THEN** the system does not display a message composer, preview, or content customization control
- **AND** the backend generates the fixed test-message content using the current UI locale supplied through `Accept-Language`

#### Scenario: Backend validates the linked bot
- **WHEN** an active Telegram destination refers to a bot that cannot send the test message
- **THEN** the frontend submits only the destination identifier and relies on the backend to validate the linked bot
- **AND** the system presents the resulting localized backend error or a localized fallback

#### Scenario: Test message does not refresh workspace data
- **WHEN** a test-message request succeeds
- **THEN** the system does not refresh or revalidate the Telegram workspace
- **AND** the system does not persist a last-test timestamp, receipt, message identifier, or delivery-history state

### Requirement: Test-message action exposes accessible availability and feedback
The system SHALL keep the destination test-message action discoverable, operable, and understandable across permission, status, pending, success, and failure states.

#### Scenario: Read-only user can understand the unavailable action
- **WHEN** a user can read Telegram destinations but lacks `telegram-destination:manage`
- **THEN** the system keeps `Gửi thử` visible and focusable with `aria-disabled="true"`
- **AND** the system blocks activation and associates a localized permission explanation through `aria-describedby`
- **AND** the same explanation is visible on hover and focus without relying on hover alone

#### Scenario: Inactive destination explains unavailable state
- **WHEN** a user with manage permission views a destination whose status is not `ACTIVE`
- **THEN** the system keeps `Gửi thử` visible and focusable but unavailable
- **AND** the system associates a localized explanation that test messages can only be sent to active Telegram destinations

#### Scenario: Pending state prevents duplicate activation
- **WHEN** a test-message request is pending for a destination
- **THEN** the system replaces the send icon with a spinner, shows localized pending text, and natively disables that destination's test action
- **AND** the system does not disable test actions for other eligible destinations

#### Scenario: Failed request preserves recovery
- **WHEN** a test-message request fails
- **THEN** the system re-enables the affected action and shows the localized backend error or a localized fallback
- **AND** the system does not retry automatically or impose an undocumented client cooldown

#### Scenario: Timeout outcome remains explicit
- **WHEN** a test-message request times out without a known outcome
- **THEN** the system tells the user that the result is uncertain and to check Telegram before manually retrying

#### Scenario: Test action remains labeled on responsive Items
- **WHEN** a Telegram destination Item renders at any supported breakpoint or at 200 percent zoom
- **THEN** the test action displays both a send icon and the localized `Gửi thử` label
- **AND** the Item reflows its action area without causing horizontal page overflow

### Requirement: Telegram destination row actions preserve task hierarchy
The system SHALL expose the supported test-message action directly on each Điểm nhận Item and keep supported lifecycle actions in the contextual overflow menu.

#### Scenario: Destination action hierarchy is stable
- **WHEN** a user views a Điểm nhận Item
- **THEN** the Item presents the labeled `Gửi thử` action before its overflow-menu trigger
- **AND** it exposes no destination label-edit control while keeping identity, status, linked bot, and operational metadata as the primary content

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

### Requirement: Telegram feature routing is API-backed
The system SHALL support Telegram feature route display and update through `GET /telegram/feature-settings` and `PUT /telegram/feature-settings`, including the backend response's optional feature output language and request's optional output-language override.

#### Scenario: Feature settings render for current workspace
- **WHEN** feature settings are loaded
- **THEN** the system displays `ECONOMIC_CALENDAR_ALERT`, `MARKET_NEWS_ALERT`, and `SCHEDULED_MARKET_ANALYSIS` for the current workspace using backend state where available
- **AND** it preserves each returned feature setting's optional output language in its client-side configuration state

#### Scenario: Route update requires a valid destination
- **WHEN** a user updates a feature route
- **THEN** the system sends the route's `featureKey`, `workspaceId`, `destinationId`, enabled state, and current or newly selected optional output-language ISO code
- **AND** it blocks mutation controls when no active destination can form a valid request

#### Scenario: Feature route switch remains scoped to enabled setting
- **WHEN** a user toggles a feature route with an existing output-language override
- **THEN** the update preserves that override while changing only the enabled state
- **AND** it does not imply bot, destination, schedule, or language-override reactivation

### Requirement: Calendar and news feature routes expose output-language configuration
The system SHALL let authorized operators configure the optional Feature output language for the economic-calendar and market-news Telegram flows while keeping runtime-effective language controls truthful.

#### Scenario: Calendar and news flows offer supported language choices
- **WHEN** an authorized operator views the Feature routing rows for `ECONOMIC_CALENDAR_ALERT` or `MARKET_NEWS_ALERT` and the language catalog is available
- **THEN** the row exposes a localized output-language selector with the persisted override, supported language choices, and a localized fallback choice
- **AND** selecting a supported language updates that flow without changing its destination or enabled state

#### Scenario: Fallback choice clears the feature override
- **WHEN** an authorized operator selects the fallback choice for a calendar or news flow
- **THEN** the system sends no `outputLanguageIsoCode` for that update
- **AND** the interface explains that delivery then resolves through the owner's preferred language and the system default

#### Scenario: Scheduled market analysis has no feature-level language control
- **WHEN** an operator views the `SCHEDULED_MARKET_ANALYSIS` Feature routing row
- **THEN** the system does not expose an output-language selector for that row
- **AND** Scheduled asset analysis language remains configurable only through its existing per-schedule override behavior

#### Scenario: Paused flow can be prepared with an output language
- **WHEN** a calendar or news feature route is paused but has a valid destination
- **THEN** an authorized operator can update its output-language override
- **AND** that update does not enable the route

#### Scenario: Feature language needs a destination
- **WHEN** a calendar or news feature route has no valid destination
- **THEN** the system keeps its output-language control unavailable
- **AND** it provides localized guidance that a destination must be selected first

### Requirement: Feature-route language state is preserved and recoverable
The system SHALL prevent routing operations and language-catalog failures from silently discarding a persisted Feature output language.

#### Scenario: Destination update preserves the language override
- **WHEN** an operator changes a feature route's destination while it has an output-language override
- **THEN** the update includes the existing output-language ISO code
- **AND** the resulting route retains the override

#### Scenario: One route update is in progress
- **WHEN** a destination, enabled-state, or output-language update is pending for one feature route
- **THEN** the system keeps all mutation controls for that route unavailable until the request resolves
- **AND** it does not prevent interaction with a different feature route solely because the first request is pending

#### Scenario: Language catalog is unavailable
- **WHEN** the language catalog cannot be loaded
- **THEN** the system displays a persisted feature output language when one exists and keeps only that language control unavailable with localized feedback
- **AND** it still permits destination and enabled-state updates that preserve the persisted language override

#### Scenario: Persisted language is no longer selectable
- **WHEN** a feature setting returns an output language that is absent from the supported language catalog
- **THEN** the system keeps the persisted language visible as unavailable
- **AND** it does not silently clear or replace that override

#### Scenario: Read-only access does not enable language mutation
- **WHEN** a user can read feature settings but lacks update permission
- **THEN** the system renders the configured output language using the same access model as other Feature routing data
- **AND** it exposes no enabled language mutation control

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

### Requirement: Scheduled market analysis schedule management is nested in feature routing
The system SHALL manage scheduled market analysis schedules inside the `SCHEDULED_MARKET_ANALYSIS` feature routing area rather than as a standalone peer-level Telegram section.

#### Scenario: Scheduled market analysis route includes schedule management
- **WHEN** the Telegram configuration workspace displays the `SCHEDULED_MARKET_ANALYSIS` route
- **THEN** the system shows that route's destination, enabled state, and schedule management surface in the same feature routing area

#### Scenario: Schedule surface is not a peer-level section
- **WHEN** the Telegram configuration workspace is displayed
- **THEN** the system does not render "Lịch phân tích thị trường" as a standalone top-level section after feature routing

#### Scenario: Simple routes remain compact
- **WHEN** the Telegram configuration workspace displays `ECONOMIC_CALENDAR_ALERT` and `MARKET_NEWS_ALERT`
- **THEN** the system keeps those route rows focused on destination, blocked state, and enabled switch without adding schedule controls

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

### Requirement: Telegram configuration workspace
The system SHALL provide a Telegram configuration UI shell that is reachable from the settings navigation for authorized users and presented as a cardless workspace.

#### Scenario: Authorized user opens Telegram settings
- **WHEN** a user with at least one Telegram read permission opens the Telegram settings route
- **THEN** the system displays a cardless workspace for Telegram configuration with professional Vietnamese copy

#### Scenario: Telegram navigation appears under settings
- **WHEN** the sidebar renders settings navigation for a user with Telegram read permission
- **THEN** the system shows a Telegram navigation item in the settings group

#### Scenario: Unauthorized user is blocked
- **WHEN** a user without Telegram read permission opens the Telegram settings route
- **THEN** the system displays the existing access-denied treatment instead of the Telegram configuration workspace

### Requirement: Telegram setup hierarchy is visible
The system SHALL present the Telegram setup dependency chain as Bot Telegram, Điểm nhận, feature routing, and scheduled asset analysis nested inside the scheduled market analysis route.

#### Scenario: Configuration sections render in dependency order
- **WHEN** the Telegram configuration workspace is displayed
- **THEN** the top-level sections appear in the order bot connections, destinations, and feature routing
- **AND** the scheduled asset analysis surface appears inside `SCHEDULED_MARKET_ANALYSIS` rather than as a peer-level section

#### Scenario: Readiness state summarizes setup progress
- **WHEN** the Telegram configuration workspace is displayed
- **THEN** the system shows a compact readiness summary that identifies which setup areas are ready, missing, or blocked
