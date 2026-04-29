## ADDED Requirements

### Requirement: List table owns toolbar-to-table spacing
The system SHALL place active list tables 16px below their preceding list toolbar or list controls through the shared list table surface.

#### Scenario: Toolbar and table render together
- **WHEN** an active list screen renders `AppListToolbar` followed by `AppListTable`
- **THEN** `AppListToolbar` does not apply a default bottom margin
- **AND** `AppListTable` applies the shared 16px top spacing with `mt-4`
- **AND** the visual distance between toolbar controls and table surface is consistent across adopted list screens

#### Scenario: Table renders in a nonstandard list context
- **WHEN** a list page renders `AppListTable` without a preceding `AppListToolbar`
- **THEN** the table still uses the shared default top spacing unless the page has a specific layout reason to override it through `className`

### Requirement: Table-to-footer spacing remains consistent
The system SHALL keep table-to-pagination/footer spacing aligned with toolbar-to-table spacing.

#### Scenario: Pagination footer renders below a table
- **WHEN** an active list screen renders `AppPaginationControls` below `AppListTable`
- **THEN** pagination/footer spacing remains 16px from the table through the existing `mt-4` usage
- **AND** the list rhythm reads as toolbar, 16px gap, table, 16px gap, footer

### Requirement: List skeletons mirror final spacing rhythm
The system SHALL ensure active list loading states mirror the same toolbar-to-table spacing as the final loaded list.

#### Scenario: Active list skeleton renders
- **WHEN** a list page renders a Suspense fallback or skeleton state with toolbar skeleton and table skeleton
- **THEN** the table skeleton uses `AppListTable` spacing or an equivalent shared list table surface
- **AND** parent wrapper gaps do not add an extra gap beyond the intended 16px toolbar-to-table distance

### Requirement: Repository guidance documents list spacing ownership
The system SHALL document list toolbar, table, and footer spacing ownership in `AGENTS.md`.

#### Scenario: Future list page is reviewed
- **WHEN** a contributor creates or reviews a list page
- **THEN** repo guidance requires `AppListToolbar` to manage only internal toolbar layout
- **AND** repo guidance requires `AppListTable` to own the default top spacing from toolbar/list controls
- **AND** reviewers flag page-local toolbar margins or double-spacing wrappers as layout drift
