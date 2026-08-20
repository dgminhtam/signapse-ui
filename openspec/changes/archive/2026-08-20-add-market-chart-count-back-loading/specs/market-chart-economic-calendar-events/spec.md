## MODIFIED Requirements

### Requirement: Calendar event range selection
The system SHALL request calendar events using valid half-open ranges derived from the displayed candle interval and SHALL constrain each request chunk to backend limits.

#### Scenario: Initial calendar range
- **WHEN** an initial or refreshed count-back candle request returns one or more valid candles and the Calendar layer is enabled
- **THEN** the system derives `from` from the earliest displayed candle timestamp
- **AND** it derives exclusive `to` from the end of the latest displayed candle bucket, clamped to the count-back anchor when the latest candle is partial
- **AND** it does not extend the calendar range into future time outside the displayed candle interval
- **AND** every request chunk is after `from` and no more than 366 days long

#### Scenario: Partial candle bounds the calendar range
- **WHEN** the latest displayed candle has `partial=true`
- **THEN** the system uses the retained candle flag and the count-back anchor as the interval's exclusive end
- **AND** it does not infer a later boundary from wall-clock time

#### Scenario: Lazy older calendar range
- **WHEN** the user loads an older count-back candle page and the Calendar layer is enabled
- **THEN** the system requests calendar events for that page's displayed candle interval
- **AND** any calendar request chunk is no longer than 366 days

#### Scenario: No displayed candles
- **WHEN** a count-back candle request has no displayed candle interval
- **THEN** the system does not request calendar events for that candle result

#### Scenario: Calendar layer disabled during history load
- **WHEN** the user loads older candles while the Calendar layer is disabled
- **THEN** the system does not fetch older calendar events solely for hidden marker visibility
