## ADDED Requirements

### Requirement: Node drag does not trigger active selection
The graph view SHALL keep drag and click interactions distinct while relying on G6 behavior unless verification proves a minimal local guard is still necessary.

#### Scenario: Drag a node without selecting it
- **WHEN** the user drags a graph node and releases the pointer without a separate click
- **THEN** the node remains at the dropped position for the current client-side graph session
- **AND** the active selected node does not change merely because the drag ended

#### Scenario: Click after drag selects normally
- **WHEN** the user clicks a graph node after the drag gesture has ended
- **THEN** the clicked node can become the active selected target through the normal click selection behavior
