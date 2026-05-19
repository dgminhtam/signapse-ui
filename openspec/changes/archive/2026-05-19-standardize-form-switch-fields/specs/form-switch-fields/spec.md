## ADDED Requirements

### Requirement: Compact Form Switch Field

Create, update, and detail setting screens that render a boolean switch as a form field SHALL use a compact field treatment instead of an oversized card-like block.

#### Scenario: Create or update form renders a boolean setting

- **WHEN** a create or update form renders a supporting boolean setting with `Switch`
- **THEN** the field MUST use compact spacing and normal form-label typography
- **AND** the switch MUST align with the field content without making the row taller than necessary
- **AND** the field MUST NOT use a nested card-like surface solely to create border, radius, or extra padding around the switch

#### Scenario: Detail setting panel renders an editable boolean setting

- **WHEN** a detail screen renders an editable boolean setting with `Switch`
- **THEN** the setting MUST follow the same compact form switch treatment as create/update fields
- **AND** the surrounding detail panel MAY provide the meaningful section boundary

### Requirement: Consequence-Based Switch Descriptions

Form switch descriptions SHALL be optional and only present when they add decision-making context.

#### Scenario: Switch effect is obvious from the label

- **WHEN** the switch label clearly communicates the boolean state or action
- **THEN** the field MUST omit redundant description copy

#### Scenario: Switch has a non-obvious consequence

- **WHEN** the switch changes global default behavior, public visibility, permission scope, routing behavior, or another non-obvious consequence
- **THEN** the field MAY include a short muted description explaining that consequence
- **AND** the description MUST remain visually secondary to the label and input fields

### Requirement: Accessible Form Switch Wiring

Form switch fields SHALL preserve accessible switch semantics and disabled or pending behavior.

#### Scenario: Form switch has visible label and optional description

- **WHEN** a form switch field is rendered
- **THEN** the `Switch` MUST have a visible label association or an equivalent accessible name
- **AND** any description that is rendered MUST be associated with the switch or field content where supported

#### Scenario: Form switch cannot be changed

- **WHEN** a form switch is disabled because of permissions, pending mutation, or unavailable data
- **THEN** the disabled state MUST be visible and programmatically communicated
- **AND** pending feedback MUST NOT shift nearby form content

### Requirement: Form Switch Scope Boundaries

The form switch field treatment SHALL apply only to create/update/detail setting contexts and SHALL NOT replace switch treatments designed for other surfaces.

#### Scenario: Switch appears in a list row, toolbar, workbench, route row, or permission matrix

- **WHEN** a `Switch` is used as a row status capsule, toolbar/workbench control, Telegram route row toggle, or permission dialog matrix control
- **THEN** the implementation MUST keep that context's existing pattern unless a separate scoped change redesigns it
- **AND** the form switch field helper MUST NOT be forced into that context

### Requirement: Repo Guidance Covers Form Switch Fields

The repository guidance SHALL document the create/update/detail switch field rule.

#### Scenario: Developer reviews a create, update, or detail switch field

- **WHEN** a developer checks `AGENTS.md` for UI conventions
- **THEN** the guidance MUST state that form/detail switches use compact field treatment, normal label hierarchy, optional consequence-based descriptions, and do not use nested cards solely for switch styling
