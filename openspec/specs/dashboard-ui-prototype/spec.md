## Purpose

Define the isolated, locale-aware dashboard prototype used to review the accepted Trading Intelligence Home information architecture without changing the production dashboard data flow.

## Requirements

### Requirement: Isolated prototype route

The system SHALL provide `/[lang]/dashboard-prototype` inside the protected main layout using route-local mock data, without dashboard APIs, actions, permission helpers, or backend DTOs. The existing `/[lang]/dashboard` route SHALL remain unchanged.

### Requirement: Prototype navigation boundary

The prototype SHALL be reachable by direct localized URL with a breadcrumb label and SHALL NOT add a sidebar item, redirect, or feature flag for the production dashboard.

### Requirement: Trading Intelligence information hierarchy

The prototype SHALL render Current Workspace, Trading Snapshot, Event Timeline, Latest News, Assets in Focus, and Market Narratives. At extra-large widths it SHALL use an eight-to-four Event Timeline/Latest News relationship and a seven-to-five Assets in Focus/Market Narratives relationship, with Next Key Event receiving the strongest snapshot emphasis.

### Requirement: Explicit workspace scope

Current Workspace SHALL show the active workspace name, localized scope description, update time through `AppTimeMetadata`, a neutral tracked-asset count, and every tracked asset as a readable presentational item containing full name, symbol, and asset type. It SHALL use Manage Assets terminology and preserve the hierarchy in empty/loading states without page-level overflow.

### Requirement: Separate event and article responsibilities

Event Timeline SHALL contain only route-local market events with title, description, occurred time, confidence, neutral themes, and neutral outline affected-asset badges. Latest News SHALL contain raw recent news with title, concise summary, source, and publication time, without relationship or calendar metadata.

### Requirement: Action placement matches action scope

Module-wide links SHALL live in module headers; item-specific Market Charts links SHALL remain on asset rows. Header actions SHALL not duplicate empty or recovery actions, and loading states SHALL preserve their footprint.

### Requirement: Narrative context and asset impact

Market Narratives SHALL show user-facing status, thesis, summary, neutral theme, confidence, and every affected asset without inferring unsupported bullish or bearish direction.

### Requirement: Decision-oriented content

The prototype SHALL expose only market-awareness content and investigation paths, not pipeline, enrichment, provider, queue, administrative telemetry, or other implementation status.

### Requirement: Reviewable prototype scenarios

The prototype SHALL support URL-selected `default`, `loading`, `empty`, and `partial-error` scenarios. Invalid or repeated scenario values SHALL resolve deterministically to `default`; partial error SHALL leave unaffected modules useful.

### Requirement: Financial Command Surface conformance

The prototype SHALL reuse existing shadcn wrappers, semantic tokens, Geist typography, and Financial Command Surface chrome without adding dependencies, global CSS, semantic tokens, large charts, decorative gradients, or heavy animation.

### Requirement: Responsive and accessible review surface

The prototype SHALL provide a semantic heading hierarchy, localized accessible names, visible keyboard focus, light/dark parity, responsive reflow, and no page-level horizontal overflow at mobile width or 200% zoom.

### Requirement: Upstream Badge contract

The prototype SHALL use only upstream Badge variants `default`, `secondary`, `destructive`, `outline`, `ghost`, and `link`. Narrative lifecycle states SHALL map to `secondary` for emerging, `default` for active, and `secondary` for weakening. Economic Calendar impact SHALL reuse its existing helper props and labels. Contextual assets, categories, and raw news SHALL remain neutral, and no feature-specific Badge variant, raw palette class, or manual dark-mode override is allowed.

### Requirement: Localized prototype copy

All reviewer-facing prototype labels, descriptions, statuses, states, controls, accessible names, and breadcrumb copy SHALL come from the application dictionaries and use existing localization formatters where values require formatting.
