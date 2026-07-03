## ADDED Requirements

### Requirement: Graph View accepts current backend node kinds
The system SHALL validate Graph View responses using the current backend graph node contract, including `event`, `asset`, `news-article`, and `narrative` nodes.

#### Scenario: Backend returns known graph node kinds
- **WHEN** `GET /graph-view` returns nodes whose `kind` values are `event`, `asset`, `news-article`, or `narrative`
- **THEN** all returned node kinds are accepted by the frontend schema
- **THEN** the graph is allowed to render those nodes

#### Scenario: Backend returns removed warm episode node kind
- **WHEN** `GET /graph-view` returns a node whose `kind` is `warm-episode`
- **THEN** frontend response validation fails with a diagnosable schema issue

## MODIFIED Requirements

### Requirement: Graph View accepts current backend edge kinds
The system SHALL validate Graph View responses using the current backend graph contract, including `event-asset`, `news-article-event`, `narrative-event`, and `narrative-asset` edges.

#### Scenario: Backend returns event asset edges
- **WHEN** `GET /graph-view` returns an edge whose `kind` is `event-asset`
- **THEN** frontend response validation succeeds
- **THEN** the graph is allowed to render with that edge

#### Scenario: Backend returns news article event edges
- **WHEN** `GET /graph-view` returns an edge whose `kind` is `news-article-event`
- **THEN** frontend response validation succeeds
- **THEN** the graph is allowed to render with that edge

#### Scenario: Backend returns narrative event edges
- **WHEN** `GET /graph-view` returns an edge whose `kind` is `narrative-event`
- **THEN** frontend response validation succeeds
- **THEN** the graph is allowed to render with that edge

#### Scenario: Backend returns narrative asset edges
- **WHEN** `GET /graph-view` returns an edge whose `kind` is `narrative-asset`
- **THEN** frontend response validation succeeds
- **THEN** the graph is allowed to render with that edge

#### Scenario: Backend returns known graph edge kinds
- **WHEN** `GET /graph-view` returns edges whose `kind` values are `event-asset`, `news-article-event`, `narrative-event`, or `narrative-asset`
- **THEN** all returned edge kinds are accepted by the frontend schema

#### Scenario: Backend returns removed warm episode edge kind
- **WHEN** `GET /graph-view` returns an edge whose `kind` is `asset-warm-episode` or `warm-episode-event`
- **THEN** frontend response validation fails with a diagnosable schema issue

### Requirement: Graph View contract documentation matches implemented schema
The system SHALL document the Graph View frontend integration using the current backend graph contract.

#### Scenario: API mapping describes graph node and edge kinds
- **WHEN** the API mapping documentation describes Graph View node and edge kinds
- **THEN** it lists node kinds `event`, `asset`, `news-article`, and `narrative`
- **THEN** it lists edge kinds `event-asset`, `news-article-event`, `narrative-event`, and `narrative-asset`
- **THEN** it does not describe `theme`, `warm-episode`, `event-theme`, `asset-warm-episode`, `warm-episode-event`, or `source-artifact-event` as current Graph View topology

### Requirement: Graph View presents narrative nodes consistently
The system SHALL present narrative nodes with localized labels, visual styling, count summaries, and inspector metadata.

#### Scenario: HUD renders narrative counts
- **WHEN** the graph contains narrative nodes
- **THEN** the in-canvas node summary includes the narrative count with a localized label

#### Scenario: Canvas renders narrative visual treatment
- **WHEN** the graph renders a narrative node
- **THEN** the node uses a distinct narrative color and size treatment
- **THEN** existing event, asset, and news article treatments remain unchanged

#### Scenario: Narrative inspector shows local details
- **WHEN** the user selects a narrative node
- **THEN** the node inspector can show the narrative title, secondary label, status, confidence, thesis, theme metadata, and relation counts
- **THEN** the inspector does not show a quick-detail route action unless a narrative route is implemented separately

## REMOVED Requirements

### Requirement: Graph View accepts warm episode nodes
**Reason**: The backend no longer returns `warm-episode` as a Graph View node kind.
**Migration**: Use `metadata.knowledgeLayer` on current graph nodes for layer context. Model any future historical/warm view as a separate contract.

### Requirement: Graph View presents warm episodes consistently
**Reason**: Warm episodes are no longer part of Graph View topology.
**Migration**: Remove warm episode counts, visuals, edges, layout behavior, and inspector sections from Graph View.
