## ADDED Requirements

### Requirement: Isolated prototype route

The system SHALL provide a locale-aware `/[lang]/dashboard-prototype` route inside the existing protected main layout, and the prototype SHALL remain independent from the production dashboard data and permission flow.

#### Scenario: Reviewer opens the prototype

- **WHEN** an authenticated reviewer opens `/[lang]/dashboard-prototype`
- **THEN** the system renders the prototype in the existing main shell using route-local mock data
- **AND** the system does not invoke dashboard feature APIs, actions, permission helpers, or backend DTOs

#### Scenario: User opens the current dashboard

- **WHEN** a user opens `/[lang]/dashboard`
- **THEN** the existing dashboard route, imports, API calls, and permission behavior remain unchanged

### Requirement: Prototype navigation boundary

The system SHALL expose the prototype through a direct URL with a localized breadcrumb label and SHALL NOT add it to the sidebar, redirect the current dashboard, or gate the current dashboard behind a feature flag.

#### Scenario: Navigation renders for the prototype

- **WHEN** the prototype route is active
- **THEN** the breadcrumb identifies the route with localized prototype copy
- **AND** the sidebar contains no prototype navigation item

### Requirement: Trading Intelligence information hierarchy

The prototype SHALL render Current Workspace, Trading Snapshot, Event Timeline, Latest News, Assets in Focus, and Market Narratives as a single Trading Intelligence Home consistent with `docs/design/DASHBOARD.md`.

#### Scenario: Default desktop hierarchy

- **WHEN** the default scenario is rendered at an extra-large desktop width
- **THEN** Current Workspace spans the page as a compact low-emphasis context strip
- **AND** the Next Key Event snapshot receives greater visual weight than the other snapshot metrics
- **AND** Event Timeline and Latest News use an eight-to-four column relationship
- **AND** Assets in Focus and Market Narratives use a seven-to-five column relationship

#### Scenario: Default mock content

- **WHEN** the default scenario is rendered
- **THEN** the prototype shows every tracked workspace asset and four snapshot metrics with explicit time windows or decision context
- **AND** it shows five or six event-only timeline items, four or five latest news items, six assets in focus, and three narratives representing emerging, active, and weakening states

### Requirement: Explicit workspace scope

Current Workspace SHALL use the active workspace name as its visible section heading, SHALL explain the active dashboard scope beneath it, and SHALL show every tracked asset as a neutral presentational item containing its full name, symbol, and asset type without collapsing the list into a count-only or `+N` summary.

#### Scenario: Workspace hierarchy is rendered

- **WHEN** Current Workspace is visible
- **THEN** the active workspace name is the visible section heading and uses the same text scale as the Next Key Event value
- **AND** the workspace name does not use metric-only monospaced or tabular-number styling
- **AND** a localized description explains that the workspace defines the active dashboard scope
- **AND** a localized mock update time appears below the description through `AppTimeMetadata` with no additional timestamp label or badge
- **AND** a repeated generic Current Workspace eyebrow is not rendered

#### Scenario: Workspace contains tracked assets

- **WHEN** the default scenario renders a workspace with tracked assets
- **THEN** the tracked-asset subsection shows a localized heading, the formatted asset count in a neutral badge, and a localized description
- **AND** every tracked asset is visible as an individually identifiable outlined item with a readable full name, symbol, and neutral asset-type badge
- **AND** workspace items do not add a mock detail link, price, market status, logo, or per-item action
- **AND** the asset list remains readable without page-level horizontal overflow at mobile width or 200 percent zoom
- **AND** long asset names wrap without requiring hover to access the full name
- **AND** the module-wide action is labeled Manage Assets without exposing watchlist terminology

#### Scenario: Workspace contains no tracked assets

- **WHEN** the empty scenario renders Current Workspace
- **THEN** the tracked-asset subsection retains its heading, description, and a localized zero count
- **AND** the existing empty guidance replaces the item grid

#### Scenario: Reviewer compares workspace scope and assets in focus

- **WHEN** Current Workspace and Assets in Focus are both visible
- **THEN** Current Workspace presents scope metadata only
- **AND** Assets in Focus remains the module that owns market context and asset-specific Market Charts actions

### Requirement: Separate event and article responsibilities

Event Timeline SHALL contain only market events, and Latest News SHALL contain raw recent news without requiring asset or event enrichment rather than economic-calendar rows.

#### Scenario: Reviewer scans the event timeline

- **WHEN** Event Timeline contains market events
- **THEN** events are ordered from newest to oldest by their occurred time
- **AND** each item shows its title, concise description, localized occurred time, and neutral confidence metadata
- **AND** each item identifies its themes as neutral text and every affected asset as an individually identifiable neutral outline badge
- **AND** relationship content wraps without page-level overflow and remains visually separate from occurred time and confidence
- **AND** no item infers bullish or bearish direction from an affected-asset relationship
- **AND** relationship content remains route-local mock data without Event DTO imports or feature requests
- **AND** no item renders Economic Calendar impact or scheduling state
- **AND** no item exposes internal enrichment status
- **AND** no article item appears in Event Timeline

#### Scenario: Reviewer scans the latest news

- **WHEN** Latest News contains recent news
- **THEN** each item shows its title, a concise summary, source, and publication time without asset or event relationship badges
- **AND** the summary appears below the title, is limited to two visual lines, and remains separate from the muted source/time metadata
- **AND** article rows do not pretend to open a specific article when the prototype has no canonical article ID
- **AND** the module header provides the route to the complete news list
- **AND** the module does not present calendar forecast, previous, or actual values

### Requirement: Action placement matches action scope

The prototype SHALL place module-wide navigation in the relevant module header and SHALL keep item-specific navigation inside the item it affects.

#### Scenario: Reviewer scans module actions

- **WHEN** the default scenario contains module data
- **THEN** Event Timeline and Latest News expose their complete-list links in their headers
- **AND** Assets in Focus and Market Narratives expose Graph View links in their headers
- **AND** article and narrative cards do not repeat those module-wide actions in card footers

#### Scenario: Reviewer scans asset actions

- **WHEN** Assets in Focus contains asset rows
- **THEN** each row retains its Market Charts action
- **AND** Graph View is not repeated as if it were specific to each asset row

#### Scenario: Reviewer scans non-default action states

- **WHEN** a module is empty, loading, or in partial error
- **THEN** its header action does not duplicate the empty-state or recovery action
- **AND** its loading skeleton preserves the normal header-action footprint

### Requirement: Narrative context and asset impact

Market Narratives SHALL identify the theme and every asset affected by each displayed narrative without inventing an unsupported bullish or bearish direction.

#### Scenario: Narrative has affected assets

- **WHEN** a market narrative is displayed
- **THEN** its user-facing status, thesis, summary, neutral theme, confidence, and affected assets are readable together
- **AND** the theme is presented as text rather than a decision-bearing status badge
- **AND** every affected asset is individually identifiable

### Requirement: Decision-oriented content

The prototype SHALL present only market-awareness content and investigation paths and MUST NOT expose pipeline, enrichment, derivation, provider, queue, administrative telemetry, or other implementation status.

#### Scenario: Reviewer scans the modules

- **WHEN** any prototype scenario contains market content
- **THEN** events, news, narratives, and assets in focus use user-facing labels and relevant list-level investigation links
- **AND** no internal processing or backend status appears

### Requirement: Reviewable prototype scenarios

The prototype SHALL support `default`, `loading`, `empty`, and `partial-error` scenarios selected through the `scenario` query parameter and a visible localized prototype control strip.

#### Scenario: Reviewer selects a supported scenario

- **WHEN** a reviewer follows a scenario control link
- **THEN** the URL stores the selected scenario
- **AND** refreshing or sharing that URL renders the same scenario

#### Scenario: Scenario value is invalid

- **WHEN** the scenario parameter is missing, repeated, or unsupported
- **THEN** the system deterministically renders the default scenario

### Requirement: Independent loading, empty, and error presentation

The prototype SHALL preserve module hierarchy across non-default states and SHALL demonstrate that one optional module can fail without blocking the rest of the dashboard.

#### Scenario: Loading scenario

- **WHEN** the loading scenario is active
- **THEN** each module renders a skeleton matching the final content and header-action footprint at the current breakpoint

#### Scenario: Empty scenario

- **WHEN** the empty scenario is active
- **THEN** empty modules explain the next useful user action without referring to a backend

#### Scenario: Partial error scenario

- **WHEN** the partial-error scenario is active
- **THEN** one optional module renders a short user-facing error and recovery action
- **AND** all unaffected modules remain readable and useful

### Requirement: Financial Command Surface conformance

The prototype SHALL reuse the existing shadcn wrappers, semantic tokens, Geist typography, and Financial Command Surface chrome, and SHALL NOT add a dependency, global CSS rule, semantic token, large chart, decorative gradient, or heavy animation.

#### Scenario: Prototype renders in both themes

- **WHEN** the reviewer switches between light and dark themes
- **THEN** the information hierarchy, contrast, and component meaning remain equivalent
- **AND** event, article, impact, and narrative states use text or icons in addition to color

### Requirement: Responsive and accessible review surface

The prototype SHALL provide one semantic page heading, sequential section headings, keyboard-accessible links and controls, visible focus, and responsive reflow without page-level horizontal overflow.

#### Scenario: Medium-width layout

- **WHEN** the available width cannot preserve the extra-large layout legibly
- **THEN** snapshot tiles reflow to two columns and primary module pairs stack as needed

#### Scenario: Mobile or 200 percent zoom

- **WHEN** the prototype is viewed on a mobile width or at 200 percent zoom
- **THEN** modules use a readable single-column flow
- **AND** content and controls remain available without page-level horizontal scrolling

#### Scenario: Keyboard review

- **WHEN** a reviewer navigates the prototype using only a keyboard
- **THEN** all scenario controls and investigation links receive visible focus and expose meaningful accessible names

### Requirement: Semantic badge color hierarchy

The prototype SHALL reproduce the complete Economic Calendar impact badge presentation for Next Key Event, SHALL use only approved shared Badge variants for other statuses and categories, SHALL preserve textual meaning in addition to color, and SHALL keep contextual asset chips and raw news neutral.

#### Scenario: Reviewer scans the Next Key Event

- **WHEN** the default Next Key Event snapshot is rendered
- **THEN** its time and currency remain readable beside the impact
- **AND** its impact uses the same helper-provided chrome and localized label as Economic Calendar
- **AND** the snapshot does not render the previous alternate impact phrase or a prototype-only icon
- **AND** the empty scenario omits the impact badge

#### Scenario: Reviewer scans narrative and asset-class badges

- **WHEN** Market Narratives and Assets in Focus render their category badges
- **THEN** emerging, active, and weakening narratives use the upstream `secondary`, `default`, and `secondary` Badge variants respectively
- **AND** foreign exchange, metals, cryptocurrency, equities, and energy use the neutral `secondary` Badge variant
- **AND** no color implies an unsupported bullish or bearish direction

#### Scenario: Reviewer scans contextual and raw content

- **WHEN** Current Workspace assets, event-related assets, narrative-affected assets, or Latest News render
- **THEN** workspace asset-type badges and contextual asset chips remain neutral and Latest News receives no decorative or relationship badge

#### Scenario: Reviewer compares badge colors across themes

- **WHEN** the prototype is reviewed in light and dark themes
- **THEN** every semantic badge remains readable with equivalent meaning and sufficient text/background contrast
- **AND** no feature code supplies raw palette classes or manual dark-mode overrides
- **AND** no global CSS rule, semantic token, dependency, feature-specific badge abstraction, or custom shared Badge variant is required

### Requirement: Localized prototype copy

All prototype labels, descriptions, statuses, empty states, errors, controls, and accessible names SHALL come from the application dictionaries and use existing localization formatters where values require formatting.

#### Scenario: Locale changes

- **WHEN** the prototype is opened under a supported locale
- **THEN** all reviewer-facing prototype copy and breadcrumb text render from that locale's dictionary
- **AND** the route does not hardcode `/vi` or `/en` navigation paths
