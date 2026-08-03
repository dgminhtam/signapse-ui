# dashboard-event-timeline Specification

## Purpose

Define the live, localized Event Timeline section on the production dashboard using the `recentEvents` metric returned by `GET /dashboard/summary`.
## Requirements
### Requirement: Production dashboard consumes the recentEvents summary metric

The localized production dashboard SHALL render Event Timeline from `DashboardSummaryResponse.recentEvents` returned by the same authenticated `GET /dashboard/summary` request used by Trading Snapshot after the workspace gate and a readable current workspace have been resolved. It SHALL NOT call `/events` to assemble the timeline.

#### Scenario: Authorized dashboard receives recent events

- **WHEN** an authenticated user with a readable workspace opens `/vi/dashboard` or `/en/dashboard` and the summary response contains `recentEvents`
- **THEN** the dashboard renders the Event Timeline from the returned metric
- **AND** the timeline uses the backend-resolved scope and summary freshness context

#### Scenario: Dashboard has no workspace context

- **WHEN** the dashboard cannot resolve a readable workspace or is rendering its workspace gate state
- **THEN** it does not request the workspace-scoped summary
- **AND** it does not render fabricated or prototype event rows

#### Scenario: Timeline does not issue a second event request

- **WHEN** the dashboard summary is loaded
- **THEN** the frontend does not call `/events` to populate Event Timeline
- **AND** the existing `/events` API remains available only for navigation to the full list or an event detail

### Requirement: Dashboard summary validation preserves event data

The dashboard API boundary SHALL validate and type `recentEvents.state`, `recentEvents.items`, each recent event item's `id`, `title`, `description`, `occurredAt`, and `confidence`, the nested theme and affected-asset summaries, and `recentEvents.errorCode` before passing the metric to the UI. It SHALL preserve backend values and SHALL NOT silently replace malformed or absent event data with prototype mocks.

#### Scenario: Valid recent events metric is accepted

- **WHEN** `GET /dashboard/summary` returns a documented `recentEvents` metric and valid item fields
- **THEN** `getDashboardSummary` returns the validated metric through `DashboardSummaryResponse`
- **AND** the Event Timeline can render the original item IDs, content, timestamps, themes, and affected assets

#### Scenario: Invalid recent events data is rejected explicitly

- **WHEN** the recent events metric or one of its required item fields has an invalid type or unsupported metric state
- **THEN** the dashboard follows its existing summary validation/error path or renders an explicit unavailable state
- **AND** it does not coerce the invalid item into a zero-count, empty mock, or fabricated event

### Requirement: Available events are presented as a compact timeline

When `recentEvents.state = "AVAILABLE"` and items are present, the dashboard SHALL render each backend-provided item in backend order with its title, description, occurred time, confidence, neutral theme context, and neutral affected-asset context. Affected assets SHALL expose readable symbols or names from the response and SHALL NOT imply market direction.

#### Scenario: Event item has themes and affected assets

- **WHEN** an available item contains one or more themes and affected assets
- **THEN** the row displays the localized event content, compact occurred-time metadata, confidence, theme labels, and neutral asset badges
- **AND** it does not add unsupported bullish, bearish, or causal labels

#### Scenario: Event item has no optional context arrays

- **WHEN** an available item contains no themes or affected assets
- **THEN** the row remains readable with its title, description, time, and confidence
- **AND** it does not render empty badge containers or placeholder symbols

### Requirement: Timeline metric states are explicit and independent

The Event Timeline SHALL render `AVAILABLE`, `EMPTY`, `DENIED`, and `ERROR` as distinct localized states. A denied or errored timeline SHALL NOT be displayed as zero events, and its state SHALL NOT hide or alter the other summary metrics.

#### Scenario: Timeline is empty

- **WHEN** `recentEvents.state = "EMPTY"` or an available metric contains no items
- **THEN** the timeline renders the localized empty state and the existing path to `/events`
- **AND** it does not display prototype event rows

#### Scenario: Timeline access is denied

- **WHEN** `recentEvents.state = "DENIED"` with a permission error code
- **THEN** the timeline renders a localized unavailable/permission state
- **AND** it does not expose the raw error enum as the primary user-facing label
- **AND** Trading Snapshot cards remain usable when their own metrics are available

#### Scenario: Timeline has an upstream error

- **WHEN** `recentEvents.state = "ERROR"` with no usable items
- **THEN** the timeline renders a localized error state
- **AND** it does not show zero or stale prototype content
- **AND** other successful summary metrics remain unchanged

### Requirement: Timeline navigation uses existing localized event routes

The timeline SHALL provide one module-level link to the localized `/events` list. Each event row SHALL be a button-backed local quick-detail trigger using the backend event ID and SHALL NOT expose a per-row canonical `href`. An ordinary pointer or keyboard activation of an available event row SHALL open the dashboard-owned event quick-detail drawer without changing the current dashboard URL. The quick-detail drawer SHALL provide the explicit action for navigating to the canonical event detail route.

#### Scenario: User opens the event list

- **WHEN** a user activates the Event Timeline header action or its empty-state action
- **THEN** the application navigates to the current-locale `/events` route

#### Scenario: User reads an event from the dashboard

- **WHEN** a user activates an available event row with a pointer click, keyboard Enter, or keyboard Space
- **THEN** the dashboard-owned quick-detail drawer opens for that row's backend event ID
- **AND** the current dashboard URL remains unchanged
- **AND** the page transition loading bar does not start for the row activation

#### Scenario: User opens the canonical event detail

- **WHEN** a user activates the drawer's full-page action
- **THEN** the application navigates to the current-locale `/events/{id}` route

### Requirement: Timeline content and time metadata are localized

All module labels, descriptions, state text, accessible names, and actions SHALL come from the `en` and `vi` dictionaries. Dynamic event title, description, theme, asset, and error-code values SHALL remain backend content. `occurredAt` SHALL use the existing locale-aware time formatter and compact icon-bearing secondary metadata treatment.

#### Scenario: Vietnamese timeline renders localized UI

- **WHEN** the active route locale is `vi`
- **THEN** the section heading, state copy, links, accessible names, and occurred-time formatting use Vietnamese localization behavior
- **AND** backend event content is displayed without machine-translating or replacing it with mock copy

#### Scenario: English timeline renders localized UI

- **WHEN** the active route locale is `en`
- **THEN** the section heading, state copy, links, accessible names, and occurred-time formatting use English localization behavior
- **AND** backend event content is displayed without replacement by prototype strings

### Requirement: Timeline loading and responsive presentation preserve accessibility

The production dashboard SHALL render a localized Event Timeline skeleton while the summary is pending. The final surface SHALL use existing Signapse UI primitives, a semantic section/card heading, keyboard-reachable buttons with visible focus, decorative icons hidden from assistive technology, and responsive rows without page-level horizontal overflow at mobile width or 200% zoom.

#### Scenario: Timeline is loading

- **WHEN** the dashboard summary request is pending
- **THEN** the loading surface preserves the Event Timeline header and representative row footprint
- **AND** it does not display mock event content as current data

#### Scenario: Timeline is viewed at narrow width or zoom

- **WHEN** the dashboard is viewed at mobile width or 200% zoom
- **THEN** event content wraps or reflows into readable rows
- **AND** the page does not require horizontal scrolling to read the timeline or activate its links
