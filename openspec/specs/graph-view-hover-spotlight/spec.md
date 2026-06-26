# graph-view-hover-spotlight Specification

## Purpose
TBD - created by archiving change graph-view-node-hover-spotlight. Update Purpose after archive.
## Requirements
### Requirement: Node hover reveals full title

The graph view SHALL reveal the full title of a hovered node through that node's in-canvas label without opening a modal, side panel, page-level card, tooltip, or separate floating hover surface.

#### Scenario: Hovered node title is readable

- **WHEN** the user hovers over a node with a truncated or hidden label
- **THEN** the graph canvas displays the node title through the hovered node label with stronger visual priority than neighboring labels
- **AND** the graph does not display a separate tooltip, hover card, modal, or page-level detail surface for that hover

#### Scenario: Hover title clears after hover ends

- **WHEN** the user's pointer leaves the hovered node
- **THEN** the expanded in-canvas label returns to its normal label treatment without changing the graph layout
- **AND** no hover title surface remains on screen

### Requirement: Hover emphasizes related graph context
The graph view SHALL emphasize the hovered node and its first-degree related nodes and edges while keeping unrelated graph context visible and avoiding broad full-graph state churn on dense payloads.

#### Scenario: Related elements are highlighted
- **WHEN** the user hovers over a node that has related edges
- **THEN** the hovered node receives the strongest visual emphasis and directly related nodes and edges are visually clearer than unrelated elements
- **AND** the hover update targets the affected hover context instead of rebuilding the graph or restyling every graph element where practical

#### Scenario: Unrelated elements remain visible
- **WHEN** the graph applies hover emphasis
- **THEN** unrelated nodes and edges remain visible enough to preserve overall graph context
- **AND** unrelated nodes are not dimmed so strongly that their labels become unreadable when they were visible before hover

### Requirement: Hover does not disturb force layout
The graph view SHALL apply hover effects without restarting the force layout, changing persisted node data, changing layout-affecting node geometry, or triggering unnecessary graph-wide animation.

#### Scenario: Hover is visually stable
- **WHEN** the user moves the pointer across graph nodes
- **THEN** node positions do not jump, re-cluster, or animate due only to hover state changes

#### Scenario: Drag remains primary during node drag
- **WHEN** the user drags a node
- **THEN** the drag interaction remains smooth and hover title display does not block dragging
- **AND** hover state updates do not compete with the active drag gesture

### Requirement: Canvas labels are readable in light and dark mode

The graph view SHALL render node labels and hover title text with sufficient contrast in both light and dark mode using graph-view-local styling that does not rely on opaque label-card backgrounds.

#### Scenario: Dark mode label contrast

- **WHEN** the application is in dark mode
- **THEN** visible graph labels and hover title text remain readable against the canvas, nodes, and edges
- **AND** labels avoid heavy opaque background boxes around the text

#### Scenario: Light mode label contrast

- **WHEN** the application is in light mode
- **THEN** visible graph labels and hover title text remain readable without making the canvas visually heavy
- **AND** labels use graph-local text contrast treatment instead of card-like label backgrounds

#### Scenario: Global theme tokens are unchanged

- **WHEN** graph-view readability is improved
- **THEN** the implementation does not modify global theme tokens or shadcn primitive components

### Requirement: Hover state uses highlight and gray dim styling
The graph view SHALL use the G6 `highlight` state for hovered first-degree graph context and SHALL use a neutral gray `dim` style for unrelated nodes and edges without opacity-based fading.

#### Scenario: Hover applies highlight state
- **WHEN** the user hovers a graph node
- **THEN** the hovered node and its first-degree related graph context receive the `highlight` state through G6 hover behavior
- **AND** unrelated graph elements receive the `dim` state

#### Scenario: Hover dim uses neutral gray
- **WHEN** unrelated graph elements are dimmed during hover
- **THEN** dimmed nodes use neutral gray node and label colors
- **AND** dimmed edges use a neutral gray stroke
- **AND** the dim style does not rely on lowering node, label, or edge opacity
