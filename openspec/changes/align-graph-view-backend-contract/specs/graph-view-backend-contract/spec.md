## ADDED Requirements

### Requirement: Graph View accepts current backend edge kinds
The system SHALL validate Graph View responses using the current backend graph contract, including `news-article-event` edges.

#### Scenario: Backend returns news article event edges
- **WHEN** `GET /graph-view` returns an edge whose `kind` is `news-article-event`
- **THEN** frontend response validation succeeds
- **THEN** the graph is allowed to render with that edge

#### Scenario: Backend returns known graph edge kinds
- **WHEN** `GET /graph-view` returns edges whose `kind` values are `event-asset`, `event-theme`, or `news-article-event`
- **THEN** all returned edge kinds are accepted by the frontend schema

### Requirement: Graph View presents news article event relationships consistently
The system SHALL use the `news-article-event` edge kind consistently in Graph View labels, counts, HUD summaries, filters, and visual styling.

#### Scenario: HUD renders news article event relationship counts
- **WHEN** the graph contains `news-article-event` edges
- **THEN** the in-canvas relationship summary includes those edges under the evidence-to-event relationship label
- **THEN** the summary does not depend on the legacy `source-artifact-event` key

#### Scenario: News article event edges retain visual treatment
- **WHEN** the graph renders a `news-article-event` edge
- **THEN** the edge uses the intended evidence-to-event color and line treatment

### Requirement: Graph View validation failures are diagnosable
The system SHALL log concise validation diagnostics when the backend Graph View response does not match the frontend schema.

#### Scenario: Response validation fails
- **WHEN** `GET /graph-view` returns a payload that fails frontend validation
- **THEN** the server log includes the number of validation issues
- **THEN** the server log includes summarized issue paths, codes, and messages
- **THEN** the server log does not include the full graph response payload

### Requirement: Graph View contract documentation matches implemented schema
The system SHALL document the Graph View frontend integration using the current backend graph contract.

#### Scenario: API mapping describes graph edge kinds
- **WHEN** the API mapping documentation describes Graph View edge kinds
- **THEN** it lists `event-asset`, `event-theme`, and `news-article-event`
- **THEN** it does not describe `source-artifact-event` as the current Graph View edge kind
