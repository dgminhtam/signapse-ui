## ADDED Requirements

### Requirement: Shared toolbars exclude collaboration actions
The shared Plate editor SHALL NOT expose Comment, Suggestion, Discussion, or editor Mode controls after collaboration support is removed, while preserving the remaining single-user editing controls.

#### Scenario: Inspect the fixed toolbar
- **WHEN** a user opens the shared editor in editable mode
- **THEN** the fixed toolbar does not display Comment or Mode controls
- **AND** the remaining fixed-toolbar controls retain their existing behavior

#### Scenario: Inspect the floating toolbar
- **WHEN** a user selects editable content and the floating toolbar opens
- **THEN** the floating toolbar does not display Comment or Suggestion controls
- **AND** the remaining contextual formatting controls remain available

#### Scenario: Open a note without update permission
- **WHEN** Personal Notes renders the shared editor for a user without update permission
- **THEN** the host-provided read-only state prevents editing
- **AND** no editor-local Mode selector is required
