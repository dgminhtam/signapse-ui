## ADDED Requirements

### Requirement: Graph view bounds force layout work for dense payloads
The graph view SHALL keep G6 force layout work bounded so large graph payloads settle into a readable state without continuous nonessential animation.

#### Scenario: Dense graph initial layout settles
- **WHEN** the graph renders a dense backend payload
- **THEN** the force layout SHALL run only the bounded work needed to reach a readable clustered arrangement
- **AND** hover or selection SHALL NOT restart the full force layout

#### Scenario: Drag force remains local session behavior
- **WHEN** the user drags a node after the graph has settled
- **THEN** connected or clustered nodes MAY react through the force layout
- **AND** the updated positions remain local to the current client session
- **AND** no backend mutation is sent
