## ADDED Requirements

### Requirement: Button-only page navigation controls
The system SHALL render shared pagination page navigation actions as real button controls when pagination is handled by client-side route transitions.

#### Scenario: Numbered page control is a button
- **WHEN** a user can navigate to a numbered page from the shared pagination surface
- **THEN** the page number control is rendered as a button action instead of an anchor with `href="#"`

#### Scenario: Previous and next controls are icon-only buttons
- **WHEN** previous or next navigation is available
- **THEN** each control is rendered as an icon-only button with an accessible label
- **AND** no visible previous or next text label is shown

## MODIFIED Requirements

### Requirement: URL-driven page navigation
The system SHALL drive page navigation from the `page` query parameter using 1-indexed URLs and SHALL preserve unrelated query parameters when navigation occurs. Page navigation controls SHALL be real button actions when the route transition is handled by the shared pagination client component.

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

### Requirement: Consistent state presentation and accessible labels
The system SHALL provide consistent state styling, user-facing copy, and accessible labels for all list pages that adopt the shared pagination surface. The active page SHALL use the primary active button treatment, inactive page controls SHALL use neutral outline treatment, unavailable controls SHALL use real disabled state, and previous/next controls SHALL remain icon-only with accessible labels and the same neutral outline treatment.

#### Scenario: Active page presentation

- **WHEN** the current page is rendered in the page navigation control
- **THEN** it is visually distinct from inactive pages using the existing theme system
- **AND** it exposes `aria-current="page"`

#### Scenario: Inactive page presentation

- **WHEN** a non-current page number is rendered in the page navigation control
- **THEN** it uses a neutral inactive button treatment

#### Scenario: Disabled control presentation

- **WHEN** a navigation or page-size control is unavailable because of bounds or a pending transition
- **THEN** it is presented as disabled and does not trigger navigation

#### Scenario: Accessible control labels

- **WHEN** the shared pagination surface is rendered
- **THEN** previous, next, page-size, and summary controls expose accessible labels or text equivalents suitable for keyboard and assistive technology

### Requirement: Minimal pagination footer summary
The system SHALL avoid redundant page-position and result-count badges in shared pagination footers. The footer SHALL use the summary text as the primary result-count presentation, the page navigation controls as the primary page-position presentation, and pending feedback as the only transient status badge.

#### Scenario: Multiple-page footer presentation

- **WHEN** a list has more than one page of results
- **THEN** the footer does not show a separate `Trang x/y` badge
- **AND** the active page and last page remain visible through the pagination navigation controls when applicable
- **AND** the visible item range summary remains visible

#### Scenario: Single-page or empty footer presentation

- **WHEN** a list has zero or one page of results
- **THEN** the footer does not show a redundant `n kết quả` badge
- **AND** the visible summary text remains the only static result-count text in the footer

#### Scenario: Pending footer feedback

- **WHEN** a pagination or page-size route transition is pending
- **THEN** the footer may show the existing pending feedback badge or spinner
- **AND** that pending feedback does not reintroduce static page-position or result-count badges
