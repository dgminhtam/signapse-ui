## ADDED Requirements

### Requirement: List table surface uses the list surface radius tier
The system SHALL render adopted admin list tables with the same broad surface radius tier as the list pagination/footer surface.

#### Scenario: Shared list table renders
- **WHEN** an adopted admin list table renders through `AppListTable`
- **THEN** the table shell uses `rounded-xl`
- **AND** the shell continues to own border, background, overflow clipping, and table header/body clipping

#### Scenario: Pagination footer renders below a table
- **WHEN** a list page renders pagination or footer controls below the table
- **THEN** the footer remains `rounded-xl`
- **AND** the footer is treated as a list surface container rather than a compact control primitive

### Requirement: List skeletons mirror shared table surfaces
The system SHALL ensure active list skeletons mirror the final shared table surface instead of hand-building independent `rounded-md border` shells.

#### Scenario: Active list page is loading
- **WHEN** a list page renders its Suspense fallback or skeleton state
- **THEN** the skeleton table shell uses the shared table surface composition or an equivalent shared list-table skeleton helper
- **AND** the skeleton header treatment aligns with `AppListTableHeaderRow` and `AppListTableHead`
- **AND** the skeleton does not introduce a `rounded-md border` table shell that differs from the final table UI

#### Scenario: Skeleton has page-specific columns
- **WHEN** a list skeleton needs page-specific column widths or row density
- **THEN** it may keep page-local skeleton row content
- **AND** the outer shell and header treatment still come from the shared list table pattern

### Requirement: In-table empty states keep shared ownership
The system SHALL keep adopted table empty states routed through the shared in-table empty-state structure.

#### Scenario: Adopted table has no rows
- **WHEN** an adopted list table has no rows to display
- **THEN** the table body renders an empty row through `AppListTableEmptyState`
- **AND** the empty state spans the visible columns and uses `<Empty>` inside the shared structure
- **AND** pages do not create independent empty wrappers inside the table body

### Requirement: Workbench visual directions remain excluded
The system SHALL NOT normalize graph view or market query workbench radii as part of list table radius and skeleton cleanup.

#### Scenario: Graph or market workbench contains large radii
- **WHEN** `app/(main)/graph-view` or `app/(main)/market-query` contains `rounded-2xl` or arbitrary radius values such as `rounded-[24px]`, `rounded-[30px]`, or `rounded-[36px]`
- **THEN** those values remain out of scope for this change
- **AND** they are treated as feature-specific visual direction rather than list/form cleanup debt
