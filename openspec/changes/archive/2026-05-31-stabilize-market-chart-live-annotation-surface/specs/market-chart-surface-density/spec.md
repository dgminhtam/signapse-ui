## ADDED Requirements

### Requirement: Chart surface prioritizes vertical reading space
The system SHALL use the available market chart workspace height for the primary chart surface without adding redundant panels or explanatory copy.

#### Scenario: Large screen chart workbench
- **WHEN** the market chart workbench is displayed on a large screen
- **THEN** the primary chart surface uses the available vertical reading space
- **AND** the workspace does not show a large unused area below the chart while the chart itself remains short

#### Scenario: Annotation legend is displayed
- **WHEN** the annotation legend is displayed below the chart
- **THEN** it remains compact and does not compete with the chart canvas

#### Scenario: Supporting metadata is displayed
- **WHEN** live status, update time, or annotation count metadata is displayed below the chart
- **THEN** it remains in the compact footer area rather than reintroducing a side summary panel or verbose description copy
