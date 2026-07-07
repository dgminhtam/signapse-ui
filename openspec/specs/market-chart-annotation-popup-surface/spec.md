# market-chart-annotation-popup-surface Specification

## Purpose
TBD - created by archiving change refine-market-chart-annotation-popup-surface. Update Purpose after archive.
## Requirements
### Requirement: Annotation popup is not clipped by chart frame
The system SHALL render the desktop market chart annotation popup in a layer that is not clipped by the chart canvas frame.

#### Scenario: Marker near chart edge
- **WHEN** the user opens an annotation marker near the left, right, top, or bottom edge of the chart
- **THEN** the popup remains readable and is not cut off by the chart surface overflow

#### Scenario: Chart frame remains polished
- **WHEN** the popup layer is separated from chart clipping
- **THEN** the chart canvas still preserves its rounded frame and does not bleed outside the chart surface

### Requirement: Annotation popup placement is collision-aware
The system SHALL position the desktop annotation popup near the selected marker while avoiding obvious viewport or chart-surface overflow.

#### Scenario: Marker has room to the right
- **WHEN** the selected marker has enough room to the right
- **THEN** the popup opens to the right side of the marker

#### Scenario: Marker is near the right edge
- **WHEN** the selected marker is too close to the right edge for the popup width
- **THEN** the popup flips toward the left or clamps inside the available surface

#### Scenario: Popup content is tall
- **WHEN** popup content exceeds the available chart height
- **THEN** the popup caps its height and scrolls internally instead of overflowing the chart workspace

### Requirement: Annotation popup content is a concise preview
The system SHALL present annotation popup content as a concise event preview rather than a rich evidence/detail reader, with a compact evaluated outcome summary when the primary reaction outcome is available.

#### Scenario: Popup metadata row
- **WHEN** an annotation popup opens
- **THEN** direction, confidence when present, event time, and grouped count when applicable appear together in the top metadata area

#### Scenario: Severity is hidden
- **WHEN** an annotation has severity such as `MEDIUM`
- **THEN** the popup does not render that severity badge

#### Scenario: Event body is simplified
- **WHEN** an annotation popup displays event content
- **THEN** each event shows title and summary when available

#### Scenario: Outcome section appears below summary
- **WHEN** a hot event annotation has `hotEvent.topMarketReaction.outcome`
- **THEN** the popup renders a compact outcome section below that annotation summary
- **AND** the section prioritizes realized return, alignment, actual direction, and evaluation price or time when those fields are available

#### Scenario: Outcome section is omitted when unavailable
- **WHEN** a hot event annotation has no `hotEvent.topMarketReaction` or its `outcome` is null
- **THEN** the popup does not render an outcome section or placeholder outcome copy for that annotation

#### Scenario: Rich detail content is omitted
- **WHEN** a hot event annotation includes reaction reasoning, evidence items, event detail links, or non-primary `hotEvent.marketReactions[]`
- **THEN** the popup does not render those rich detail blocks in this quick preview surface
- **AND** the compact primary outcome section remains allowed when `hotEvent.topMarketReaction.outcome` is present

### Requirement: Existing annotation access paths remain intact
The system SHALL preserve existing annotation opening and fallback behavior while simplifying the popup.

#### Scenario: Keyboard accessible controls
- **WHEN** the user opens an annotation through the accessible annotation controls outside the canvas
- **THEN** the same simplified popup or fallback detail content is shown

#### Scenario: Mobile fallback
- **WHEN** the chart is viewed on a narrow screen
- **THEN** the below-chart/mobile fallback still shows the simplified annotation preview without relying on desktop anchored placement

### Requirement: Annotation popup marker color matches selected marker
The system SHALL render the annotation popup marker dot and pulse using the same color semantics as the selected chart annotation marker.

#### Scenario: Popup opens for a positive marker
- **WHEN** the user opens a positive or bullish annotation marker
- **THEN** the popup header marker uses the positive annotation color treatment

#### Scenario: Popup opens for a negative marker
- **WHEN** the user opens a negative or bearish annotation marker
- **THEN** the popup header marker uses the negative annotation color treatment

#### Scenario: Popup opens for neutral or mixed marker
- **WHEN** the user opens a neutral or mixed annotation marker
- **THEN** the popup header marker uses the matching neutral or mixed annotation color treatment

### Requirement: Annotation popup frame and scroll containment
The system SHALL keep the annotation popup frame visually intact while allowing only the event body content to scroll when needed.

#### Scenario: Popup content exceeds available height
- **WHEN** the selected annotation group contains enough event content to exceed the available popup height
- **THEN** the popup outer frame remains rounded and uncut
- **AND** only the inner content area scrolls

#### Scenario: Popup opens near chart edge
- **WHEN** the user opens an annotation marker near the chart surface edge
- **THEN** the popup clamps or flips to remain readable inside the available surface or viewport
- **AND** the popup is not visually clipped by the chart canvas frame

#### Scenario: Popup header remains usable
- **WHEN** the popup body scrolls
- **THEN** the popup title and close action remain visible and usable

### Requirement: Annotation outcome summary is shown in reaction preview
The system SHALL display a backend-provided annotation outcome summary inside the market chart annotation popup reaction preview.

#### Scenario: Outcome summary is available
- **WHEN** an annotation reaction outcome includes a non-empty `summary`
- **THEN** the popup shows that summary inside the existing reaction block after the reaction metrics
- **AND** the summary remains visually secondary to the event title and event summary

#### Scenario: Outcome summary is missing
- **WHEN** an annotation reaction outcome has no `summary` or only whitespace
- **THEN** the popup omits the outcome summary text without rendering an empty placeholder

#### Scenario: Summary is the only reaction display field
- **WHEN** an annotation reaction outcome has a non-empty `summary` but no displayable direction, price change, or evaluation time range
- **THEN** the popup still renders the reaction block with the summary

### Requirement: Annotation popup uses shadcn-composed shell
The system SHALL render the desktop market chart annotation popup shell through shadcn Popover composition while preserving existing annotation behavior.

#### Scenario: Popup header uses Popover composition
- **WHEN** the user opens an annotation marker popup
- **THEN** the popup shared header content is rendered through `PopoverHeader`
- **AND** the popup title/count content is rendered through `PopoverTitle`
- **AND** the close action remains available in the header

#### Scenario: Popup content uses ScrollArea
- **WHEN** the selected annotation group contains enough event content to exceed the popup content height
- **THEN** the popup body scrolls through shadcn `ScrollArea`
- **AND** the header and close action remain visible while the body scrolls

#### Scenario: Annotation logic is preserved
- **WHEN** the popup composition is standardized
- **THEN** annotation grouping, group color, event count, event opening, close behavior, mobile fallback, and outcome rendering continue to behave as before

### Requirement: Hot event popup uses nested hot event data
The system SHALL preserve the current hot annotation popup behavior while sourcing event content from `hotEvent`.

#### Scenario: Render hot event popup
- **WHEN** a user opens a marker group containing one or more `HOT_EVENT` annotations
- **THEN** the popup renders event time from top-level annotation `time`
- **AND** the popup renders title, summary, predicted reaction, actual outcome, confidence, evidence, and detail link data from each annotation's `hotEvent`

#### Scenario: Hot event without top reaction
- **WHEN** a hot event annotation has no `hotEvent.topMarketReaction`
- **THEN** the popup omits the reaction preview for that event without rendering placeholder reaction copy

### Requirement: Warm episode popup overview
The system SHALL render warm episode annotations as an episode overview instead of the hot event list layout.

#### Scenario: Render warm episode summary
- **WHEN** a user opens a `WARM_EPISODE` band
- **THEN** the popup header identifies the item as a market period
- **AND** the popup shows the count of nested `warmEpisode.events[]`
- **AND** the popup body prioritizes `warmEpisode.summary`

#### Scenario: Render warm episode outcome
- **WHEN** a warm episode has `warmEpisode.outcome`
- **THEN** the popup renders an episode outcome section below the summary
- **AND** the outcome section compares predicted direction from `warmEpisode.direction` with actual direction and realized return from `warmEpisode.outcome`

#### Scenario: Warm episode without outcome
- **WHEN** a warm episode has no `warmEpisode.outcome`
- **THEN** the popup omits the episode outcome section without rendering placeholder outcome copy

### Requirement: Warm episode nested event timeline
The system SHALL show nested warm episode events as compact timeline rows.

#### Scenario: Render nested warm events
- **WHEN** a warm episode includes one or more `warmEpisode.events[]`
- **THEN** the popup renders a compact timeline section for those events
- **AND** each event row shows event time, `title || summary`, optional summary text, relation type, reaction direction, reaction horizon, and reaction confidence when available

#### Scenario: Missing nested event fields
- **WHEN** a nested warm event omits optional fields such as title, summary, relation type, reaction, or confidence
- **THEN** the popup renders the available fields without placeholder copy and without crashing

#### Scenario: Backend enum labels are localized
- **WHEN** the popup shows reaction direction, actual direction, alignment, or relation type badges
- **THEN** the popup uses frontend dictionary labels instead of displaying backend enum strings directly
