# market-chart-annotation-popup-interaction Specification

## Purpose
TBD - created by archiving change refine-market-chart-annotation-popups. Update Purpose after archive.
## Requirements
### Requirement: Notification-style annotation markers
The system SHALL render chart annotations as prominent notification-style event markers instead of directional trade-like arrows.

#### Scenario: Render annotation dot
- **WHEN** the annotation layer is enabled and backend annotations are available
- **THEN** the system renders each annotation time bucket as a noticeable event dot on the chart

#### Scenario: Avoid directional arrow semantics
- **WHEN** an annotation has direction `BULLISH`, `BEARISH`, `MIXED`, or `NEUTRAL`
- **THEN** the marker remains a notification-style event marker
- **AND** the marker does not use buy/sell-like arrow semantics to represent direction

#### Scenario: Grouped annotation marker
- **WHEN** multiple annotations share the same chart time bucket
- **THEN** the system renders one notification marker with compact count treatment for that bucket

### Requirement: Annotation marker emphasis
The system SHALL make annotation markers visually prominent without overwhelming the chart.

#### Scenario: Important marker emphasis
- **WHEN** a marker is selected, grouped, or represents a high-priority event
- **THEN** the system applies stronger visual emphasis such as a ring, larger marker, or pulse treatment

#### Scenario: Reduced motion
- **WHEN** the user prefers reduced motion
- **THEN** the system replaces marker pulse animation with a static emphasis treatment

#### Scenario: Preserve chart readability
- **WHEN** annotation markers are visible
- **THEN** the system keeps marker labels compact
- **AND** the system does not render long annotation titles or summaries directly over the chart canvas

### Requirement: Marker-triggered annotation popup
The system SHALL open annotation details from the selected chart marker instead of relying on a persistent right-side annotation detail panel.

#### Scenario: Click marker opens popup
- **WHEN** a user clicks an annotation marker on the chart
- **THEN** the system opens a compact annotation detail popup associated with that marker

#### Scenario: Popup shows useful event detail
- **WHEN** the popup is open
- **THEN** the system displays available direction, severity, confidence, event time, title, summary or reaction context, evidence preview, and event detail link

#### Scenario: Grouped marker popup
- **WHEN** the selected marker represents multiple annotations
- **THEN** the popup allows the user to inspect the annotations in that group

#### Scenario: Dismiss popup
- **WHEN** a user dismisses the popup or selects another marker
- **THEN** the system closes the old popup or replaces it with the newly selected marker detail

### Requirement: Responsive annotation detail fallback
The system SHALL provide a usable responsive fallback for annotation details on narrow screens.

#### Scenario: Narrow screen detail
- **WHEN** the user selects an annotation marker on a narrow screen
- **THEN** the system displays annotation detail in a mobile-suitable surface such as a sheet or below-chart detail region

#### Scenario: Prevent viewport overflow
- **WHEN** the annotation popup would overflow the chart surface or viewport
- **THEN** the system clamps, repositions, or uses the responsive fallback so the content remains usable

### Requirement: Accessible annotation inspection
The system SHALL preserve a non-canvas way to inspect annotations.

#### Scenario: Keyboard access
- **WHEN** the annotation layer is enabled and annotations are available
- **THEN** the system provides keyboard-focusable controls outside the canvas that can open the same annotation detail content

#### Scenario: Canvas marker unavailable
- **WHEN** a user cannot click or hit-test a chart marker
- **THEN** the user can still inspect annotation detail through the accessible controls

