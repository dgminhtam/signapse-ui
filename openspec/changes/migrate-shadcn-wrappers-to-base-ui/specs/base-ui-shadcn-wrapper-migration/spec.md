## ADDED Requirements

### Requirement: In-scope shadcn wrappers use the fixed Base UI registry baseline
The system SHALL migrate only shadcn wrappers in `components/ui/` to the latest official Base UI registry output selected at the start of the change.

#### Scenario: Migration baseline is established
- **WHEN** implementation begins
- **THEN** the project SHALL record the selected shadcn and `@base-ui/react` versions in the lockfile
- **AND** each migrated wrapper SHALL be compared with the matching official Base UI registry output

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

### Requirement: Consumer code uses Base UI wrapper contracts
The system SHALL update in-scope consumers to the official Base UI shadcn contracts when each wrapper is migrated.

#### Scenario: Consumer uses Radix polymorphism
- **WHEN** a consumer uses `asChild` with a migrated wrapper
- **THEN** the consumer SHALL use the Base UI `render` contract
- **AND** the old `asChild` prop SHALL not remain as a compatibility alias

#### Scenario: Consumer uses a changed control contract
- **WHEN** a migrated Select, ToggleGroup, Dialog, or overlay has a Base UI-specific prop or callback contract
- **THEN** the consumer SHALL be updated to the official Base UI contract
- **AND** obsolete Radix-only props SHALL be removed

### Requirement: Migration preserves the application visual and workflow contract
The system SHALL preserve Nova visual chrome and application workflows while allowing intentional Base UI behavior differences.

#### Scenario: Visual contract is reviewed
- **WHEN** a migrated wrapper is rendered in the application
- **THEN** colors, spacing, typography, radius, layout, and overlay chrome SHALL remain aligned with the existing Nova design
- **AND** the migration SHALL not introduce a redesign

#### Scenario: Feature workflow uses a migrated wrapper
- **WHEN** a user performs an existing form, permission, delete, selection, or navigation workflow
- **THEN** API calls, validation, permissions, pending/error state, and workflow outcome SHALL remain available
- **AND** the implementation SHALL use the official Base UI behavior where Radix behavior has no direct Base equivalent

### Requirement: Missing Base UI primitives use native or CSS mappings
The system SHALL use the official native or CSS solution when a shadcn wrapper has no direct Base UI primitive.

#### Scenario: Wrapper has a native or CSS equivalent
- **WHEN** a wrapper maps to a native element or CSS capability, such as Label or AspectRatio
- **THEN** the implementation SHALL use that native or CSS solution
- **AND** it SHALL not create a new replacement primitive

### Requirement: Migration proceeds with verification and rollback boundaries
The system SHALL verify each wrapper dependency group before migrating dependent groups.

#### Scenario: Group verification fails
- **WHEN** typecheck, lint/build milestone checks, or required browser/manual QA fails for a wrapper group
- **THEN** dependent groups SHALL not proceed
- **AND** the failed group SHALL be fixed or restored to its previous wrapper state before migration continues

#### Scenario: Final migration verification succeeds
- **WHEN** all in-scope wrappers have migrated
- **THEN** typecheck, lint, production build, static import sweep, and the required browser/manual QA matrix SHALL pass
- **AND** `radix-ui` SHALL be removed only after no in-scope wrapper imports it

### Requirement: Migration state is recorded per wrapper
The system SHALL record each migrated wrapper in a self-contained migration report and SHALL derive project migration status from those reports and the current UI imports.

#### Scenario: A wrapper migration is completed
- **WHEN** an in-scope wrapper has been migrated and its consumers verified
- **THEN** `.migration/<component>.md` SHALL record the strategy, changed files, intentionally untouched files, behavior changes, focused manual QA, and the leftover Radix import scan
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

#### Scenario: Third-party primitive is used
- **WHEN** a component uses `cmdk`, `vaul`, `react-day-picker`, charts, or another non-shadcn integration
- **THEN** that integration SHALL remain outside the migration unless a separate approved change includes it
