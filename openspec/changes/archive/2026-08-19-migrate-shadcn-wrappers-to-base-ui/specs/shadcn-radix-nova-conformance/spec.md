## MODIFIED Requirements

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
