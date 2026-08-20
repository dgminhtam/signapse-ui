# dashboard-event-news-quick-detail Specification

## Purpose

Define the shared quick-detail interaction for Event Timeline and Latest News rows on the dashboard.
## Requirements
### Requirement: Dashboard owns one shared quick-detail drawer

The dashboard SHALL own one local quick-detail state boundary for Event Timeline and Latest News and SHALL render the existing `LocalEntityQuickDetailDrawer` from that boundary. The dashboard SHALL NOT mount a separate drawer per section or change the current dashboard URL when quick detail opens or closes.

#### Scenario: Dashboard renders both sections

- **WHEN** the dashboard renders Event Timeline and Latest News
- **THEN** both sections use the same dashboard quick-detail owner
- **AND** the owner renders at most one local entity quick-detail drawer

#### Scenario: Quick detail closes

- **WHEN** a user closes an event or news-article quick-detail drawer
- **THEN** the dashboard remains mounted at the same URL
- **AND** the selected entity state is cleared

### Requirement: Event and news rows use the same title-only button interaction

Available Event Timeline and Latest News rows SHALL use a regular shadcn `Item` container and SHALL expose the entity kind and backend ID through a native button around the visible title only. Descriptions, icons, metadata, and footers SHALL remain non-interactive. Rows SHALL NOT expose a per-row canonical detail `href`.

#### Scenario: Event row is rendered

- **WHEN** an available event item is rendered
- **THEN** its row is an `Item` whose title contains a native button trigger for `{ kind: "event", id }`
- **AND** the title button exposes its localized event-open accessible name

#### Scenario: News row is rendered

- **WHEN** a news article is rendered
- **THEN** its row is an `Item` whose title contains a native button trigger for `{ kind: "news-article", id }`
- **AND** the title button exposes its localized article-open accessible name

### Requirement: Dashboard quick-detail activation uses native button behavior

The shared dashboard title trigger SHALL open local quick detail for every normal button activation, including pointer click, keyboard Enter, and keyboard Space. It SHALL NOT perform route navigation or require modifier-click, middle-click, or context-menu link behavior. Canonical full-page escalation SHALL remain an explicit action only for entity types that provide it.

#### Scenario: User activates a row normally

- **WHEN** a user clicks an event or news title button, or activates it with Enter or Space
- **THEN** the trigger opens the existing drawer for that row's entity kind and ID
- **AND** the current dashboard URL remains unchanged
- **AND** no page-transition loading bar is started by the title activation

#### Scenario: User requests an Event full page

- **WHEN** a user activates the Event drawer's full-page action
- **THEN** the application navigates to the Event's canonical localized route
- **AND** the action intentionally leaves the dashboard

#### Scenario: User reads a News article in Quick detail
- **WHEN** a user opens a News article from a dashboard row
- **THEN** the drawer provides the focused News article reading body without a full-page action
- **AND** the current dashboard URL remains unchanged

### Requirement: Dashboard quick-detail triggers remain accessible

Event and news title buttons SHALL remain keyboard reachable, expose an accessible localized name, identify the dialog relationship with `aria-haspopup="dialog"`, and preserve the existing drawer's focus, Escape, loading, permission, error, and scroll behavior. Other row content SHALL remain non-interactive.

#### Scenario: User opens and closes with the keyboard

- **WHEN** a user focuses a title trigger and presses Enter, then presses Escape in the open drawer
- **THEN** the corresponding local quick-detail drawer opens and closes
- **AND** focus returns to the activating title trigger

#### Scenario: Detail loading or access fails

- **WHEN** the selected event or article is loading, missing, denied, or fails to fetch
- **THEN** the existing drawer renders its local state
- **AND** the dashboard remains mounted and usable behind the drawer
