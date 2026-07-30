## MODIFIED Requirements

### Requirement: Existing calendar list behavior is preserved
The week stream SHALL preserve existing economic calendar list behaviors that are not replaced by week-window navigation and remain supported by the backend contract.

#### Scenario: Search and sync remain available
- **WHEN** the week stream renders
- **THEN** search and sync controls remain available with localized labels and existing permission behavior

#### Scenario: Event rows remain detail-capable
- **WHEN** an event row renders in the week stream
- **THEN** grouped day rows, market-calendar row hierarchy, localized publication status, and canonical localized detail links remain available
- **AND** supporting-content expansion is not rendered
