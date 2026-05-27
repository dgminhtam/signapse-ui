## MODIFIED Requirements

### Requirement: Graph view MUST prioritize the canvas as the primary exploration surface
The graph-view route SHALL present the graph canvas as the dominant visual region, and supporting information such as metrics, legend content, helper copy, and page identity MUST be visually secondary or progressively revealed.

#### Scenario: Graph canvas remains the primary focal area on first load
- **WHEN** an authorized user opens `/graph-view` with a non-empty graph payload
- **THEN** the page MUST make the graph canvas the primary above-the-fold focus rather than presenting the canvas as one card among many equally weighted panels
- **AND** the graph canvas MUST NOT be visually dominated by permanent HUD chips, helper copy, or decorative chrome

#### Scenario: Supporting guidance becomes secondary once the graph is available
- **WHEN** the graph-view page has data to render
- **THEN** helper content, legend content, and graph metrics MUST NOT compete equally with the main canvas for attention

#### Scenario: Page identity matches navigation hierarchy
- **WHEN** the graph-view route renders its breadcrumb or comparable page identity
- **THEN** the displayed hierarchy MUST match the sidebar/navigation hierarchy
- **AND** Graph View MUST NOT be shown as a child of Overview unless the navigation model makes it a child route

### Requirement: Graph view MUST reduce clutter through contextual disclosure
The graph-view surface SHALL keep dense graph detail readable by revealing some labels, metadata, and controls contextually rather than keeping all of them permanently visible.

#### Scenario: Edge labels are contextual rather than always-on
- **WHEN** a user is browsing the graph at rest
- **THEN** edge labels MUST appear only when the interaction state or readability state calls for them, such as selection, hover, or a comparable explicit reveal condition

#### Scenario: Secondary metadata does not crowd the primary graph reading path
- **WHEN** a user has not selected a node or edge
- **THEN** secondary metadata and support content MUST stay out of the primary graph reading path until requested or made relevant by interaction

#### Scenario: Relationship legend remains secondary
- **WHEN** relationship counts are visible in the canvas
- **THEN** they MUST use a compact, low-emphasis treatment or an on-demand reveal pattern
- **AND** they MUST NOT compete with selected, hovered, or high-priority graph content

#### Scenario: Helper affordances are concise
- **WHEN** graph interaction guidance is shown
- **THEN** it MUST be short, contextual, and dismissible or secondary
- **AND** it MUST NOT restore the removed explanatory card treatment as persistent primary content
