## MODIFIED Requirements

### Requirement: Frontend MUST provide a protected market-query workbench
The system SHALL provide a protected frontend market query surface at `/market-conversations`, and it MUST gate navigation, route access, and query execution with `query:execute`. The legacy `/market-query` path MAY remain as a locale-preserving compatibility redirect to `/market-conversations`.

#### Scenario: Market-query navigation is shown only to authorized users
- **WHEN** a signed-in user can satisfy `query:execute`
- **THEN** the protected navigation MUST include `Truy vấn thị trường` under the content group
- **AND** the navigation target MUST resolve to `/market-conversations`

#### Scenario: Market-query route access is denied without execute permission
- **WHEN** a signed-in user opens `/market-conversations` without `query:execute`
- **THEN** the frontend MUST deny access using the repo's protected-route permission pattern

#### Scenario: Legacy market-query path preserves compatibility
- **WHEN** a signed-in user opens `/market-query`
- **THEN** the frontend MAY redirect to `/market-conversations` with the active locale preserved
- **AND** it MUST NOT render the retired one-shot market query workbench as the primary product surface

### Requirement: Market-query workbench MUST support persisted conversation execution
The market query surface SHALL provide a composer for market questions through persisted conversations, and it MUST execute authenticated market conversation create/message requests without exposing a user-editable `asOfTime` control in the default flow.

#### Scenario: Authorized user submits a valid first market question
- **WHEN** a user with `query:execute` submits a non-empty first question from `/market-conversations`
- **THEN** the frontend MUST call the existing market conversation creation action
- **AND** it MUST submit the corresponding first message through the existing market conversation message action
- **AND** it MUST omit `asOfTime` from the default flow so backend can resolve the current analysis time
- **AND** it MUST navigate to the persisted conversation detail route after success

#### Scenario: Query submission shows pending feedback
- **WHEN** the market conversation request is in flight
- **THEN** the question input and submit control MUST be disabled
- **AND** the submit control MUST show loading feedback using the repo-standard spinner treatment

#### Scenario: Default flow does not expose manual analysis time input
- **WHEN** a user opens the market conversation page
- **THEN** the workbench MUST NOT render a user-editable `asOfTime` control

#### Scenario: Workbench exposes history on demand
- **WHEN** a user opens the market conversation page
- **THEN** the page MUST provide conversation history through a user-triggered sheet
- **AND** it MUST NOT render saved history as the main page table
