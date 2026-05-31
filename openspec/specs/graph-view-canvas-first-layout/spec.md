# graph-view-canvas-first-layout Specification

## Purpose
TBD - created by archiving change simplify-graph-view-canvas-first-layout. Update Purpose after archive.
## Requirements
### Requirement: Graph view presents a canvas-first workspace
The graph view SHALL render the graph canvas as the only primary content surface when graph data exists, and the workspace SHALL be bounded to the available app viewport instead of relying on page-level scrolling.

#### Scenario: Render graph data
- **WHEN** the backend graph response contains nodes
- **THEN** the page SHALL show a single dominant graph canvas workspace
- **AND** the page SHALL NOT render a separate hero title, experiment badges, explanatory layout card, metric cards, or edge chips outside the canvas

#### Scenario: Preserve graph interactions
- **WHEN** the user interacts with the canvas
- **THEN** existing graph pan, zoom, drag, bounded-space, and recenter behavior SHALL remain available

#### Scenario: Prevent document-level horizontal overflow
- **WHEN** an authorized user opens `/graph-view` on a desktop-width viewport
- **THEN** the route SHALL NOT expose a horizontal browser or document scrollbar as part of normal graph browsing
- **AND** recovering or repositioning the graph SHALL depend on graph controls and canvas interactions rather than scrolling the page horizontally

#### Scenario: Fit the workspace inside the app shell
- **WHEN** the app header and sidebar are visible
- **THEN** the graph canvas workspace SHALL fit within the remaining viewport area
- **AND** the canvas container SHALL avoid forcing vertical document overflow except for normal app shell constraints outside this feature

### Requirement: Graph view shows graph metadata as in-canvas HUD overlays
The graph view SHALL show useful graph counts as compact overlays inside the canvas instead of external cards, and those overlays SHALL remain visually secondary to the graph topology.

#### Scenario: Show canvas identity
- **WHEN** graph data exists
- **THEN** the top-left canvas HUD SHALL show `Bieu do tri thuc`
- **AND** it SHALL NOT show the `D3 force layout` label or a descriptive paragraph

#### Scenario: Show node-kind counts
- **WHEN** graph data exists
- **THEN** node-kind counts SHALL appear inside the canvas at the top-right or right edge
- **AND** the counts SHALL include the available node kinds from the current graph model
- **AND** the node-kind count group SHALL remain visually lighter than selected, hovered, or high-priority graph labels

#### Scenario: Show lower-priority total counts
- **WHEN** graph data exists
- **THEN** the total node and edge summary SHALL appear inside the canvas at the bottom-left
- **AND** this summary SHALL be visually lower priority than the graph itself

#### Scenario: Show edge-kind counts
- **WHEN** graph data exists
- **THEN** edge-kind counts SHALL appear inside the canvas at the bottom-right
- **AND** relation labels SHALL remain concise Vietnamese labels
- **AND** the relationship summary SHALL NOT read as a primary action group unless it is explicitly interactive

#### Scenario: Separate controls from metadata
- **WHEN** graph data exists
- **THEN** zoom, recenter, and comparable canvas actions SHALL be visually grouped separately from node-kind and edge-kind counts
- **AND** metric chips SHALL NOT share the same visual grouping as graph navigation controls

### Requirement: Graph view uses compact accessible canvas controls
The graph view SHALL keep canvas controls compact while preserving accessibility and separating graph actions from graph metadata.

#### Scenario: Recenter control
- **WHEN** graph data exists
- **THEN** the recenter control SHALL render as an icon-only control
- **AND** the control SHALL expose an accessible Vietnamese label such as `Dua bieu do ve trung tam`
- **AND** activating the control SHALL keep the existing recenter behavior

#### Scenario: Controls render as a dedicated tool dock
- **WHEN** graph data exists
- **THEN** zoom in, zoom out, recenter, and comparable canvas controls SHALL appear in a compact canvas tool dock or equivalent grouped action surface
- **AND** the tool dock SHALL remain visually distinct from the node and relationship legend chips

#### Scenario: Controls remain usable in dense graph states
- **WHEN** graph labels, chips, and edges are visible
- **THEN** icon controls SHALL remain readable and targetable
- **AND** the controls SHALL NOT cover the primary graph cluster in the default centered view

### Requirement: Graph view loading and empty states match the simplified hierarchy
The graph view SHALL keep loading and empty states aligned with the canvas-first hierarchy and viewport-bounded workspace.

#### Scenario: Loading graph view
- **WHEN** graph view data is loading
- **THEN** the skeleton SHALL mirror a single canvas-first workspace
- **AND** it SHALL NOT reserve space for removed hero, explanatory cards, or metric cards
- **AND** it SHALL avoid introducing page-level horizontal overflow that the loaded state does not need

#### Scenario: Empty graph response
- **WHEN** the backend graph response contains no nodes
- **THEN** the page SHALL preserve a clear Vietnamese empty state
- **AND** the empty state SHALL remain the primary content surface for that state

