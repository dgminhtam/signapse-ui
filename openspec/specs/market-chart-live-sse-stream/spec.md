# market-chart-live-sse-stream Specification

## Purpose
TBD - created by archiving change integrate-market-chart-live-sse. Update Purpose after archive.
## Requirements
### Requirement: Authenticated market chart live stream
The system SHALL open an authenticated live market chart stream for the active watchlist asset and timeframe.

#### Scenario: Open stream for selected chart
- **WHEN** an authorized user has a selected watchlist asset and supported timeframe
- **THEN** the system opens `GET /market-charts/live` with `assetId` and `timeframe`
- **AND** the stream request is authenticated with a fresh Clerk bearer token

#### Scenario: Do not open provider websocket from frontend
- **WHEN** the live stream is active
- **THEN** the frontend connects only to the Signapse backend SSE endpoint
- **AND** the frontend does not open a WebSocket connection to Twelve Data or expose provider credentials

#### Scenario: Close previous stream on identity change
- **WHEN** the selected asset, timeframe, workspace context, or chart identity changes
- **THEN** the system aborts or closes the previous live stream before opening a replacement stream

#### Scenario: Close stream on unmount
- **WHEN** the market chart workbench unmounts
- **THEN** the system aborts or closes the active live stream

### Requirement: Live stream event handling
The system SHALL handle backend market chart SSE events without clearing historical chart data.

#### Scenario: Snapshot event
- **WHEN** the stream emits a `snapshot` event
- **THEN** the system stores the returned live quote, partial candle, and status when present
- **AND** the existing historical candles and annotations remain available

#### Scenario: Price event
- **WHEN** the stream emits a `price` event
- **THEN** the system updates the live quote state, latest displayed price metadata, and quote timestamp
- **AND** the system makes the quote eligible to update the displayed live partial candle for the active timeframe

#### Scenario: Candle event
- **WHEN** the stream emits a `candle` event
- **THEN** the system stores the event as the current live partial candle for the active timeframe
- **AND** the system keeps the partial candle distinguishable from completed historical candles

#### Scenario: Status event
- **WHEN** the stream emits a `status` event
- **THEN** the system updates the live stream status state without reloading the chart

#### Scenario: Error event
- **WHEN** the stream emits an `error` event
- **THEN** the system stores a non-blocking live error message
- **AND** the historical chart remains visible

#### Scenario: Invalid event payload
- **WHEN** a stream event payload is malformed or does not match the expected event schema
- **THEN** the system ignores that event or reports a non-blocking stream error
- **AND** the system does not crash the market chart workspace

### Requirement: Live partial candle rendering
The system SHALL render live partial candles as a derived view over historical candles.

#### Scenario: Update latest candle bucket
- **WHEN** a live partial candle has the same `time` as the latest displayed candle
- **THEN** the system displays the live candle values over that latest bucket

#### Scenario: Append newer partial candle
- **WHEN** a live partial candle has a `time` after the latest displayed candle
- **THEN** the system displays it as a new partial candle at the right edge of the chart

#### Scenario: Ignore stale partial candle
- **WHEN** a live partial candle has a `time` before the latest displayed candle and the chart is not viewing that older bucket
- **THEN** the system does not regress the displayed latest candle

#### Scenario: Historical refresh wins over partial data
- **WHEN** a historical candle response includes a completed candle that overlaps the live partial candle time
- **THEN** the completed historical candle replaces the overlapping live partial candle in the displayed series

### Requirement: Live status UI
The system SHALL show live stream health as compact chart workspace metadata.

#### Scenario: Connecting state
- **WHEN** the live stream is opening or reconnecting
- **THEN** the market chart workspace shows compact Vietnamese pending live status

#### Scenario: Live state
- **WHEN** the stream status is `CONNECTED` or `SUBSCRIBED`
- **THEN** the market chart workspace shows compact live status

#### Scenario: Price confirms live state
- **WHEN** the stream emits a non-stale `price` event while an older pending status is stored
- **THEN** the market chart workspace shows compact live status

#### Scenario: Stale or disconnected state
- **WHEN** the stream status is `STALE`, `DISCONNECTED`, or `UNSUBSCRIBED`
- **THEN** the market chart workspace keeps historical candles visible
- **AND** the market chart workspace shows concise Vietnamese status explaining that live data is not current

#### Scenario: Market closed state
- **WHEN** the stream status is `MARKET_CLOSED`
- **THEN** the market chart workspace keeps historical candles visible
- **AND** the market chart workspace shows a concise non-error status indicating that live updates are paused because the market is closed

#### Scenario: Error state
- **WHEN** the live stream fails or emits an error
- **THEN** the market chart workspace shows a concise non-blocking error state
- **AND** the user can continue viewing historical candles, annotations, indicators, and drawings

### Requirement: Quote-driven live candle rendering
The system SHALL keep the displayed live candle OHLC valid from live events for the active timeframe.

#### Scenario: Quote updates latest REST candle close
- **WHEN** a live quote belongs to the same timeframe bucket as the latest displayed candle
- **THEN** the system displays that candle with close updated to the quote price
- **AND** expands high or low when the quote price exceeds the existing range
- **AND** preserves the candle open, time, and volume from REST data

#### Scenario: Quote expands candle range
- **WHEN** a live quote price is above the latest REST candle high or below the latest REST candle low
- **THEN** the system expands the displayed high or low to include the quote price
- **AND** the displayed candle remains valid OHLC data

#### Scenario: Quote newer than latest REST candle bucket
- **WHEN** a live quote belongs to a timeframe bucket after the latest displayed candle
- **THEN** the system appends a partial candle with open, high, low, and close initialized to the quote price

#### Scenario: Quote older than latest REST candle bucket
- **WHEN** a live quote belongs to a timeframe bucket before the latest displayed candle
- **THEN** the system does not regress the displayed latest candle close

#### Scenario: SSE candle payload updates the partial candle
- **WHEN** a live `candle` event or `snapshot.candle` payload arrives
- **THEN** the system uses that payload as the current authoritative partial candle

### Requirement: Four-hour live quotes use four-hour buckets
The system SHALL evaluate quote-only candle updates for timeframe `4h` against fixed four-hour bucket boundaries.

#### Scenario: Quote belongs to the latest four-hour bucket
- **WHEN** a live quote and the latest REST candle belong to the same `4h` bucket
- **THEN** the displayed latest candle close is updated to the quote price
- **AND** its REST-provided open, high, low, time, and volume remain unchanged

#### Scenario: Quote belongs to a newer four-hour bucket
- **WHEN** a live quote belongs to the four-hour bucket after the latest REST candle
- **THEN** the quote does not create or update a rendered candle
- **AND** the existing REST refresh remains responsible for supplying that candle

#### Scenario: Four-hour stream identity changes
- **WHEN** the selected chart changes to or from timeframe `4h`
- **THEN** the previous stream is closed
- **AND** the replacement stream uses the active asset and timeframe
