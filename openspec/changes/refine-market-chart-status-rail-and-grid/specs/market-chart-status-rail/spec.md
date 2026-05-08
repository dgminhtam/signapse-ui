## ADDED Requirements

### Requirement: Always-present chart status rail
The system SHALL render a compact bottom status rail as part of the market chart surface.

#### Scenario: Event layer is disabled
- **WHEN** the market chart event switch is off
- **THEN** the bottom chart status rail remains visible
- **AND** event milestone text is not displayed

#### Scenario: Event groups are loading
- **WHEN** the market chart event switch is on
- **AND** annotation groups are loading
- **THEN** the bottom chart status rail displays `Đang tải sự kiện`

#### Scenario: Event groups are available
- **WHEN** the market chart event switch is on
- **AND** one or more annotation groups are available
- **THEN** the bottom chart status rail displays `N mốc sự kiện`

#### Scenario: No event groups are available
- **WHEN** the market chart event switch is on
- **AND** no annotation groups are available
- **THEN** the bottom chart status rail displays `Chưa có sự kiện trong khoảng hiện tại.`
- **AND** the bottom chart status rail does not display `0 mốc sự kiện`

### Requirement: Chart update metadata placement
The system SHALL display chart update metadata in the bottom chart status rail instead of the toolbar.

#### Scenario: Candle data has update time
- **WHEN** the current market chart data has a valid `to` timestamp
- **THEN** the bottom chart status rail displays `Cập nhật HH:mm dd/MM/yyyy`
- **AND** the update metadata is aligned in the trailing side of the rail

#### Scenario: Candle data has no update time
- **WHEN** the current market chart data does not have a valid `to` timestamp
- **THEN** the bottom chart status rail omits the update metadata text

#### Scenario: Toolbar renders market chart controls
- **WHEN** the market chart toolbar is rendered
- **THEN** it does not render the `Cập nhật HH:mm dd/MM/yyyy` metadata label

### Requirement: Status rail skeleton parity
The system SHALL render market chart loading skeletons that reserve the always-present status rail.

#### Scenario: Page-level market chart skeleton renders
- **WHEN** the market chart route is suspended while server-side data is loading
- **THEN** the page-level chart skeleton includes a bottom status rail cue
- **AND** the toolbar skeleton does not include an update-time placeholder

#### Scenario: Mounted chart data is loading
- **WHEN** candle data is loading after the market chart workbench is mounted
- **THEN** the chart body displays the embedded chart-like skeleton
- **AND** the bottom status rail remains represented exactly once

#### Scenario: Skeleton reflects rail layout
- **WHEN** a market chart skeleton includes a status rail cue
- **THEN** the cue represents a leading event-status area and a trailing update-time area
