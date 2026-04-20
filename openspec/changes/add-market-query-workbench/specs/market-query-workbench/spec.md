## ADDED Requirements

### Requirement: Frontend MUST provide a protected market-query workbench
The system SHALL provide a protected frontend route for grounded market queries at `/market-query`, and it MUST gate navigation, route access, and query execution with `query:execute`.

#### Scenario: Market-query navigation is shown only to authorized users
- **WHEN** a signed-in user can satisfy `query:execute`
- **THEN** the protected navigation MUST include `Truy vấn thị trường` under the content group

#### Scenario: Market-query route access is denied without execute permission
- **WHEN** a signed-in user opens `/market-query` without `query:execute`
- **THEN** the frontend MUST deny access using the repo's protected-route permission pattern

### Requirement: Market-query workbench MUST support one-shot query execution
The workbench SHALL provide a single composer for `question`, and it MUST execute authenticated `POST /query` requests without exposing saved history, thread navigation, or a user-editable `asOfTime` control in v1.

#### Scenario: Authorized user submits a valid market query
- **WHEN** a user with `query:execute` submits a non-empty `question`
- **THEN** the frontend MUST call `POST /query` with the corresponding `MarketQueryRequest`
- **AND** it MUST omit `asOfTime` from the request in the default v1 flow so backend can resolve the current analysis time
- **AND** it MUST render the latest `MarketQueryResponse` in the workbench result area

#### Scenario: Query submission shows pending feedback
- **WHEN** the market query request is in flight
- **THEN** the question input and submit control MUST be disabled
- **AND** the submit control MUST show loading feedback using the repo-standard spinner treatment

#### Scenario: V1 workbench does not expose manual analysis time input
- **WHEN** a user opens the market-query page
- **THEN** the workbench MUST NOT render a user-editable `asOfTime` control

#### Scenario: Workbench does not expose history in v1
- **WHEN** a user opens the market-query page
- **THEN** the page MUST show a single composer and current-result surface only
- **AND** it MUST NOT render a saved query list, thread rail, or prior-response history module

### Requirement: Market-query results MUST render as a structured analytical briefing
The workbench SHALL render query results as structured sections rather than a chat transcript, and it MUST present `answer`, `confidence`, `assetsConsidered`, `limitations`, `keyEvents`, `evidence`, and `reasoningChain` from `MarketQueryResponse`.

#### Scenario: Full query response renders all briefing sections
- **WHEN** the backend returns a populated `MarketQueryResponse`
- **THEN** the frontend MUST render sections for the final answer, confidence, assets considered, limitations, key events, evidence, and reasoning chain

#### Scenario: Reasoning chain remains available without overwhelming the page
- **WHEN** the workbench renders a response with `reasoningChain`
- **THEN** the frontend MUST provide a dedicated reasoning section that is available to all authorized users
- **AND** it MUST default to a collapsed presentation with an explicit control to expand it

#### Scenario: Empty result arrays do not break the briefing layout
- **WHEN** the backend returns empty `keyEvents`, `assetsConsidered`, `limitations`, `evidence`, or `reasoningChain`
- **THEN** the frontend MUST preserve a coherent result layout using repo-standard empty or absent-state treatment for those sections

### Requirement: Market-query response parsing MUST tolerate nullable optional timestamps
The frontend SHALL accept `null` for optional temporal fields in `MarketQueryResponse`, and it MUST continue rendering the structured briefing when `keyEvents[].occurredAt` or `evidence[].publishedAt` are null.

#### Scenario: Evidence item omits publish time with null
- **WHEN** the backend returns a market-query evidence item with `publishedAt: null`
- **THEN** the frontend MUST accept the response payload
- **AND** it MUST render the evidence section using its missing-time fallback instead of failing the whole query

#### Scenario: Key event omits occurrence time with null
- **WHEN** the backend returns a market-query key event with `occurredAt: null`
- **THEN** the frontend MUST accept the response payload
- **AND** it MUST render the key-events section using its missing-time fallback instead of failing the whole query

### Requirement: Market-query traceability MUST respect related entity permissions
The workbench SHALL expose traceability from result sections into related events and source documents when identifiers are present, and it MUST only make those links interactive when the user has the corresponding read permission.

#### Scenario: Key event navigation is available to users who can read events
- **WHEN** a query result contains `keyEvents` with event identifiers and the user can satisfy `event:read`
- **THEN** the frontend MUST provide navigation from each related event entry into the corresponding event detail route

#### Scenario: Evidence source-document navigation is hidden or disabled without permission
- **WHEN** a query result contains evidence items with `sourceDocumentId` and the user cannot satisfy `source-document:read`
- **THEN** the frontend MUST render the evidence metadata without an interactive source-document detail link

#### Scenario: Evidence event navigation is hidden or disabled without permission
- **WHEN** a query result contains evidence items with `eventId` and the user cannot satisfy `event:read`
- **THEN** the frontend MUST render the evidence metadata without an interactive event detail link
