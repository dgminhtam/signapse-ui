# workspace-local-quick-detail-overlays Specification

## Purpose

Defines the shared Signapse entity quick-detail policy for approved local owner surfaces without global intercepted-route behavior.

## Requirements

### Requirement: Approved owner surfaces own local quick detail explicitly

Dashboard, Graph View, and Market Charts SHALL own entity quick detail through local state. Dashboard and Graph View SHALL support Event inspection and Article reader; Market Charts SHALL support Event inspection only. An owner SHALL mount at most one modal quick-detail overlay at a time and SHALL NOT use a generic global Drawer mode, nested quick details, or an internal quick-detail history stack. A new owner surface requires an explicit design proposal showing why preserving its background context is valuable.

#### Scenario: Dashboard opens local quick detail

- **WHEN** a user activates an available Event Timeline or Latest News title on Dashboard
- **THEN** Dashboard opens one local entity quick-detail overlay without changing the dashboard URL
- **AND** Dashboard state remains mounted behind the modal

#### Scenario: Graph View opens local quick detail

- **WHEN** a user activates a supported event or news-article action in Graph View
- **THEN** Graph View opens one local entity quick-detail overlay without resetting its route or analytical state

#### Scenario: Market Charts opens Event inspection only

- **WHEN** a user activates a supported event action in Market Charts
- **THEN** Market Charts opens one local Event inspection overlay without resetting its route or analytical state
- **AND** Market Charts does not expose an Article reader quick-detail action

#### Scenario: Closing quick detail does not navigate

- **WHEN** a user dismisses a local entity quick-detail overlay
- **THEN** its owner clears local quick-detail state
- **AND** the close action does not call `router.back()`, `router.push()`, or `router.replace()`

### Requirement: Entity kind resolves the content profile

The shared quick-detail resolver SHALL derive content profile from entity kind and placement from the effective CSS viewport plus the resolved content profile. Owner surfaces SHALL retain local state, approved-entity scope, and host-specific portal or focus restoration behavior, but SHALL NOT select arbitrary Quick Detail mode, swipe direction, or dimensions.

#### Scenario: Event resolves Event inspection

- **WHEN** the selected entity kind is `event`
- **THEN** quick detail renders the Event inspection profile
- **AND** it presents a scan surface rather than a long-form reader

#### Scenario: News article resolves Article reader

- **WHEN** the selected entity kind is `news-article`
- **THEN** quick detail renders the Article reader profile
- **AND** it presents a full, focused reading surface rather than an event-review surface

### Requirement: Placement follows the approved host and responsive geometry

The resolver SHALL use the following shared placement and geometry policy for every approved owner. The `1440px` threshold is based on effective CSS viewport and SHALL NOT change with sidebar state.

| Effective CSS viewport | Event inspection | Article reader |
| --- | --- | --- |
| Every approved owner at `1440px` or wider | viewport-right sheet, maximum `32rem`, `100dvh` | viewport-right sheet, maximum `44rem`, `100dvh` |
| Every approved owner from `768px` to below `1440px` | bottom sheet, content-fit, `max-height: min(60dvh, 36rem)` | bottom sheet, `height: min(72dvh, 48rem)` |
| Every approved owner below `768px` | bottom sheet, content-fit, maximum `90dvh` | bottom sheet, `90dvh` |

#### Scenario: Large approved owner uses a viewport side sheet

- **WHEN** Dashboard, Graph View, or Market Charts opens a supported quick detail at an effective CSS viewport of at least `1440px`
- **THEN** the sheet is anchored to the right edge of its active overlay viewport or fullscreen container
- **AND** Event inspection and Article reader use their respective side-sheet widths

#### Scenario: Shared bottom-sheet fallback ignores sidebar state

- **WHEN** any approved owner opens a supported quick detail below `1440px`
- **THEN** it uses the defined bottom-sheet geometry for that entity profile
- **AND** toggling the Dashboard sidebar does not change the selected placement policy

#### Scenario: Workbench shares the desktop reading surface

- **WHEN** Graph View or Market Charts opens quick detail at `1440px` or wider
- **THEN** it uses the same right-side sheet geometry as Dashboard
- **AND** its owner-local graph or chart context remains mounted behind the modal

#### Scenario: Responsive re-resolution preserves the reading session

- **WHEN** resize or browser zoom crosses a placement threshold while quick detail is open
- **THEN** the overlay re-resolves its placement without changing the selected entity
- **AND** it preserves modal focus and body scroll position
- **AND** it does not replay an opening animation and respects `prefers-reduced-motion`

#### Scenario: Fullscreen market chart keeps fullscreen ownership

- **WHEN** Market Charts is fullscreen and opens quick detail
- **THEN** the overlay renders in the fullscreen portal container using the resolved shared geometry
- **AND** opening quick detail does not exit fullscreen

### Requirement: Event inspection stays a bounded scan surface

Event inspection SHALL show focused event facts, status, concise description, key evidence, related assets, and canonical escalation without embedding a full detail page or long-form reader. It SHALL show no more than four evidence items and four related assets.

#### Scenario: Event inspection opens in a bottom sheet

- **WHEN** Event inspection uses a bottom-sheet placement
- **THEN** its facts, evidence, and asset cluster is centered with a maximum width of `64rem`
- **AND** it does not stretch structured cards across the full wide viewport

#### Scenario: Event evidence leads to deeper article reading

- **WHEN** a user activates a related news article from Event inspection
- **THEN** the app navigates in the same tab to that article's canonical full-detail route
- **AND** it does not replace Event inspection with a nested Article reader

### Requirement: Article reader preserves a readable full article

Article reader SHALL render complete article content in focused reading order with article title, provenance, publication metadata, optional feature image, original-source access, and canonical escalation. It SHALL not embed linked-event review, operational panels, page shell chrome, or a second full-detail action in a footer.

#### Scenario: Article prose is readable on a wide sheet

- **WHEN** Article reader has more horizontal space than its prose needs
- **THEN** Markdown prose remains constrained to a maximum measure of `72ch`
- **AND** image or media may use the available reader-panel width without causing horizontal page overflow

#### Scenario: Intrinsically wide article content is contained

- **WHEN** article Markdown contains a wide table, code block, or equivalent content
- **THEN** only that intended content surface may scroll horizontally
- **AND** the app page and overlay body do not gain unintended horizontal overflow

#### Scenario: Article provenance remains distinct from canonical escalation

- **WHEN** an article has an original source URL
- **THEN** Article reader exposes it as a secondary provenance link
- **AND** the sticky header separately exposes the canonical internal full-article action

### Requirement: Canonical detail routes remain full-page destinations

The system SHALL treat canonical event and news article detail URLs as full-page destinations outside local quick-detail state.

#### Scenario: Full detail action leaves the owner intentionally

- **WHEN** a user activates the sticky-header canonical action
- **THEN** the application navigates in the same tab to the canonical route for that entity
- **AND** the navigation intentionally leaves the local owner surface

#### Scenario: Normal detail links are not intercepted globally

- **WHEN** a user activates a normal internal link to `/events/{id}` or `/news-articles/{id}`
- **THEN** the app renders the corresponding full detail page
- **AND** no global quick-detail overlay route handles the navigation

#### Scenario: Browser Back does not reopen quick detail

- **WHEN** a user navigates back from a canonical full-detail page to its owner surface
- **THEN** the owner surface renders without automatically reopening the prior quick-detail overlay
- **AND** no quick-detail history stack is reconstructed

### Requirement: Quick detail is an accessible, single-scroll modal

Quick detail SHALL use a modal overlay with a sticky header containing a visible Close control, a localized entity-or-state accessible title, and a canonical full-detail action when the selected target is actionable. The title SHALL not include an internal profile prefix or owner/source description. The ready-state header SHALL not render a generic description that repeats the entity context. Loading, error, missing, and access-denied states SHALL continue to provide announced feedback in the body through their state-specific title, description, live-region, and busy semantics. The canonical action SHALL be available for loading, ready, and transient-error states with a known permitted target, and SHALL be absent for missing and access-denied states. The body SHALL be the only scrolling region. A sticky footer SHALL NOT duplicate the canonical action.

#### Scenario: Modal opens and closes with keyboard support

- **WHEN** a user opens quick detail from a keyboard-reachable trigger
- **THEN** focus moves to the visible Close control while the overlay announces the actual entity or state title
- **AND** the title does not include a profile prefix or generic owner/source description
- **AND** Escape closes the overlay and restores focus to the exact activating trigger

#### Scenario: Pointer and touch dismissal remain safe

- **WHEN** a user dismisses quick detail by clicking the desktop backdrop or swiping down a mobile bottom sheet
- **THEN** the overlay closes without navigation
- **AND** focus is restored safely to the activating trigger

#### Scenario: Header action follows recovery state

- **WHEN** quick detail is loading or shows a transient error for a permitted entity
- **THEN** its sticky header retains the canonical full-detail action
- **AND** the header does not expose that action for a missing or access-denied entity

#### Scenario: Ready state removes redundant header copy

- **WHEN** an authorized Event inspection or Article reader has loaded its entity
- **THEN** the sticky header title is the entity title without “Event inspection” or “Article reader” profile text
- **AND** the header contains no generic quick-detail description
- **AND** the body retains the Event description or Article reading content

#### Scenario: Non-ready state retains announced feedback

- **WHEN** quick detail is loading, missing, denied, or in a transient error state
- **THEN** the body continues to expose the state-specific title and description through its existing status, alert, busy, or recovery semantics
- **AND** removing the header description does not remove the state feedback

### Requirement: Article reader retains a focused content hierarchy

Article reader SHALL render article information in a focused single-column reading order without operational or linked-event review UI. Apart from the shared header's canonical action, it SHALL NOT add full-page shell chrome.

#### Scenario: Article reader renders focused content

- **WHEN** an authorized user opens a news article in local quick detail
- **THEN** the drawer shows the article description when available, the article-owned outlet and publication time, one original-article access control only when an original URL exists, an uncropped feature image when available, and complete article content rendered with the canonical safe Typeset Markdown behavior
- **AND** the drawer does not show processing status, linked-event cards or empty states, redundant content headings, dashboard-style content borders, page breadcrumb, list back button, or full-page shell chrome

### Requirement: Local states keep the resolved presentation stable

Loading, missing, error, and access-denied states SHALL render inside the same resolved overlay profile and placement as the target entity. They SHALL provide accessible state feedback and SHALL NOT remount a second overlay when data resolves. Each opening SHALL use one stable data snapshot, reset the body scroll position to the top, and only obtain new data through a later open or explicit retry.

#### Scenario: Content is loading

- **WHEN** quick detail is loading
- **THEN** the overlay reports a busy state with an accessible title and description
- **AND** its skeleton mirrors the resolved profile geometry and preserves a single body scroll region

#### Scenario: Original article URL is absent

- **WHEN** the selected news article has no original URL
- **THEN** the drawer does not render an empty, disabled, or unusable original-article control

#### Scenario: Optional article regions are missing
- **WHEN** the selected news article has no description or feature image
- **THEN** the drawer omits the missing region without reserving an empty labeled surface

#### Scenario: Content cannot be read

- **WHEN** the entity is missing, access is denied, or the request fails
- **THEN** the overlay renders a concise local state with clearly announced error or access feedback
- **AND** the owner surface remains mounted behind the modal

#### Scenario: Transient request failure can retry

- **WHEN** a permitted entity request fails for a reason other than missing content
- **THEN** quick detail renders a concise announced error state with Retry and Close controls
- **AND** Retry starts a new snapshot request without changing the selected entity or resolved placement

#### Scenario: Content is missing or access is denied

- **WHEN** the entity is missing or access is denied
- **THEN** the overlay renders a concise local state with clearly announced feedback and a Close control
- **AND** it does not render Retry or a canonical full-detail action
- **AND** the owner surface remains mounted behind the modal

#### Scenario: A later open starts at the beginning

- **WHEN** a user dismisses quick detail after scrolling and later opens an entity quick detail again
- **THEN** the new opening starts at the top of the body scroll region
- **AND** it creates a new snapshot request even when the entity kind and ID are unchanged

#### Scenario: Open-session content remains stable

- **WHEN** a user is reading an open Event inspection or Article reader
- **THEN** the overlay does not automatically refetch or replace its content during that open session
- **AND** a later open or explicit retry may obtain fresh data from the existing permission-aware fetch path

### Requirement: Global quick-detail route interception remains absent

The app SHALL NOT keep active global quick-detail route interception files, slots, placeholders, or route-level compatibility components.

#### Scenario: Parallel route slot is absent

- **WHEN** the protected app layout renders route content
- **THEN** it renders normal child content without a `quickDetail` parallel-route prop or slot

#### Scenario: Intercepted route tree is absent

- **WHEN** the repository is searched for active quick-detail interception routes
- **THEN** there is no active `app/[lang]/(main)/@quickDetail/**` route tree
