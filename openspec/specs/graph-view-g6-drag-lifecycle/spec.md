# graph-view-g6-drag-lifecycle Specification

## Purpose
TBD - created by archiving change fix-graph-view-g6-drag-lifecycle. Update Purpose after archive.
## Requirements
### Requirement: Graph view keeps dropped G6 nodes fixed during the current session
The graph view SHALL keep a user-dragged G6 node fixed at its dropped position for the current client-side graph session.

#### Scenario: Drop a dragged node
- **WHEN** the user drags a graph node and releases the pointer
- **THEN** the dragged node SHALL remain at the dropped position
- **AND** connected or clustered nodes SHALL remain able to react through the force layout
- **AND** the frontend SHALL NOT send a backend mutation for the dropped position

#### Scenario: Remount graph canvas
- **WHEN** the graph canvas remounts or graph data is refetched
- **THEN** previously dropped node positions SHALL be allowed to reset from the current graph payload and force layout

### Requirement: Node drag does not trigger active selection
The graph view SHALL keep drag and click interactions distinct while relying on G6 behavior unless verification proves a minimal local guard is still necessary.

#### Scenario: Drag a node without selecting it
- **WHEN** the user drags a graph node and releases the pointer without a separate click
- **THEN** the node remains at the dropped position for the current client-side graph session
- **AND** the active selected node does not change merely because the drag ended

#### Scenario: Click after drag selects normally
- **WHEN** the user clicks a graph node after the drag gesture has ended
- **THEN** the clicked node can become the active selected target through the normal click selection behavior

### Requirement: Graph view avoids expected G6 destroyed-instance lifecycle errors
The graph view SHALL avoid surfacing expected G6 destroyed-instance console errors caused by React development mount, cleanup, and remount races.

#### Scenario: Immediate cleanup before initial render starts
- **WHEN** React cleans up the graph canvas effect before the initial scheduled G6 render starts
- **THEN** the frontend SHALL cancel the stale render work
- **AND** G6 SHALL NOT log `[G6 v5.1.0] The graph instance has been destroyed` for that stale instance

#### Scenario: Cleanup after graph instance creation
- **WHEN** the graph canvas cleanup runs after creating a G6 graph instance
- **THEN** the frontend SHALL destroy the instance only if it has not already been destroyed
- **AND** stale cleanup SHALL NOT clear a newer graph instance reference

#### Scenario: Resize after cleanup
- **WHEN** resize observer callbacks run after the graph canvas has begun cleanup
- **THEN** the frontend SHALL ignore those callbacks
- **AND** no resize, fit, or viewport operation SHALL run against a destroyed graph instance
