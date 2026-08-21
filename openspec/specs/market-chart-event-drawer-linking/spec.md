# market-chart-event-drawer-linking Specification

## Purpose
Defines Market Charts annotation entry points into the shared Event inspection quick-detail policy.
## Requirements
### Requirement: Event title links from market chart annotations
The system SHALL let users open event detail from market chart annotation titles when a safe event route can be resolved, without relying on global intercepted route navigation.

#### Scenario: Annotation has event id
- **WHEN** a market chart annotation popup renders an annotation with a valid `eventId`
- **THEN** the annotation title is rendered as an action that opens local event quick detail
- **AND** the action text is the annotation title

#### Scenario: Annotation has safe event detail fallback
- **WHEN** a market chart annotation popup renders an annotation without `eventId`
- **AND** `links.eventDetail` is a safe internal event detail path
- **THEN** the annotation title can resolve the event id from that path
- **AND** the title is rendered as an action that opens local event quick detail

#### Scenario: Annotation has no safe event route
- **WHEN** a market chart annotation popup renders an annotation without a valid event route
- **THEN** the annotation title is rendered as non-interactive text

### Requirement: Event inspection navigation behavior
The system SHALL use a local Market Charts Event inspection quick-detail overlay for event title actions from market chart annotations.

#### Scenario: User opens linked event title
- **WHEN** a user activates an annotation event title from the market chart popup
- **THEN** the market chart opens a local event quick-detail drawer
- **AND** the chart route, selected asset, timeframe, loaded candles, lazy history state, and chart instance are not reset by the open action
- **AND** the local chart annotation popup is closed

#### Scenario: User closes local event detail
- **WHEN** a user closes the market chart event quick-detail drawer
- **THEN** the drawer closes without calling `router.back()`
- **AND** the chart route, selected asset, timeframe, loaded candles, lazy history state, and chart instance are not reset by the close action

#### Scenario: Drawer owns deeper event content
- **WHEN** the local event quick-detail drawer opens from a market chart annotation title
- **THEN** the shared Event inspection profile owns the bounded event facts, evidence, and related assets
- **AND** related news actions use their canonical article routes rather than nesting Article reader inside Event inspection
- **AND** the market chart popup does not add article or source-document detail links for this change

#### Scenario: Full detail escalation remains available
- **WHEN** a user needs the complete event detail page
- **THEN** the local event quick-detail drawer provides an action to open `/events/{eventId}` as the canonical full detail page

#### Scenario: Existing chart marker behavior is preserved
- **WHEN** a user clicks a red chart annotation marker
- **THEN** the chart annotation popup still opens as before
- **AND** annotation grouping, marker rendering, popup positioning, and lazy history loading remain unchanged
