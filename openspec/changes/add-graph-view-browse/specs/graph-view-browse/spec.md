## ADDED Requirements

### Requirement: Frontend MUST provide a protected graph-view browsing surface
The system SHALL provide a protected frontend route at `/graph-view` for browsing the shared knowledge graph, and it MUST gate both navigation and route access with `graph-view:read`.

#### Scenario: Graph-view navigation is shown only to authorized users
- **WHEN** a signed-in user can satisfy `graph-view:read`
- **THEN** the protected navigation MUST include an entry labeled `Biểu đồ tri thức` that opens `/graph-view`

#### Scenario: Graph-view route access is denied without graph-view read permission
- **WHEN** a signed-in user opens `/graph-view` without `graph-view:read`
- **THEN** the frontend MUST deny access using the repo's protected-route permission pattern

### Requirement: Graph view MUST load and render the shared graph contract
The graph-view surface SHALL call `GET /graph-view` and MUST render nodes and edges from the response using `id`, `kind`, `sourceNodeId`, and `targetNodeId` as the canonical runtime mapping.

#### Scenario: Graph renders all returned nodes and edges
- **WHEN** `GET /graph-view` returns one or more nodes and edges
- **THEN** the frontend MUST render a graph that includes every returned node and every returned edge from that payload

#### Scenario: Edge direction follows the backend contract
- **WHEN** the frontend renders an edge from the graph-view response
- **THEN** it MUST preserve the direction encoded by `sourceNodeId` and `targetNodeId` and MUST NOT infer or reverse direction from `relationType`

#### Scenario: Graph view handles an empty graph response
- **WHEN** `GET /graph-view` returns empty `nodes` and `edges` collections
- **THEN** the graph-view page MUST show the repo-standard empty state for the graph browse surface

### Requirement: Graph view MUST support browse-first graph interactions
The graph-view surface SHALL support interactive browsing behavior that lets operators explore relationships without leaving the page immediately.

#### Scenario: Users can pan and zoom the graph canvas
- **WHEN** a user interacts with the graph viewport
- **THEN** the surface MUST support panning and zooming within the graph canvas

#### Scenario: Hovering a node highlights its local neighborhood
- **WHEN** a user hovers a node in the graph
- **THEN** the frontend MUST highlight that node's directly connected relations and visually de-emphasize unrelated graph elements

#### Scenario: Selecting a node shows graph metadata without an additional fetch
- **WHEN** a user selects a node
- **THEN** the page MUST show a graph detail panel with the node label, node kind, and any graph metadata available in the original graph-view response

#### Scenario: Selecting an edge shows relation semantics
- **WHEN** a user selects an edge
- **THEN** the page MUST show a graph detail panel with the edge kind, relation type, and any available relation metadata from the original graph-view response

### Requirement: Graph view MUST provide permission-aware drill-down from supported node kinds
The graph-view surface SHALL preserve browse context while allowing drill-down into supported entity detail routes when those routes already exist and the current user has permission to open them.

#### Scenario: Event nodes deep-link into event detail for authorized users
- **WHEN** a user with `event:read` selects an `event` node that has a valid entity identifier
- **THEN** the detail panel MUST provide navigation to `/events/{id}`

#### Scenario: Source-document nodes deep-link into source-document detail for authorized users
- **WHEN** a user with `source-document:read` selects a `source-document` node that has a valid entity identifier
- **THEN** the detail panel MUST provide navigation to `/source-documents/{id}`

#### Scenario: Graph metadata remains readable without related read permission
- **WHEN** a user selects an `event` or `source-document` node without the corresponding entity read permission
- **THEN** the page MUST still show graph metadata for that node but MUST NOT expose interactive navigation to the related detail route

#### Scenario: Asset and theme nodes remain browse-only in v1
- **WHEN** a user selects an `asset` or `theme` node
- **THEN** the page MUST show local graph metadata for that node and MUST NOT require a dedicated frontend detail route to complete the interaction

### Requirement: Graph view MUST visually distinguish node and relation types
The graph-view surface SHALL use frontend-owned styling to help operators quickly distinguish node kinds and relation kinds while browsing the graph.

#### Scenario: Different node kinds are visually distinguishable
- **WHEN** the graph renders nodes of kinds `event`, `asset`, `theme`, and `source-document`
- **THEN** the surface MUST present those node kinds with distinct visual treatment

#### Scenario: Relation kinds remain readable in the graph experience
- **WHEN** the graph renders edges of kinds `event-asset`, `event-theme`, and `source-document-event`
- **THEN** the surface MUST provide enough visual distinction or label treatment for operators to identify relation categories during browsing
