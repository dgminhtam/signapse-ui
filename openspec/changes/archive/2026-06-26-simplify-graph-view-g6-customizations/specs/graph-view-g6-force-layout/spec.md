## ADDED Requirements

### Requirement: Graph view uses a minimal G6 force layout
The graph view SHALL use G6-supported force layout configuration without custom hierarchy anchors, inferred cluster membership, per-kind many-body strength tables, or per-edge-kind link tuning tables.

#### Scenario: Create force layout
- **WHEN** Graph View creates the G6 graph instance
- **THEN** the layout uses a force-directed G6 layout with only the small set of parameters needed for readable rendering
- **AND** the layout does not derive custom cluster anchors, hierarchy levels, or leaf flags from the graph payload

#### Scenario: Relation edges render without custom layout tuning
- **WHEN** the backend returns asset, narrative, event, and news-article relationships
- **THEN** all relationships render through the same G6 layout configuration
- **AND** relationship type does not select custom link distance, link strength, or many-body strength functions

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Graph view uses team clustering force layout
**Reason**: The refactor intentionally removes custom team clustering and hierarchy anchoring so Graph View relies on G6-supported force behavior.
**Migration**: Use the new minimal G6 force layout requirement and keep relationship readability through built-in layout configuration only.
