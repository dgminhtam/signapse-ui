# plate-editor-overlay-composition Specification

## Purpose

Define the shadcn wrapper boundary and preserved interaction behavior for Plate editor dropdown menus, Popovers, and shared toolbar tooltips.

## Requirements

### Requirement: Plate dropdown menus use the shadcn wrapper boundary
The Plate editor SHALL compose dropdown menus and derive their public component prop types from `@/components/ui/dropdown-menu` without importing `@radix-ui/react-dropdown-menu` directly.

#### Scenario: Dropdown root props are declared
- **WHEN** a Plate toolbar dropdown component exposes or consumes root dropdown props
- **THEN** those props are derived from the local `DropdownMenu` wrapper component
- **AND** the consumer does not require a direct Radix dropdown-menu type import

#### Scenario: Dropdown item props are declared
- **WHEN** a Plate toolbar component exposes or consumes dropdown item props
- **THEN** those props are derived from the corresponding local wrapper component
- **AND** runtime and type imports remain on the same shadcn wrapper boundary

### Requirement: Radio menu items render one standard selection indicator
Plate line-height, mode, and turn-into dropdown radio items SHALL use the selection indicator supplied by the shadcn `DropdownMenuRadioItem` wrapper and SHALL NOT render or hide a second consumer-owned indicator.

#### Scenario: Selected radio item is displayed
- **WHEN** a value is selected in a Plate line-height, mode, or turn-into radio menu
- **THEN** the selected item displays exactly one standard wrapper-provided check indicator
- **AND** unselected items do not display a selection indicator

#### Scenario: Radio selection is operated by keyboard
- **WHEN** a keyboard user opens a Plate radio menu and changes its selected value
- **THEN** the menu retains the wrapper's Radix-backed roles, arrow-key navigation, selection behavior, Escape handling, and focus restoration

### Requirement: Shared Plate toolbar tooltips use the shadcn wrapper
The shared Plate toolbar SHALL compose `Tooltip`, `TooltipTrigger`, and `TooltipContent` from `@/components/ui/tooltip` without directly composing `@radix-ui/react-tooltip` primitives.

#### Scenario: Tooltip is enabled for a toolbar button
- **WHEN** a mounted toolbar button opts into tooltip rendering and provides tooltip content
- **THEN** the existing button remains the tooltip trigger through `asChild`
- **AND** the tooltip content uses the standard wrapper surface and arrow

#### Scenario: Tooltip placement props are resolved
- **WHEN** no tooltip content offset is supplied by the caller
- **THEN** the toolbar uses a side offset of `4`
- **AND** when the caller supplies a content offset or other content props, those caller values take precedence

#### Scenario: Tooltip rendering is not requested
- **WHEN** the toolbar button is not mounted, disables tooltip rendering, or has no tooltip content
- **THEN** it renders without creating the tooltip overlay composition

### Requirement: Overlay adoption does not mutate wrapper or dependency sources
The Plate overlay migration SHALL reuse the installed `radix-nova` dropdown-menu and tooltip wrappers without changing their generated source or adding direct Radix overlay dependencies.

#### Scenario: Migration source is reviewed
- **WHEN** the Plate overlay migration is complete
- **THEN** `components/ui/dropdown-menu.tsx`, `components/ui/tooltip.tsx`, package manifests, and lockfiles remain unchanged by the migration
- **AND** `@radix-ui/react-toolbar` and the excluded date-node focus handling remain outside the change scope

### Requirement: Plate dropdown menus remain scrollable inside modal Sheets
The shared overlay composition SHALL portal Plate dropdown content opened within a modal Sheet into that Sheet's content boundary, while preserving the default portal behavior outside a Sheet.

#### Scenario: Scroll the Insert menu inside Personal Notes
- **WHEN** a user opens the tall Plate Insert dropdown inside the Personal Notes Quick Sheet and uses the mouse wheel over the menu
- **THEN** the menu scrolls through its existing vertically overflowing content
- **AND** the Sheet remains modal with background scrolling and interaction isolated

#### Scenario: Open a Plate dropdown on the editor page
- **WHEN** a user opens a Plate dropdown without an enclosing Sheet portal container
- **THEN** the dropdown uses the standard Radix body portal
- **AND** its existing positioning, sizing, keyboard interaction, and selection behavior remain available

#### Scenario: Open a dropdown in a nested Sheet composition
- **WHEN** a dropdown is rendered beneath more than one overlay-container provider
- **THEN** its content portals into the nearest provided Sheet content element

### Requirement: Plate emoji Popovers use the shadcn wrapper boundary
The Plate editor SHALL compose emoji Popovers through `@/components/ui/popover` without directly importing a Radix Popover primitive.

#### Scenario: Emoji picker source is reviewed
- **WHEN** the Plate emoji toolbar and callout picker compositions are inspected
- **THEN** their Popover root, trigger, and content come from the local shadcn wrapper
- **AND** no direct Radix Popover import is required by the emoji picker

#### Scenario: Emoji picker surface is rendered
- **WHEN** the emoji picker opens
- **THEN** the shadcn Popover content owns the overlay surface and stacking behavior
- **AND** the picker retains its required dimensions without duplicate surface chrome

### Requirement: Shared Popovers honor modal Sheet portal boundaries
The shared shadcn Popover content SHALL portal into the nearest provided Sheet content element and SHALL retain the standard Radix body portal when no Sheet container is available.

#### Scenario: Select an emoji inside Personal Notes
- **WHEN** a user opens the Plate emoji picker in the Personal Notes Quick Sheet and selects an emoji
- **THEN** Plate inserts the selected emoji at the current editor selection
- **AND** the Personal Notes Sheet remains open
- **AND** the emoji picker follows its configured close-on-select behavior

#### Scenario: Use the emoji picker on the editor page
- **WHEN** a user selects an emoji on `/editor` without an enclosing Sheet provider
- **THEN** the Popover uses the standard Radix body portal
- **AND** Plate inserts the emoji with the existing standalone behavior

#### Scenario: Open a Popover in a nested Sheet composition
- **WHEN** a shared Popover is rendered beneath more than one overlay-container provider
- **THEN** its content portals into the nearest provided Sheet content element

#### Scenario: Interact with the modal background
- **WHEN** the emoji picker is open inside the Personal Notes Sheet
- **THEN** the Sheet retains focus isolation, background interaction blocking, and background scroll locking

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
