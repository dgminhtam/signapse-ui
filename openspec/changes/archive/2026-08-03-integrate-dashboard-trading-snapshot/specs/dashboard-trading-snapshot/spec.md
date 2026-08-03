# dashboard-trading-snapshot Specification

## ADDED Requirements

### Requirement: Production dashboard loads one live Trading Snapshot summary

The localized production dashboard SHALL load the Trading Snapshot through one authenticated `GET /dashboard/summary` request with no request body or query parameters after the workspace gate and a readable current workspace have been resolved. It SHALL NOT recreate the summary by calling the individual economic-calendar, event, narrative, or news list endpoints.

#### Scenario: Authorized dashboard loads the summary

- **WHEN** an authenticated user with `workspace:read` opens `/vi/dashboard` or `/en/dashboard` and a readable workspace is available
- **THEN** the frontend makes one authenticated request to `GET /dashboard/summary`
- **AND** the dashboard renders the returned summary using the backend-resolved scope and `asOf`

#### Scenario: Dashboard does not request summary without workspace context

- **WHEN** the dashboard cannot resolve a readable workspace or is rendering its existing workspace gate state
- **THEN** the frontend does not render placeholder Trading Snapshot values as live data
- **AND** it does not request the workspace-scoped summary with an inferred or undefined workspace

#### Scenario: Existing list APIs are not used for summary aggregation

- **WHEN** the Trading Snapshot is loaded
- **THEN** the frontend does not issue separate aggregate calls to `/economic-calendar`, `/events`, `/narratives`, or `/news-articles` for the four cards

### Requirement: Dashboard summary response is validated at the API boundary

The frontend summary action SHALL use the authenticated transport and SHALL validate the response shape, including `asOf`, `timezone`, `scope`, all four metric objects, metric states `AVAILABLE`, `EMPTY`, `DENIED`, `ERROR`, nullable metric values, `window`, `statuses`, and canonical `errorCode` values before passing data to the UI.

#### Scenario: Valid summary response is accepted

- **WHEN** `GET /dashboard/summary` returns a response containing the documented top-level fields and metric states
- **THEN** the action returns the validated `DashboardSummaryResponse` to the dashboard route

#### Scenario: Nullable metric values are preserved

- **WHEN** a response contains `count: null`, `data: null`, `window: null`, or `errorCode: null` where allowed by the metric state
- **THEN** the parser preserves those values and does not coerce them to zero, empty strings, or fabricated event data

### Requirement: Trading Snapshot presents the four backend metrics

The production dashboard SHALL render a localized four-card Trading Snapshot with the prototype's hierarchy: a visually stronger `nextKeyEvent` card plus cards for `marketEvents24h`, `activeNarratives`, and `latestNews6h`. The cards SHALL use backend values rather than route-local mock values.

#### Scenario: Next key event is available

- **WHEN** `nextKeyEvent.state = "AVAILABLE"` and `data` is present
- **THEN** the card shows the canonical event title, localized scheduled date/time, currency code, and the existing economic-calendar impact badge

#### Scenario: Next key event is empty

- **WHEN** `nextKeyEvent.state = "EMPTY"` and `data = null`
- **THEN** the card shows the localized no-data state
- **AND** it does not show the prototype's mock title, time, currency, or impact

#### Scenario: Count metrics are available or empty

- **WHEN** a count metric is `AVAILABLE` or `EMPTY`
- **THEN** the card shows its validated `count` using the active locale's number formatter
- **AND** an empty metric is shown as a known zero only when the backend state is `EMPTY`

### Requirement: Metric states remain independent and truthful

The dashboard SHALL render `DENIED` and `ERROR` as explicit localized unavailable/error states and SHALL NOT represent either state as count `0`. A state or failure in one metric SHALL NOT hide or alter the other metric cards in a successful HTTP 200 summary.

#### Scenario: One metric is denied

- **WHEN** one metric has `state = "DENIED"` and a canonical permission `errorCode`
- **THEN** that card shows a localized permission/unavailable state without exposing raw enum text as the primary label
- **AND** the other returned metric cards remain usable

#### Scenario: One metric has an error

- **WHEN** one metric has `state = "ERROR"` and `count = null` or `data = null`
- **THEN** that card shows a localized error state without displaying zero
- **AND** retained backend metadata such as an available window or narrative statuses is not discarded

#### Scenario: Endpoint-level summary failure

- **WHEN** the summary request returns endpoint-level `403`, `409`, or a transport failure
- **THEN** the dashboard preserves the Current Workspace surface and renders a localized summary-level failure state
- **AND** it does not render mock or stale metric values as current data

### Requirement: Snapshot hierarchy is responsive and accessible

The Trading Snapshot SHALL use existing shadcn `Card`, `Badge`, `Skeleton`, icon, semantic-token, and spacing conventions. It SHALL preserve the prototype's responsive emphasis, provide a semantic section heading and card headings, keep decorative icons hidden from assistive technology, and avoid page-level horizontal overflow.

#### Scenario: Desktop dashboard renders the accepted hierarchy

- **WHEN** the dashboard is viewed at an extra-large viewport
- **THEN** the next-event card receives the strongest snapshot emphasis
- **AND** the three count cards occupy the remaining snapshot row according to the accepted responsive grid

#### Scenario: Narrow dashboard reflows without overflow

- **WHEN** the dashboard is viewed at mobile width or 200% zoom
- **THEN** the cards reflow into readable rows or columns
- **AND** the page does not require horizontal scrolling to read the metric values

#### Scenario: Snapshot is loading

- **WHEN** the summary request is pending
- **THEN** the snapshot renders a localized skeleton that preserves the final card footprint

### Requirement: Production snapshot copy and formatting are localized

All production Trading Snapshot labels, descriptions, no-data text, unavailable/error text, accessible names, dates, times, and counts SHALL come from the application dictionaries and existing localization formatters in both `vi` and `en`. Canonical backend titles, IDs, enum values, permissions, and timestamps SHALL not be translated or replaced with frontend mock content.

#### Scenario: Vietnamese dashboard renders localized copy

- **WHEN** the active route locale is `vi`
- **THEN** section labels, state text, dates, times, and counts use Vietnamese dictionary/formatting behavior

#### Scenario: English dashboard renders localized copy

- **WHEN** the active route locale is `en`
- **THEN** section labels, state text, dates, times, and counts use English dictionary/formatting behavior

### Requirement: Prototype route remains isolated

The existing localized `/dashboard-prototype` route SHALL retain its route-local mock data and review scenarios. Production dashboard code SHALL NOT import prototype mock constants, scenario controls, or production-incompatible static event values.

#### Scenario: Prototype remains reviewable

- **WHEN** a reviewer opens `/vi/dashboard-prototype` or `/en/dashboard-prototype`
- **THEN** the route continues to support its existing `default`, `loading`, `empty`, and `partial-error` scenarios

#### Scenario: Production uses live data only

- **WHEN** a user opens `/vi/dashboard` or `/en/dashboard`
- **THEN** the Trading Snapshot uses the summary API response or an explicit loading/empty/error state
- **AND** it does not use prototype mock data
