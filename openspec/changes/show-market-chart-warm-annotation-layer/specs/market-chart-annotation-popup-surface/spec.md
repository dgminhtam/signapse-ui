## ADDED Requirements

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
