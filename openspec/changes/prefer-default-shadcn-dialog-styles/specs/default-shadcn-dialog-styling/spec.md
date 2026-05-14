## ADDED Requirements

### Requirement: Dialog usages prefer shadcn default chrome
Feature and shared app dialog usages SHALL rely on the default visual styling provided by `@/components/ui/dialog` for modal chrome.

#### Scenario: Simple dialog uses default shell styling
- **WHEN** a simple modal workflow uses shadcn `DialogContent`
- **THEN** the usage does not reset default content padding or gap with classes such as `p-0` or `gap-0`
- **AND** the usage does not recreate header or footer shell chrome with custom borders, background fills, shadows, or title typography

#### Scenario: Default close button is sufficient
- **WHEN** a dialog can be closed normally without business-specific close blocking
- **THEN** the usage relies on the default close button rendered by `DialogContent`
- **AND** the usage does not set `showCloseButton={false}` only to recreate the same close button manually

### Requirement: Dialog overrides are layout-only
Feature and shared app dialog usages SHALL limit `className` overrides on Dialog parts to layout constraints that are required by the content.

#### Scenario: Wider dialog content is required
- **WHEN** a dialog needs more horizontal room for model lists, watchlist editing, or permission editing
- **THEN** the usage MAY set width or max-width classes on `DialogContent`
- **AND** the usage does not add unrelated visual styling classes for shadow, ring, border, text color, or background

#### Scenario: Scrollable dialog body is required
- **WHEN** a dialog contains a long list or dense editor
- **THEN** the usage MAY set max-height, flex layout, and overflow classes needed for a stable scroll region
- **AND** the usage keeps the shadcn dialog shell styling intact

### Requirement: Dialog content behavior remains unchanged
The dialog style cleanup SHALL preserve the business behavior of each affected workflow.

#### Scenario: AI provider model selection
- **WHEN** a user selects and confirms a model in the AI provider model picker
- **THEN** the selected model flow and disabled confirm behavior remain unchanged
- **AND** the dialog uses shadcn default chrome with only necessary list layout overrides

#### Scenario: Workspace create or rename
- **WHEN** a user creates or renames a workspace through the workspace dialog
- **THEN** validation, pending state, submit, cancel, and refresh behavior remain unchanged
- **AND** the dialog uses shadcn default chrome with minimal layout overrides

#### Scenario: Workspace watchlist editing
- **WHEN** a user opens, updates, or saves the workspace watchlist editor
- **THEN** loading, permission, save, and refresh behavior remain unchanged
- **AND** the dialog uses shadcn default chrome with only necessary width or body layout overrides

#### Scenario: Role permission editing
- **WHEN** a user searches, toggles, resets, or saves role permissions
- **THEN** filtering, selection, pending state, and save behavior remain unchanged
- **AND** the dialog keeps only the layout exceptions needed for its dense permission editor
