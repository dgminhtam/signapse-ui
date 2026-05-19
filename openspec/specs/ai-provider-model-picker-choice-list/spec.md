# ai-provider-model-picker-choice-list Specification

## Purpose
TBD - created by archiving change refine-ai-provider-model-picker-choice-list. Update Purpose after archive.
## Requirements
### Requirement: Model picker uses shadcn scroll containment
The AI provider model picker dialog SHALL render a populated model list inside a shadcn `ScrollArea` wrapper instead of a custom overflow-only container.

#### Scenario: Model list has available options
- **WHEN** the model picker dialog receives one or more model options
- **THEN** the model options are contained in a shadcn `ScrollArea`
- **AND** the dialog keeps layout-only height constraints so long model lists scroll inside the dialog instead of expanding the page

#### Scenario: Model list is empty
- **WHEN** the model picker dialog receives no model options
- **THEN** the existing empty state remains visible
- **AND** the confirm action remains disabled

### Requirement: Model options use shadcn radio choice cards
The AI provider model picker dialog SHALL render model options as a controlled shadcn `RadioGroup` composed with `Field` choice-card primitives.

#### Scenario: User views model options
- **WHEN** the model picker dialog displays model options
- **THEN** each option is rendered with `FieldLabel`, `Field`, `FieldContent`, `FieldTitle`, `FieldDescription` when applicable, and `RadioGroupItem`
- **AND** the implementation does not use custom clickable button rows, custom selected check icons, or hand-written hover/selected row chrome

#### Scenario: Existing selected model is present
- **WHEN** `currentModel` matches an available model option
- **THEN** the matching radio choice is selected when the dialog opens
- **AND** the confirm action is enabled

#### Scenario: User selects a model
- **WHEN** the user selects a different model option
- **THEN** the controlled selected model value updates to that option's id
- **AND** confirming the dialog calls the existing confirm callback with the selected model id

### Requirement: Model picker preserves existing business behavior
The AI provider model picker refinement SHALL be a presentation and interaction-semantics change only.

#### Scenario: Model picker is refactored
- **WHEN** the model picker list is changed to shadcn `ScrollArea` and `RadioGroup`
- **THEN** the existing model catalog data shape, credential validation flow, dialog open state, confirm callback, and Vietnamese user-facing copy remain unchanged
- **AND** feature code imports only shadcn wrappers from `@/components/ui/` rather than primitive UI libraries directly

