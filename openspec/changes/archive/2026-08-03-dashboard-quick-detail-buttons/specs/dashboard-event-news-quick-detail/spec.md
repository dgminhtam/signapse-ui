## RENAMED Requirements

- FROM: Event and news rows use the same anchor-backed Item interaction
  TO: Event and news rows use the same button-backed Item interaction
- FROM: Dashboard quick-detail activation preserves native link behavior
  TO: Dashboard quick-detail activation uses native button behavior

## MODIFIED Requirements

### Requirement: Event and news rows use the same button-backed Item interaction

Available Event Timeline and Latest News rows SHALL use a button-backed shadcn `Item asChild` structure and SHALL expose the entity kind and backend ID to the shared dashboard quick-detail trigger. Rows SHALL NOT expose a per-row canonical detail `href`.

#### Scenario: Event row is rendered

- **WHEN** an available event item is rendered
- **THEN** its row is an `Item asChild` whose child is a native button trigger for `{ kind: "event", id }`
- **AND** the row exposes its localized event-open accessible name

#### Scenario: News row is rendered

- **WHEN** a news article is rendered
- **THEN** its row is an `Item asChild` whose child is a native button trigger for `{ kind: "news-article", id }`
- **AND** the row exposes its localized article-open accessible name

### Requirement: Dashboard quick-detail activation uses native button behavior

The shared dashboard trigger SHALL open local quick detail for every normal button activation, including pointer click, keyboard Enter, and keyboard Space. It SHALL NOT perform route navigation or require modifier-click, middle-click, or context-menu link behavior. Canonical full-page escalation SHALL remain an explicit action inside the drawer.

#### Scenario: User activates a row normally

- **WHEN** a user clicks an event or news row, or activates it with Enter or Space
- **THEN** the trigger opens the existing drawer for that row's entity kind and ID
- **AND** the current dashboard URL remains unchanged
- **AND** no page-transition loading bar is started by the row activation

#### Scenario: User requests a full page

- **WHEN** a user activates the drawer's full-page action
- **THEN** the application navigates to the entity's canonical localized route
- **AND** the action intentionally leaves the dashboard

