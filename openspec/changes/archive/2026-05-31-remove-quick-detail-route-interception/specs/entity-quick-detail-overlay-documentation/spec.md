## MODIFIED Requirements

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

### Requirement: Documentation defines scope boundaries
The documentation SHALL define supported entity types, non-goals, and validation checks for future local quick-detail implementation proposals.

#### Scenario: Initial entity scope is clear
- **WHEN** a developer reads the documentation
- **THEN** it identifies `event` and `news-article` as entity types that may be rendered in local analytical quick detail when a workspace explicitly supports them

#### Scenario: Future implementation checks are listed
- **WHEN** the document provides rollout guidance
- **THEN** it includes checks for local open and close behavior, unchanged workspace URL, full detail escalation, focus handling, scroll containment, loading, error, and permission states

#### Scenario: Global route cleanup is verifiable
- **WHEN** a developer implements local quick detail
- **THEN** the documentation instructs them to verify that no active global `@quickDetail` slot, intercepted quick-detail route, placeholder route file, or route-level compatibility drawer remains unless a future proposal explicitly reintroduces one
