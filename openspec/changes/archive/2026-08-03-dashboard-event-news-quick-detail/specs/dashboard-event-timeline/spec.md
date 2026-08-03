# dashboard-event-timeline Specification Delta

## MODIFIED Requirements

### Requirement: Timeline navigation uses existing localized event routes

The timeline SHALL provide one module-level link to the localized `/events` list and SHALL retain a localized `/events/{id}` canonical `href` on each event row using the backend event ID. An ordinary primary activation of an available event row SHALL open the dashboard-owned event quick-detail drawer without changing the current dashboard URL. The quick-detail drawer SHALL provide the explicit action for navigating to the canonical event detail route.

#### Scenario: User opens the event list

- **WHEN** a user activates the Event Timeline header action or its empty-state action
- **THEN** the application navigates to the current-locale `/events` route

#### Scenario: User reads an event from the dashboard

- **WHEN** a user activates an available event row with an ordinary primary click or keyboard Enter
- **THEN** the dashboard-owned quick-detail drawer opens for that row's backend event ID
- **AND** the current dashboard URL remains unchanged

#### Scenario: User opens the canonical event detail

- **WHEN** a user activates the event row with a modifier click, middle-click, context-menu link action, or the drawer's full-page action
- **THEN** the application navigates to the current-locale `/events/{id}` route
