# graph-view-large-graph-performance Specification

## Purpose
TBD - created by archiving change optimize-graph-view-large-graph-performance. Update Purpose after archive.
## Requirements
### Requirement: Dense graph rendering uses performance-aware label detail
Graph View SHALL reduce default canvas text work for dense graph payloads while preserving enough labels for orientation and analysis.

#### Scenario: Dense graph applies label level of detail
- **WHEN** the graph payload exceeds the configured dense-graph threshold
- **THEN** the canvas renders default labels only for priority nodes such as asset, theme, selected, hovered, and high-connectivity nodes
- **AND** non-priority event and article nodes remain inspectable through hover or selection

#### Scenario: Sparse graph keeps normal label readability
- **WHEN** the graph payload is below the configured dense-graph threshold
- **THEN** the canvas keeps the existing readable default label policy
- **AND** hover and selected nodes still reveal their full title in the canvas

### Requirement: Graph interactions update through built-in behavior paths
Graph View SHALL avoid additional custom full-graph state loops for common hover and active interactions when G6 built-in behavior can provide the requested highlight and dim semantics.

#### Scenario: Hover uses built-in relation activation
- **WHEN** the user hovers a node in a dense graph
- **THEN** G6 hover activation applies first-degree highlight and dim states
- **AND** Graph View does not add a second custom active-state update on top of the G6 hover behavior

#### Scenario: Active mode uses built-in selection activation
- **WHEN** the user activates a node after another node was already active
- **THEN** G6 behavior-equivalent selection handling updates the active highlight and dim states
- **AND** the interaction does not rebuild the G6 graph instance
- **AND** Graph View does not run a separate custom full-graph selected-state loop

### Requirement: Dense graph visuals avoid broad expensive effects
Graph View SHALL keep nonessential expensive visual effects lightweight by default on dense payloads.

#### Scenario: Default dense graph avoids broad heavy effects
- **WHEN** a dense graph is rendered
- **THEN** broad default shadows, heavy label strokes, and repeated animations are reduced or disabled for non-focused elements
- **AND** hovered and selected nodes still receive clear visual emphasis

#### Scenario: Quick detail remains available
- **WHEN** a user selects a supported event or news article node after performance optimizations are active
- **THEN** the existing local quick-detail action remains available
- **AND** no backend contract change is required
