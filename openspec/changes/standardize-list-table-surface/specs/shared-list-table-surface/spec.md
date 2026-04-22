## ADDED Requirements

### Requirement: Standardized list table shell
The system SHALL provide a reusable surface for admin list tables that owns the outer border, radius, background, and clipping behavior for adopted list pages.

#### Scenario: Adopted list page renders the shared table surface
- **WHEN** an admin list page adopts the shared table surface
- **THEN** the table renders inside one consistent outer shell instead of a page-specific combination of nested `Card` wrappers or plain bordered `div` containers
- **AND** header and body content are clipped to the same outer radius
- **AND** the shell uses one shared background and border treatment across adopted pages

### Requirement: Consistent shared header treatment
The system SHALL provide one shared header presentation for adopted admin list tables.

#### Scenario: Table header is rendered on an adopted page
- **WHEN** an adopted admin list page renders a table header
- **THEN** the header row uses the shared visual treatment defined by the table-surface pattern
- **AND** header text hierarchy remains consistent across adopted pages
- **AND** the header presentation aligns visually with the outer table shell

### Requirement: Standardized in-table empty state
The system SHALL render empty-result states inside the table body through a consistent in-table empty-state structure.

#### Scenario: No rows match the current list state
- **WHEN** an adopted admin list page has no rows to display because the dataset is empty or the current filters return no results
- **THEN** the table body renders a single empty-state row that spans the visible columns
- **AND** the empty state uses `<Empty>` within the shared in-table structure
- **AND** spacing and alignment are consistent across adopted pages while preserving feature-owned iconography and copy

### Requirement: Table loading states mirror the final surface
The system SHALL ensure loading skeletons for adopted admin list pages mirror the shared table surface they resolve into.

#### Scenario: Initial list loading state on an adopted page
- **WHEN** an adopted admin list page is rendering its skeleton or suspense fallback
- **THEN** the loading state uses the same shell shape, header treatment, and footer placement as the final table screen
- **AND** the loading state does not introduce a conflicting header bar or alternate table shell that is absent from the final UI
