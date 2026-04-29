## ADDED Requirements

### Requirement: Core controls use rounded-lg radius
The system SHALL render core reusable control primitives with `rounded-lg` as their default visible radius.

#### Scenario: Button renders with default control radius
- **WHEN** a `Button` is rendered without a feature-level radius override
- **THEN** the visible button radius is based on `rounded-lg`

#### Scenario: Input renders with default control radius
- **WHEN** an `Input` is rendered without a feature-level radius override
- **THEN** the visible input radius is based on `rounded-lg`

#### Scenario: Select trigger renders with default control radius
- **WHEN** a `SelectTrigger` is rendered without a feature-level radius override
- **THEN** the visible select trigger radius is based on `rounded-lg`

#### Scenario: Textarea renders with default control radius
- **WHEN** a `Textarea` is rendered without a feature-level radius override
- **THEN** the visible textarea radius is based on `rounded-lg`

### Requirement: Input groups own their visible radius
The system SHALL render `InputGroup` with `rounded-lg` while keeping inner input and textarea controls unrounded inside the group.

#### Scenario: InputGroup wraps an input
- **WHEN** an `InputGroup` contains an `InputGroupInput`
- **THEN** the group wrapper owns the visible `rounded-lg` radius
- **AND** the inner input remains `rounded-none`

#### Scenario: InputGroup wraps a textarea
- **WHEN** an `InputGroup` contains an `InputGroupTextarea`
- **THEN** the group wrapper owns the visible `rounded-lg` radius
- **AND** the inner textarea remains `rounded-none`

### Requirement: Surface radius cleanup remains out of scope
The system SHALL NOT change app-level surfaces, page-level skeleton shells, graph workbench surfaces, market workbench surfaces, global radius tokens, or repo guidance as part of the control-radius change.

#### Scenario: Table and pagination surface radius drift exists
- **WHEN** this change is implemented
- **THEN** `components/app-list-table.tsx` and pagination/list surface radius decisions remain unchanged
- **AND** any alignment between table `rounded-md` and pagination `rounded-xl` is deferred to a separate surface cleanup

#### Scenario: Page skeleton shell radius drift exists
- **WHEN** this change is implemented
- **THEN** page-level skeleton/table shells such as `blogs/page.tsx`, `cronjobs/page.tsx`, and `ai-provider-configs/page.tsx` remain unchanged
- **AND** those shells are deferred to a separate list/table skeleton cleanup

#### Scenario: Workbench screens use large visual radius
- **WHEN** this change is implemented
- **THEN** graph and market workbench radius values such as `rounded-[24px]`, `rounded-[30px]`, and `rounded-[36px]` remain unchanged
- **AND** those screens keep their separate visual direction
