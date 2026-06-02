## MODIFIED Requirements

### Requirement: Selection state updates are batched
The graph view SHALL apply selected-node and selected-relation visual states using a batched or behavior-equivalent G6 state update, and selection optimization SHALL NOT disable existing hover, drag, animation, or force-layout behavior.

#### Scenario: User selects a node in a dense graph
- **WHEN** the user selects a node in a graph with many nodes and edges
- **THEN** the graph view computes the required node and edge states
- **AND** the graph view submits them to G6 as a single batched or behavior-equivalent state update

#### Scenario: Selection optimization preserves graph behavior
- **WHEN** selection state update logic is optimized
- **THEN** node drag, linked force reaction, hover dim/focus, graph animation, and quick detail behavior SHALL continue to work as before
- **AND** optimization SHALL NOT remove existing Graph View interaction behaviors to reduce selection update cost
