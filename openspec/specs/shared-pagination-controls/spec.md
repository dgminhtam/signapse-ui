## ADDED Requirements

### Requirement: Unified pagination controls surface

The system SHALL provide a shared pagination control surface for admin list pages that combines page-size selection, results summary, and page navigation in a single reusable component.

#### Scenario: Multi-page list on a wide viewport

- **WHEN** a list page renders more than one page of results on a wide viewport
- **THEN** the shared pagination surface shows page-size selection, summary content, and page navigation together
- **AND** the list page does not need to render separate summary markup outside the shared component

#### Scenario: Single-page result set

- **WHEN** a list page has zero or one total page of results
- **THEN** the shared pagination surface still renders the summary and page-size control
- **AND** it hides page navigation links that would not change the result set

#### Scenario: Narrow viewport layout

- **WHEN** the shared pagination surface is rendered on a narrow viewport
- **THEN** the layout reflows without clipping controls or summary text
- **AND** all interactive controls remain reachable and readable

### Requirement: Composition without core shadcn changes

The system SHALL implement the redesigned shared pagination experience by composing existing shadcn primitives and SHALL NOT require source changes to core components under `components/ui`.

#### Scenario: Pagination redesign implementation

- **WHEN** the shared pagination controls are implemented
- **THEN** the solution uses wrapper or composition components outside `components/ui`
- **AND** the redesign does not modify shadcn core component source files

### Requirement: URL-driven page navigation

The system SHALL drive page navigation from the `page` query parameter using 1-indexed URLs and SHALL preserve unrelated query parameters when navigation occurs.

#### Scenario: Navigate to a numbered page

- **WHEN** the user selects a specific page number
- **THEN** the system updates the `page` query parameter to the selected 1-indexed page
- **AND** preserves unrelated query parameters such as search and sort

#### Scenario: Navigate with previous and next controls

- **WHEN** the user activates the previous or next navigation control
- **THEN** the system updates the `page` query parameter to the adjacent valid page
- **AND** does not push a route outside the valid page range

#### Scenario: Pending page navigation

- **WHEN** a page navigation transition is pending
- **THEN** pagination navigation controls are disabled until the transition completes

### Requirement: URL-driven page-size updates

The system SHALL provide page-size selection within the shared pagination surface and SHALL reset the current page to `1` when page size changes.

#### Scenario: Change page size

- **WHEN** the user selects a different page size option
- **THEN** the system updates the `size` query parameter
- **AND** resets the `page` query parameter to `1`
- **AND** preserves unrelated query parameters such as search and sort

#### Scenario: Pending page-size update

- **WHEN** a page-size transition is pending
- **THEN** the page-size control is disabled
- **AND** the shared pagination surface presents a pending state consistent with page navigation

### Requirement: Consistent state presentation and accessible labels

The system SHALL provide consistent state styling, user-facing copy, and accessible labels for all list pages that adopt the shared pagination surface.

#### Scenario: Active page presentation

- **WHEN** the current page is rendered in the page navigation control
- **THEN** it is visually distinct from inactive pages using the existing theme system

#### Scenario: Disabled control presentation

- **WHEN** a navigation or page-size control is unavailable because of bounds or a pending transition
- **THEN** it is presented as disabled and does not trigger navigation

#### Scenario: Accessible control labels

- **WHEN** the shared pagination surface is rendered
- **THEN** previous, next, page-size, and summary controls expose accessible labels or text equivalents suitable for keyboard and assistive technology
