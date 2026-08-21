# dashboard-event-news-quick-detail Specification

## Purpose

Define the shared quick-detail interaction and responsive presentation for Event Timeline and Latest News rows on Dashboard.
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

### Requirement: Dashboard resolves the shared quick-detail presentation responsively

Dashboard SHALL use the shared entity quick-detail resolver without allowing a row trigger to select a mode, direction, or size. At an effective CSS viewport of `1440px` or wider, Dashboard SHALL render Event inspection as a viewport-right sheet with a maximum width of `32rem` and Article reader as a viewport-right sheet with a maximum width of `44rem`; both side sheets are `100dvh`. Below `1440px`, Dashboard SHALL use the shared bottom-sheet geometry. The threshold SHALL NOT change when the sidebar is expanded or collapsed.

#### Scenario: Large Dashboard opens Event inspection

- **WHEN** a user opens an event quick detail on Dashboard at an effective CSS viewport of at least `1440px`
- **THEN** Event inspection opens as a right-side sheet with the documented maximum `32rem` width
- **AND** the sheet is not constrained by the Event Timeline grid column

#### Scenario: Large Dashboard opens Article reader

- **WHEN** a user opens a news-article quick detail on Dashboard at an effective CSS viewport of at least `1440px`
- **THEN** Article reader opens as a right-side sheet with the documented maximum `44rem` width
- **AND** the sheet is not constrained by the Latest News grid column

#### Scenario: Dashboard uses the stable bottom-sheet fallback

- **WHEN** a user opens either quick-detail entity below `1440px`
- **THEN** Dashboard uses the documented bottom-sheet geometry for that entity profile
- **AND** toggling the sidebar does not change the selected placement policy

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

The shared dashboard title trigger SHALL open local quick detail for every normal button activation, including pointer click, keyboard Enter, and keyboard Space. It SHALL NOT perform route navigation or require modifier-click, middle-click, or context-menu link behavior. Canonical full-page escalation SHALL remain an explicit sticky-header action for both entity profiles.

#### Scenario: User activates a row normally

- **WHEN** a user clicks an event or news title button, or activates it with Enter or Space
- **THEN** the trigger opens the existing drawer for that row's entity kind and ID
- **AND** the current dashboard URL remains unchanged
- **AND** no page-transition loading bar is started by the title activation

#### Scenario: User requests an Event full page

- **WHEN** a user activates the Event drawer's full-page action
- **THEN** the application navigates to the Event's canonical localized route
- **AND** the action intentionally leaves the dashboard

#### Scenario: User requests a News article full page

- **WHEN** a user activates the Article reader's full-page action
- **THEN** the application navigates to the News article's canonical localized route
- **AND** the action intentionally leaves the dashboard

### Requirement: Dashboard quick-detail triggers remain accessible

Event and news title buttons SHALL remain keyboard reachable, expose an accessible localized name, identify the dialog relationship with `aria-haspopup="dialog"`, and preserve the shared quick-detail modal's focus, Escape, loading, permission, error, and scroll behavior. Other row content SHALL remain non-interactive.

#### Scenario: User opens and closes with the keyboard

- **WHEN** a user focuses a title trigger and presses Enter, then presses Escape in the open drawer
- **THEN** the corresponding local quick-detail drawer opens and closes
- **AND** focus returns to the activating title trigger

#### Scenario: Detail loading or access fails

- **WHEN** the selected event or article is loading, missing, denied, or fails to fetch
- **THEN** the existing drawer renders its local state
- **AND** Dashboard remains mounted with its state preserved behind the modal
