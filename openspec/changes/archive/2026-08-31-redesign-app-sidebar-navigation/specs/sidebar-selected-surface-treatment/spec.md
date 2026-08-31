## ADDED Requirements

### Requirement: Sidebar current destination is semantically exposed

The sidebar navigation MUST expose the current direct or child destination with `aria-current="page"` while preserving the neutral selected-surface visual treatment.

#### Scenario: Direct destination is current

- **WHEN** the current pathname matches a direct sidebar destination or its owned descendant route
- **THEN** that destination link has `aria-current="page"`
- **AND** no unrelated destination has `aria-current="page"`

#### Scenario: Child destination is current

- **WHEN** the current pathname matches a child sidebar destination or its owned descendant route
- **THEN** that child link has `aria-current="page"`
- **AND** its parent trigger does not claim to be the current page

#### Scenario: Current destination renders in collapsed flyout

- **WHEN** a collapsed grouped flyout contains the current child destination
- **THEN** the child retains `aria-current="page"` and selected-surface semantics inside the flyout
