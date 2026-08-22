## MODIFIED Requirements

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

## ADDED Requirements

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
