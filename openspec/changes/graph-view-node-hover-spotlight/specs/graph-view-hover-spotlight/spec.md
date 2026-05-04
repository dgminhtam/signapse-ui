## ADDED Requirements

### Requirement: Node hover reveals full title

The graph view SHALL reveal the full title of a hovered node inside the canvas without opening a modal, side panel, or page-level card.

#### Scenario: Hovered node title is readable

- **WHEN** the user hovers over a node with a truncated or hidden label
- **THEN** the graph canvas displays the node title in full near the hovered node or pointer

#### Scenario: Hover title clears after hover ends

- **WHEN** the user's pointer leaves the hovered node
- **THEN** the full-title hover surface is hidden without changing the graph layout

### Requirement: Hover emphasizes related graph context

The graph view SHALL emphasize the hovered node and its first-degree related nodes and edges while keeping unrelated graph context visible.

#### Scenario: Related elements are highlighted

- **WHEN** the user hovers over a node that has related edges
- **THEN** the hovered node receives the strongest visual emphasis and directly related nodes and edges are visually clearer than unrelated elements

#### Scenario: Unrelated elements remain visible

- **WHEN** the graph applies hover emphasis
- **THEN** unrelated nodes and edges remain visible enough to preserve overall graph context

### Requirement: Hover does not disturb force layout

The graph view SHALL apply hover effects without restarting the force layout, changing persisted node data, or changing layout-affecting node geometry.

#### Scenario: Hover is visually stable

- **WHEN** the user moves the pointer across graph nodes
- **THEN** node positions do not jump, re-cluster, or animate due only to hover state changes

#### Scenario: Drag remains primary during node drag

- **WHEN** the user drags a node
- **THEN** the drag interaction remains smooth and hover title display does not block dragging

### Requirement: Canvas labels are readable in light and dark mode

The graph view SHALL render node labels and hover title text with sufficient contrast in both light and dark mode using graph-view-local styling.

#### Scenario: Dark mode label contrast

- **WHEN** the application is in dark mode
- **THEN** visible graph labels and hover title text remain readable against the canvas, nodes, and edges

#### Scenario: Light mode label contrast

- **WHEN** the application is in light mode
- **THEN** visible graph labels and hover title text remain readable without making the canvas visually heavy

#### Scenario: Global theme tokens are unchanged

- **WHEN** graph-view readability is improved
- **THEN** the implementation does not modify global theme tokens or shadcn primitive components
