## ADDED Requirements

### Requirement: Sidebar active item uses accent-based treatment
The sidebar navigation MUST render the current page item with an accent-based active treatment that is stronger than hover but does not use `sidebar-primary`, `sidebar-primary-foreground`, or a custom active token.

#### Scenario: Leaf item is current page
- **WHEN** a top-level sidebar item without children matches the current route
- **THEN** the item is shown as active using `sidebar-accent`-based local styling rather than primary-colored styling

#### Scenario: Child item is current page
- **WHEN** a child sidebar item matches the current route
- **THEN** the child item is shown as the active item using `sidebar-accent`-based local styling rather than primary-colored styling

### Requirement: Sidebar hover remains lightweight
The sidebar navigation MUST keep hover feedback lightweight by using the existing `sidebar-accent` hover treatment and MUST NOT make hover visually compete with the current page state.

#### Scenario: User hovers an inactive item
- **WHEN** a user hovers an inactive sidebar item
- **THEN** the item uses the normal `sidebar-accent` hover treatment without primary-colored styling

### Requirement: Sidebar expanded parent has no background state
The sidebar navigation MUST NOT apply a background color solely because a parent item is expanded; expanded state MUST be communicated by chevron rotation.

#### Scenario: Parent item is expanded
- **WHEN** a parent sidebar item is open
- **THEN** the parent item shows the rotated chevron without adding an expanded-state background

### Requirement: Parent with active child remains contextual
The sidebar navigation MUST keep parent items with an active child visually secondary to the active child item.

#### Scenario: Child item is active
- **WHEN** a child sidebar item is the current page
- **THEN** the parent item may show mild text or chevron emphasis but does not use the strongest active background

### Requirement: Sidebar active treatment avoids global token changes
The sidebar active-state refinement MUST use existing neutral shadcn sidebar tokens and local composition only.

#### Scenario: Implementing the active treatment
- **WHEN** the sidebar active-state treatment is updated
- **THEN** the implementation does not introduce `--sidebar-active` and does not change `--primary`, `--accent`, `--sidebar-primary`, or `--sidebar-accent`
