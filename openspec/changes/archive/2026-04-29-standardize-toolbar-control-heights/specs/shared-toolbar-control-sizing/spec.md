## ADDED Requirements

### Requirement: Primary list toolbar controls use default shadcn height
The system SHALL render primary list toolbar controls with the default height of their shadcn primitives instead of feature-specific height overrides.

#### Scenario: Toolbar contains search, action, sort, and page-size controls
- **WHEN** a list toolbar renders a search input, primary action button, sort select, or page-size select
- **THEN** each primary control uses the default shadcn primitive height
- **AND** the toolbar does not force those controls to `h-10`, `h-8`, or `size="sm"`

#### Scenario: Toolbar select has responsive width
- **WHEN** a list toolbar select needs a fixed desktop width or full mobile width
- **THEN** width-only classes such as `w-full`, `sm:w-[120px]`, or `sm:w-[200px]` may be used
- **AND** those classes do not change the control height

### Requirement: Shared toolbar wrappers do not introduce height drift
The system SHALL keep shared list toolbar wrappers responsible for layout and semantics, not custom control height.

#### Scenario: Shared sort select renders in a list toolbar
- **WHEN** `SortSelect` renders its trigger for primary toolbar usage
- **THEN** the trigger uses the default `SelectTrigger` size
- **AND** any `triggerClassName` passed by a feature does not include height-specific classes

#### Scenario: Shared page-size select renders in a list toolbar
- **WHEN** a page-size selector renders as a trailing list toolbar control
- **THEN** the trigger uses the default `SelectTrigger` size
- **AND** page-size selection remains in the toolbar controls area rather than moving back into the pagination footer

#### Scenario: Shared toolbar arranges controls
- **WHEN** `AppListToolbarLeading` or `AppListToolbarTrailing` lays out controls
- **THEN** the wrapper may define flex direction, gap, width, wrapping, and alignment
- **AND** it does not add card chrome or height classes solely to make controls appear aligned

### Requirement: Compact controls remain scoped to dense contexts
The system SHALL allow compact control sizes outside primary list toolbar controls when the surrounding UI intentionally needs higher density.

#### Scenario: Row action uses compact sizing
- **WHEN** a table row renders an edit, delete, menu, or icon-only action
- **THEN** the action may use compact button sizing
- **AND** this does not violate the list toolbar height rule

#### Scenario: Pagination navigation uses compact sizing
- **WHEN** pagination navigation renders previous, next, or page number buttons
- **THEN** those buttons may keep compact or icon sizing appropriate to pagination density
- **AND** the page-size selector itself remains aligned to default toolbar control height when placed in the toolbar

### Requirement: Repository guidance prevents toolbar height regressions
The system SHALL document the list toolbar control-height convention in `AGENTS.md` and SHALL update review expectations so future toolbar work does not reintroduce ad hoc height overrides.

#### Scenario: Future list toolbar is reviewed
- **WHEN** a contributor creates or reviews a list toolbar
- **THEN** repo guidance requires primary toolbar controls to use default shadcn heights
- **AND** custom `h-*`, `min-h-*`, or compact size props in the primary toolbar row are flagged unless there is an explicit product reason

#### Scenario: Future compact control is reviewed
- **WHEN** a compact control appears outside the primary list toolbar row
- **THEN** repo guidance allows the compact sizing when it supports row actions, icon-only actions, dialogs, or pagination density
- **AND** reviewers do not require those contexts to match search input height
