## ADDED Requirements

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
The system SHALL present the Telegram setup dependency chain as bot connection, destination verification, feature routing, and scheduled market analysis.

#### Scenario: Configuration sections render in dependency order
- **WHEN** the Telegram configuration workspace is displayed
- **THEN** the sections appear in the order bot connections, destinations, feature routing, and market analysis schedules

#### Scenario: Readiness state summarizes setup progress
- **WHEN** the Telegram configuration workspace is displayed
- **THEN** the system shows a compact readiness summary that identifies which setup areas are ready, missing, or blocked

### Requirement: Bot and destination management surfaces
The system SHALL show UI-only list surfaces for Telegram bot connections and verified destinations without calling Telegram backend endpoints.

#### Scenario: Bot connection list shell
- **WHEN** the bot connection section is displayed
- **THEN** the system shows a shared list table surface with bot label, bot username, status, webhook/validation metadata, and row actions

#### Scenario: Destination list shell
- **WHEN** the destination section is displayed
- **THEN** the system shows a shared list table surface with destination label, chat type, bot relationship, status, and row actions

#### Scenario: Link token review flow
- **WHEN** the user opens the destination linking UI
- **THEN** the system shows the intended flow for choosing an active bot and using a `/start <token>` command without requesting a real token

### Requirement: Feature routing surface
The system SHALL show a UI-only feature routing surface for the Telegram feature keys `ECONOMIC_CALENDAR_ALERT`, `MARKET_NEWS_ALERT`, and `SCHEDULED_MARKET_ANALYSIS`.

#### Scenario: Feature routes are displayed with Vietnamese labels
- **WHEN** the feature routing section is displayed
- **THEN** the system labels the routes as calendar alerts, market news alerts, and scheduled market analysis in Vietnamese

#### Scenario: Feature route switch is scoped to enabled setting
- **WHEN** a feature routing row is displayed
- **THEN** the system uses a compact switch only for the route `enabled` state and does not imply bot, destination, or schedule reactivation

#### Scenario: Missing destination blocks route activation
- **WHEN** no verified active destination is available
- **THEN** the feature routing controls are disabled or shown as blocked with a clear explanation

### Requirement: Scheduled market analysis surface
The system SHALL show a UI-only schedule surface for scheduled market analysis configuration.

#### Scenario: Schedule list shell
- **WHEN** the scheduled market analysis section is displayed
- **THEN** the system shows a shared list table surface with schedule name, workspace, destination, timezone, local times, assets, status, and row actions

#### Scenario: Schedule form shell
- **WHEN** the user opens the create or edit schedule UI
- **THEN** the system uses the focused form shell pattern with fields for name, workspace, destination, timezone, local times, and assets

### Requirement: UI-only boundary is preserved
The system SHALL NOT integrate live Telegram API calls as part of this UI shell change.

#### Scenario: No Telegram server action is added
- **WHEN** the change is implemented
- **THEN** the system does not add a Telegram server action file or call `fetchAuthenticated()` for `/telegram/**`

#### Scenario: No live mutation feedback is shown
- **WHEN** the user interacts with UI-only Telegram controls
- **THEN** the system does not show success feedback that claims a backend create, update, disable, or delete mutation succeeded

#### Scenario: Backend-only webhook remains excluded
- **WHEN** the Telegram UI shell is implemented
- **THEN** the system does not expose `/webhooks/telegram/{connectionId}` as a frontend action or user-callable control
