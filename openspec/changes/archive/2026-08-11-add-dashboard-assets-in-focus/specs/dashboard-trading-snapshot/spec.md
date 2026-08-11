## MODIFIED Requirements

### Requirement: Production dashboard loads one live Trading Snapshot summary

The localized production dashboard SHALL load Trading Snapshot, Event Timeline, and Assets in Focus through one authenticated `GET /dashboard/summary` request with no request body or query parameters after the workspace gate and a readable current workspace have been resolved. It SHALL NOT recreate these modules by calling the individual economic-calendar, event, narrative, news, watchlist, Graph View, or Market Charts endpoints.

#### Scenario: Authorized dashboard loads the summary

- **WHEN** an authenticated user with `workspace:read` opens `/vi/dashboard` or `/en/dashboard` and a readable workspace is available
- **THEN** the frontend makes one authenticated request to `GET /dashboard/summary`
- **AND** the dashboard renders the returned Trading Snapshot, Event Timeline, and Assets in Focus using the backend-resolved scope and `asOf`

#### Scenario: Dashboard does not request summary without workspace context

- **WHEN** the dashboard cannot resolve a readable workspace or is rendering its existing workspace gate state
- **THEN** the frontend does not render placeholder Trading Snapshot, Event Timeline, or Assets in Focus values as live data
- **AND** it does not request the workspace-scoped summary with an inferred or undefined workspace

#### Scenario: Existing APIs are not used for summary aggregation

- **WHEN** Trading Snapshot, Event Timeline, and Assets in Focus are loaded
- **THEN** the frontend does not issue separate aggregate calls to `/economic-calendar`, `/events`, `/narratives`, `/news-articles`, `/watchlists`, `/graph-view`, or `/market-charts` for those dashboard modules

### Requirement: Dashboard summary response is validated at the API boundary

The frontend summary action SHALL use the authenticated transport and SHALL validate the response shape, including `asOf`, `timezone`, `scope`, all six required metric objects including `recentEvents` and `assetsInFocus`, metric states `AVAILABLE`, `EMPTY`, `DENIED`, `ERROR`, required nullable metric values, `window`, `statuses`, recent event items, ranked asset items and contexts, and contract-compatible `errorCode` strings before passing data to the UI.

#### Scenario: Valid summary response is accepted

- **WHEN** `GET /dashboard/summary` returns the documented top-level fields, the four Trading Snapshot metrics, `recentEvents`, and `assetsInFocus` with valid metric states and nested fields
- **THEN** the action returns the validated `DashboardSummaryResponse` to the dashboard route

#### Scenario: Nullable metric values are preserved

- **WHEN** a response contains `count: null`, `data: null`, `window: null`, `context.summary: null`, or `errorCode: null` where allowed by the contract
- **THEN** the parser preserves those values and does not coerce them to zero, empty strings, empty arrays, or fabricated content

#### Scenario: Required summary field is absent

- **WHEN** the response omits one of the six required metric objects or a required field inside one of those objects
- **THEN** the action follows the existing explicit summary validation failure path
- **AND** it does not silently discard or synthesize the missing metric

### Requirement: Metric states remain independent and truthful

The dashboard SHALL render `DENIED` and `ERROR` as explicit localized unavailable/error states for any summary metric, including `recentEvents` and `assetsInFocus`, and SHALL NOT represent either state as count `0` or a successful empty list. A state or failure in one metric SHALL NOT hide or alter the other metric cards, Event Timeline, or Assets in Focus in a successful HTTP 200 summary.

#### Scenario: One metric is denied

- **WHEN** one metric, including `recentEvents` or `assetsInFocus`, has `state = "DENIED"` and a canonical permission `errorCode`
- **THEN** that metric shows a localized permission/unavailable state without exposing raw enum text as the primary label
- **AND** the other returned metric cards and sections remain usable

#### Scenario: One metric has an error

- **WHEN** one metric, including `recentEvents` or `assetsInFocus`, has `state = "ERROR"` and no usable data
- **THEN** that metric shows a localized error state without displaying zero, successful empty content, or stale items
- **AND** retained backend metadata and other available metrics are not discarded

#### Scenario: Endpoint-level summary failure

- **WHEN** the summary request returns endpoint-level `403`, `409`, a validation failure, or a transport failure
- **THEN** the dashboard preserves the Current Workspace surface and renders localized failure states for the summary-backed modules
- **AND** it does not render mock or stale metric values as current data

