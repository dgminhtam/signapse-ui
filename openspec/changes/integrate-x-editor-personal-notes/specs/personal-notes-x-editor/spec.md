## ADDED Requirements

### Requirement: Personal notes MUST use x-editor through a stable adapter
The system SHALL replace the custom personal note `contentEditable` editor with the full `@shadcn-editor/editor-x` experience while keeping app-facing note surfaces dependent on a stable `PersonalNoteEditor` adapter.

#### Scenario: Note surfaces continue using the app editor adapter
- **WHEN** the quick Sheet or full `/notes` workspace renders a personal note editor
- **THEN** it MUST import and use the app-level `PersonalNoteEditor` adapter
- **AND** it MUST NOT import low-level x-editor nodes, plugins, extensions, or Lexical state types directly

#### Scenario: Full x-editor capability is available
- **WHEN** a user edits a personal note
- **THEN** the editor MUST expose the registry-supported rich editing features, including toolbar formatting, lists, checklists, links, code blocks, tables, markdown shortcuts, images, embeds, and layout features where supported by x-editor

### Requirement: Personal note persistence MUST remain HTML-based
The system SHALL keep `contentHtml` as the only create/update persistence boundary even though x-editor uses Lexical state internally.

#### Scenario: Existing note HTML initializes x-editor
- **WHEN** a personal note detail response returns `contentHtml`
- **THEN** the frontend MUST initialize x-editor from that HTML
- **AND** it MUST keep Lexical state internal to the editor adapter

#### Scenario: Save exports HTML
- **WHEN** a user explicitly saves a personal note edited in x-editor
- **THEN** the frontend MUST export the current editor content as HTML
- **AND** it MUST call the existing create/update action with only `{ contentHtml }`

#### Scenario: Save success rehydrates from sanitized HTML
- **WHEN** the backend returns a saved personal note after create or update
- **THEN** the frontend MUST replace the editor state with the returned `contentHtml`
- **AND** it MUST mark the editor as clean after rehydration

#### Scenario: Lexical JSON does not leak to API actions
- **WHEN** personal note actions create or update a note
- **THEN** they MUST NOT send Lexical JSON, editor metadata, toolbar state, plugin state, or unsupported frontend-only fields

### Requirement: X-editor source MUST be organized and reviewable
The system SHALL integrate generated x-editor source with an explicit ownership boundary and reviewed dependencies.

#### Scenario: Registry install is reviewed before migration is finalized
- **WHEN** the x-editor registry item is installed
- **THEN** the implementation MUST review the generated file list and dependency list
- **AND** it MUST identify which dependencies and wrappers are new versus already present

#### Scenario: Editor-specific files have a module boundary
- **WHEN** generated files are committed
- **THEN** editor-specific nodes, plugins, extensions, themes, transformers, and utilities MUST live behind an intentional editor module boundary
- **AND** only actual shadcn wrapper files MAY remain in `components/ui`

#### Scenario: Feature code avoids editor internals
- **WHEN** personal note surfaces need editor behavior
- **THEN** they MUST use adapter props and callbacks
- **AND** they MUST NOT depend on generated editor internal paths

### Requirement: X-editor MUST support read-only note viewing
The system SHALL render saved personal note HTML through the x-editor/viewer pipeline for read-only surfaces.

#### Scenario: Presentation mode renders saved content through x-editor
- **WHEN** a user opens presentation mode for a selected note
- **THEN** the content MUST render from backend-returned `contentHtml`
- **AND** editing controls MUST be disabled or hidden in read-only mode

#### Scenario: Read-only rendering remains sanitized-source-first
- **WHEN** backend sanitization removes unsupported markup from saved content
- **THEN** read-only views MUST render the backend-returned HTML rather than the pre-save draft

### Requirement: X-editor migration MUST preserve existing note workflow behavior
The system SHALL keep the existing personal-note workflow semantics while replacing the editor implementation.

#### Scenario: Dirty state still protects user edits
- **WHEN** a user changes note content in x-editor and attempts to close, switch notes, or enter presentation mode
- **THEN** the frontend MUST preserve the existing save-or-discard confirmation behavior

#### Scenario: Empty content is still rejected
- **WHEN** x-editor content serializes to visually empty HTML
- **THEN** the save action MUST remain disabled

#### Scenario: Permissions still gate write actions
- **WHEN** a user lacks create or update permission
- **THEN** x-editor MUST not expose an enabled save path for that unauthorized write action
