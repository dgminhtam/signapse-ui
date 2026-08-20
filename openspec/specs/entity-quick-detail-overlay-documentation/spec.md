# entity-quick-detail-overlay-documentation Specification

## Purpose
TBD - created by archiving change document-signapse-quick-detail-overlay-pattern. Update Purpose after archive.
## Requirements
### Requirement: Documentation uses Signapse quick detail framing
The documentation SHALL describe the pattern as a Signapse entity quick detail overlay for analytical workspaces, not as an ecommerce PDP or product quick-view pattern.

#### Scenario: Ecommerce language is removed from the primary pattern
- **WHEN** the quick detail documentation is updated
- **THEN** the primary examples use Signapse concepts such as graph nodes, market-chart annotations, events, news articles, source evidence, and full detail pages

#### Scenario: Signapse use cases are explicit
- **WHEN** a developer reads the updated documentation
- **THEN** the document identifies Graph View node detail and Market Chart annotation reading as the initial motivating surfaces

### Requirement: Documentation defines canonical URL behavior
The documentation SHALL state that full entity detail pages remain the canonical destination for reload, direct URL entry, copied links, hard navigation, and normal internal detail links.

#### Scenario: Local workspace overlay can render quick detail
- **WHEN** a user opens an event or news article from a supported analytical workspace through an explicit workspace-owned quick-detail action
- **THEN** the documented pattern allows the workspace to render a local quick-detail overlay without changing the current route

#### Scenario: Hard navigation renders full page
- **WHEN** a user reloads, pastes, opens, or clicks a normal internal link to the same event or news article URL
- **THEN** the documented pattern expects the full detail page to render instead of a quick-detail overlay

#### Scenario: Full detail remains shareable
- **WHEN** a user needs a shareable event or news article detail URL
- **THEN** the documented pattern directs them to the canonical full detail page rather than an open local drawer state

### Requirement: Documentation recommends Signapse shell and route guidance
The documentation SHALL recommend explicit workspace-owned quick-detail overlays and SHALL NOT recommend a global `app/(main)/@quickDetail` intercepted route slot as the default implementation pattern.

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

#### Scenario: Quick detail has entity-appropriate escalation guidance
- **WHEN** the document describes quick detail content
- **THEN** it requires an obvious way to open the canonical full detail page when users need the complete workspace or actions for entity types that expose escalation
- **AND** it documents that News article Quick detail intentionally omits a canonical-detail action while retaining canonical-route behavior outside the drawer

### Requirement: Documentation defines scope boundaries
The documentation SHALL define supported entity types, non-goals, and validation checks for future local quick-detail implementation proposals.

#### Scenario: Initial entity scope is clear
- **WHEN** a developer reads the documentation
- **THEN** it identifies `event` and `news-article` as entity types that may be rendered in local analytical quick detail when a workspace explicitly supports them

#### Scenario: Future implementation checks are listed
- **WHEN** the document provides rollout guidance
- **THEN** it includes checks for local open and close behavior, unchanged workspace URL, entity-appropriate full detail escalation or its documented absence, focus handling, scroll containment, loading, error, and permission states

#### Scenario: Global route cleanup is verifiable
- **WHEN** a developer implements local quick detail
- **THEN** the documentation instructs them to verify that no active global `@quickDetail` slot, intercepted quick-detail route, placeholder route file, or route-level compatibility drawer remains unless a future proposal explicitly reintroduces one
