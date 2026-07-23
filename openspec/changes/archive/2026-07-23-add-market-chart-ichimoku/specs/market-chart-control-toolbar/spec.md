## ADDED Requirements

### Requirement: Market chart indicator controls expose Ichimoku
The system SHALL expose the complete classic Ichimoku indicator through the existing market chart indicator control.

#### Scenario: Indicator selector is available
- **WHEN** the market chart has usable candle data
- **THEN** the indicator selector includes an option labeled `Ichimoku`
- **AND** the option participates in the existing multiple-selection control

#### Scenario: User enables Ichimoku
- **WHEN** the user selects Ichimoku
- **THEN** Ichimoku is included in the active indicator selection
- **AND** the indicator control's active count includes Ichimoku

#### Scenario: User disables Ichimoku
- **WHEN** the user deselects an active Ichimoku indicator
- **THEN** Ichimoku is removed from the active indicator selection
- **AND** other active indicators remain selected

