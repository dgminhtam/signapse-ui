## ADDED Requirements

### Requirement: Permission gates follow backend metadata
Frontend permission gates for backend-backed actions SHALL use the permission keys declared by `x-signapse-auth` in `docs/api_mapping.json` as the canonical source.

#### Scenario: Event operator action uses canonical permission
- **WHEN** a user has `news-article:analyze` and opens an event action that calls a backend event enrichment or market reaction derivation endpoint
- **THEN** the frontend makes that action available without requiring `source-document:analyze`

#### Scenario: Stale permission literal is not used as the only gate
- **WHEN** a frontend action calls an endpoint whose backend metadata declares a canonical permission
- **THEN** the frontend MUST NOT gate that action only with an unrelated legacy permission literal

### Requirement: Legacy compatibility aliases are explicit
Frontend modules that temporarily accept legacy permission aliases SHALL keep the canonical backend permission first and document the alias as compatibility behavior.

#### Scenario: Compatibility alias remains available during migration
- **WHEN** a migrated feature still needs to support legacy roles during rollout
- **THEN** its permission constant includes the canonical permission first and any legacy alias after it

#### Scenario: Compatibility alias is not treated as backend contract
- **WHEN** documentation describes frontend permission behavior
- **THEN** it distinguishes canonical backend permissions from temporary frontend compatibility aliases

### Requirement: Legacy source implementation is not kept after canonical migration
After content management is migrated to canonical news outlet and news article surfaces, the frontend SHALL keep old source/source-document URLs only as redirect compatibility routes and SHALL NOT keep unused list, form, search, or API action implementations for removed backend endpoints.

#### Scenario: Old source URL redirects to canonical surface
- **WHEN** a user opens an old `/sources` or `/news-sources` URL
- **THEN** the frontend redirects the user to the equivalent `/news-outlets` URL

#### Scenario: Removed source implementation cannot be accidentally reused
- **WHEN** developers search the active frontend code for `source:create`, `source:update`, `source:delete`, or `/sources` API action usage
- **THEN** no active implementation remains outside redirect compatibility pages and documentation notes

#### Scenario: Old source-document URL redirects to canonical article surface
- **WHEN** a user opens an old `/source-documents` URL
- **THEN** the frontend redirects the user to the equivalent `/news-articles` URL
