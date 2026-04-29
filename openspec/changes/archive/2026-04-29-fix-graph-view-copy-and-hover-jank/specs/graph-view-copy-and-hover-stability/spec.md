## ADDED Requirements

### Requirement: Graph view MUST render correct Vietnamese copy across the browse surface
The graph-view route SHALL render professional Vietnamese user-facing copy without corrupted encoding in the page shell, workbench, canvas overlays, and inspector content.

#### Scenario: Route shell copy renders correctly
- **WHEN** a signed-in user opens `/graph-view`
- **THEN** the page title, description, access-denied message, and empty-state copy MUST render as correct Vietnamese text instead of corrupted encoded characters

#### Scenario: Workbench and inspector copy render correctly
- **WHEN** the graph-view workbench renders with graph data
- **THEN** badges, helper text, status labels, inspector labels, and canvas overlay copy MUST render as correct Vietnamese text instead of corrupted encoded characters

### Requirement: Graph view MUST keep hover feedback lightweight and localized
Hovering a graph node SHALL remain a transient reading aid that emphasizes the local neighborhood without repeatedly rewriting broad shell or inspector content.

#### Scenario: Hover feedback stays near the canvas
- **WHEN** a user moves the pointer across nodes in the graph canvas
- **THEN** the primary hover feedback MUST remain bounded to the graph canvas or other low-cost local surfaces rather than driving large page-level text changes on every hover event

#### Scenario: Hover does not destabilize the surrounding workbench
- **WHEN** a user hovers multiple nodes in succession
- **THEN** the graph-view shell and inspector layout MUST remain visually stable instead of appearing to jump or reflow with each hover transition

### Requirement: Graph view MUST preserve selection-first detail behavior
The graph-view workbench SHALL treat selection as the stable source of detail for inspector content, anchored status messaging, and drill-down affordances.

#### Scenario: Selection remains the active detail state during hover
- **WHEN** a node or edge is selected and the user later hovers a different node
- **THEN** the inspector MUST continue to show the selected item as the active detail context until the selection changes

#### Scenario: Hover still supports browse-first graph reading
- **WHEN** no item is selected and a user hovers a node
- **THEN** the graph MUST still provide local neighborhood emphasis and concise transient feedback without requiring an additional fetch or replacing the broader page state model
