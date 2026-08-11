## ADDED Requirements

### Requirement: Production dashboard consumes the marketNarratives summary metric

The localized production dashboard SHALL render Market Narratives from `DashboardSummaryResponse.marketNarratives` returned by the same authenticated `GET /dashboard/summary` request used by Trading Snapshot, Event Timeline, and Assets in Focus after the workspace gate and a readable current workspace have been resolved. It SHALL NOT call Narrative list/detail, watchlist, asset, Graph View, or Market Charts endpoints to assemble the section.

#### Scenario: Authorized dashboard receives market narratives

- **WHEN** an authenticated user with a readable workspace opens `/vi/dashboard` or `/en/dashboard` and the summary contains `marketNarratives`
- **THEN** the dashboard renders Market Narratives from the returned metric
- **AND** it uses the backend-resolved workspace scope, shared `asOf`, and returned authoritative ordering

#### Scenario: Section does not issue aggregation requests

- **WHEN** the dashboard summary has loaded
- **THEN** Market Narratives does not issue an additional request to rank, filter, enrich, or resolve its rows
- **AND** it does not request Narrative detail or related assets for each item

### Requirement: Dashboard boundary validates the marketNarratives contract

The dashboard API boundary SHALL require and validate `marketNarratives.state`, `marketNarratives.items`, and required nullable `marketNarratives.errorCode`. It SHALL accept no more than three items and SHALL restrict item status to `EMERGING`, `WEAKENING`, or `ACTIVE`. Every item SHALL require `id`, required nullable `title`, required nullable `thesis`, `status`, required nullable `confidence`, `lastUpdatedAt`, required `primaryTheme`, and `assets`. The primary theme SHALL require `themeId`, required nullable `themeTitle`, and `themeSlug`. Every asset SHALL require `assetId`, `assetName`, `assetSymbol`, `assetType`, `relationType`, and required nullable `weight`; asset type SHALL accept `COMMODITY`, `CRYPTO`, `EQUITY`, `ETF`, `FX`, and `INDEX`, and relation type SHALL accept `PRIMARY` and `AFFECTED`.

#### Scenario: Valid metric is preserved

- **WHEN** `GET /dashboard/summary` returns a valid documented `marketNarratives` metric
- **THEN** `getDashboardSummary` preserves its items, nested content, state, and error code through `DashboardSummaryResponse`
- **AND** nullable title, thesis, confidence, theme title, weight, and error code values remain null

#### Scenario: Required field is missing or malformed

- **WHEN** the metric or a required nested field is absent, uses an invalid type or enum, sets `primaryTheme` to null, or contains more than three items
- **THEN** the dashboard follows its existing explicit summary validation failure path
- **AND** it does not replace the invalid metric with prototype rows, an empty array, or fabricated content

#### Scenario: Backend returns a canonical error code

- **WHEN** `marketNarratives.errorCode` is a string not previously known to the frontend
- **THEN** the boundary preserves the string as allowed by the OpenAPI contract
- **AND** the user-facing state does not expose the raw code as its primary label

### Requirement: Available narratives preserve backend order and canonical content

When `marketNarratives.state = "AVAILABLE"` and items are present, the section SHALL render every returned item and asset in backend order without frontend sorting, filtering, or slicing. Each row SHALL present a localized fallback-capable title and thesis, a user-facing lifecycle status, primary theme title when available, every returned asset symbol, optional localized confidence, and localized `lastUpdatedAt`. It SHALL NOT infer market direction, causality, prediction accuracy, or trading advice.

#### Scenario: Available item has complete content

- **WHEN** an available item contains title, thesis, confidence, a non-empty primary theme title, assets, and a valid update timestamp
- **THEN** the row presents those values with the approved lifecycle and neutral asset Badge treatments
- **AND** its position and asset order match the backend response

#### Scenario: Available item contains nullable or empty presentation fields

- **WHEN** an available item has null or blank title, thesis, confidence, or theme title, or has an empty asset array
- **THEN** the row uses localized title or thesis fallback copy where needed and remains readable
- **AND** it omits unavailable confidence, theme, or asset metadata rather than fabricating values, displaying `0%`, or promoting `themeSlug` as a user-facing title

#### Scenario: Lifecycle status is rendered

- **WHEN** an item status is `ACTIVE`, `EMERGING`, or `WEAKENING`
- **THEN** the section renders the localized lifecycle label with `default` Badge treatment for `ACTIVE` and `secondary` treatment for `EMERGING` and `WEAKENING`
- **AND** neutral iconography and copy do not imply bullish or bearish asset direction

### Requirement: Market Narratives states remain explicit and independent

Market Narratives SHALL render `AVAILABLE`, `EMPTY`, `DENIED`, and `ERROR` as distinct localized states. A denied, errored, missing, endpoint-failed, or defensively empty metric SHALL NOT be represented with mock or stale narrative rows, and its state SHALL NOT hide successful Current Workspace, Trading Snapshot, Event Timeline, Latest News, or Assets in Focus content.

#### Scenario: Metric is empty

- **WHEN** `marketNarratives.state = "EMPTY"` or an available metric defensively contains no items
- **THEN** the section renders a localized empty state without prototype narrative rows
- **AND** it does not claim that denied or errored data is empty

#### Scenario: Metric access is denied

- **WHEN** `marketNarratives.state = "DENIED"` with a canonical permission error code
- **THEN** the section renders a localized permission state
- **AND** it does not display the raw error code as its primary user-facing label

#### Scenario: Metric has an upstream or summary error

- **WHEN** `marketNarratives.state = "ERROR"`
- **THEN** the section renders a localized technical error state without stale or mock items
- **AND** the other successful dashboard modules remain usable

#### Scenario: Summary endpoint fails

- **WHEN** the existing summary request fails validation, transport, or endpoint authorization
- **THEN** Market Narratives uses the dashboard's localized summary error path
- **AND** Current Workspace remains available when its own data loaded successfully

### Requirement: Graph View navigation matches action scope and destination permission

Market Narratives SHALL place its module-wide Graph View action in the Card header only when available narrative items exist and the current user can read Graph View. It SHALL NOT add item-level Narrative links before a canonical production Narrative route exists.

#### Scenario: User can investigate available narratives

- **WHEN** the metric has available items and the user can read Graph View
- **THEN** the Card header links to the localized `/graph-view` route
- **AND** the action is represented once at module scope rather than repeated per item

#### Scenario: User cannot access Graph View or no items exist

- **WHEN** the user cannot read Graph View or the metric has no available items
- **THEN** the Graph View action is omitted without hiding the section state or otherwise available narrative content
- **AND** no action known to lead to an access-denied or contextless destination is presented

### Requirement: Section copy, loading, and responsive presentation are localized and accessible

All Market Narratives labels, descriptions, state text, accessible names, actions, lifecycle labels, fallbacks, and date or percentage formatting SHALL come from the Vietnamese and English application dictionaries and localization helpers. Backend titles, theses, theme titles, asset names, asset symbols, IDs, enum values, error codes, and timestamps SHALL remain canonical. The section SHALL use existing Signapse UI primitives, semantic headings, visible keyboard focus, hidden decorative icons, a matching loading skeleton, motion-reduction-safe Skeletons, and responsive reflow without page-level horizontal overflow at mobile width or 200% zoom.

#### Scenario: Section is loading

- **WHEN** the production dashboard is suspended while summary data loads
- **THEN** the fallback preserves the Market Narratives Card header, eligible action footprint, and three representative row footprints
- **AND** it does not display mock narrative, theme, asset, confidence, or timestamp content

#### Scenario: Vietnamese or English dashboard renders

- **WHEN** the active route locale is `vi` or `en`
- **THEN** section chrome, state copy, lifecycle labels, action labels, fallbacks, percentage, and update-time formatting use that locale
- **AND** backend domain content is not machine-translated or replaced

#### Scenario: Section is viewed at narrow width or zoom

- **WHEN** the dashboard is viewed at mobile width or 200% zoom
- **THEN** title, thesis, metadata, asset badges, and the permitted action wrap or reflow into a readable order
- **AND** the page does not require horizontal scrolling to read narrative content or activate the available action

### Requirement: Production implementation remains isolated from the prototype

The production Market Narratives section SHALL adapt only the reviewed presentation and SHALL NOT import route-local mock records, scenario controls, prototype dictionary content, relative-time strings, or prototype component implementations. The existing localized `/dashboard-prototype` route SHALL remain unchanged and reviewable.

#### Scenario: Production section is implemented

- **WHEN** the production dashboard renders Market Narratives
- **THEN** every narrative row comes from the validated backend summary or an explicit state
- **AND** production files do not import the prototype view, scenario module, mock constants, or prototype dictionary namespace

#### Scenario: Prototype remains reviewable

- **WHEN** a reviewer opens `/vi/dashboard-prototype` or `/en/dashboard-prototype`
- **THEN** its existing default, loading, empty, and partial-error scenarios continue to render unchanged
- **AND** the prototype does not call the production summary endpoint
