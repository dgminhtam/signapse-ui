## MODIFIED Requirements

### Requirement: Graph view MUST prioritize the canvas as the primary exploration surface
The graph-view route SHALL present the graph canvas as the dominant visual region, and supporting information such as metrics, legend content, helper copy, title chrome, and decorative shell effects MUST be visually secondary or progressively revealed.

#### Scenario: Graph canvas remains the primary focal area on first load
- **WHEN** an authorized user opens `/graph-view` with a non-empty graph payload
- **THEN** the page MUST make the graph canvas the primary above-the-fold focus rather than presenting the canvas as one card among many equally weighted panels
- **AND** the outer shell MUST NOT compete with the graph through heavy glow, high-contrast gradient, or oversized custom radius

#### Scenario: Supporting guidance becomes secondary once the graph is available
- **WHEN** the graph-view page has data to render
- **THEN** helper content, legend content, and graph metrics MUST NOT compete equally with the main canvas for attention

#### Scenario: Page identity is clear without badge chrome
- **WHEN** graph data exists
- **THEN** the `Bieu do tri thuc` title MUST read as page or canvas identity
- **AND** it MUST NOT be styled as another metric chip, legend badge, or filter badge
