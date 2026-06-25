## ADDED Requirements

### Requirement: Active mode mirrors hover emphasis
The graph view SHALL provide an active node mode whose visual treatment matches the hover highlight and dim treatment.

#### Scenario: User activates a node
- **WHEN** the user clicks a graph node
- **THEN** the clicked node and its first-degree related nodes and edges receive the active highlight treatment
- **AND** unrelated nodes and edges receive the same dim treatment used during hover
- **AND** the selected node detail inspector opens for the clicked node

#### Scenario: User clears active mode
- **WHEN** the user clicks the canvas outside graph nodes
- **THEN** active graph states are cleared
- **AND** the selected node detail inspector closes

## MODIFIED Requirements

### Requirement: Selection state updates are batched
The graph view SHALL apply active-node and active-relation visual states using G6 behavior-equivalent state updates, and selection optimization SHALL NOT disable existing hover, drag, animation, or force-layout behavior.

#### Scenario: User selects a node in a dense graph
- **WHEN** the user selects a node in a graph with many nodes and edges
- **THEN** the graph view delegates active and related visual state updates to G6 behavior-equivalent handling
- **AND** the graph view does not run a separate custom loop over all nodes and edges to apply selected-related or selected-inactive states

#### Scenario: Selection optimization preserves graph behavior
- **WHEN** selection state update logic is optimized
- **THEN** node drag, linked force reaction, hover dim/focus, graph animation, and quick detail behavior SHALL continue to work as before
- **AND** active mode visual styling SHALL match hover mode visual styling
