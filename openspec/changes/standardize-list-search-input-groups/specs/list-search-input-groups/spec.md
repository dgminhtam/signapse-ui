## ADDED Requirements

### Requirement: List Search Uses InputGroup Composition

List toolbar search controls SHALL use shadcn `InputGroup`, `InputGroupInput`, and `InputGroupAddon` for search chrome instead of raw `Input` plus absolutely positioned search icons.

#### Scenario: List page renders search input

- **WHEN** a list page includes a search control in its toolbar
- **THEN** the search control MUST render the input through `InputGroupInput`
- **AND** the search icon MUST render inside `InputGroupAddon`
- **AND** the search icon MUST NOT be manually positioned with absolute offsets or manually sized per page

#### Scenario: Search has pending transition feedback

- **WHEN** a route transition from list search is pending
- **THEN** the search control MUST show an inline spinner within the search control
- **AND** the spinner MUST NOT require absolute positioning that changes icon alignment between pages

### Requirement: List Search Behavior Is Preserved

List search migration SHALL preserve existing URL, debounce, accessibility, and responsive-width behavior.

#### Scenario: Search value changes

- **WHEN** a user types in a list search control
- **THEN** the component MUST debounce URL updates by `300ms`
- **AND** it MUST trim the search value before writing it to the URL
- **AND** it MUST reset `page` to `1`
- **AND** it MUST remove the search query parameter when the trimmed value is empty

#### Scenario: Search input is rendered

- **WHEN** a list search input is visible
- **THEN** it MUST have `type="search"`, an `id`, and a matching `sr-only` label
- **AND** it MUST keep the responsive wrapper width `w-full sm:w-80 lg:w-96`

### Requirement: Toolbar Leading Controls Use Compact Gap

The list toolbar leading control group SHALL use the same compact spacing rhythm as trailing view controls.

#### Scenario: Primary action and search render together

- **WHEN** `AppListToolbarLeading` contains a primary action and a search control
- **THEN** the controls MUST use compact `gap-2` spacing at the shared toolbar level
- **AND** the spacing MUST visually align with sort and page-size controls in `AppListToolbarTrailing`

### Requirement: Scope Boundaries

The list search InputGroup treatment SHALL apply only to list toolbar search controls.

#### Scenario: Search-like input appears outside a list toolbar

- **WHEN** a search-like input appears in a combobox, dialog, command palette, role permission matrix, graph/workbench surface, or other non-list toolbar context
- **THEN** that control MUST keep its context-specific composition unless a separate scoped change redesigns it
- **AND** the list search rule MUST NOT force a shared default search component into that context

### Requirement: Repo Guidance Covers List Search InputGroup

The repository guidance SHALL document the list search InputGroup rule.

#### Scenario: Developer reads list search conventions

- **WHEN** a developer checks `AGENTS.md` for search-list guidance
- **THEN** the guidance MUST state that list search uses `InputGroup`, `InputGroupInput`, and `InputGroupAddon`
- **AND** it MUST forbid manual absolute search icon positioning and per-page icon sizing for list search inputs
