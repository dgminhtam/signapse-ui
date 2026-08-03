## MODIFIED Requirements

### Requirement: Timeline navigation uses existing localized event routes

The timeline SHALL provide one module-level link to the localized `/events` list. Each event row SHALL be a button-backed local quick-detail trigger using the backend event ID and SHALL NOT expose a per-row canonical `href`. An ordinary pointer or keyboard activation of an available event row SHALL open the dashboard-owned event quick-detail drawer without changing the current dashboard URL. The quick-detail drawer SHALL provide the explicit action for navigating to the canonical event detail route.

#### Scenario: User opens the event list

- **WHEN** a user activates the Event Timeline header action or its empty-state action
- **THEN** the application navigates to the current-locale `/events` route

#### Scenario: User reads an event from the dashboard

- **WHEN** a user activates an available event row with a pointer click, keyboard Enter, or keyboard Space
- **THEN** the dashboard-owned quick-detail drawer opens for that row's backend event ID
- **AND** the current dashboard URL remains unchanged
- **AND** the page transition loading bar does not start for the row activation

#### Scenario: User opens the canonical event detail

- **WHEN** a user activates the drawer's full-page action
- **THEN** the application navigates to the current-locale `/events/{id}` route

