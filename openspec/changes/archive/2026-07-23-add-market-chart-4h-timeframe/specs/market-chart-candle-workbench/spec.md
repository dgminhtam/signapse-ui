## ADDED Requirements

### Requirement: Market chart supports four-hour selection and candle requests
The system SHALL expose backend timeframe `4h` through the existing market chart selection, URL, localization, and candle request flow.

#### Scenario: User selects four-hour timeframe
- **WHEN** the market chart timeframe control is available
- **THEN** it includes `4H` after `1H` and before `1D`
- **AND** its accessible label is `4 giờ` in Vietnamese and `4 hours` in English

#### Scenario: Four-hour timeframe is stored in the URL
- **WHEN** the user selects `4H`
- **THEN** the route stores `timeframe=4h`
- **AND** the value is accepted as a supported timeframe rather than replaced with the default

#### Scenario: Initial four-hour candles are requested
- **WHEN** the workbench loads or refreshes a valid `4h` selection
- **THEN** it requests candles with backend timeframe `4h`
- **AND** the initial request uses a rolling 30-day lookback ending at the current request time

#### Scenario: Four-hour candle response is parsed
- **WHEN** the backend returns a valid candle response with timeframe `4h`
- **THEN** frontend runtime validation accepts the response
- **AND** the workbench renders it through the existing successful chart state
