# list-search-pending-spinner Specification

## Purpose
TBD - created by archiving change replace-list-search-icon-with-spinner. Update Purpose after archive.
## Requirements
### Requirement: List Search Pending Replaces Leading Search Icon

List toolbar search controls SHALL render pending feedback by replacing the leading search icon with the spinner inside the same `InputGroupAddon`.

#### Scenario: Search is idle

- **WHEN** a list toolbar search control is not pending a route transition
- **THEN** the leading `InputGroupAddon` MUST render the search icon
- **AND** the control MUST NOT render a trailing spinner addon

#### Scenario: Search route transition is pending

- **WHEN** a list toolbar search control is pending a route transition caused by search input
- **THEN** the leading `InputGroupAddon` MUST render `<Spinner>`
- **AND** the same addon MUST NOT render the search icon at the same time
- **AND** the control MUST NOT render a spinner outside the input group or in a trailing `InputGroupAddon`

#### Scenario: Search pending feedback is implemented

- **WHEN** pending search feedback is implemented for a list toolbar search control
- **THEN** it MUST NOT use absolute positioning, custom input padding, or reserved trailing width only to align the spinner

### Requirement: List Search Behavior Remains Unchanged

The pending indicator change SHALL preserve existing list search behavior and accessibility.

#### Scenario: Search value changes

- **WHEN** a user types in a list toolbar search input
- **THEN** the component MUST preserve its existing query key
- **AND** it MUST debounce URL updates by `300ms`
- **AND** it MUST trim the search value before writing it to the URL
- **AND** it MUST reset `page` to `1`
- **AND** it MUST remove the search query parameter when the trimmed value is empty

#### Scenario: Search input is rendered

- **WHEN** a list toolbar search input is visible
- **THEN** it MUST keep `type="search"`, an `id`, and a matching `sr-only` label
- **AND** it MUST keep the responsive wrapper width `w-full sm:w-80 lg:w-96`
- **AND** it MUST keep existing Vietnamese placeholder and label copy unless a separate copy change is scoped

### Requirement: Repo Guidance Covers Search Spinner Replacement

The repository guidance SHALL document that list search pending feedback replaces the leading search icon.

#### Scenario: Developer reads list search conventions

- **WHEN** a developer checks `AGENTS.md` for search-list guidance
- **THEN** the guidance MUST state that pending list search uses `<Spinner>` in the leading `InputGroupAddon` in place of the search icon
- **AND** it MUST forbid trailing spinner addons, external search spinners, and absolute positioning for list search pending feedback

