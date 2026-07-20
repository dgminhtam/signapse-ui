## ADDED Requirements

### Requirement: Personal notes Sheet MUST remain intentionally empty
The system SHALL render an empty personal-notes Sheet as the temporary frontend state.

#### Scenario: Empty Sheet contains no note workflow
- **WHEN** an authorized user opens the personal-notes Sheet
- **THEN** the Sheet MUST NOT render a note list, editor, toolbar, fullscreen control, save bar, discard dialog, empty-state placeholder, or explanatory body copy
- **AND** opening the Sheet MUST NOT load, create, update, or delete personal-note data

#### Scenario: Empty Sheet remains accessible
- **WHEN** the personal-notes Sheet opens
- **THEN** it MUST provide an accessible dialog title
- **AND** it MUST retain the standard Sheet close behavior

## MODIFIED Requirements

### Requirement: Personal notes MUST be available only through the header Sheet
The system SHALL expose the temporary personal-notes UI only as a permission-gated header Sheet utility and SHALL NOT provide a separate notes workspace destination.

#### Scenario: Header opens personal notes
- **WHEN** a user with `personal-note:read` permission uses the app header
- **THEN** the header MUST show a compact personal-note trigger labeled `Ghi chú`
- **AND** activating it MUST open the personal-notes Sheet

#### Scenario: Users without read permission cannot open the Sheet
- **WHEN** a user lacks `personal-note:read` permission
- **THEN** the header MUST NOT render the personal-note trigger

#### Scenario: Standalone notes workspace remains unavailable
- **WHEN** the temporary empty-Sheet state is active
- **THEN** the app MUST NOT provide an in-app `/notes` workspace link, breadcrumb destination, or expansion action

## REMOVED Requirements

### Requirement: Personal notes Sheet MUST optimize space for editing
**Reason**: The Sheet no longer contains a note list or editor to optimize.
**Migration**: Trigger and accessible-title behavior are covered by the retained entry-point requirement and the new empty-Sheet requirement.

### Requirement: Fullscreen mode MUST expand the editable Sheet
**Reason**: The empty Sheet has no editable surface and no fullscreen workflow.
**Migration**: Remove fullscreen state and controls without a compatibility path.

### Requirement: Personal note editor toolbar MUST be streamlined
**Reason**: The editor and its toolbars are being removed completely.
**Migration**: No toolbar controls remain in the temporary Sheet.

### Requirement: Personal note editor MUST NOT support Markdown authoring
**Reason**: The entire editor source is being removed, including all authoring behavior.
**Migration**: Remove residual editor and dependency references rather than retaining Markdown-specific compatibility code.

### Requirement: Font-size toolbar control MUST align with default shadcn sizing
**Reason**: The font-size toolbar control no longer exists.
**Migration**: No replacement control is introduced in the empty Sheet.
