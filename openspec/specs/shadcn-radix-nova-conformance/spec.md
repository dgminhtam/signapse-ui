# shadcn-radix-nova-conformance Specification

## Purpose
TBD - created by archiving change sync-shadcn-radix-nova-preset. Update Purpose after archive.
## Requirements
### Requirement: Repo declares radix-nova as the shadcn preset baseline
The system SHALL preserve the existing Nova visual contract while transitioning the shadcn implementation baseline from Radix to Base UI.

#### Scenario: Shadcn project context is inspected before migration
- **WHEN** the shadcn project context is inspected before the final wrapper migration
- **THEN** the configuration SHALL identify the current `radix-nova` visual baseline and Radix base while mixed wrappers remain
- **AND** the theme baseline SHALL remain neutral with lucide icons

#### Scenario: Base UI migration is complete
- **WHEN** every in-scope shadcn wrapper has migrated to Base UI
- **THEN** the configuration SHALL use the Base-backed Nova preset (`base-nova` with `base: base`)
- **AND** the visual theme baseline SHALL remain neutral with lucide icons

#### Scenario: Theme or radius drift is considered
- **WHEN** a component appears visually different from the Nova baseline during migration
- **THEN** the implementation SHALL sync the relevant official wrapper or app usage to the selected Nova preset
- **AND** it SHALL not silently change global theme, radius, sidebar, or chart tokens to compensate for a local mismatch

### Requirement: Installed shadcn wrappers conform to the selected Nova registry output
The system SHALL keep all 30 installed registry-backed shadcn wrappers in `components/ui/*`, including `Drawer` and `Combobox`, aligned with the selected official Base UI Nova registry output while the migration is in progress.

#### Scenario: Existing wrapper differs from the selected registry
- **WHEN** the shadcn CLI reports an installed wrapper as `overwrite`
- **THEN** the wrapper SHALL be reviewed with `--diff`
- **AND** the implementation SHALL sync the default wrapper to the reviewed Base UI Nova output
- **AND** progressive migration SHALL not use `--overwrite` while the original wrapper still has consumers

#### Scenario: The installed inventory includes Drawer
- **WHEN** `components/ui/drawer.tsx` uses a third-party primitive but the selected Nova registry provides a Base UI Drawer
- **THEN** Drawer SHALL be included in the registry conformance audit
- **AND** its default implementation SHALL be reconciled with the registry before the migration can be complete

#### Scenario: The installed inventory includes Combobox
- **WHEN** the Telegram schedule timezone consumer requires the selected `base-nova` Combobox registry entry
- **THEN** `components/ui/combobox.tsx` SHALL be included in the registry conformance audit
- **AND** its default implementation SHALL remain aligned with the selected Base UI Nova output
- **AND** the timezone consumer SHALL compose the wrapper without adding local popup chrome or changing the registry wrapper contract

#### Scenario: Wrapper implementation is updated
- **WHEN** a file inside `components/ui/*` is changed as part of the migration
- **THEN** the change SHALL use the shadcn CLI workflow or a direct transcription of the reviewed CLI diff
- **AND** the wrapper SHALL not retain local visual chrome that conflicts with the selected Nova output

#### Scenario: Registry parity is checked beyond visual classes
- **WHEN** an installed wrapper differs from the selected registry output
- **THEN** the review SHALL compare primitive structure, state behavior, prop and type contracts, exports, data-slot structure, portal behavior, and default chrome
- **AND** every non-formatting difference SHALL be removed from the canonical wrapper or moved to a documented external extension

#### Scenario: Local wrapper exception is required
- **WHEN** a local wrapper deviation is necessary for a product, accessibility, portal, or repository constraint
- **THEN** the deviation SHALL be implemented as the smallest documented extension outside the default Base UI wrapper behavior
- **AND** the deviation SHALL not silently change the Nova visual contract

#### Scenario: Formatting is deferred during implementation
- **WHEN** the migration implementation is still in progress
- **THEN** no repository formatter SHALL be run as part of the change
- **AND** a user-owned post-implementation formatting pass MAY normalize whitespace or import ordering without changing registry parity

### Requirement: App usage preserves shadcn Nova component chrome
Feature and shared app code SHALL rely on shadcn Nova defaults for component height, radius, color, border, shadow, typography, and overlay chrome.

#### Scenario: Feature code composes a primitive-like shadcn control
- **WHEN** feature or shared app code renders `Input`, `Button`, `SelectTrigger`, `Textarea`, `Switch`, `DialogContent`, `DialogFooter`, `SheetContent`, `DrawerContent`, `Card`, or similar shadcn primitives
- **THEN** the usage does not add visual override classes such as `h-*`, `min-h-*`, `rounded-*`, component padding, text color, background, border, ring, or shadow classes only to reshape the component
- **AND** the usage relies on the component's default variant and size unless a built-in shadcn variant or size is semantically appropriate

#### Scenario: Layout constraint is required
- **WHEN** a shadcn component needs placement or containment for the surrounding feature layout
- **THEN** the usage MAY apply layout-only classes such as width, max-width, flex, grid, gap, alignment, max-height, overflow, truncate, or responsive constraints
- **AND** those classes do not recreate component chrome already owned by the shadcn wrapper

#### Scenario: Compact control context is intentional
- **WHEN** a row action, icon-only action, pagination navigation, dialog action, or other dense control legitimately needs compact treatment
- **THEN** the usage MAY select an existing shadcn size or variant
- **AND** it does not hard-code height or radius classes unless no shadcn size or variant can express the context

### Requirement: Repo guidance enforces preset conformance
The system SHALL document that shadcn wrapper chrome is managed by the selected Nova preset and that Base UI is the implementation baseline after migration.

#### Scenario: Developer reads core component guidance
- **WHEN** a developer reads the `components/ui` guidance
- **THEN** `AGENTS.md` SHALL state that wrapper chrome is managed by the selected shadcn Nova preset
- **AND** feature/app bugs SHALL normally be fixed at usage sites or documented extensions instead of mutating default wrapper internals

#### Scenario: Developer reads UI review guidance
- **WHEN** a developer reviews a UI change
- **THEN** visual override drift on shadcn primitives SHALL be treated as a review finding
- **AND** layout-only classes SHALL remain allowed when they do not change default component chrome

### Requirement: Graph view viewport controls use shadcn grouping
The system SHALL compose Graph View viewport controls with installed shadcn wrappers instead of custom recreations of grouped button chrome.

#### Scenario: Graph view renders zoom and recenter controls
- **WHEN** Graph View renders zoom out, recenter, and zoom in controls
- **THEN** the controls SHALL use `ButtonGroup` from `@/components/ui/button-group`
- **AND** each action SHALL use `Button` from `@/components/ui/button`
- **AND** feature code SHALL NOT edit `components/ui/button.tsx` or `components/ui/button-group.tsx` for this local Graph View polish

#### Scenario: Graph view needs local placement
- **WHEN** the grouped controls need canvas placement
- **THEN** Graph View MAY use local layout classes around the shadcn group
- **AND** those classes SHALL place the control group without recreating button radius, separator, border, or background behavior owned by the shadcn wrappers

### Requirement: Graph view local chrome respects the shadcn Nova system
The system SHALL allow Graph View to use graph-specific local visual treatments while preserving shadcn/radix-nova primitive chrome and global theme token stability.

#### Scenario: Graph view uses a specialized canvas surface
- **WHEN** Graph View renders its dark analytical canvas
- **THEN** the canvas MAY use local feature styling for graph atmosphere, node colors, edge colors, and graph-local HUD treatments
- **AND** the implementation SHALL NOT change global theme tokens, sidebar tokens, chart tokens, or `components/ui/*` wrapper chrome to achieve the Graph View look

#### Scenario: Graph view composes shadcn controls
- **WHEN** Graph View renders buttons, tooltips, badges, popovers, dialogs, sheets, skeletons, or comparable shadcn-backed UI
- **THEN** feature code SHALL compose the installed shadcn wrappers from `@/components/ui/`
- **AND** icon-only controls SHALL use existing shadcn variants or sizes before adding hard-coded height, radius, border, shadow, or color overrides

#### Scenario: Graph-specific color is local and semantic
- **WHEN** Graph View needs category colors for event, asset, theme, article, narrative, or relationship kinds
- **THEN** those colors SHALL remain local to Graph View visuals
- **AND** they SHALL NOT redefine app-wide semantic tokens such as primary, accent, sidebar, border, foreground, or background
