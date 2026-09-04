## ADDED Requirements

### Requirement: Sigma demo is protected and isolated from production Graph View

The system SHALL provide a direct-link-only Knowledge Graph demo route protected by the existing `graph-view:read` permission. The demo SHALL be frontend-only, SHALL NOT request the graph-view backend endpoint, SHALL NOT appear in sidebar navigation, and SHALL NOT alter the production `/graph-view` route.

#### Scenario: Authorized user opens the demo

- **WHEN** an authenticated user with `graph-view:read` opens the demo route
- **THEN** the page SHALL render the Sigma demo surface
- **AND** the page SHALL use only its local fixture data

#### Scenario: Demo does not change production Graph View

- **WHEN** the Sigma demo is loaded or interacted with
- **THEN** the production `/graph-view` route and its backend contract SHALL remain unchanged

### Requirement: Demo uses a deterministic 100-node fixture

The demo SHALL render exactly 100 nodes distributed across the current node kinds `event`, `asset`, `news-article`, and `narrative`. The fixture SHALL use stable IDs, deterministic labels and metadata, current relation kinds, directed source/target relationships, no self-loops, and selectable edge-density presets of 100, 400, and 1000 edges.

#### Scenario: Default fixture loads

- **WHEN** the demo first renders
- **THEN** it SHALL contain exactly 100 nodes
- **AND** it SHALL contain 25 nodes of each supported node kind
- **AND** its node and edge IDs SHALL be stable across reloads

#### Scenario: User changes edge density

- **WHEN** the user selects the 100-edge, 400-edge, or 1000-edge preset
- **THEN** the demo SHALL replace the local graph with the corresponding deterministic edge set
- **AND** the node count SHALL remain 100

### Requirement: Demo renders through Sigma and Graphology

The demo SHALL represent the fixture in a directed multi-edge-capable Graphology graph and SHALL render it through Sigma’s WebGL renderer. At rest, every fixture node and valid fixture edge SHALL be represented in the rendered graph.

#### Scenario: Graph renders at rest

- **WHEN** the fixture is ready and WebGL is available
- **THEN** the demo SHALL render all 100 nodes and all edges in the selected preset
- **AND** the source and target direction of every edge SHALL be preserved

#### Scenario: WebGL is unavailable

- **WHEN** the browser cannot initialize the required WebGL renderer
- **THEN** the demo SHALL show a localized unsupported-renderer state
- **AND** the demo SHALL NOT silently switch to G6 or another renderer

### Requirement: Demo makes the graph visible before layout refinement completes

The demo SHALL show a usable graph from deterministic seed coordinates without waiting for force layout completion. On a cache miss, a client-side worker MAY refine the seed layout after first visibility. On a valid cache hit, the demo SHALL render from cached coordinates immediately and SHALL NOT automatically rerun refinement.

#### Scenario: First visit uses seed coordinates

- **WHEN** the demo loads without a valid layout cache
- **THEN** the graph SHALL become visible from deterministic seed coordinates before worker refinement completes
- **AND** the worker SHALL be allowed to refine the layout without blocking the initial visible state

#### Scenario: Warm visit uses cached coordinates

- **WHEN** the demo loads with a cache matching the fixture and layout versions
- **THEN** the graph SHALL render from cached coordinates immediately
- **AND** automatic layout refinement SHALL remain stopped

#### Scenario: User requests re-layout

- **WHEN** the user activates the localized `Re-layout` control
- **THEN** the demo SHALL run client-side layout refinement
- **AND** the completed generated layout SHALL replace the matching cache

### Requirement: Layout state remains client-owned

The demo SHALL keep generated layout positions in a versioned client cache and SHALL keep manually dragged positions only for the current graph session. The demo SHALL NOT send layout or drag position mutations to the backend.

#### Scenario: Cache is invalidated by a version change

- **WHEN** the fixture version or layout algorithm version changes
- **THEN** the previous cached positions SHALL NOT be used as the active layout

#### Scenario: User drops a dragged node

- **WHEN** the user releases a dragged node
- **THEN** the node SHALL remain fixed at the dropped position for the current session
- **AND** the position SHALL NOT be persisted as user data
- **AND** connected nodes SHALL remain able to react through the client-side force behavior

### Requirement: Demo preserves Graph View navigation interactions

The demo SHALL support canvas panning, explicit bounded zoom-in, explicit bounded zoom-out, recentering, and node dragging. Ordinary wheel or trackpad scrolling over the canvas SHALL NOT change the zoom level.

#### Scenario: User pans and recenters

- **WHEN** the user drags the canvas and later activates recenter
- **THEN** the viewport SHALL pan within the bounded workspace
- **AND** recenter SHALL return the graph to a readable centered view without rebuilding fixture data

#### Scenario: User uses explicit zoom controls

- **WHEN** the user activates zoom in or zoom out
- **THEN** the viewport SHALL change by a bounded step within the configured zoom range

#### Scenario: User scrolls over the canvas

- **WHEN** the user uses a wheel or trackpad scroll gesture over the canvas
- **THEN** the graph zoom level SHALL remain unchanged

### Requirement: Demo preserves local graph exploration behavior

The demo SHALL provide first-degree hover spotlight, node selection, edge selection, and background clear behavior without restarting the full layout for hover or selection changes.

#### Scenario: User hovers a node

- **WHEN** the pointer enters a node
- **THEN** the node and its directly related nodes and edges SHALL receive visual emphasis
- **AND** unrelated graph elements SHALL be visually de-emphasized
- **AND** node positions SHALL remain stable

#### Scenario: User selects a node

- **WHEN** the user clicks a node
- **THEN** the node SHALL become selected
- **AND** unrelated graph elements SHALL be visually de-emphasized
- **AND** the demo SHALL show the node label, kind, and available fixture metadata

#### Scenario: User selects an edge

- **WHEN** the user clicks an edge
- **THEN** the demo SHALL show its kind, relation type, direction, and available relation metadata

#### Scenario: User clears selection

- **WHEN** the user clicks the graph background
- **THEN** node and edge selection state SHALL be cleared
- **AND** the graph SHALL return to its normal browsing emphasis

### Requirement: Demo preserves contextual detail and quick-detail behavior

The demo SHALL use contextual labels and metadata to keep dense graphs readable. Hovered and selected nodes SHALL reveal their full labels, while edge labels SHALL be contextual rather than permanently visible. Event and news-article nodes SHALL expose local hardcoded quick-detail content; asset and narrative nodes SHALL remain graph-metadata-only.

#### Scenario: Dense graph is at rest

- **WHEN** a 400-edge or 1000-edge graph is resting without a focused element
- **THEN** the demo SHALL not force every node label to remain visible
- **AND** nonessential edge labels SHALL remain hidden

#### Scenario: Node receives focus

- **WHEN** a node is hovered, selected, or dragged
- **THEN** its full label SHALL become visible with visual priority
- **AND** the graph SHALL retain enough surrounding context for exploration

#### Scenario: Supported node opens quick detail

- **WHEN** the user activates quick detail for an event or news-article node
- **THEN** the existing local quick-detail presentation SHALL open with fixture content
- **AND** the demo SHALL NOT fetch a real entity or navigate to a production detail route

### Requirement: Demo respects existing presentation and accessibility conventions

The demo SHALL preserve the current node and edge visual distinctions, light/dark theme behavior, responsive layout, and Vietnamese/English localization. All controls and overlay surfaces SHALL be keyboard accessible and SHALL expose localized accessible names.

#### Scenario: User changes theme or locale

- **WHEN** the application theme or locale changes
- **THEN** graph colors, labels, controls, inspector copy, and unsupported states SHALL remain readable and localized

#### Scenario: User navigates controls by keyboard

- **WHEN** a keyboard user tabs through the demo controls or opens an overlay
- **THEN** focus SHALL remain visible and the control or overlay SHALL be operable with the keyboard
