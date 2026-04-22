## MODIFIED Requirements

### Requirement: Unified pagination controls surface
The system SHALL provide a shared pagination control surface for admin list pages that combines results summary and page navigation in a single reusable footer and SHALL compose cleanly with toolbar-level page-size selection when present.

#### Scenario: Multi-page list on a wide viewport

- **WHEN** a list page renders more than one page of results on a wide viewport
- **THEN** the shared pagination footer shows summary content and page navigation together
- **AND** the list page does not need to render separate summary markup outside the shared footer
- **AND** page-size selection can be rendered in the shared toolbar without being duplicated in the footer

#### Scenario: Single-page result set

- **WHEN** a list page has zero or one total page of results
- **THEN** the shared pagination footer still renders the summary
- **AND** it hides page navigation links that would not change the result set

#### Scenario: Narrow viewport layout

- **WHEN** the shared pagination footer is rendered on a narrow viewport
- **THEN** the layout reflows without clipping summary text or navigation controls
- **AND** all interactive controls remain reachable and readable

### Requirement: Consistent state presentation and accessible labels
The system SHALL provide consistent state styling, user-facing copy, and accessible labels for all list pages that adopt the shared pagination footer.

#### Scenario: Active page presentation

- **WHEN** the current page is rendered in the page navigation control
- **THEN** it is visually distinct from inactive pages using the existing theme system

#### Scenario: Disabled control presentation

- **WHEN** a navigation control is unavailable because of bounds or a pending transition
- **THEN** it is presented as disabled and does not trigger navigation

#### Scenario: Accessible footer labels

- **WHEN** the shared pagination footer is rendered
- **THEN** previous, next, current-page, and summary content expose accessible labels or text equivalents suitable for keyboard and assistive technology

## REMOVED Requirements

### Requirement: URL-driven page-size updates
**Reason**: Page-size selection is moving to the new `shared-list-toolbar-controls` capability so it can live beside sort and filters in the toolbar instead of inside the pagination footer.

**Migration**: Render page-size selection through the shared toolbar view-controls group while preserving the existing `size` and `page` query-parameter semantics.
