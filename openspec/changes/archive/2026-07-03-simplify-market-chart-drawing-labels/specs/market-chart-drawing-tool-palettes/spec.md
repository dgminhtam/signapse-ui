## ADDED Requirements

### Requirement: Drawing overlay labels minimize chart clutter
The system SHALL render drawing overlay labels so selected drawings remain readable without duplicating chart axis and crosshair information.

#### Scenario: Fibonacci line labels omit price values
- **WHEN** the user creates or selects a Fibonacci line drawing
- **THEN** each configured Fibonacci level remains labeled with its percentage
- **AND** the label does not include the corresponding price value

#### Scenario: Fibonacci segment and extension labels keep all percentages
- **WHEN** the user creates or selects a Fibonacci segment or Fibonacci extension drawing
- **THEN** each configured Fibonacci level remains labeled with its percentage
- **AND** no configured percentage label is hidden only to reduce clutter

#### Scenario: Selected drawing anchor dates are hidden
- **WHEN** a drawing overlay is selected
- **THEN** the system does not render selected-overlay anchor date labels on the X axis
- **AND** the system does not render a selected-overlay X-axis range fill behind the chart time axis

#### Scenario: Selected drawing anchor prices are limited to price-level tools
- **WHEN** a non-price-level drawing overlay is selected
- **THEN** the system does not render selected-overlay anchor price labels on the Y axis
- **AND** the system does not render a selected-overlay Y-axis range fill across the chart plot

#### Scenario: Price-level drawings keep useful price feedback
- **WHEN** a price-line or horizontal price-level drawing overlay is selected
- **THEN** the system may render the selected price value needed to inspect that price level
- **AND** the chart remains free of selected-overlay anchor date labels

#### Scenario: Drawing text remains legible
- **WHEN** drawing overlay text is rendered on the market chart
- **THEN** the text uses a chart-readable text treatment rather than inheriting only the drawing stroke color
- **AND** the drawing line, border, fill, and point styles continue to reflect the selected drawing style
