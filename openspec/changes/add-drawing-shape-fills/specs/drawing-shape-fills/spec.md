# drawing-shape-fills Specification

## Purpose

Shape drawing tools render with a semi-transparent fill so users can visually mark price zones on the chart.

## Requirements

### Requirement: Circle shape has semi-transparent fill

The system SHALL render circle drawing overlays with a semi-transparent interior fill in addition to the colored border.

#### Scenario: Draw circle
- **WHEN** the user draws a circle on the chart
- **THEN** the circle has a colored border using the drawing palette color
- **AND** the circle interior is filled with a semi-transparent version of the same color

### Requirement: Rectangle shape has semi-transparent fill

The system SHALL render rectangle drawing overlays with a semi-transparent interior fill in addition to the colored border.

#### Scenario: Draw rectangle
- **WHEN** the user draws a rectangle on the chart
- **THEN** the rectangle has a colored border using the drawing palette color
- **AND** the rectangle interior is filled with a semi-transparent version of the same color

### Requirement: Gann Box has semi-transparent fill

The system SHALL render the Gann Box outer rectangle with a semi-transparent interior fill.

#### Scenario: Draw Gann Box
- **WHEN** the user draws a Gann Box on the chart
- **THEN** the outer rectangle has a colored border and semi-transparent fill
- **AND** the inner grid lines remain as stroke-only

### Requirement: Line tools remain unchanged

The system SHALL NOT add fills to line-based drawing tools.

#### Scenario: Draw trend line
- **WHEN** the user draws any line tool (trend-line, ray, segment, arrow, fibonacci, pattern)
- **THEN** the tool renders as stroke-only without fill
