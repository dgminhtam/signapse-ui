## ADDED Requirements

### Requirement: Standardized list toolbar hierarchy
The system SHALL provide a reusable toolbar surface for admin list pages that places primary task controls in a leading group and view-configuration controls in a trailing group.

#### Scenario: Wide viewport list toolbar
- **WHEN** a list page adopts the shared toolbar on a viewport at or above the small responsive breakpoint
- **THEN** the leading group renders the primary action and search controls first
- **AND** the trailing group renders sort, filters, and page-size controls after the leading group on the same toolbar row when space allows
- **AND** the trailing group remains visually distinct from the leading task group

#### Scenario: Narrow viewport list toolbar
- **WHEN** the shared toolbar is rendered on a narrow viewport
- **THEN** the leading and trailing groups stack or wrap without clipping controls
- **AND** the primary action and search controls remain earlier in reading order than sort, filters, and page-size controls
- **AND** each interactive control remains reachable and readable

### Requirement: Toolbar-level page-size selection
The system SHALL support page-size selection inside the trailing list-toolbar controls group and SHALL preserve the existing URL-driven paging semantics.

#### Scenario: Change page size from the toolbar
- **WHEN** the user selects a different page size from the shared toolbar
- **THEN** the system updates the `size` query parameter
- **AND** resets the `page` query parameter to `1`
- **AND** preserves unrelated query parameters such as search, sort, and filters

#### Scenario: Pending page-size update in the toolbar
- **WHEN** a page-size transition is pending
- **THEN** the toolbar page-size control is disabled
- **AND** the shared toolbar presents pending feedback consistent with other view controls

### Requirement: Consistent shared view-control affordances
The system SHALL provide consistent shared affordances for sort, filters, and page-size controls when they are rendered in the trailing toolbar group.

#### Scenario: Sort and page-size controls coexist
- **WHEN** a list page renders both sort and page-size controls in the trailing group
- **THEN** the controls use consistent sizing and alignment
- **AND** they can wrap or stack without overlapping the leading group
- **AND** each control exposes accessible text or labels suitable for keyboard and assistive technology
