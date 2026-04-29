## ADDED Requirements

### Requirement: Frontend maps event market reaction contract
The system SHALL define frontend types, labels, and presentation helpers for event market reactions returned by the backend event detail and derivation APIs.

#### Scenario: Event detail response includes market reactions
- **WHEN** the frontend receives an event detail response with `marketReactions[]`
- **THEN** the system exposes typed reaction data including asset identity, asset type, direction, time horizon, confidence, reasoning, and observed time

#### Scenario: Event detail response omits market reactions
- **WHEN** the frontend receives an event detail response without `marketReactions[]`
- **THEN** the system treats the market reactions collection as empty instead of failing render

#### Scenario: Market reaction enums are displayed
- **WHEN** a market reaction direction or time horizon is rendered
- **THEN** the system displays professional Vietnamese labels for `BULLISH`, `BEARISH`, `MIXED`, `NEUTRAL`, `INTRADAY`, `SHORT_TERM`, `MEDIUM_TERM`, and `LONG_TERM`

### Requirement: Event detail shows market reactions as market impact insight
The system SHALL show market reactions on event detail pages in a dedicated "Tác động thị trường" section after evidence and before assets, themes, and technical metadata.

#### Scenario: Market reactions are available
- **WHEN** an authorized user opens an event detail page whose response contains one or more market reactions
- **THEN** the system renders scannable reaction cards showing asset symbol or name, asset type, direction, time horizon, confidence, observed time, and reasoning

#### Scenario: No market reactions are available
- **WHEN** an authorized user opens an event detail page whose response has no market reactions
- **THEN** the system renders an empty state explaining that market impact has not been derived yet

#### Scenario: Market reaction section loading
- **WHEN** the event detail page is loading
- **THEN** the skeleton mirrors the final market reaction section position and density to avoid layout shift

### Requirement: User can derive market reactions for one event
The system SHALL let authorized users trigger market reaction derivation for the current event from the event detail page.

#### Scenario: Authorized user starts single-event derivation
- **WHEN** an authorized user clicks the market reaction derivation action on an event detail page
- **THEN** the system calls `POST /events/{id}/derive-market-reactions`, disables the action while pending, shows a spinner, refreshes event data on success, and shows a Vietnamese toast summary using `reactionCount`, `neutralCount`, and `message`

#### Scenario: Single-event derivation fails
- **WHEN** the market reaction derivation request fails
- **THEN** the system keeps the user on the event detail page and shows a Vietnamese error toast

#### Scenario: User lacks derivation permission
- **WHEN** a user without the configured market reaction derivation permission opens event detail
- **THEN** the system does not render the market reaction derivation action

### Requirement: User can derive pending market reactions in batch
The system SHALL let authorized users trigger pending market reaction derivation from the event list toolbar without changing the list table columns.

#### Scenario: Authorized user starts batch derivation
- **WHEN** an authorized user clicks the batch market reaction derivation action on the event list
- **THEN** the system calls `POST /events/derive-pending-market-reactions` with optional `batchSize`, disables the action while pending, shows a spinner, refreshes the event list on success, and shows a Vietnamese toast summary using selected, processed, skipped, derived, neutral, and failed counts

#### Scenario: No pending events are selected by backend
- **WHEN** the batch derivation response has `selectedCount` equal to zero
- **THEN** the system shows a Vietnamese toast explaining that there are no pending events to process

#### Scenario: Event list rendering
- **WHEN** market reaction derivation support is added
- **THEN** the event list table keeps its existing columns and does not show market reaction counts or statuses that are not returned by `GET /events`

### Requirement: System prompt options include market reaction derivation
The system SHALL include `EVENT_MARKET_REACTION_DERIVATION` in frontend system prompt type options.

#### Scenario: System prompt type selector is shown
- **WHEN** a user opens a system prompt create or edit flow
- **THEN** the system includes `EVENT_MARKET_REACTION_DERIVATION` with a professional Vietnamese label and an event-related workflow group
