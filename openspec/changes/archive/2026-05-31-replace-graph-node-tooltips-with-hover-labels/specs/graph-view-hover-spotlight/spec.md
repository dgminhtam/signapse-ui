## MODIFIED Requirements

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
