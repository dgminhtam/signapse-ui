# entity-quick-detail-overlay-documentation Specification

## Purpose
Documents the shared Signapse entity quick-detail policy for approved local owner surfaces.
## Requirements
### Requirement: Documentation uses Signapse quick detail framing
The documentation SHALL describe the pattern as a Signapse entity quick detail overlay for approved owner surfaces, not as an ecommerce PDP or product quick-view pattern.

#### Scenario: Ecommerce language is removed from the primary pattern
- **WHEN** the quick detail documentation is updated
- **THEN** the primary examples use Signapse concepts such as graph nodes, market-chart annotations, events, news articles, source evidence, and full detail pages

#### Scenario: Signapse use cases are explicit
- **WHEN** a developer reads the updated documentation
- **THEN** the document identifies Dashboard title actions, Graph View node detail, and Market Chart annotation reading as approved owner surfaces

### Requirement: Documentation defines canonical URL behavior
The documentation SHALL state that full entity detail pages remain the canonical destination for reload, direct URL entry, copied links, hard navigation, and normal internal detail links.

#### Scenario: Local owner overlay can render quick detail
- **WHEN** a user opens an event or news article from a supported owner surface through an explicit owner-owned quick-detail action
- **THEN** the documented pattern allows that owner to render a local quick-detail overlay without changing the current route

#### Scenario: Hard navigation renders full page
- **WHEN** a user reloads, pastes, opens, or clicks a normal internal link to the same event or news article URL
- **THEN** the documented pattern expects the full detail page to render instead of a quick-detail overlay

#### Scenario: Full detail remains shareable
- **WHEN** a user needs a shareable event or news article detail URL
- **THEN** the documented pattern directs them to the canonical full detail page rather than an open local drawer state

### Requirement: Documentation recommends Signapse shell and route guidance
The documentation SHALL recommend explicit owner-surface quick-detail overlays and SHALL NOT recommend a global `app/(main)/@quickDetail` intercepted route slot as the default implementation pattern.

#### Scenario: Overlay shell follows repository primitives
- **WHEN** the documentation describes the overlay UI shell
- **THEN** it references shadcn primitives already wrapped in `@/components/ui`
- **AND** it keeps the shell choice scoped to the workspace use case

#### Scenario: Global intercepted route is not default guidance
- **WHEN** the documentation describes App Router integration
- **THEN** it states that global intercepted routes are not the default quick-detail approach in this repository
- **AND** it requires a future proposal before introducing any route-intercepted quick-detail behavior

### Requirement: Documentation separates summary surfaces from reading surfaces
The documentation SHALL distinguish lightweight local summaries from the richer quick detail reading overlay and from full detail pages.

#### Scenario: Existing graph and chart surfaces keep their purpose
- **WHEN** the document discusses graph node inspectors or market-chart annotation popups
- **THEN** it describes them as summary or decision surfaces rather than places to embed full event or article detail

#### Scenario: Quick detail has a clear escalation path
- **WHEN** the document describes quick detail content
- **THEN** it requires an obvious way to open the canonical full detail page when users need the complete workspace or actions

### Requirement: Documentation defines profiles and host-responsive placement

The documentation SHALL define Event inspection and Article reader as the only supported quick-detail profiles, derive those profiles from entity kind, and describe host/viewport placement separately from profile selection.

#### Scenario: Profile terminology is unambiguous

- **WHEN** a developer reads the quick-detail policy
- **THEN** `event` maps to Event inspection and `news-article` maps to Article reader
- **AND** the document does not call Event quick detail an Inspector, which is reserved for Graph View's summary surface

#### Scenario: Placement policy is explicit

- **WHEN** a developer implements an approved owner surface
- **THEN** the documentation identifies Dashboard's large-viewport right-sheet behavior, Dashboard's bottom-sheet fallback, Graph View and Market Charts' bottom-sheet placement, and the shared mobile policy
- **AND** it states that callers do not choose arbitrary quick-detail direction or dimensions

### Requirement: Documentation defines scope boundaries
The documentation SHALL define supported entity types, non-goals, and validation checks for future local quick-detail implementation proposals.

#### Scenario: Initial entity scope is clear
- **WHEN** a developer reads the documentation
- **THEN** it identifies `event` and `news-article` as entity types that may be rendered in local quick detail when an owner surface explicitly supports them

#### Scenario: Future implementation checks are listed
- **WHEN** the document provides rollout guidance
- **THEN** it includes checks for local open and close behavior, unchanged owner URL, full detail escalation, profile/placement resolution, focus handling, scroll containment, loading, error, permission states, responsive thresholds, zoom, and reduced motion

#### Scenario: Global route cleanup is verifiable
- **WHEN** a developer implements local quick detail
- **THEN** the documentation instructs them to verify that no active global `@quickDetail` slot, intercepted quick-detail route, placeholder route file, or route-level compatibility drawer remains unless a future proposal explicitly reintroduces one
