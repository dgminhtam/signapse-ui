## ADDED Requirements

### Requirement: List Row Switch Capsule
List or table rows that expose an inline boolean state toggle MUST render the state label and switch as one compact capsule control instead of separate loose inline elements.

#### Scenario: Boolean row state in a list table
- **WHEN** a list table row renders a boolean state toggle such as active/inactive
- **THEN** the row MUST show a stable capsule containing the current state label and the switch
- **AND** the switch MUST remain inside the same visual control surface as the label

#### Scenario: News outlet active state
- **WHEN** the news outlet list renders the `Kích hoạt` column
- **THEN** each row MUST show a capsule-style active control with `Đang bật` or `Tạm dừng` next to the switch

### Requirement: Accessible List Row Switches
List row switch controls MUST preserve accessible switch semantics and row-specific labels.

#### Scenario: Screen reader label
- **WHEN** a row switch toggles a specific entity
- **THEN** the switch MUST have an `aria-label` that names the action and the entity

#### Scenario: Disabled permission state
- **WHEN** the user does not have permission to update the row state
- **THEN** the switch MUST be disabled and the visual control MUST not imply that the action is available

### Requirement: Stable Pending Feedback
List row switch controls MUST provide pending feedback without changing the table column width or shifting nearby content.

#### Scenario: Toggle mutation pending
- **WHEN** a row switch mutation is pending
- **THEN** the affected row control MUST indicate pending or disabled state
- **AND** the table cell layout MUST remain stable

### Requirement: Matching List Skeleton
List skeletons MUST mirror the final switch capsule layout for columns that contain list row switch controls.

#### Scenario: Loading list table
- **WHEN** a list table with a switch capsule column is loading
- **THEN** the skeleton for that column MUST use a capsule-like placeholder that matches the final control width and height
