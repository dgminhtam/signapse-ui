## MODIFIED Requirements

### Requirement: Quote-derived live partial candle rendering
The system SHALL derive a display-only live partial candle from live quote events when quote data is fresher than the currently displayed candle state for the active timeframe.

#### Scenario: Quote updates current candle bucket
- **WHEN** a live quote belongs to the same timeframe bucket as the latest displayed candle
- **THEN** the system derives a live partial candle that preserves the bucket open value
- **AND** updates close to the quote price
- **AND** expands high or low when the quote price exceeds the current bucket range

#### Scenario: Quote updates existing live candle bucket
- **WHEN** a live quote belongs to the same timeframe bucket as the current displayed live partial candle
- **THEN** the system keeps the current live candle open value
- **AND** updates close to the quote price
- **AND** expands high or low when the quote price exceeds the current live candle range

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
- **THEN** the system uses the live candle event values as the base for the displayed partial candle
- **AND** later eligible quote events remain able to update that displayed partial candle
