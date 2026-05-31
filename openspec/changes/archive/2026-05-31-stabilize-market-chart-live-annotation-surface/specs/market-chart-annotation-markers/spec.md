## ADDED Requirements

### Requirement: Annotation color semantics are shared
The system SHALL use one annotation color mapping for chart markers, popup marker affordances, and marker legends.

#### Scenario: Positive annotation is shown
- **WHEN** an annotation represents a positive or bullish market reaction
- **THEN** the chart marker, popup dot or pulse, and legend item use the same positive color treatment

#### Scenario: Negative annotation is shown
- **WHEN** an annotation represents a negative or bearish market reaction
- **THEN** the chart marker, popup dot or pulse, and legend item use the same negative color treatment

#### Scenario: Neutral annotation is shown
- **WHEN** an annotation represents a neutral market reaction
- **THEN** the chart marker, popup dot or pulse, and legend item use the same neutral color treatment

#### Scenario: Mixed annotation is shown
- **WHEN** an annotation represents a mixed market reaction
- **THEN** the chart marker, popup dot or pulse, and legend item use the same mixed color treatment

### Requirement: Annotation legend
The system SHALL provide a compact legend for annotation marker colors below the chart canvas and above the chart footer when marker colors are visible.

#### Scenario: Annotation layer has visible markers
- **WHEN** the annotation layer is enabled and the chart has visible annotation markers
- **THEN** the workbench displays a compact legend explaining positive, negative, neutral, and mixed marker colors

#### Scenario: Annotation layer is disabled
- **WHEN** the annotation layer is disabled
- **THEN** the workbench does not display annotation legend copy

#### Scenario: Annotation layer has no events
- **WHEN** the annotation layer is enabled but no annotations are available in the current loaded range
- **THEN** the workbench keeps the existing concise empty annotation footer state
- **AND** the workbench does not display an unnecessary color legend
