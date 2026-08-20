## ADDED Requirements

### Requirement: In-scope shadcn wrappers use the fixed Base UI registry baseline
The system SHALL migrate every installed shadcn wrapper in `components/ui/` that has a selected Nova registry entry to the latest official Base UI registry output selected at the start of the change. The expanded inventory SHALL include 30 wrappers, including `Drawer` and `Combobox`.

#### Scenario: Migration baseline is established
- **WHEN** implementation begins
- **THEN** the project SHALL record the selected shadcn and `@base-ui/react` versions in the lockfile
- **AND** each migrated wrapper SHALL be compared with the matching official Base UI registry output

#### Scenario: Drawer is present in the installed shadcn inventory
- **WHEN** `components/ui/drawer.tsx` is backed by Vaul but the selected `base-nova` registry provides a Drawer implementation backed by `@base-ui/react/drawer`
- **THEN** Drawer SHALL be treated as an in-scope shadcn wrapper
- **AND** its live quick-detail consumer SHALL be updated to the official Base UI wrapper contract
- **AND** the old Vaul dependency SHALL be removed when no other consumer remains

#### Scenario: Combobox is added for the Telegram timezone field
- **WHEN** the Telegram schedule dialog requires a searchable grouped timezone selector and the selected `base-nova` registry provides a Base UI Combobox
- **THEN** `components/ui/combobox.tsx` SHALL be included in the registry conformance audit and use the official Base UI wrapper structure
- **AND** the schedule timezone consumer SHALL use the official grouped Combobox composition without changing the system-generated timezone data or IANA form/API contract

#### Scenario: Non-shadcn Radix component is encountered
- **WHEN** a component uses Radix but is not a shadcn wrapper, such as `components/ui/toolbar.tsx`
- **THEN** it SHALL be reported as outside this change
- **AND** it SHALL not be migrated as part of the shadcn wrapper set

### Requirement: Base UI wrapper defaults remain canonical
The system SHALL use the official Base UI shadcn wrapper implementation as the default source of primitive structure, state behavior, and Nova component chrome.

#### Scenario: A Radix-backed wrapper is migrated
- **WHEN** a shadcn wrapper is replaced by its Base UI registry variant
- **THEN** the default Base UI wrapper logic SHALL remain unchanged
- **AND** the implementation SHALL not add a Radix compatibility alias or reimplement Radix semantics inside the wrapper

#### Scenario: App-specific behavior is still required
- **WHEN** a feature requires behavior not provided by the default Base UI wrapper
- **THEN** the behavior SHALL be composed through a narrowly scoped extension outside the default wrapper implementation
- **AND** the extension SHALL be documented in the implementing change

### Requirement: Default wrappers have complete registry conformance
The system SHALL keep each default wrapper aligned with the selected official registry output for primitive structure, state behavior, prop and type contracts, exports, data-slot structure, and default Nova chrome.

#### Scenario: Registry diff contains a semantic or API difference
- **WHEN** `shadcn add <component> --dry-run --diff` reports a difference in primitive choice, markup structure, default class, state selector, prop type, export, portal path, or public wrapper API
- **THEN** the difference SHALL be removed from the canonical wrapper or moved to a named external extension
- **AND** a formatting-only or import-order difference SHALL not be used to justify retaining the semantic difference

#### Scenario: Wrapper requires a product-specific extension
- **WHEN** a wrapper needs an application portal, overlay, size option, or workflow behavior that is not in the registry output
- **THEN** the canonical wrapper SHALL remain registry-conformant
- **AND** the extension SHALL be composed outside the canonical wrapper and documented with its consumer and rationale

#### Scenario: Implementation formatting is intentionally deferred
- **WHEN** this change is implemented before the user runs the repository formatter
- **THEN** the implementation SHALL not run a repository-wide format command
- **AND** the deferred formatting pass SHALL be allowed to normalize whitespace or import ordering only after implementation

### Requirement: Consumer code uses Base UI wrapper contracts
The system SHALL update in-scope consumers to the official Base UI shadcn contracts when each wrapper is migrated.

#### Scenario: Consumer uses Radix polymorphism
- **WHEN** a consumer uses `asChild` with a migrated wrapper
- **THEN** the consumer SHALL use the Base UI `render` contract when the composed element preserves the wrapper primitive's semantics
- **AND** the old `asChild` prop SHALL not remain as a compatibility alias

#### Scenario: Button consumer targets a link
- **WHEN** a Button consumer targets an internal or external link
- **THEN** the consumer SHALL render `Link` or `<a>` directly and apply the exported `buttonVariants` for button-like styling
- **AND** the consumer SHALL not render the link through `Button`, preserving native link semantics and avoiding the Base UI `nativeButton` warning

#### Scenario: Consumer uses a changed control contract
- **WHEN** a migrated Select, ToggleGroup, Dialog, or overlay has a Base UI-specific prop or callback contract
- **THEN** the consumer SHALL be updated to the official Base UI contract
- **AND** obsolete Radix-only props SHALL be removed

#### Scenario: Menu group parts use the required Base UI context
- **WHEN** a consumer renders `DropdownMenuLabel` or another menu group part
- **THEN** the part SHALL be nested within `DropdownMenuGroup` or `DropdownMenuRadioGroup` according to the official Base UI composition
- **AND** the consumer sweep SHALL cover the workspace, user, asset, language, and editor menu surfaces without adding compatibility context to the canonical wrapper

### Requirement: Telegram schedule timezone uses the grouped Base UI Combobox
The system SHALL use the official Base Nova Combobox composition for the Telegram schedule timezone field while preserving the system-generated timezone model and existing form/API behavior.

#### Scenario: Grouped timezone selection
- **WHEN** the create or update Telegram schedule dialog renders the timezone field
- **THEN** it SHALL compose `ComboboxInput`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxList`, `ComboboxGroup`, `ComboboxLabel`, `ComboboxCollection`, and `ComboboxItem`
- **AND** the options SHALL remain generated from `Intl.supportedValuesOf("timeZone")` with the existing `Asia/Bangkok` and `UTC` safeguards, localized groups/labels, and IANA item values
- **AND** selecting an item SHALL write its `item.value` into the existing timezone form field without changing schema validation, request serialization, or create/update behavior

#### Scenario: Timezone field retains form and accessibility behavior
- **WHEN** the timezone Combobox is rendered in the schedule form
- **THEN** its field label, description, validation error, disabled state, `id`, `aria-invalid`, and `aria-describedby` wiring SHALL remain available
- **AND** the input SHALL use the default Base Nova Combobox input and popup behavior, including keyboard navigation, focus management, search, empty state, and standard positioning
- **AND** the implementation SHALL not add feature-specific chrome or mutate the canonical Combobox wrapper

### Requirement: Drawer quick-detail uses the default Base UI composition
The system SHALL render the local entity quick-detail Drawer with the official Base UI sizing and consumer composition while preserving the named fullscreen portal extension.

#### Scenario: Quick-detail Drawer uses default sizing and shell
- **WHEN** the local entity quick-detail Drawer is rendered
- **THEN** it SHALL omit consumer-provided height and max-height values and rely on Base UI intrinsic sizing and its viewport cap
- **AND** it SHALL enable the official `showSwipeHandle` option
- **AND** `DrawerContent`, `DrawerHeader`, and `DrawerTitle` SHALL use their default wrapper chrome without consumer overrides
- **AND** the content region SHALL use `flex-1 overflow-y-auto p-4` so long detail content remains scrollable
- **AND** the header SHALL render only the localized `DrawerTitle`
- **AND** the quick-detail composition SHALL not render `DrawerDescription`, `DrawerFooter`, `DrawerClose`, or footer action buttons

#### Scenario: Quick-detail Drawer closes through root dismissal
- **WHEN** the quick-detail Drawer is dismissed through Base UI swipe, Escape, or outside-click behavior
- **THEN** the controlled root `onOpenChange` SHALL remain responsible for notifying the feature owner that the Drawer closed
- **AND** the quick-detail composition SHALL not add a footer close button solely for dismissal

#### Scenario: Fullscreen quick-detail preserves the portal extension
- **WHEN** the quick-detail Drawer is rendered inside a fullscreen market-chart surface
- **THEN** it SHALL continue using `DrawerInOverlay` and `DrawerContentInOverlay` to target the provided overlay portal container
- **AND** the extension SHALL not alter the canonical Drawer primitive structure or default Nova chrome

### Requirement: Migration preserves the application visual and workflow contract
The system SHALL preserve Nova visual chrome and application workflows while allowing intentional Base UI behavior differences.

#### Scenario: Default visual contract is established by registry parity
- **WHEN** a canonical wrapper is compared against the locked Base Nova registry baseline
- **THEN** its default chrome SHALL match the selected registry output and the existing Nova theme baseline
- **AND** the migration SHALL not introduce feature-specific wrapper chrome or a redesign

#### Scenario: Feature workflow uses a migrated wrapper
- **WHEN** a user performs an existing form, permission, delete, selection, or navigation workflow
- **THEN** API calls, validation, permissions, pending/error state, and workflow outcome SHALL remain available
- **AND** the implementation SHALL use the official Base UI behavior where Radix behavior has no direct Base equivalent

### Requirement: Deterministic P0 tests protect high-risk Base UI consumer contracts
The system SHALL use the repository's deterministic P0 test foundation to cover the Base UI consumer regressions discovered during this migration. The test suite SHALL verify behavior and payloads in addition to any narrow assertion that a known Base UI warning is absent.

#### Scenario: Schedule controls retain a controlled lifetime and IANA serialization
- **WHEN** a user creates a Telegram schedule from an empty asset selection and selects a non-default timezone through the grouped Combobox
- **THEN** the Select SHALL remain controlled through the empty-to-selected transition
- **AND** the submitted request SHALL contain the selected asset and IANA timezone value

#### Scenario: Feature routing retains a controlled destination Select
- **WHEN** a Telegram feature route without a configured destination is assigned an active destination
- **THEN** the Select SHALL remain controlled through the empty-to-selected transition
- **AND** the update request SHALL contain the selected destination identifier

#### Scenario: Menu grouping and link semantics retain native Base UI contracts
- **WHEN** a user opens the WorkspaceSwitcher menu
- **THEN** its group label and workspace/action entries SHALL render without a Base UI group-context error
- **WHEN** EventTimeline renders its view-all control
- **THEN** it SHALL render a native link with the expected destination rather than route a link through Button

### Requirement: Missing Base UI primitives use native or CSS mappings
The system SHALL use the official native or CSS solution when a shadcn wrapper has no direct Base UI primitive.

#### Scenario: Wrapper has a native or CSS equivalent
- **WHEN** a wrapper maps to a native element or CSS capability, such as Label or AspectRatio
- **THEN** the implementation SHALL use that native or CSS solution
- **AND** it SHALL not create a new replacement primitive

### Requirement: Migration proceeds with verification and rollback boundaries
The system SHALL verify each wrapper dependency group before migrating dependent groups.

#### Scenario: Group verification fails
- **WHEN** typecheck, lint/build milestone checks, registry/static sweeps, or the required deterministic P0 suite fails for a wrapper group
- **THEN** dependent groups SHALL not proceed
- **AND** the failed group SHALL be fixed or restored to its previous wrapper state before migration continues

#### Scenario: Final migration verification succeeds
- **WHEN** all in-scope wrappers have migrated
- **THEN** `pnpm test`, typecheck, lint, production build, static import sweep, and strict OpenSpec validation SHALL pass
- **AND** `radix-ui` SHALL be removed only after no in-scope wrapper imports it

### Requirement: Migration state is recorded per wrapper
The system SHALL record each migrated wrapper in a self-contained migration report and SHALL derive project migration status from those reports and the current UI imports.

#### Scenario: A wrapper migration is completed
- **WHEN** an in-scope wrapper has been migrated and its consumers verified
- **THEN** `.migration/<component>.md` SHALL record the strategy, changed files, intentionally untouched files, behavior changes, focused automated verification evidence, and the leftover Radix import scan
- **AND** the report SHALL not claim a wrapper is migrated when a Radix import remains in its migrated files

#### Scenario: The whole migration is completed
- **WHEN** the final in-scope wrapper and consumer sweep are complete
- **THEN** `.migration/project.md` SHALL record the dependency swap, final verification, consumer sweep summary, documented Toolbar exception, and the derived number of wrappers that remain on Radix
- **AND** the project SHALL not maintain a separate hand-written migration index

### Requirement: Out-of-scope Radix and third-party primitives remain stable
The system SHALL not alter non-shadcn Radix components or third-party primitive integrations as part of this migration.

#### Scenario: Out-of-scope Toolbar is built
- **WHEN** Plate/editor toolbar code imports `@radix-ui/react-toolbar`
- **THEN** the toolbar implementation and its dependency SHALL remain unchanged by this change

#### Scenario: Non-Drawer third-party primitive is used
- **WHEN** a component uses `cmdk`, a non-Drawer Vaul integration, `react-day-picker`, charts, or another non-shadcn integration
- **THEN** that integration SHALL remain outside the migration unless a separate approved change includes it
