# graph-view-selection-state-lifecycle Specification

## Purpose
TBD - created by archiving change fix-graph-view-selection-state-lifecycle. Update Purpose after archive.
## Requirements
### Requirement: Selection state waits for graph render readiness

The graph view SHALL NOT call G6 selection state update APIs before the graph has completed its initial render.

#### Scenario: Graph mounts with no selected node

- **WHEN** the graph view creates a G6 graph instance
- **AND** no node is selected
- **THEN** the graph view does not call G6 `setElementState()` before initial render completion

#### Scenario: Node is selected after render

- **WHEN** the graph has completed initial render
- **AND** the user selects a graph node
- **THEN** the graph view applies selected-node and selected-relation states without throwing a runtime error

### Requirement: Initial null selection does not redraw graph state

The graph view SHALL skip selection state writes when there is no selected node and no previous selection state to clear.

#### Scenario: Initial unselected graph loads

- **WHEN** the graph view first renders with `selectedNodeId` unset
- **THEN** the graph keeps its default visual state
- **AND** no selection-state redraw is requested

#### Scenario: User clears an existing selection

- **WHEN** the user clears a selected node after selection states were applied
- **THEN** the graph view clears selection-specific states from nodes and edges

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

### Requirement: G6 state update errors are contained

The graph view SHALL handle asynchronous G6 state update failures without crashing the React page.

#### Scenario: G6 rejects a state update after graph teardown

- **WHEN** G6 rejects a selection state update after the graph is destroyed or disposed
- **THEN** the graph view does not surface an unhandled runtime error

#### Scenario: G6 rejects a state update while graph remains alive

- **WHEN** G6 rejects a selection state update while the graph is still alive
- **THEN** the graph view logs the error for debugging
- **AND** the page remains mounted

