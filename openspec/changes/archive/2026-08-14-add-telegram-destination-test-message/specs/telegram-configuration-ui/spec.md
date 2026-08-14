## ADDED Requirements

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

#### Scenario: Test action remains labeled at narrow widths
- **WHEN** the Telegram destination table is rendered at any supported breakpoint
- **THEN** the test action displays both a send icon and the localized `Gửi thử` label
- **AND** any horizontal overflow remains within the table surface

### Requirement: Telegram destination row actions preserve task hierarchy
The system SHALL prioritize test and edit actions while placing destination lifecycle actions in a contextual overflow menu.

#### Scenario: Destination action order is stable
- **WHEN** an authorized user views a Telegram destination row
- **THEN** the row presents `Gửi thử`, `Sửa`, and an overflow-menu trigger in that order

#### Scenario: Pause and delete remain confirmed
- **WHEN** the user opens the destination overflow menu
- **THEN** the menu presents `Tạm dừng`, a separator, and `Xóa` in that order
- **AND** selecting pause or delete opens the existing localized confirmation flow before invoking the mutation
- **AND** focus returns to the overflow trigger after the confirmation flow closes

## MODIFIED Requirements

### Requirement: Refined Telegram hierarchy reflects shared infrastructure and feature workflows
The system SHALL present bot connections and destinations as shared Telegram infrastructure, and feature routing as the place where workflow-specific Telegram behavior is managed.

#### Scenario: Top-level configuration order is simplified
- **WHEN** the Telegram configuration workspace is displayed
- **THEN** the top-level content order is readiness summary, bot connections, destinations, and feature routing

#### Scenario: Market analysis readiness belongs to routing
- **WHEN** the readiness summary communicates scheduled market analysis state
- **THEN** the copy or placement indicates it is part of route readiness rather than a separate setup pillar

## REMOVED Requirements

### Requirement: Bot and destination management surfaces
**Reason**: The Telegram workspace is API-backed, and the current API-backed bot and destination requirements supersede the earlier UI-only list and link-token shell behavior.

**Migration**: Use the existing `Telegram bot connections are API-backed` and `Telegram destinations and link tokens are API-backed` requirements together with the new destination test-message requirements.

### Requirement: Feature routing surface
**Reason**: Live feature-routing behavior is already governed by the `Telegram feature routing is API-backed` requirement, so the earlier UI-only requirement is obsolete.

**Migration**: Use the existing API-backed feature-routing requirement.

### Requirement: Scheduled market analysis surface
**Reason**: Live schedule behavior is already governed by the API-backed schedule requirements, so the earlier UI-only shell requirement is obsolete.

**Migration**: Use the existing API-backed scheduled market analysis requirements.

### Requirement: UI-only boundary is preserved
**Reason**: The Telegram configuration workspace now intentionally uses authenticated Telegram backend actions, making the prohibition on server actions and live mutation feedback incorrect.

**Migration**: Preserve only the backend-only webhook exclusion under `Telegram API integration preserves frontend safety boundaries`; use the API-backed requirements for all user-callable Telegram configuration behavior.
