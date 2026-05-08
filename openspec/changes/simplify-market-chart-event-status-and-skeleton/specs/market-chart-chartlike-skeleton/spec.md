## ADDED Requirements

### Requirement: Chart-like loading skeleton
The system SHALL render market chart loading skeletons that resemble the final chart surface rather than generic content blocks.

#### Scenario: Chart data is loading after workbench mount
- **WHEN** candle data is loading in the mounted market chart workbench
- **THEN** the chart-level skeleton displays a chart-like surface
- **AND** the skeleton includes a compact legend-row cue
- **AND** the skeleton includes a main plot-area cue
- **AND** the skeleton includes a lower volume or indicator pane cue
- **AND** the mounted toolbar remains visible

#### Scenario: Page-level market chart skeleton renders
- **WHEN** the market chart route is suspended while server-side data is loading
- **THEN** the page-level skeleton displays the current cardless toolbar placeholder
- **AND** the page-level skeleton displays a chart-like surface placeholder
- **AND** the page-level skeleton does not show the removed right-side summary rail

#### Scenario: Annotation rail skeleton is needed
- **WHEN** the final loading state can include an annotation status rail
- **THEN** the skeleton uses a compact status-rail cue rather than milestone action placeholders

#### Scenario: Skeleton avoids fake chart copy
- **WHEN** a market chart skeleton is rendered
- **THEN** it does not render fake symbol, timeframe, update-time, or event milestone labels inside the chart body
- **AND** it remains shape-based and low-emphasis
