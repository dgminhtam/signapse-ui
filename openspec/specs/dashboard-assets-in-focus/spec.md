# dashboard-assets-in-focus Specification

## Purpose

Define the live, localized Assets in Focus section on the production dashboard using the ranked `assetsInFocus` metric returned by `GET /dashboard/summary`.

## Requirements

### Requirement: Production dashboard consumes the assetsInFocus summary metric

The localized production dashboard SHALL render Assets in Focus from `DashboardSummaryResponse.assetsInFocus` returned by the same authenticated `GET /dashboard/summary` request used by Trading Snapshot and Event Timeline after the workspace gate and a readable current workspace have been resolved. It SHALL NOT call watchlist, Event, Narrative, Graph View, or Market Charts endpoints to assemble the section.

#### Scenario: Authorized dashboard receives assets in focus

- **WHEN** an authenticated user with a readable workspace opens `/vi/dashboard` or `/en/dashboard` and the summary contains `assetsInFocus`
- **THEN** the dashboard renders Assets in Focus from the returned metric
- **AND** it uses the backend-resolved workspace scope and summary freshness context

#### Scenario: Section does not issue aggregation requests

- **WHEN** the dashboard summary has loaded
- **THEN** Assets in Focus does not issue an additional request to rank, enrich, or resolve its asset rows
- **AND** it does not request Event or Narrative detail for each item

### Requirement: Dashboard boundary validates the assetsInFocus contract

The dashboard API boundary SHALL require and validate `assetsInFocus.state`, `assetsInFocus.items`, and the required nullable `assetsInFocus.errorCode`. Each item SHALL require `assetId`, `assetName`, `assetSymbol`, `assetType`, and `context`; each context SHALL require `title`, required nullable `summary`, and `observedAt`. The item array SHALL accept no more than six items and asset type SHALL accept the backend values `COMMODITY`, `CRYPTO`, `EQUITY`, `ETF`, `FX`, and `INDEX`.

#### Scenario: Valid metric is preserved

- **WHEN** `GET /dashboard/summary` returns a valid documented `assetsInFocus` metric
- **THEN** `getDashboardSummary` returns the original item identities, asset types, context content, timestamps, state, and error code through `DashboardSummaryResponse`
- **AND** a `summary` value of `null` remains `null`

#### Scenario: Required field is missing or malformed

- **WHEN** the metric or any required nested field is absent, has an invalid type, uses an unsupported metric state, or contains more than six items
- **THEN** the dashboard follows its existing explicit summary validation failure path
- **AND** it does not replace the invalid metric with prototype rows, an empty array, or fabricated context

#### Scenario: Backend returns a canonical error code

- **WHEN** `assetsInFocus.errorCode` is a string not previously known to the frontend
- **THEN** the boundary preserves the string as allowed by the OpenAPI contract
- **AND** the user-facing state does not expose the raw value as its primary label

### Requirement: Available assets preserve backend ranking and context

When `assetsInFocus.state = "AVAILABLE"` and items are present, the section SHALL render the returned items in backend order without frontend sorting. Each row SHALL present asset symbol and name, a localized neutral asset-type category, context title, optional non-empty context summary, localized observed time, and any permitted item action. It SHALL NOT infer context source type, source identifier, price, percentage change, sparkline, market direction, or trading recommendation.

#### Scenario: Available item has a summary

- **WHEN** an available item contains a non-empty `context.summary`
- **THEN** the row displays asset identity, type, context title, supporting summary, and localized observed time
- **AND** its position matches the backend response order

#### Scenario: Available item has no summary

- **WHEN** an available item contains `context.summary = null` or only empty supporting text
- **THEN** the row remains readable using its asset identity, context title, type, and observed time
- **AND** it does not render a blank placeholder or fabricate supporting context

#### Scenario: Context source is not exposed

- **WHEN** a row is rendered from a backend-selected Event or Narrative context
- **THEN** the UI does not label the source type or create a source quick-detail action
- **AND** it does not infer unsupported bullish, bearish, or causal meaning

### Requirement: Assets in Focus states remain explicit and independent

Assets in Focus SHALL render `AVAILABLE`, `EMPTY`, `DENIED`, and `ERROR` as distinct localized states. A denied, errored, missing, or endpoint-failed metric SHALL NOT be represented as an empty successful ranking, and its state SHALL NOT replace successful Current Workspace, Trading Snapshot, Event Timeline, or Latest News content.

#### Scenario: Metric is empty

- **WHEN** `assetsInFocus.state = "EMPTY"` or an available metric defensively contains no items
- **THEN** the section renders a localized empty state without prototype asset rows
- **AND** it does not duplicate the Current Workspace tracked-asset management trigger

#### Scenario: Metric access is denied

- **WHEN** `assetsInFocus.state = "DENIED"` with a permission error code such as `ASSETS_IN_FOCUS_READ_REQUIRED`
- **THEN** the section renders a localized permission/unavailable state
- **AND** it does not display the raw error code as the primary user-facing label

#### Scenario: Metric has an upstream error

- **WHEN** `assetsInFocus.state = "ERROR"`
- **THEN** the section renders a localized technical error state without stale or mock items
- **AND** the other successful dashboard modules remain usable

#### Scenario: Summary endpoint fails

- **WHEN** the existing summary request fails validation, transport, or endpoint authorization
- **THEN** Assets in Focus uses the dashboard's localized summary error path
- **AND** Current Workspace remains available when its own data loaded successfully

### Requirement: Navigation matches action scope and destination permissions

Assets in Focus SHALL place the module-wide Graph View action in its Card header and the asset-specific Market Charts action within each asset row. The Graph View action SHALL render only when the current user can read Graph View. Market Charts actions SHALL render only when the current user can access the Market Charts workbench, and each SHALL navigate through the localized route with the row's backend asset ID and a supported default timeframe.

#### Scenario: User can access both investigation destinations

- **WHEN** the metric has items and the user can read Graph View and access the Market Charts workbench
- **THEN** the header links to the localized `/graph-view` route
- **AND** each row links to `/market-charts?assetId={assetId}&timeframe=1h` in the current locale

#### Scenario: User lacks a destination permission

- **WHEN** the user cannot access Graph View or Market Charts
- **THEN** the corresponding action is omitted without hiding otherwise available metric content
- **AND** the dashboard does not present an action known to lead to an access-denied destination

### Requirement: Section copy, loading, and responsive presentation are localized and accessible

All Assets in Focus labels, descriptions, state text, accessible names, actions, asset-type labels, and invalid-time fallbacks SHALL come from the Vietnamese and English application dictionaries. Backend asset and context content SHALL remain canonical. The section SHALL use existing Signapse UI primitives, semantic headings, visible keyboard focus, hidden decorative icons, a loading skeleton matching its Card and representative rows, and responsive reflow without page-level horizontal overflow at mobile width or 200% zoom.

#### Scenario: Section is loading

- **WHEN** the production dashboard is suspended while summary data loads
- **THEN** the fallback preserves the Assets in Focus Card header, eligible action footprint, and representative row footprint
- **AND** it does not display mock asset or context content

#### Scenario: Vietnamese or English dashboard renders

- **WHEN** the active route locale is `vi` or `en`
- **THEN** section chrome, state copy, asset-type labels, action labels, and observed-time formatting use that locale
- **AND** backend asset names, symbols, titles, summaries, IDs, and timestamps are not machine-translated or replaced

#### Scenario: Section is viewed at narrow width or zoom

- **WHEN** the dashboard is viewed at mobile width or 200% zoom
- **THEN** row content and actions wrap or reflow into a readable order
- **AND** the page does not require horizontal scrolling to read context or activate available links

### Requirement: Production implementation remains isolated from the prototype

The production Assets in Focus section SHALL adapt only the reviewed presentation and SHALL NOT import route-local mock records, scenario controls, prototype dictionary content, or prototype component implementations. The existing localized `/dashboard-prototype` route SHALL remain unchanged and reviewable.

#### Scenario: Production section is implemented

- **WHEN** the production dashboard renders Assets in Focus
- **THEN** every asset row comes from the validated backend summary or an explicit state
- **AND** production files do not import the prototype view, scenario module, or mock constants
