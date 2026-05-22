## ADDED Requirements

### Requirement: Graph View accepts narrative nodes
The system SHALL validate and render `narrative` nodes returned by `GET /graph-view`.

#### Scenario: Backend returns narrative nodes
- **WHEN** `GET /graph-view` returns a node whose `kind` is `narrative`
- **THEN** frontend response validation succeeds
- **THEN** the graph is allowed to render that node

#### Scenario: Narrative node metadata is preserved
- **WHEN** a narrative node includes `narrativeStatus`, `confidence`, `thesis`, or `slug` in `metadata`
- **THEN** the frontend parsed graph response preserves those fields for the canvas inspector

#### Scenario: Narrative node ids are parseable
- **WHEN** a graph node id has the form `narrative:{id}`
- **THEN** frontend graph id parsing recognizes the node as a narrative entity reference

### Requirement: Graph View presents narrative nodes consistently
The system SHALL present narrative nodes with localized labels, visual styling, count summaries, and inspector metadata.

#### Scenario: HUD renders narrative counts
- **WHEN** the graph contains narrative nodes
- **THEN** the in-canvas node summary includes the narrative count with a localized label

#### Scenario: Canvas renders narrative visual treatment
- **WHEN** the graph renders a narrative node
- **THEN** the node uses a distinct narrative color and size treatment
- **THEN** existing event, asset, theme, and news article treatments remain unchanged

#### Scenario: Narrative inspector shows local details
- **WHEN** the user selects a narrative node
- **THEN** the node inspector can show the narrative title, secondary label, status, confidence, thesis, slug, and relation counts
- **THEN** the inspector does not show a quick-detail route action unless a narrative route is implemented separately

## MODIFIED Requirements

### Requirement: Graph View accepts current backend edge kinds
The system SHALL validate Graph View responses using the current backend graph contract, including `news-article-event`, `narrative-event`, and `narrative-asset` edges.

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
- **WHEN** `GET /graph-view` returns edges whose `kind` values are `event-asset`, `event-theme`, `news-article-event`, `narrative-event`, or `narrative-asset`
- **THEN** all returned edge kinds are accepted by the frontend schema

### Requirement: Graph View presents news article event relationships consistently
The system SHALL use `news-article-event`, `narrative-event`, and `narrative-asset` edge kinds consistently in Graph View labels, counts, HUD summaries, filters, clustering, and visual styling.

#### Scenario: HUD renders news article event relationship counts
- **WHEN** the graph contains `news-article-event` edges
- **THEN** the in-canvas relationship summary includes those edges under the evidence-to-event relationship label
- **THEN** the summary does not depend on the legacy `source-artifact-event` key

#### Scenario: News article event edges retain visual treatment
- **WHEN** the graph renders a `news-article-event` edge
- **THEN** the edge uses the intended evidence-to-event color and line treatment

#### Scenario: HUD renders narrative relationship counts
- **WHEN** the graph contains `narrative-event` or `narrative-asset` edges
- **THEN** the in-canvas relationship summary includes those edge counts with localized labels

#### Scenario: Narrative edges retain visual treatment
- **WHEN** the graph renders a `narrative-event` or `narrative-asset` edge
- **THEN** the edge uses the intended narrative relationship color and line treatment

#### Scenario: Narrative nodes participate in clustering
- **WHEN** a narrative node is connected to events or assets
- **THEN** the graph layout clusters the narrative near related graph entities rather than treating it as unrelated noise
