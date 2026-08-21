## MODIFIED Requirements

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
