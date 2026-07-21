# Plate Editor AI Boundary Specification

## Purpose

Define the removal boundary for Plate editor AI features while preserving the editor's non-AI behavior and unrelated AI product areas.

## Requirements

### Requirement: Plate editor runtime excludes AI plugins
The shared Plate editor SHALL compose its runtime without AI command/chat plugins or inline copilot completion plugins.

#### Scenario: Editor initializes without AI runtime
- **WHEN** an editor route or the personal-notes Sheet renders the shared Plate editor
- **THEN** the editor initializes without registering the Plate AI chat, AI mark, or copilot plugins

### Requirement: Plate editor exposes no AI interaction entry points
The Plate editor SHALL NOT expose an AI toolbar button, AI slash command group, AI block-context action, AI settings dialog, AI selection shortcut, inline AI ghost text, or AI streaming UI.

#### Scenario: User inspects normal editor controls
- **WHEN** a user opens the fixed toolbar, selects text, opens the floating toolbar, invokes the slash menu, or opens the block context menu
- **THEN** no AI command or copilot action is offered

#### Scenario: User presses the former AI shortcut
- **WHEN** a block selection is active and the user presses `Mod+J`
- **THEN** the Plate editor does not open or submit an AI command interface

### Requirement: Plate AI HTTP handlers are absent
The application SHALL NOT register route handlers for `/api/ai/command` or `/api/ai/copilot` after the Plate AI integration is removed.

#### Scenario: Application route manifest is built
- **WHEN** Next.js discovers application route handlers
- **THEN** neither Plate AI endpoint is present in the route tree

### Requirement: Plate AI implementation and direct dependencies are removed
The repository SHALL contain no Plate AI-only components, hooks, plugins, prompt builders, mock streams, settings code, or direct dependencies on `@platejs/ai`, `@ai-sdk/react`, `@faker-js/faker`, `ai`, or `dedent`.

#### Scenario: Source and package references are checked
- **WHEN** the completed repository is searched and its dependency manifest is inspected
- **THEN** no Plate AI implementation reference or listed direct dependency remains

### Requirement: Non-AI Plate editor behavior remains composed
The removal SHALL preserve the shared editor's remaining non-AI toolbars, Markdown support, block and cursor selection, tables, and other supported editing plugins, without requiring removed comment, discussion, or suggestion behavior.

#### Scenario: Editor kit is composed after removal
- **WHEN** the shared editor initializes after collaboration files are deleted
- **THEN** its remaining non-AI plugin kits and controls still resolve without an AI or collaboration replacement or compatibility shim

### Requirement: Editor demo content does not advertise removed AI behavior
The Plate editor's initial document SHALL NOT claim that AI editing is available or include AI-specific usage instructions or comparison rows.

#### Scenario: Initial editor document is rendered
- **WHEN** a user opens the editor with its bundled initial value
- **THEN** the document contains no AI-powered editing section, AI shortcut instructions, or AI feature comparison row

### Requirement: Unrelated AI product areas remain outside the removal
The Plate editor AI removal SHALL preserve AI provider configuration, system-prompt management, and assistant-ui.

#### Scenario: Removal scope is reviewed
- **WHEN** the implementation diff is inspected
- **THEN** no file owned exclusively by those remaining unrelated product areas is removed or modified for this change
