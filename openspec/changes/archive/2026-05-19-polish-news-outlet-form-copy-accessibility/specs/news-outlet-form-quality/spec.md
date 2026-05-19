## ADDED Requirements

### Requirement: Professional Vietnamese form copy
The news outlet create/edit form SHALL use professional Vietnamese text for all user-facing form copy, without mojibake or unaccented Vietnamese.

#### Scenario: Form renders with readable Vietnamese
- **WHEN** the create or edit news outlet form renders
- **THEN** the form title, description, field labels, helper text, validation messages, toast messages, submit state, and cancel action MUST display readable Vietnamese text

#### Scenario: Copy remains scoped to the current form model
- **WHEN** the form copy is updated
- **THEN** the copy MUST describe the existing create/edit workflow without introducing read-only detail behavior or unsupported API fields

### Requirement: Form controls expose invalid state accessibly
The news outlet create/edit form SHALL expose validation state on each editable form control according to the local shadcn form pattern.

#### Scenario: A text input has a validation error
- **WHEN** a news outlet `Input` field is invalid
- **THEN** the surrounding `Field` MUST have `data-invalid` and the `Input` MUST have `aria-invalid={true}`

#### Scenario: A textarea has a validation error
- **WHEN** the description `Textarea` field is invalid
- **THEN** the surrounding `Field` MUST have `data-invalid` and the `Textarea` MUST have `aria-invalid={true}`

#### Scenario: A control is valid
- **WHEN** an editable control has no validation error
- **THEN** its `aria-invalid` value MUST be false or absent while existing validation feedback remains available when errors occur
