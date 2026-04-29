## ADDED Requirements

### Requirement: Graph view must accept parallel directed edges
The graph view SHALL accept backend payloads that contain multiple directed edges with the same `sourceNodeId` and `targetNodeId` when those edges have distinct identities or semantic relation types.

#### Scenario: Asset relations share the same source and target
- **WHEN** the payload contains both `event:4->asset:7:AFFECTED_ASSET` and `event:4->asset:7:PRIMARY_SUBJECT`
- **THEN** the graph view initializes successfully without throwing a duplicate-edge runtime error
- **AND** both edges remain available in the graph model by their own `id`

#### Scenario: Theme relations share the same source and target
- **WHEN** the payload contains both `event:3->theme:10:PRIMARY_THEME` and `event:3->theme:10:SECONDARY_THEME`
- **THEN** the frontend SHALL preserve both relations instead of collapsing them because the endpoints match

### Requirement: Sigma runtime must be multigraph-compatible
The graph canvas SHALL initialize Sigma with a graph implementation that supports multiple directed edges between the same node pair before loading the frontend graph model.

#### Scenario: Sigma loads a multigraph model
- **WHEN** the graph canvas mounts and `useLoadGraph` loads a `MultiDirectedGraph` model
- **THEN** Sigma's internal graph SHALL accept all parallel edges from that model
- **AND** the canvas SHALL render without the `Graph.addDirectedEdgeWithKey` duplicate-linking error
