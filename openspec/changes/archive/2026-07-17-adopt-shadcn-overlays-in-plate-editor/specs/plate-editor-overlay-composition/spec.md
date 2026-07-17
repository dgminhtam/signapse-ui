## ADDED Requirements

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
