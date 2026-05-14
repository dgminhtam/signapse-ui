## ADDED Requirements

### Requirement: Feature UI uses shadcn component wrappers
The system SHALL use shadcn/ui components from `@/components/ui/` for feature and shared app UI whenever a shadcn wrapper exists or can be added for the needed primitive.

#### Scenario: Existing shadcn wrapper is available
- **WHEN** app or feature code needs a button, input, select, dialog, sheet, drawer, alert dialog, dropdown, table, badge, empty state, spinner, skeleton, switch, tooltip, or other available shadcn component
- **THEN** the code imports and composes that component from `@/components/ui/`
- **AND** the code does not import the underlying primitive package directly

#### Scenario: Shadcn wrapper is missing
- **WHEN** app or feature code needs a standard shadcn component that is not installed in `components/ui`
- **THEN** the implementation adds the component through the shadcn workflow before using it
- **AND** the feature code imports the installed wrapper from `@/components/ui/`

#### Scenario: Shadcn wrapper internals
- **WHEN** a file inside `components/ui/` defines or updates a shadcn wrapper
- **THEN** that wrapper MAY import the underlying primitive library needed by the shadcn component
- **AND** app or feature code still MUST NOT import that primitive directly

### Requirement: UI dependency additions are controlled
The system SHALL NOT add or use external UI libraries for standard component needs without explicit approval and a proposal-backed reason.

#### Scenario: Standard component need
- **WHEN** a developer needs a standard overlay, form control, menu, feedback, data display, navigation, or layout component
- **THEN** the developer uses an existing shadcn component or adds the matching shadcn component
- **AND** no new outside UI library is installed

#### Scenario: External UI library is considered
- **WHEN** a standard shadcn component cannot satisfy a product requirement
- **THEN** the work captures the reason in an explicit proposal or user-approved decision before adding the outside UI dependency
- **AND** the implementation documents why shadcn is insufficient for that case

### Requirement: Shadcn skill guides component work
The system SHALL require the local `shadcn` skill to be consulted before adding, fixing, debugging, styling, or composing shadcn/ui components.

#### Scenario: Component is added or refactored
- **WHEN** work adds or refactors a shadcn UI component or a feature composition built from shadcn components
- **THEN** the implementation follows the local `shadcn` skill guidance for docs, composition, semantic tokens, icons, and installed component checks

#### Scenario: Overlay component is composed
- **WHEN** work composes Dialog, Sheet, Drawer, AlertDialog, Popover, DropdownMenu, or another overlay component
- **THEN** the implementation uses the shadcn wrapper composition
- **AND** the feature code does not manually recreate overlay portal, overlay z-index, or content stacking from primitive parts

### Requirement: Dialog semantics are selected by user intent
The system SHALL choose shadcn overlay components by the intent of the user workflow.

#### Scenario: Ordinary modal selection or editing
- **WHEN** the user opens a modal to select a model, edit permissions, switch workspace context, or manage a non-destructive focused workflow
- **THEN** the UI uses shadcn `Dialog`
- **AND** the dialog content remains visually above the backdrop while the surrounding page is dimmed or blurred

#### Scenario: Destructive confirmation
- **WHEN** the user must confirm an irreversible or destructive action
- **THEN** the UI uses shadcn `AlertDialog`
- **AND** the warning copy clearly explains the consequence

#### Scenario: Side or bottom panel workflow
- **WHEN** the UI presents a side panel or bottom drawer workflow
- **THEN** the UI uses shadcn `Sheet` or `Drawer`
- **AND** the component includes the required accessible title

### Requirement: Repo guidance records shadcn-only UI composition
The system SHALL document the shadcn-only component rule in `AGENTS.md` so future implementation and review work applies it consistently.

#### Scenario: Developer reads UI conventions
- **WHEN** a developer reads `AGENTS.md`
- **THEN** the UI conventions state that app and feature code must use shadcn components from `@/components/ui/`
- **AND** the guidance forbids direct use of primitive UI libraries outside shadcn wrapper files
- **AND** the guidance requires consulting the local `shadcn` skill for shadcn component work
