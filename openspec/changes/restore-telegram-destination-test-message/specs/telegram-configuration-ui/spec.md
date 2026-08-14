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

#### Scenario: Test action remains labeled on responsive Items

- **WHEN** a Telegram destination Item renders at any supported breakpoint or at 200 percent zoom
- **THEN** the test action displays both a send icon and the localized `Gửi thử` label
- **AND** the Item reflows its action area without causing horizontal page overflow

## MODIFIED Requirements

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
