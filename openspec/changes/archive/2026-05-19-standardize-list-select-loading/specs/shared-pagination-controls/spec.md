## MODIFIED Requirements

### Requirement: URL-driven page-size updates

The system SHALL provide page-size selection within the shared pagination surface, SHALL use `10, 20, 50, 100` as the shared page-size options, SHALL default shared list pagination to `10` items per page, and SHALL reset the current page to `1` when page size changes.

#### Scenario: Change page size

- **WHEN** the user selects a different page size option
- **THEN** the system updates the `size` query parameter
- **AND** resets the `page` query parameter to `1`
- **AND** preserves unrelated query parameters such as search and sort

#### Scenario: Pending page-size update

- **WHEN** a page-size transition is pending
- **THEN** the page-size control is disabled
- **AND** the shared pagination surface presents the pending state without adding spinner chrome to the select trigger or surrounding toolbar layout

#### Scenario: Shared page-size options

- **WHEN** the shared page-size selector renders its default options
- **THEN** it presents `10`, `20`, `50`, and `100` as the available page-size values

#### Scenario: Shared default page size

- **WHEN** a list page uses the shared pagination default without an explicit product-specific override
- **THEN** the default page size is `10`

## ADDED Requirements

### Requirement: Disable-only pending feedback for shared list selects

The system SHALL use disable-only pending feedback for shared URL-driven toolbar select controls, including sort and page-size selectors, and SHALL NOT show inline select spinners for those controls.

#### Scenario: Sort select pending transition

- **WHEN** a sort change transition is pending
- **THEN** the sort select is disabled
- **AND** no spinner is rendered inside the select trigger or as a sibling that changes toolbar layout

#### Scenario: Page-size select pending transition

- **WHEN** a page-size change transition is pending
- **THEN** the page-size select is disabled
- **AND** no spinner is rendered inside the select trigger or as a sibling that changes toolbar layout

#### Scenario: Layout remains stable

- **WHEN** a shared list select enters or exits pending state
- **THEN** the select control and neighboring toolbar controls keep their positions without horizontal shift
