## ADDED Requirements

### Requirement: Pagination footer uses secondary visual density

The shared pagination controls surface SHALL present page navigation and summary copy as secondary list-footer controls, while preserving existing pagination behavior and accessibility.

#### Scenario: Summary copy is visually secondary

- **WHEN** the shared pagination surface renders a result summary
- **THEN** the summary copy uses compact muted typography equivalent to `text-xs text-muted-foreground`

#### Scenario: Page navigation uses compact button density

- **WHEN** the shared pagination surface renders previous, next, or numbered page navigation controls
- **THEN** those navigation controls use the existing compact icon button density rather than the default icon button density

#### Scenario: Pagination ellipsis aligns with compact navigation

- **WHEN** the shared pagination surface renders an ellipsis between page numbers
- **THEN** the ellipsis aligns visually with the compact page navigation controls

#### Scenario: Toolbar controls remain unchanged

- **WHEN** list toolbar controls such as search, create action, sort select, or page-size select render near the pagination system
- **THEN** this density refinement does not reduce their default shadcn control height or typography

#### Scenario: Pagination behavior remains unchanged

- **WHEN** a user navigates pages or a route transition is pending
- **THEN** URL-driven pagination, disabled pending state, accessible labels, and responsive wrapping behave as before
