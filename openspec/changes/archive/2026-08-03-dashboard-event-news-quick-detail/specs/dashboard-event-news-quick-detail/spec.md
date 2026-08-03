# dashboard-event-news-quick-detail Specification

## Purpose

Define the shared quick-detail interaction for Event Timeline and Latest News rows on the dashboard.

## ADDED Requirements

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

### Requirement: Event and news rows use the same anchor-backed Item interaction

Available Event Timeline and Latest News rows SHALL use an anchor-backed shadcn `Item asChild` structure and SHALL expose the entity kind and backend ID to the shared dashboard quick-detail trigger. Event rows SHALL use `/events/{id}` and news rows SHALL use `/news-articles/{id}` as their localized canonical `href` values.

#### Scenario: Event row is rendered

- **WHEN** an available event item is rendered
- **THEN** its row is an `Item asChild` whose child is a localized anchor trigger for `{ kind: "event", id }`
- **AND** the row keeps its canonical localized event `href`

#### Scenario: News row is rendered

- **WHEN** a news article is rendered
- **THEN** its row is an `Item asChild` whose child is a localized anchor trigger for `{ kind: "news-article", id }`
- **AND** the row keeps its canonical localized news-article `href`

### Requirement: Dashboard quick-detail activation preserves native link behavior

The shared dashboard trigger SHALL open local quick detail only for an ordinary primary activation. It SHALL preserve the real localized anchor behavior for keyboard focus, modifier clicks, middle-clicks, context-menu actions, and explicit canonical full-page escalation.

#### Scenario: User activates a row normally

- **WHEN** a user clicks an event or news row with the primary pointer button and no modifier key
- **THEN** the trigger prevents the immediate route navigation
- **AND** the existing drawer opens for that row's entity kind and ID
- **AND** the current dashboard URL remains unchanged

#### Scenario: User requests a full page

- **WHEN** a user uses a modifier click, middle-click, context-menu link action, or the drawer's full-page action
- **THEN** the application navigates to the row's canonical localized route
- **AND** it does not replace the action with local quick detail

### Requirement: Dashboard quick-detail triggers remain accessible

Event and news row triggers SHALL remain keyboard reachable, expose an accessible localized name, identify the dialog relationship with `aria-haspopup="dialog"`, and preserve the existing drawer's focus, Escape, loading, permission, error, and scroll behavior.

#### Scenario: User opens and closes with the keyboard

- **WHEN** a user focuses a row trigger and presses Enter, then presses Escape in the open drawer
- **THEN** the corresponding local quick-detail drawer opens and closes
- **AND** focus returns to the activating row trigger

#### Scenario: Detail loading or access fails

- **WHEN** the selected event or article is loading, missing, denied, or fails to fetch
- **THEN** the existing drawer renders its local state
- **AND** the dashboard remains mounted and usable behind the drawer
