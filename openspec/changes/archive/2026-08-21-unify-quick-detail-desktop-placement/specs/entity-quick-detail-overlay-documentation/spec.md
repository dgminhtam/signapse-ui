## MODIFIED Requirements

### Requirement: Documentation uses Signapse quick detail framing

The documentation SHALL describe the pattern as a Signapse entity quick detail overlay for approved owner surfaces, not as an ecommerce PDP or product quick-view pattern. The canonical guide SHALL use the same Quick Detail terminology in both its name and content.

#### Scenario: Ecommerce language is removed from the primary pattern

- **WHEN** the quick detail documentation is updated
- **THEN** the primary examples use Signapse concepts such as graph nodes, market-chart annotations, events, news articles, source evidence, and full detail pages

#### Scenario: Signapse use cases are explicit

- **WHEN** a developer reads the updated documentation
- **THEN** the document identifies Dashboard title actions, Graph View node detail, and Market Chart annotation reading as approved owner surfaces

### Requirement: Documentation defines profiles and host-responsive placement

The documentation SHALL define Event inspection and Article reader as the only supported quick-detail profiles, derive those profiles from entity kind, and describe the shared effective-viewport placement policy separately from owner-local state and restoration behavior.

#### Scenario: Profile terminology is unambiguous

- **WHEN** a developer reads the quick-detail policy
- **THEN** `event` maps to Event inspection and `news-article` maps to Article reader
- **AND** the document does not call Event quick detail an Inspector, which is reserved for Graph View's summary surface

#### Scenario: Placement policy is explicit

- **WHEN** a developer implements an approved owner surface
- **THEN** the documentation identifies the `1440px`-and-wider right-sheet geometry for Dashboard, Graph View, and Market Charts, the shared bottom-sheet fallback below `1440px`, and the shared mobile policy
- **AND** it states that callers do not choose arbitrary quick-detail direction or dimensions
- **AND** it preserves host-specific Graph inspector context and Market Chart fullscreen/annotation restoration behavior without treating them as separate placement policies
