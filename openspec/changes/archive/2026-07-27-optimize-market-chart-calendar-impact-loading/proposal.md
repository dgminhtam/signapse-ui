## Why

Market Charts currently requests every economic calendar impact level and filters the result in the browser, although traders usually begin with high-impact releases. Sending impact selection to the existing backend filter reduces unnecessary query and response data while preserving access to medium- and low-impact events on demand.

## What Changes

- Default the Market Charts calendar impact selection to `HIGH` only.
- Send selected impact levels through the existing `GET /market-charts/economic-calendar-events` `impact` query parameter.
- Load a newly enabled `MEDIUM` or `LOW` level on demand and merge those events into the already loaded calendar data.
- Hide disabled impact levels locally without issuing a removal request or discarding previously loaded events.
- Preserve selected impact filtering across initial loads, refreshes, calendar-layer re-enablement, and lazy history loads.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-economic-calendar-events`: Change calendar event loading from an unfiltered backend request to high-impact-by-default, server-filtered, on-demand impact loading.

## Impact

- Market chart economic calendar request type and validation.
- Authenticated market chart action query serialization.
- Market chart calendar filter state, fetch orchestration, and event merging.
- No backend, dependency, route, or response-contract changes are required.
