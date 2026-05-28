## ADDED Requirements

### Requirement: Drawing overlay tool palette
The system SHALL render market chart drawing overlays with a dedicated chart-tool palette that is distinct from candle direction and annotation reaction colors.

#### Scenario: Drawing overlays use tool colors
- **WHEN** a user creates a drawing object on the market chart
- **THEN** the drawing line, circle, rectangle, and point styles use chart-local drawing colors
- **AND** the drawing colors are not the same semantic red or green used for candle direction

#### Scenario: Drawing overlays remain legible in light and dark mode
- **WHEN** the market chart theme is light or dark
- **THEN** drawing overlays remain visible against the chart background and grid
- **AND** selected drawing handles use a stronger same-hue treatment than inactive drawing handles

#### Scenario: Drawing overlay strokes avoid fuzzy fractional widths
- **WHEN** drawing overlay styles are created
- **THEN** line, circle, and rectangle border sizes use crisp chart-friendly stroke values
- **AND** selected point borders use a visible selected treatment without relying on neutral gray

#### Scenario: Drawing palette remains chart-local
- **WHEN** drawing overlay colors are adjusted
- **THEN** the implementation changes only the market chart KLineChart style helper
- **AND** global shadcn theme tokens and shared UI wrappers remain unchanged
