## ADDED Requirements

### Requirement: Viewport-aware chart reading area
The system SHALL size the mounted market chart reading area from the available workspace viewport instead of using a fixed canvas height that leaves large unused vertical space.

#### Scenario: Tall desktop viewport
- **WHEN** the market chart workbench is displayed on a tall desktop viewport
- **THEN** the chart surface expands vertically to use the available workspace height
- **AND** the surface does not leave a large blank area below the chart solely because of a fixed canvas height

#### Scenario: Short desktop viewport
- **WHEN** the market chart workbench is displayed on a shorter desktop viewport
- **THEN** the chart surface keeps a usable minimum height without overflowing the app layout unexpectedly

#### Scenario: Chart container resizes
- **WHEN** the workspace size changes due to window resize, sidebar state, or full-screen state
- **THEN** the chart resizes to the current container without requiring a data reset

### Requirement: Live candle updates preserve user viewport
The system SHALL apply incoming live candle updates without resetting the chart dataset or stealing the user's visible chart range.

#### Scenario: User reviews older candles
- **WHEN** the user has panned away from the realtime edge to review older candles
- **AND** a live candle update arrives for the active asset and timeframe
- **THEN** the displayed chart data updates without calling a chart-wide data reset
- **AND** the visible historical range remains stable

#### Scenario: Live candle replaces latest bucket
- **WHEN** a live candle update has the same bucket time as the latest displayed candle
- **THEN** the latest candle is updated in place through a non-reset update path

#### Scenario: Live candle appends new bucket
- **WHEN** a live candle update has a newer bucket time than the latest displayed candle
- **THEN** the live candle is appended through a non-reset update path
- **AND** the chart does not reinitialize lazy-loaded historical candles

#### Scenario: Chart identity changes
- **WHEN** the selected asset, timeframe, workspace context, or chart reset identity changes
- **THEN** the system may reset and reload chart data for the new identity
- **AND** live updates from the previous identity no longer update the current chart
