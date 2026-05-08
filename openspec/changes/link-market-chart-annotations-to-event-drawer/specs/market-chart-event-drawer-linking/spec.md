## ADDED Requirements

### Requirement: Event title links from market chart annotations
The system SHALL link market chart annotation event titles to event detail when a safe event route can be resolved.

#### Scenario: Annotation has event id
- **WHEN** a market chart annotation popup renders an annotation with a valid `eventId`
- **THEN** the annotation title is rendered as an internal link to `/events/{eventId}`
- **AND** the link text is the annotation title

#### Scenario: Annotation has safe event detail fallback
- **WHEN** a market chart annotation popup renders an annotation without `eventId`
- **AND** `links.eventDetail` is a safe internal event detail path
- **THEN** the annotation title is rendered as an internal link to that event detail path

#### Scenario: Annotation has no safe event route
- **WHEN** a market chart annotation popup renders an annotation without a valid event route
- **THEN** the annotation title is rendered as non-interactive text

### Requirement: Event drawer navigation behavior
The system SHALL use the existing event quick-detail drawer flow for event title navigation from market chart annotations.

#### Scenario: User clicks linked event title
- **WHEN** a user clicks a linked annotation event title from the market chart popup
- **THEN** the app navigates to the event detail route using client-side routing
- **AND** the existing `@quickDetail` event drawer can render the event detail in the current workspace context
- **AND** the local chart annotation popup is closed

#### Scenario: Drawer owns deeper event content
- **WHEN** the event quick-detail drawer opens from a market chart annotation title
- **THEN** deeper event content, related articles, and evidence remain owned by the event detail drawer
- **AND** the market chart popup does not add article or source-document detail links for this change

#### Scenario: Existing chart marker behavior is preserved
- **WHEN** a user clicks a red chart annotation marker
- **THEN** the chart annotation popup still opens as before
- **AND** annotation grouping, marker rendering, popup positioning, and lazy history loading remain unchanged
