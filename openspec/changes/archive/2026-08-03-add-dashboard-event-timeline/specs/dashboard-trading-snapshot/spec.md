# dashboard-trading-snapshot Specification Delta

## MODIFIED Requirements

### Requirement: Production dashboard loads one live Trading Snapshot summary

The localized production dashboard SHALL load the Trading Snapshot and Event Timeline through one authenticated `GET /dashboard/summary` request with no request body or query parameters after the workspace gate and a readable current workspace have been resolved. It SHALL NOT recreate the summary or timeline by calling the individual economic-calendar, event, narrative, or news list endpoints.

#### Scenario: Authorized dashboard loads the summary

- **WHEN** an authenticated user with `workspace:read` opens `/vi/dashboard` or `/en/dashboard` and a readable workspace is available
- **THEN** the frontend makes one authenticated request to `GET /dashboard/summary`
- **AND** the dashboard renders the returned Trading Snapshot and Event Timeline using the backend-resolved scope and `asOf`

#### Scenario: Dashboard does not request summary without workspace context

- **WHEN** the dashboard cannot resolve a readable workspace or is rendering its existing workspace gate state
- **THEN** the frontend does not render placeholder Trading Snapshot or Event Timeline values as live data
- **AND** it does not request the workspace-scoped summary with an inferred or undefined workspace

#### Scenario: Existing list APIs are not used for summary aggregation

- **WHEN** the Trading Snapshot and Event Timeline are loaded
- **THEN** the frontend does not issue separate aggregate calls to `/economic-calendar`, `/events`, `/narratives`, or `/news-articles` for the dashboard modules

### Requirement: Dashboard summary response is validated at the API boundary

The frontend summary action SHALL use the authenticated transport and SHALL validate the response shape, including `asOf`, `timezone`, `scope`, all five metric objects including `recentEvents`, metric states `AVAILABLE`, `EMPTY`, `DENIED`, `ERROR`, nullable metric values, `window`, `statuses`, recent event items, and canonical `errorCode` values before passing data to the UI.

#### Scenario: Valid summary response is accepted

- **WHEN** `GET /dashboard/summary` returns a response containing the documented top-level fields, the four Trading Snapshot metrics, and `recentEvents` with valid metric states
- **THEN** the action returns the validated `DashboardSummaryResponse` to the dashboard route

#### Scenario: Nullable metric values are preserved

- **WHEN** a response contains `count: null`, `data: null`, `window: null`, or `errorCode: null` where allowed by the metric state
- **THEN** the parser preserves those values and does not coerce them to zero, empty strings, or fabricated event data

### Requirement: Metric states remain independent and truthful

The dashboard SHALL render `DENIED` and `ERROR` as explicit localized unavailable/error states for any summary metric, including `recentEvents`, and SHALL NOT represent either state as count `0`. A state or failure in one metric SHALL NOT hide or alter the other metric cards or the Event Timeline in a successful HTTP 200 summary.

#### Scenario: One metric is denied

- **WHEN** one metric, including `recentEvents`, has `state = "DENIED"` and a canonical permission `errorCode`
- **THEN** that metric shows a localized permission/unavailable state without exposing raw enum text as the primary label
- **AND** the other returned metric cards and timeline remain usable

#### Scenario: One metric has an error

- **WHEN** one metric, including `recentEvents`, has `state = "ERROR"` and `count = null`, `data = null`, or no usable items
- **THEN** that metric shows a localized error state without displaying zero
- **AND** retained backend metadata such as an available window, narrative statuses, or other available event metrics is not discarded

#### Scenario: Endpoint-level summary failure

- **WHEN** the summary request returns endpoint-level `403`, `409`, or a transport failure
- **THEN** the dashboard preserves the Current Workspace surface and renders a localized summary-level failure state
- **AND** it does not render mock or stale metric values as current data
