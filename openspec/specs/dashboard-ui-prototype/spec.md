## Purpose

Define the isolated, locale-aware dashboard prototype used to review the accepted Trading Intelligence Home information architecture without changing the production dashboard data flow.

## Requirements

### Requirement: Isolated prototype route

The system SHALL provide `/[lang]/dashboard-prototype` inside the protected main layout using route-local mock data, without dashboard APIs, actions, permission helpers, or backend DTOs. If the production dashboard adopts a reviewed prototype presentation, the production implementation SHALL keep its live data flow and SHALL NOT import prototype mock data or scenario controls.

#### Scenario: Prototype remains isolated
- **WHEN** a reviewer opens `/[lang]/dashboard-prototype`
- **THEN** the route uses only its route-local mock data and review scenarios
- **AND** it does not call production dashboard APIs or actions

#### Scenario: Production adopts Current Workspace presentation
- **WHEN** the production dashboard applies the prototype's Current Workspace hierarchy
- **THEN** it binds the hierarchy to production workspace and tracked-asset data
- **AND** it retains production permission and failure-state behavior
- **AND** the prototype route remains available and unchanged for isolated review

### Requirement: Prototype navigation boundary

The prototype SHALL be reachable by direct localized URL with a breadcrumb label and SHALL NOT add a sidebar item, redirect, or feature flag for the production dashboard.

#### Scenario: Direct prototype URL preserves the navigation boundary
- **WHEN** a reviewer opens `/en/dashboard-prototype`
- **THEN** the breadcrumb identifies the prototype with localized copy
- **AND** the production dashboard sidebar and route behavior remain unchanged

### Requirement: Trading Intelligence information hierarchy

The prototype SHALL render Current Workspace, Trading Snapshot, Event Timeline, Latest News, Assets in Focus, and Market Narratives. At extra-large widths it SHALL use an eight-to-four Event Timeline/Latest News relationship and a seven-to-five Assets in Focus/Market Narratives relationship, with Next Key Event receiving the strongest snapshot emphasis.

#### Scenario: Default prototype hierarchy is decision-oriented
- **WHEN** the default prototype renders at an extra-large desktop width
- **THEN** it presents all six Trading Intelligence modules
- **AND** Next Key Event receives the strongest snapshot emphasis with the specified module column relationships

### Requirement: Explicit workspace scope

Current Workspace SHALL show the active workspace name, localized scope description, update time through `AppTimeMetadata`, a neutral tracked-asset count, and every tracked asset as a readable presentational item containing full name, symbol, and asset type. It SHALL use Manage Assets terminology and preserve the hierarchy in empty/loading states without page-level overflow.

#### Scenario: Workspace scope remains readable
- **WHEN** Current Workspace renders with tracked assets
- **THEN** it shows the active workspace, scope description, update metadata, neutral count, and individually readable assets
- **AND** the Manage Assets action is used without page-level horizontal overflow

### Requirement: Separate event and article responsibilities

Event Timeline SHALL contain only route-local market events with title, description, occurred time, confidence, neutral themes, and neutral outline affected-asset badges. Latest News SHALL contain raw recent news with title, concise summary, source, and publication time, without relationship or calendar metadata.

#### Scenario: Event and article metadata stay separated
- **WHEN** the default prototype renders event and news modules
- **THEN** Event Timeline contains only event metadata and Latest News contains only raw article metadata
- **AND** neither module presents the other module's relationship or calendar fields

### Requirement: Action placement matches action scope

Module-wide links SHALL live in module headers; item-specific Market Charts links SHALL remain on asset rows. Header actions SHALL not duplicate empty or recovery actions, and loading states SHALL preserve their footprint.

#### Scenario: Actions match their scope
- **WHEN** a module renders list or item actions
- **THEN** module-wide navigation appears in its header and Market Charts remains on the affected asset row
- **AND** loading, empty, and recovery states do not duplicate actions

### Requirement: Narrative context and asset impact

Market Narratives SHALL show user-facing status, thesis, summary, neutral theme, confidence, and every affected asset without inferring unsupported bullish or bearish direction.

#### Scenario: Narrative impact remains neutral
- **WHEN** a narrative with affected assets renders
- **THEN** its status, thesis, summary, theme, confidence, and each affected asset are readable
- **AND** the presentation does not infer bullish or bearish direction

### Requirement: Decision-oriented content

The prototype SHALL expose only market-awareness content and investigation paths, not pipeline, enrichment, provider, queue, administrative telemetry, or other implementation status.

#### Scenario: Implementation telemetry is absent
- **WHEN** a reviewer scans any prototype scenario
- **THEN** the visible content uses market-awareness labels and investigation paths
- **AND** pipeline, provider, queue, and administrative telemetry are not rendered

### Requirement: Reviewable prototype scenarios

The prototype SHALL support URL-selected `default`, `loading`, `empty`, and `partial-error` scenarios. Invalid or repeated scenario values SHALL resolve deterministically to `default`; partial error SHALL leave unaffected modules useful.

#### Scenario: Scenario selection is deterministic
- **WHEN** a reviewer selects a supported, missing, repeated, or invalid `scenario` query value
- **THEN** the prototype renders the corresponding supported scenario or deterministically falls back to `default`
- **AND** unaffected modules remain useful in `partial-error`

### Requirement: Financial Command Surface conformance

The prototype SHALL reuse existing shadcn wrappers, semantic tokens, Geist typography, and Financial Command Surface chrome without adding dependencies, global CSS, semantic tokens, large charts, decorative gradients, or heavy animation.

#### Scenario: Prototype uses the existing visual system
- **WHEN** the prototype is reviewed in its supported themes
- **THEN** it uses existing wrappers, semantic tokens, and typography
- **AND** it introduces no dependency, global style, large chart, decorative gradient, or heavy animation

### Requirement: Responsive and accessible review surface

The prototype SHALL provide a semantic heading hierarchy, localized accessible names, visible keyboard focus, light/dark parity, responsive reflow, and no page-level horizontal overflow at mobile width or 200% zoom.

#### Scenario: Responsive review remains accessible
- **WHEN** the prototype is viewed on a mobile-width viewport or at 200% zoom
- **THEN** headings and accessible names remain available, focus remains visible, and content reflows without page-level horizontal overflow

### Requirement: Upstream Badge contract

The prototype SHALL use only upstream Badge variants `default`, `secondary`, `destructive`, `outline`, `ghost`, and `link`. Narrative lifecycle states SHALL map to `secondary` for emerging, `default` for active, and `secondary` for weakening. Economic Calendar impact SHALL reuse its existing helper props and labels. Contextual assets, categories, and raw news SHALL remain neutral, and no feature-specific Badge variant, raw palette class, or manual dark-mode override is allowed.

#### Scenario: Badge semantics remain upstream and neutral
- **WHEN** narrative, impact, asset, or contextual badges render
- **THEN** they use only the approved upstream variants and localized labels
- **AND** contextual assets, categories, and news do not imply unsupported market direction

### Requirement: Localized prototype copy

All reviewer-facing prototype labels, descriptions, statuses, states, controls, accessible names, and breadcrumb copy SHALL come from the application dictionaries and use existing localization formatters where values require formatting.

#### Scenario: Prototype copy follows the active locale
- **WHEN** the prototype is opened under a supported locale
- **THEN** reviewer-facing labels, statuses, controls, accessible names, and breadcrumb copy render from that locale's dictionary
