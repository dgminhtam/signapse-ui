## MODIFIED Requirements

### Requirement: Graph view presents a canvas-first workspace
The graph view SHALL render the graph canvas as the only primary content surface when graph data exists, and the canvas shell SHALL use restrained system-aligned section chrome.

#### Scenario: Render graph data
- **WHEN** the backend graph response contains nodes
- **THEN** the page SHALL show a single dominant graph canvas workspace
- **AND** the page SHALL NOT render a separate hero title, experiment badges, explanatory layout card, metric cards, or edge chips outside the canvas
- **AND** the canvas shell SHALL use the same general radius rhythm as standard Signapse sections such as `rounded-xl`
- **AND** the canvas shell SHALL NOT rely on a heavy gradient or large glow as the primary visual treatment

#### Scenario: Preserve graph interactions
- **WHEN** the user interacts with the canvas
- **THEN** existing graph pan, zoom, drag, bounded-space, and recenter behavior SHALL remain available

### Requirement: Graph view shows graph metadata as in-canvas HUD overlays
The graph view SHALL show useful graph counts as compact overlays inside the canvas instead of external cards, while page identity remains plain text rather than a badge-style chip.

#### Scenario: Show canvas identity
- **WHEN** graph data exists
- **THEN** the top-left canvas HUD SHALL show `Bieu do tri thuc`
- **AND** it SHALL render as larger plain title text without a pill, badge, or card wrapper
- **AND** it SHALL NOT show the `D3 force layout` label or a descriptive paragraph

#### Scenario: Show node-kind counts
- **WHEN** graph data exists
- **THEN** node-kind counts SHALL appear inside the canvas at the top-right or right edge
- **AND** the counts SHALL include the available node kinds from the current graph model
- **AND** the node-kind counts SHALL remain visually distinct from the plain title text

#### Scenario: Show lower-priority total counts
- **WHEN** graph data exists
- **THEN** the total node and edge summary SHALL appear inside the canvas at the bottom-left
- **AND** this summary SHALL be visually lower priority than the graph itself

#### Scenario: Show edge-kind counts
- **WHEN** graph data exists
- **THEN** edge-kind counts SHALL appear inside the canvas at the bottom-right
- **AND** relation labels SHALL remain concise Vietnamese labels

### Requirement: Graph view uses compact accessible canvas controls
The graph view SHALL keep canvas controls compact while preserving accessibility and using a shadcn grouped-control treatment.

#### Scenario: Recenter control
- **WHEN** graph data exists
- **THEN** the recenter control SHALL render as an icon-only control
- **AND** the control SHALL use a locate, focus, or comparable spatial-position icon rather than a reset or undo-style icon
- **AND** the control SHALL expose an accessible Vietnamese label such as `Dua bieu do ve trung tam`
- **AND** activating the control SHALL keep the existing recenter behavior

#### Scenario: Group viewport controls
- **WHEN** graph data exists
- **THEN** zoom out, recenter, and zoom in controls SHALL be grouped with the installed shadcn `ButtonGroup`
- **AND** the recenter control SHALL sit between zoom out and zoom in
- **AND** the group SHALL NOT add a separate custom outer pill solely to recreate button group chrome

### Requirement: Graph view loading and empty states match the simplified hierarchy
The graph view SHALL keep loading and empty states aligned with the canvas-first hierarchy and polished canvas chrome.

#### Scenario: Loading graph view
- **WHEN** graph view data is loading
- **THEN** the skeleton SHALL mirror a single canvas-first workspace
- **AND** it SHALL NOT reserve space for removed hero, explanatory cards, or metric cards
- **AND** the skeleton SHALL mirror the plain title, grouped controls, standard radius, and restrained surface treatment

#### Scenario: Empty graph response
- **WHEN** the backend graph response contains no nodes
- **THEN** the page SHALL preserve a clear Vietnamese empty state
- **AND** the empty state SHALL remain the primary content surface for that state
