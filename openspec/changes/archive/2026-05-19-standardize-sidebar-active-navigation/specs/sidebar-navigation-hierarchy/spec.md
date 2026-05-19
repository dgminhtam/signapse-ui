## ADDED Requirements

### Requirement: Sidebar active color uses shadcn sidebar accent behavior
The system SHALL use the original shadcn sidebar accent color behavior for selected, hover, and open navigation states instead of dedicated custom active color tokens.

#### Scenario: Active color is reverted
- **WHEN** a sidebar navigation item represents the current route
- **THEN** the item uses the sidebar accent treatment rather than `sidebar-active` styling

#### Scenario: Custom active tokens are removed
- **WHEN** sidebar active styling is updated
- **THEN** `sidebar-active` token definitions and usage are removed from the active implementation

### Requirement: Sidebar hierarchy distinguishes parent section and current page
The system SHALL distinguish parent section and child page hierarchy through spacing, row height, width, and typography without introducing heavy custom active colors.

#### Scenario: Child route is active
- **WHEN** the current route matches a child navigation item
- **THEN** the parent group is shown as open context and the child item remains readable within the original sidebar accent color model

#### Scenario: Parent route without children is active
- **WHEN** the current route matches a top-level navigation item without children
- **THEN** that top-level item uses the original sidebar selected navigation treatment directly

### Requirement: Sidebar item density remains readable
The system SHALL make sidebar navigation parent and child rows large enough to scan comfortably while preserving the existing rhythm between same-level items.

#### Scenario: Expanded sidebar is shown
- **WHEN** the sidebar is expanded
- **THEN** parent and child navigation items have enough height, icon alignment, and text contrast to read comfortably in normal dashboard usage

#### Scenario: Parent and child rows are compared
- **WHEN** an expanded parent item and its child list are visible
- **THEN** parent rows are visually more substantial than child rows, and child rows are still taller than the previous undersized treatment

#### Scenario: Parent group is expanded
- **WHEN** a parent group reveals child navigation items
- **THEN** the child list has clear breathing room from the parent without increasing the gap between sibling children unnecessarily

### Requirement: Sidebar behavior remains unchanged
The system SHALL preserve navigation behavior while changing only visual hierarchy and active-state styling.

#### Scenario: Sidebar navigation is used
- **WHEN** a user clicks a sidebar item
- **THEN** existing route links, permission filtering, route matching, and collapsed tooltip behavior continue to work as before
