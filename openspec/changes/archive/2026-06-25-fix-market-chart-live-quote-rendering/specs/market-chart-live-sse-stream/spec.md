## MODIFIED Requirements

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

### Requirement: Live status UI
The system SHALL show live stream health as compact chart workspace metadata.

#### Scenario: Connecting state
- **WHEN** the live stream is opening or reconnecting
- **THEN** the market chart workspace shows compact Vietnamese pending live status

#### Scenario: Live state
- **WHEN** the stream status is `CONNECTED` or `SUBSCRIBED`
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

## ADDED Requirements

### Requirement: Quote-derived live partial candle rendering
The system SHALL derive a display-only live partial candle from live quote events when candle events are unavailable for the active timeframe.

#### Scenario: Quote updates current candle bucket
- **WHEN** a live quote belongs to the same timeframe bucket as the latest displayed candle
- **THEN** the system derives a live partial candle that preserves the bucket open value
- **AND** updates close to the quote price
- **AND** expands high or low when the quote price exceeds the current bucket range

#### Scenario: Quote creates newer candle bucket
- **WHEN** a live quote belongs to a timeframe bucket after the latest displayed candle
- **THEN** the system derives a new live partial candle at the quote bucket time
- **AND** sets open, high, low, and close to the quote price
- **AND** leaves volume unavailable unless the quote provides finite volume

#### Scenario: Quote is older than displayed latest bucket
- **WHEN** a live quote belongs to a timeframe bucket before the latest displayed candle
- **THEN** the system does not regress the displayed latest candle

#### Scenario: Real candle event supersedes derived candle
- **WHEN** a live `candle` event arrives for the same bucket as a quote-derived live candle
- **THEN** the system displays the live candle event values instead of the quote-derived values
