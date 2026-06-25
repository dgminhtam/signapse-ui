## MODIFIED Requirements

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
