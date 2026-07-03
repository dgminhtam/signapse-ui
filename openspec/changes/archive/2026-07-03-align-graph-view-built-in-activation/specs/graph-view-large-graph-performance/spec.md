## MODIFIED Requirements

### Requirement: Graph interactions update through built-in behavior paths
Graph View SHALL avoid additional custom full-graph state loops for common hover and active interactions when G6 built-in behavior can provide the requested highlight and dim semantics.

#### Scenario: Hover uses built-in relation activation
- **WHEN** the user hovers a node in a dense graph
- **THEN** G6 hover activation applies first-degree highlight and dim states
- **AND** Graph View does not add a second custom active-state update on top of the G6 hover behavior

#### Scenario: Active mode uses built-in selection activation
- **WHEN** the user activates a node after another node was already active
- **THEN** G6 behavior-equivalent selection handling updates the active highlight and dim states
- **AND** the interaction does not rebuild the G6 graph instance
- **AND** Graph View does not run a separate custom full-graph selected-state loop
