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
The documentation SHALL state that full entity detail pages remain the canonical destination for reload, direct URL entry, copied links, and hard navigation.

#### Scenario: Soft navigation can render overlay
- **WHEN** a user opens an event or news article from a supported analytical workspace through client-side navigation
- **THEN** the documented pattern allows the same canonical URL to render as a quick detail overlay above the current workspace

#### Scenario: Hard navigation renders full page
- **WHEN** a user reloads, pastes, or opens the same event or news article URL directly
- **THEN** the documented pattern expects the full detail page to render instead of the overlay

### Requirement: Documentation recommends Signapse shell and route guidance
The documentation SHALL recommend a right-side shadcn `Sheet` quick detail shell and a future `app/(main)/@quickDetail` parallel route slot for shared implementation guidance.

#### Scenario: Overlay shell follows repository primitives
- **WHEN** the documentation describes the overlay UI shell
- **THEN** it references `@/components/ui/sheet` as the recommended primitive and does not instruct developers to use `@workspace/ui` or install Drawer as part of this documentation change

#### Scenario: Route shape is future guidance
- **WHEN** the documentation describes a possible App Router structure
- **THEN** it clearly marks route files, intercepted routes, shared detail components, and overlay components as future implementation scope rather than work performed by this change

### Requirement: Documentation separates summary surfaces from reading surfaces
The documentation SHALL distinguish lightweight local summaries from the richer quick detail reading overlay and from full detail pages.

#### Scenario: Existing graph and chart surfaces keep their purpose
- **WHEN** the document discusses graph node inspectors or market-chart annotation popups
- **THEN** it describes them as summary or decision surfaces rather than places to embed full event or article detail

#### Scenario: Quick detail has a clear escalation path
- **WHEN** the document describes quick detail content
- **THEN** it requires an obvious way to open the canonical full detail page when users need the complete workspace or actions

### Requirement: Documentation defines scope boundaries
The documentation SHALL define supported initial entity types, non-goals, and validation checks for future implementation proposals.

#### Scenario: Initial entity scope is clear
- **WHEN** a developer reads the documentation
- **THEN** it identifies `event` and `news-article` as the initial supported entities and treats other entities as future scope

#### Scenario: Future implementation checks are listed
- **WHEN** the document provides rollout guidance
- **THEN** it includes checks for soft navigation, direct navigation, reload, copied URL, Back/Forward behavior, focus handling, scroll containment, loading, error, and permission states

