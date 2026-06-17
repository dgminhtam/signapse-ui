## ADDED Requirements

### Requirement: Graph View accepts warm episode nodes
The system SHALL validate and render `warm-episode` nodes returned by `GET /graph-view`.

#### Scenario: Backend returns warm episode nodes
- **WHEN** `GET /graph-view` returns a node whose `kind` is `warm-episode`
- **THEN** frontend response validation succeeds
- **THEN** the graph is allowed to render that node

#### Scenario: Warm episode metadata is preserved
- **WHEN** a warm episode node includes `periodStart`, `periodEnd`, `knowledgeLayer`, or `confidence` in `metadata`
- **THEN** the frontend parsed graph response preserves those fields for the canvas inspector

#### Scenario: Warm episode node ids are parseable
- **WHEN** a graph node id has the form `warm-episode:{id}`
- **THEN** frontend graph id parsing recognizes the node as a warm episode entity reference

### Requirement: Graph View presents warm episodes consistently
The system SHALL present warm episode nodes and relationships with localized labels, visual styling, count summaries, clustering, and browse-only inspection.

#### Scenario: HUD renders warm episode counts
- **WHEN** the graph contains warm episode nodes
- **THEN** the in-canvas node summary includes the warm episode count with a localized label

#### Scenario: Canvas renders warm episode visual treatment
- **WHEN** the graph renders a warm episode node
- **THEN** the node uses a distinct warm episode color and size treatment
- **THEN** existing event, asset, theme, news article, and narrative treatments remain unchanged

#### Scenario: HUD renders warm episode relationship counts
- **WHEN** the graph contains `asset-warm-episode` or `warm-episode-event` edges
- **THEN** the in-canvas relationship summary includes those edge counts with localized labels

#### Scenario: Warm episode edges retain visual treatment
- **WHEN** the graph renders an `asset-warm-episode` or `warm-episode-event` edge
- **THEN** the edge uses the intended warm episode relationship color and line treatment

#### Scenario: Warm episode nodes participate in clustering
- **WHEN** a warm episode node is connected to events or assets
- **THEN** the graph layout clusters the warm episode near related graph entities rather than treating it as unrelated noise

## MODIFIED Requirements

### Requirement: Graph View accepts current backend edge kinds
The system SHALL validate Graph View responses using the current backend graph contract, including `news-article-event`, `narrative-event`, `narrative-asset`, `asset-warm-episode`, and `warm-episode-event` edges.

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

#### Scenario: Backend returns asset warm episode edges
- **WHEN** `GET /graph-view` returns an edge whose `kind` is `asset-warm-episode`
- **THEN** frontend response validation succeeds
- **THEN** the graph is allowed to render with that edge

#### Scenario: Backend returns warm episode event edges
- **WHEN** `GET /graph-view` returns an edge whose `kind` is `warm-episode-event`
- **THEN** frontend response validation succeeds
- **THEN** the graph is allowed to render with that edge

#### Scenario: Backend returns known graph edge kinds
- **WHEN** `GET /graph-view` returns edges whose `kind` values are `event-asset`, `event-theme`, `news-article-event`, `narrative-event`, `narrative-asset`, `asset-warm-episode`, or `warm-episode-event`
- **THEN** all returned edge kinds are accepted by the frontend schema

### Requirement: Graph View contract documentation matches implemented schema
The system SHALL document the Graph View frontend integration using the current backend graph contract.

#### Scenario: API mapping describes graph node and edge kinds
- **WHEN** the API mapping documentation describes Graph View node and edge kinds
- **THEN** it lists node kinds `event`, `asset`, `theme`, `news-article`, `narrative`, and `warm-episode`
- **THEN** it lists edge kinds `event-asset`, `event-theme`, `news-article-event`, `narrative-event`, `narrative-asset`, `asset-warm-episode`, and `warm-episode-event`
- **THEN** it does not describe `source-artifact-event` as the current Graph View edge kind
