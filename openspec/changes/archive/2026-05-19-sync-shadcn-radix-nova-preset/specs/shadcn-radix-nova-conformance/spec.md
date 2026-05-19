## ADDED Requirements

### Requirement: Repo declares radix-nova as the shadcn preset baseline
The system SHALL treat `radix-nova` as the authoritative shadcn/ui preset baseline for installed component wrappers.

#### Scenario: Shadcn project context is inspected
- **WHEN** `pnpm dlx shadcn@latest info --json` is run in the project
- **THEN** the shadcn config reports `style` as `radix-nova`
- **AND** the config reports `base` as `radix`
- **AND** the theme baseline remains neutral with lucide icons unless a later proposal changes the preset intentionally

#### Scenario: Theme or radius drift is considered
- **WHEN** a component appears visually different from shadcn's `radix-nova` baseline
- **THEN** the implementation syncs the relevant shadcn wrapper or app usage to the preset
- **AND** the implementation does not silently change global theme, radius, sidebar, or chart tokens to compensate for a local component mismatch

### Requirement: Installed shadcn wrappers conform to radix-nova output
The system SHALL keep installed files in `components/ui/*` aligned with the `radix-nova` shadcn registry output.

#### Scenario: Existing wrapper differs from the preset
- **WHEN** `pnpm dlx shadcn@latest add <component> --dry-run` reports an installed wrapper as `overwrite`
- **THEN** the wrapper is reviewed with `--diff`
- **AND** visual class differences are resolved by syncing to the `radix-nova` wrapper output

#### Scenario: Wrapper implementation is updated
- **WHEN** a file inside `components/ui/*` is changed as part of preset sync
- **THEN** the change uses the shadcn CLI workflow or a direct transcription of the reviewed CLI diff
- **AND** the wrapper does not keep local Vega, New York, or hand-built visual chrome classes that conflict with `radix-nova`

#### Scenario: Local wrapper exception is requested
- **WHEN** a local wrapper deviation from `radix-nova` is necessary for a product, accessibility, or repository constraint
- **THEN** the deviation is explicitly documented in the implementing change
- **AND** the deviation is limited to the smallest possible non-visual or behavior-preserving surface

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
The system SHALL document shadcn preset conformance in `AGENTS.md` so future implementation and review work preserve the `radix-nova` baseline.

#### Scenario: Developer reads core component guidance
- **WHEN** a developer reads the `components/ui` guidance
- **THEN** `AGENTS.md` states that `components/ui/*` wrapper chrome is managed by the shadcn `radix-nova` preset
- **AND** feature/app bugs are normally fixed at usage sites instead of manually editing wrapper internals

#### Scenario: Developer reads UI review guidance
- **WHEN** a developer reviews a UI change
- **THEN** visual override drift on shadcn primitives is treated as a review finding
- **AND** layout-only classes remain allowed when they do not change default component chrome
