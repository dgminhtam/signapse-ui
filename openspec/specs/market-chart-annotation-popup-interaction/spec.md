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

### Requirement: Outcome range hover highlight
The system SHALL show a transient chart time-range highlight when users inspect an annotation outcome from the popup.

#### Scenario: Hover reaction section with complete outcome range
- **WHEN** a popup reaction section has both `outcome.anchorTime` and `outcome.evaluationTime`
- **AND** the user hovers or focuses that reaction section
- **THEN** the chart shows a non-interactive highlight band covering the corresponding time range on the candle pane

#### Scenario: Missing outcome range
- **WHEN** a popup reaction section is missing `outcome.anchorTime` or `outcome.evaluationTime`
- **THEN** hovering or focusing that reaction section does not show a chart range highlight

#### Scenario: Hover leaves reaction section
- **WHEN** the user stops hovering or focusing the reaction section
- **THEN** the chart range highlight is cleared

#### Scenario: Popup closes
- **WHEN** the annotation popup closes while a range highlight is visible
- **THEN** the chart range highlight is cleared

#### Scenario: Chart viewport changes
- **WHEN** the chart scrolls, zooms, resizes, or its visible range changes while a range highlight is active
- **THEN** the range highlight remains aligned to the current candle pane coordinates

#### Scenario: Range is outside the visible pane
- **WHEN** the hovered outcome range is partially visible in the current chart viewport
- **THEN** the visible portion of the highlight is clamped to the candle pane bounds
- **AND** the highlight is omitted when no part of the range can be mapped to visible finite chart coordinates

#### Scenario: Highlight remains visual-only
- **WHEN** an outcome range highlight is shown
- **THEN** it does not intercept chart pointer interactions
- **AND** it is not created as a persisted drawing or selectable klinecharts overlay

