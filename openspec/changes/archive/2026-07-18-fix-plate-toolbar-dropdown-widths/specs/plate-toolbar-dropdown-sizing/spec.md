## ADDED Requirements

### Requirement: Text-bearing Plate toolbar menus remain readable
Plate toolbar dropdowns triggered by narrow controls SHALL own enough content width to display their labels without being clipped to the trigger width.

#### Scenario: Open the Insert menu
- **WHEN** a user opens the Insert toolbar dropdown
- **THEN** group labels and item labels are visible within a readable menu surface

#### Scenario: Open the Line height menu
- **WHEN** a user opens the Line height toolbar dropdown
- **THEN** each line-height value is visible within a readable menu surface

#### Scenario: Open the Turn into menu
- **WHEN** a user opens the Turn into toolbar dropdown
- **THEN** the available block type labels are visible within a readable menu surface

### Requirement: Dropdown width belongs to the menu content surface
Each affected text-bearing toolbar dropdown SHALL define its minimum width on `DropdownMenuContent` rather than repeating width constraints on individual menu items.

#### Scenario: Inspect an affected toolbar menu
- **WHEN** the Insert, Line height, or Turn into dropdown implementation is inspected
- **THEN** its content surface owns the text-bearing minimum width and its items do not repeat that width constraint

### Requirement: Intentional menu sizing is preserved
The change MUST preserve intentionally compact icon-only menus and menus that already define an explicit working content width.

#### Scenario: Open the Align menu
- **WHEN** a user opens the icon-only Align dropdown
- **THEN** the menu remains compact and its alignment icons remain usable

#### Scenario: Open the Table menu
- **WHEN** a user opens the Table dropdown
- **THEN** its existing explicit content width and table insertion behavior remain unchanged

### Requirement: Shared shadcn dropdown remains registry-aligned
The application MUST resolve Plate toolbar sizing at consumer call sites without modifying the shared radix-nova `DropdownMenuContent` wrapper.

#### Scenario: Review the implementation diff
- **WHEN** the toolbar width fix is reviewed
- **THEN** `components/ui/dropdown-menu.tsx` contains no change from this work
