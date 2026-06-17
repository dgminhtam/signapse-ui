# ai-assistant-market-analysis-parts Specification

## Purpose
TBD - created by archiving change add-ai-assistant-market-analysis-parts. Update Purpose after archive.
## Requirements
### Requirement: Analysis messages use structured Assistant UI content
The system SHALL represent persisted market-analysis references as named Assistant UI data message parts while preserving the assistant answer as normal text content.

#### Scenario: Completed analysis message is converted
- **WHEN** a backend assistant message has kind `ANALYSIS`, status `COMPLETED`, and a valid `analysisId`
- **THEN** the runtime message contains the answer text and a named `market-analysis` data part referencing that persisted analysis

#### Scenario: Plain text message is converted
- **WHEN** a backend message has kind `TEXT`
- **THEN** the runtime message contains its supported text content without a market-analysis data part

#### Scenario: Analysis message has no artifact identifier
- **WHEN** an analysis message does not have a valid `analysisId`
- **THEN** the system preserves its text and status presentation without attempting to load a structured analysis

### Requirement: Persisted analysis details load on demand
The system SHALL load structured market analysis only after the user requests its disclosure and SHALL reuse a loaded result within the active conversation session.

#### Scenario: User expands an unloaded analysis
- **WHEN** the user expands a completed analysis part that is not cached
- **THEN** the system requests `/market-analyses/{analysisId}` through the existing authenticated action and renders a localized loading state without hiding the answer text

#### Scenario: User reopens a loaded analysis
- **WHEN** the user closes and reopens an analysis that is already cached
- **THEN** the system renders the cached analysis without sending another request

#### Scenario: Analysis loading fails
- **WHEN** the persisted analysis request fails
- **THEN** the system preserves the assistant answer and renders a localized inline failure with a retry action inside the analysis part

#### Scenario: User retries a failed analysis
- **WHEN** the user activates retry for a failed analysis load
- **THEN** the system requests that analysis again and replaces the failure state only if the result still belongs to the active workspace and conversation

### Requirement: Analysis state respects conversation boundaries
The system SHALL prevent analysis state or asynchronous results from leaking across workspace and conversation boundaries.

#### Scenario: Workspace changes during analysis loading
- **WHEN** an analysis request completes after the active workspace has changed
- **THEN** the system ignores the result and does not expose it in the new workspace

#### Scenario: Conversation changes during analysis loading
- **WHEN** an analysis request completes after another conversation or a new-conversation draft becomes active
- **THEN** the system ignores the stale result for the active thread

#### Scenario: Active conversation changes
- **WHEN** the user selects another conversation or starts a new conversation
- **THEN** the system collapses analysis disclosures and clears conversation-scoped analysis loading or failure state

### Requirement: Compact analysis disclosure prioritizes decision context
The system SHALL present persisted analysis in a compact disclosure that keeps the answer primary and exposes only decision-relevant structured fields.

#### Scenario: Completed analysis is expanded
- **WHEN** a persisted analysis loads successfully and its disclosure is expanded
- **THEN** the system presents available confidence, model identity, assets considered, limitations, key events, and key narratives using bounded readable summaries

#### Scenario: Analysis contains empty optional sections
- **WHEN** an analysis field has no useful values
- **THEN** the system omits that section unless its absence is necessary to understand analysis quality

#### Scenario: Analysis contains structured objects
- **WHEN** key events or key narratives contain object data
- **THEN** the system renders selected readable labels and summaries rather than raw JSON

#### Scenario: Persisted reasoning is available
- **WHEN** the analysis response contains `reasoningChain`
- **THEN** the system does not present it as raw chain-of-thought or as the assistant's live internal reasoning

### Requirement: Analysis disclosure is localized and accessible
The system SHALL provide localized English and Vietnamese analysis states and keyboard-accessible disclosure controls.

#### Scenario: User toggles analysis details
- **WHEN** the user activates the analysis disclosure with a keyboard or pointer
- **THEN** the control updates `aria-expanded`, retains visible focus treatment, and associates the control with the expanded content

#### Scenario: Analysis state is rendered
- **WHEN** analysis availability, loading, loaded, unavailable, failure, retry, or empty-section state is shown
- **THEN** all user-facing and accessible copy comes from the active locale dictionary

### Requirement: Full analysis workbench controls remain excluded
The system SHALL keep the analysis message part focused on compact persisted analysis and SHALL NOT restore full conversation workbench controls within the assistant modal.

#### Scenario: Compact analysis is rendered
- **WHEN** an analysis disclosure is displayed
- **THEN** evidence browsing, Telegram delivery, analysis editing, regeneration, tool approval, and removed canonical-route actions are absent

