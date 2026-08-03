## ADDED Requirements

### Requirement: Plate block-selection shadow input stays within the editor overlay boundary
The Plate editor SHALL render the block-selection shadow input through a local `afterEditable` renderer and SHALL portal it to the nearest provided overlay container or local Plate editor container, never directly to `document.body`.

#### Scenario: Select and delete all blocks inside a Personal Notes Sheet
- **WHEN** an editable Plate editor inside the Personal Notes Sheet is focused and the user presses `Ctrl/Cmd+A` followed by Delete
- **THEN** Plate selects all selectable blocks through its block-selection API
- **AND** the selected blocks are removed
- **AND** the Sheet remains open with focus inside its content boundary

#### Scenario: Select and delete all blocks on the standalone editor page
- **WHEN** an editable Plate editor on `/editor` is focused and the user presses `Ctrl/Cmd+A` followed by Delete
- **THEN** Plate retains its default block-selection select-all behavior
- **AND** all selectable blocks are removed without requiring a body-level shadow input

#### Scenario: Nested overlay containers resolve the nearest host
- **WHEN** a Plate editor is rendered beneath more than one overlay portal provider
- **THEN** the shadow input is mounted in the nearest provided container
- **AND** keyboard and clipboard events remain inside that overlay's focus boundary

#### Scenario: No overlay provider is available
- **WHEN** a Plate editor is rendered outside a Sheet or Dialog
- **THEN** the shadow input is mounted in the local Plate editor container or its local parent
- **AND** no block-selection input is portaled to `document.body`

### Requirement: Local block-selection rendering preserves Plate interaction behavior
The local `afterEditable` renderer SHALL preserve the installed Plate block-selection behavior for selection movement, focus, deletion, replacement typing, clipboard operations, duplicate, undo, redo, Escape, Enter, and read-only guards.

#### Scenario: Keyboard selection commands remain available
- **WHEN** blocks are selected and the user presses Shift+Arrow, Arrow, Escape, or Enter
- **THEN** selection expansion, movement, deselection, and focus restoration behave as in the installed Plate block-selection renderer

#### Scenario: Clipboard and replacement operations remain available
- **WHEN** blocks are selected and the user copies, cuts, pastes, or types a printable character
- **THEN** Plate performs the corresponding block-selection operation
- **AND** the local shadow input receives the event without changing the operation's existing semantics

#### Scenario: Read-only editors do not mutate content
- **WHEN** a read-only editor has selected blocks and the user presses Delete, Backspace, or types a printable character
- **THEN** the editor content remains unchanged
- **AND** selection and focus handling do not throw an error

#### Scenario: Context menu and visual selection remain unchanged
- **WHEN** a user selects blocks with the mouse or opens the block context menu
- **THEN** the existing `belowRootNodes` visual selection, selectable-block exclusions, and context-menu behavior remain available
