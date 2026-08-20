# base-ui-plate-toolbar-migration Specification

## Purpose

Define the Base UI primitive mapping and preserved keyboard, pressed-state, overlay, and visual contracts for the shared Plate/editor Toolbar.

## Requirements

### Requirement: Shared Plate/editor Toolbar uses Base UI primitives
The shared Plate/editor Toolbar SHALL use Base UI Toolbar primitives for its root, group, button, link, and separator behavior, and SHALL use Base UI Toggle primitives for pressed controls. The implementation MUST NOT retain a direct `@radix-ui/react-toolbar` source import or manifest dependency after the migration is complete.

#### Scenario: Review the shared Toolbar implementation
- **WHEN** the shared Plate/editor Toolbar source and dependency manifest are reviewed after migration
- **THEN** the Toolbar primitive mapping is provided by Base UI
- **AND** no direct `@radix-ui/react-toolbar` import or manifest dependency remains

### Requirement: Shared Toolbar API and visual contract are preserved
The shared Plate/editor Toolbar SHALL preserve the supported root, button, group, link, and separator consumer contracts, existing control sizing, grouping, and Nova visual treatment. The implementation SHALL remove internal toggle-group helper exports that have no consumers instead of retaining a Radix compatibility layer.

#### Scenario: Render an existing shared Toolbar consumer
- **WHEN** a fixed, floating, or table toolbar renders through the shared Toolbar API
- **THEN** its supported controls render with their existing layout and visual treatment
- **AND** no consumer requires a Radix-specific compatibility prop

### Requirement: Pressed and disabled controls retain their interaction contract
An independently pressed Toolbar control SHALL retain its controlled `pressed` behavior and expose pressed semantics through Base UI. Disabled Toolbar controls SHALL be skipped by roving arrow-key focus navigation.

#### Scenario: Operate an active formatting control
- **WHEN** an editor formatting control is active
- **THEN** the corresponding Toolbar control exposes a pressed state
- **AND** its active visual treatment is rendered from the Base UI pressed-state contract

#### Scenario: Navigate past a disabled control
- **WHEN** a keyboard user moves through a Toolbar with arrow keys and encounters a disabled control
- **THEN** focus moves to the next eligible Toolbar control
- **AND** the disabled control does not receive roving focus

### Requirement: Toolbar popup controls use supported Base UI composition
Toolbar dropdown and popover controls SHALL compose their trigger inside the Toolbar button using the supported Base UI direction. Opening, selecting from, dismissing, or escaping an overlay SHALL preserve its existing action outcome and return focus to the originating Toolbar control when the overlay closes.

#### Scenario: Open and dismiss a Toolbar dropdown
- **WHEN** a user opens a Toolbar dropdown and dismisses it with Escape
- **THEN** the existing menu content and dismissal behavior remain available
- **AND** focus returns to the originating Toolbar control

#### Scenario: Use a Toolbar popover action
- **WHEN** a user opens a Toolbar popover and completes or dismisses its action
- **THEN** the existing popover action outcome remains available
- **AND** the Toolbar control retains the correct open or pressed presentation

### Requirement: Split-list controls use separate interactive controls
The split-list control SHALL render its primary list action and menu trigger as separate sibling interactive controls. It SHALL preserve the existing primary action, menu choices, visual grouping, and keyboard accessibility without nesting one interactive control inside another.

#### Scenario: Use both portions of a split-list control
- **WHEN** a user activates the primary portion of a split-list control
- **THEN** the existing list action is applied
- **AND** when the user activates its secondary portion, the existing list menu opens without invoking the primary action

### Requirement: Font-size input preserves text-entry behavior
The font-size input SHALL remain outside the Toolbar roving-focus composite at its current visual position. It MUST preserve native typing, Left/Right caret movement, Tab behavior, and its existing popover interaction.

#### Scenario: Edit a font-size value with the keyboard
- **WHEN** a user focuses the font-size input and presses Left or Right
- **THEN** the input moves the text caret according to native input behavior
- **AND** the Toolbar does not treat the key as roving-focus navigation

### Requirement: Toolbar orientation matches its rendered layout
The fixed Toolbar SHALL declare vertical orientation and use Up/Down arrow navigation. Floating and table Toolbars SHALL retain horizontal orientation and use Left/Right arrow navigation.

#### Scenario: Navigate the fixed Toolbar
- **WHEN** a keyboard user focuses the vertically rendered fixed Toolbar and presses Up or Down
- **THEN** focus moves between its eligible controls in visual column order

#### Scenario: Navigate a floating or table Toolbar
- **WHEN** a keyboard user focuses a floating or table Toolbar and presses Left or Right
- **THEN** focus moves between its eligible controls in horizontal order

### Requirement: Migration verification is explicit and scoped
The migration SHALL pass TypeScript type checking, linting, and a static sweep for direct Radix Toolbar imports and dependency usage. The change SHALL record user-owned browser QA for fixed, floating, and table Toolbar interactions without introducing a new automated browser-test framework.

#### Scenario: Review migration verification
- **WHEN** the migration is prepared for handoff
- **THEN** deterministic checks and the static dependency/import sweep are recorded as complete
- **AND** the user-owned browser QA matrix covers keyboard, disabled, overlay, tooltip, split-list, font-size, and visual behaviors
