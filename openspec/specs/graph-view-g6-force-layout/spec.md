# graph-view-g6-force-layout Specification

## Purpose
TBD - created by archiving change replace-graph-view-canvas-with-g6-force-layout. Update Purpose after archive.
## Requirements
### Requirement: Graph view renders through a G6 force canvas
The graph view SHALL render the current backend graph payload through a client-only G6 canvas using a force-directed layout and WebGL renderer.

#### Scenario: Render graph payload
- **WHEN** the backend returns graph nodes and edges for `/graph-view`
- **THEN** the graph view SHALL map that payload into G6 nodes and edges
- **AND** the graph view SHALL render the mapped graph without requiring backend contract changes
- **AND** the graph view SHALL preserve stable node and edge ids from the payload

#### Scenario: Browser-only canvas
- **WHEN** the graph view route is server-rendered or built by Next.js
- **THEN** the G6 canvas SHALL remain isolated behind a client-only boundary
- **AND** browser-only rendering APIs SHALL NOT be evaluated during server module execution

#### Scenario: WebGL renderer initialization
- **WHEN** Graph View creates the G6 graph instance
- **THEN** the graph SHALL use the G6 WebGL renderer from `@antv/g-webgl`
- **AND** existing force layout, drag, hover, selection, zoom, recenter, and quick-detail behavior SHALL remain available

### Requirement: Graph view uses team clustering force layout
The graph view SHALL arrange the current backend graph as a compact tree-like force-directed structure using hierarchy-aware branch and leaf forces, and performance optimizations SHALL preserve the visible force-layout settle behavior.

#### Scenario: Map hierarchy for force layout
- **WHEN** the frontend maps graph nodes and edges for the G6 canvas
- **THEN** asset nodes SHALL be treated as the root hierarchy level
- **AND** narrative and event nodes SHALL be treated as branch hierarchy levels
- **AND** news article nodes SHALL be treated as leaf hierarchy nodes

#### Scenario: Apply hierarchy-aware link force
- **WHEN** the G6 force layout computes link distance and strength
- **THEN** links from the asset/root level SHALL use a longer and weaker branch force
- **AND** links from lower branch levels to terminal leaf nodes SHALL use a shorter and stronger leaf force
- **AND** direct asset-to-terminal links SHALL NOT be shortened solely because the child node has no children

#### Scenario: Render tree-like layout
- **WHEN** the G6 force layout runs
- **THEN** connected nodes SHALL settle into readable branches around the asset root where practical
- **AND** lower-level leaf nodes SHALL stay visually grouped near their parent branch where practical
- **AND** unrelated branches SHALL remain separated enough to avoid collapsing into a single pile
- **AND** performance optimization SHALL NOT remove the visible force-layout settle behavior solely because the graph is dense

#### Scenario: Avoid radial seed bias
- **WHEN** the frontend creates the initial G6 graph data
- **THEN** graph nodes SHALL NOT be seeded into a deterministic circular or radial arrangement by frontend-provided `x` and `y` positions
- **AND** the force layout SHALL be allowed to settle from natural G6 force initialization

### Requirement: Graph view supports force-directed drag exploration
The graph view SHALL allow users to drag graph elements with force behavior so connected nodes react while preserving overall graph readability, and performance optimizations SHALL NOT disable or materially weaken this behavior based on graph size.

#### Scenario: Drag a node
- **WHEN** the user drags a graph node
- **THEN** the dragged node SHALL follow the pointer
- **AND** connected or clustered nodes SHALL react through the force layout rather than remaining completely static
- **AND** the graph SHALL avoid sending backend mutations for drag positions

#### Scenario: Dense graph drag preserves force reaction
- **WHEN** the user drags a node in a dense graph
- **THEN** the dragged node SHALL still follow the pointer
- **AND** connected or clustered nodes SHALL still react through the force layout
- **AND** performance optimization SHALL NOT disable animation or force-layout reaction solely because the graph is dense

#### Scenario: Drop a dragged node
- **WHEN** the user releases a dragged graph node
- **THEN** the node SHALL remain fixed at the dropped position for the current client-side graph session
- **AND** the fixed position SHALL NOT be persisted to the backend
- **AND** the rest of the force layout SHALL remain able to react around the fixed node

#### Scenario: Navigate canvas
- **WHEN** the user pans or zooms the graph canvas
- **THEN** the graph view SHALL update the viewport without rebuilding the backend graph data
- **AND** the force layout SHALL remain usable after viewport changes

### Requirement: Graph view MVP keeps behavior intentionally minimal
The first G6 canvas implementation SHALL focus on rendering and force exploration before restoring advanced Sigma-era inspection behavior.

#### Scenario: Defer advanced inspection behavior
- **WHEN** the G6 canvas MVP is implemented
- **THEN** hover full-title cards, modal detail inspection, local focus controls, contextual edge-label toggles, and position persistence SHALL NOT be required for completion
- **AND** the graph route SHALL still provide an empty state when no graph data is available
- **AND** the graph route SHALL remain buildable and navigable

### Requirement: Graph view bounds force layout work for dense payloads
The graph view SHALL keep G6 force layout work bounded so large graph payloads settle into a readable state without continuous nonessential animation or custom dense-graph clustering passes.

#### Scenario: Dense graph initial layout settles
- **WHEN** the graph renders a dense backend payload
- **THEN** the force layout SHALL run only the bounded work needed to reach a readable arrangement
- **AND** hover or selection SHALL NOT restart the full force layout

#### Scenario: Drag force remains local session behavior
- **WHEN** the user drags a node after the graph has settled
- **THEN** connected nodes MAY react through the force layout
- **AND** the updated positions remain local to the current client session
- **AND** no backend mutation is sent
