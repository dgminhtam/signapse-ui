## MODIFIED Requirements

### Requirement: Isolated prototype route
The system SHALL provide `/[lang]/dashboard-prototype` inside the protected main layout using route-local mock data, without dashboard APIs, actions, permission helpers, or backend DTOs. If the production dashboard adopts a reviewed prototype presentation, the production implementation SHALL keep its live data flow and SHALL NOT import prototype mock data or scenario controls.

#### Scenario: Prototype remains isolated
- **WHEN** a reviewer opens `/[lang]/dashboard-prototype`
- **THEN** the route uses only its route-local mock data and review scenarios
- **AND** it does not call production dashboard APIs or actions

#### Scenario: Production adopts Current Workspace presentation
- **WHEN** the production dashboard applies the prototype's Current Workspace hierarchy
- **THEN** it binds the hierarchy to production workspace and tracked-asset data
- **AND** it retains production permission and failure-state behavior
- **AND** the prototype route remains available and unchanged for isolated review
