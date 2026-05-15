## ADDED Requirements

### Requirement: X-editor reads MUST provide active editor context when needed
The personal note x-editor integration SHALL execute editor-aware Lexical read and export operations inside a read scope that provides the active `LexicalEditor`.

#### Scenario: HTML export reads with editor context
- **WHEN** x-editor content changes and the personal note adapter exports the current content to HTML
- **THEN** the export MUST run inside `editor.read(...)` or `editorState.read(..., { editor })`
- **AND** Lexical MUST NOT throw an active-editor runtime error

#### Scenario: Generated plugin reads remain compatible with Lexical 0.44
- **WHEN** x-editor toolbar, floating UI, image, code action, or selection plugins read editor state during normal editing
- **THEN** any read that depends on editor-aware Lexical helpers MUST provide the active editor context
- **AND** plugin reads MUST NOT break note editing, toolbar state, or selection interactions

### Requirement: Personal note HTML persistence MUST remain stable after the fix
The system SHALL keep the personal note persistence boundary as `contentHtml` while fixing Lexical read context handling.

#### Scenario: Save receives exported HTML
- **WHEN** a user edits a personal note and clicks save
- **THEN** the frontend MUST send the current exported HTML through the existing create or update action
- **AND** it MUST NOT send Lexical JSON or plugin state

#### Scenario: Saved HTML rehydrates the editor
- **WHEN** the backend returns sanitized `contentHtml` after create, update, or note load
- **THEN** the editor MUST rehydrate from that returned HTML
- **AND** the fix MUST NOT bypass backend-sanitized HTML as the saved source of truth

### Requirement: Runtime fix MUST preserve existing note workflows
The system SHALL preserve the quick Sheet, full `/notes`, dirty-state, empty-note, permission, and read-only presentation behaviors while removing the active-editor runtime error.

#### Scenario: Existing note workflows still function
- **WHEN** a user creates, updates, switches, cancels, or deletes a personal note from the quick Sheet or `/notes` workspace
- **THEN** the existing workflow behavior MUST remain unchanged except that the Lexical active-editor runtime error no longer occurs

#### Scenario: Read-only rendering remains safe
- **WHEN** a saved note is opened in read-only or presentation mode
- **THEN** the editor MUST render backend-returned HTML without exposing enabled edit or save controls
- **AND** read-only rendering MUST NOT trigger editor-aware export callbacks
