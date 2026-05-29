## ADDED Requirements

### Requirement: Viewport-aware chart skeleton
The system SHALL render market chart skeletons that mirror the final viewport-aware chart surface and footer structure.

#### Scenario: Chart data is loading after toolbar is mounted
- **WHEN** the selected market chart data is loading after the workbench toolbar is already visible
- **THEN** the chart-level skeleton uses the same viewport-aware chart surface sizing as the loaded chart
- **AND** the skeleton preserves the chart canvas, optional legend strip, and footer rail structure without adding unrelated placeholder blocks

#### Scenario: Page-level skeleton renders before workbench data
- **WHEN** the market chart route is suspended before workbench data is ready
- **THEN** the page-level skeleton mirrors the final toolbar and viewport-aware chart surface shape
- **AND** the skeleton does not collapse to a short fixed-height placeholder on tall viewports

#### Scenario: Annotation legend skeleton is needed
- **WHEN** the final chart state can include an annotation legend strip
- **THEN** the skeleton uses a compact shape-based cue for that strip rather than fake annotation text
