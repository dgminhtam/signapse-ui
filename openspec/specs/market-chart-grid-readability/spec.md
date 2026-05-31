# market-chart-grid-readability Specification

## Purpose
TBD - created by archiving change refine-market-chart-status-rail-and-grid. Update Purpose after archive.
## Requirements
### Requirement: Dashed chart grid
The system SHALL render market chart grid lines with a low-noise dashed style and canvas-friendly stroke sizing.

#### Scenario: Horizontal grid lines render as dashed
- **WHEN** the market chart canvas is rendered
- **THEN** horizontal grid lines use a dashed line style
- **AND** horizontal grid lines remain visible for price orientation

#### Scenario: Vertical grid lines render as dashed
- **WHEN** the market chart canvas is rendered
- **THEN** vertical grid lines use a dashed line style
- **AND** vertical grid lines remain visible for time orientation

#### Scenario: Grid lines avoid subpixel softness
- **WHEN** chart grid styles are created
- **THEN** horizontal and vertical grid line sizes use canvas-friendly whole-pixel values
- **AND** low visual emphasis is controlled through chart-local color opacity rather than subpixel stroke width

#### Scenario: Grid styling does not alter chart data behavior
- **WHEN** grid styling is changed
- **THEN** candle data, annotation data, lazy history loading, and chart interactions remain unchanged

