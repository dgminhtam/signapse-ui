## ADDED Requirements

### Requirement: Market-query UI copy MUST be readable Vietnamese
The market-query workbench SHALL use readable, professional Vietnamese for route copy, workbench labels, prompt examples, validation errors, toast messages, evidence labels, and navigation labels that affect entry into the screen.

#### Scenario: Market-query copy renders without mojibake
- **WHEN** a user opens `/market-query`
- **THEN** visible Vietnamese text MUST NOT contain mojibake fragments such as `Ã`, `Â`, `Æ`, `Ä`, or similarly corrupted accented text
- **AND** labels, placeholders, errors, empty states, and button text MUST be professional Vietnamese

#### Scenario: Market-query navigation label is readable
- **WHEN** the market-query item appears in sidebar navigation
- **THEN** the label MUST use readable Vietnamese copy for "Truy vấn thị trường"

### Requirement: Market-query workbench MUST minimize duplicated guidance
The market-query workbench SHALL keep first-run orientation concise, and it MUST avoid repeating the same instructional content or prompt suggestions across multiple visible modules on the page.

#### Scenario: First-run page shows one primary guidance path
- **WHEN** a user opens `/market-query` before submitting any query
- **THEN** the page MUST present at most one primary guidance module for how to use the workbench
- **AND** it MUST present prompt suggestions in a single location rather than duplicating the same suggestions in separate page regions

#### Scenario: Composer is the first meaningful workbench region
- **WHEN** the route shell already shows the page title and description
- **THEN** the client workbench MUST NOT render a competing H1-style hero that repeats the same orientation purpose
- **AND** the query composer MUST appear before secondary explanation modules

#### Scenario: Completed-result view removes no-longer-useful onboarding content
- **WHEN** the workbench is rendering a completed query result
- **THEN** the page MUST remove or demote first-run instructional content that does not help interpret the current result
- **AND** any remaining helper content MUST be contextual to the current query rather than restating product-level guidance

### Requirement: Market-query resubmission MUST not leave stale results ambiguous
The market-query workbench SHALL make the currently running query explicit, and it MUST not present the previous completed briefing as if it were the active result for a newly submitted question.

#### Scenario: New query starts after an earlier result exists
- **WHEN** a user submits a valid new `question` while a previous market-query result is visible
- **THEN** the page MUST replace, mask, or otherwise clearly deactivate the previous briefing before the new response arrives
- **AND** it MUST surface loading feedback tied to the newly submitted question

#### Scenario: Running state remains actionable and clear
- **WHEN** a market-query request is in flight
- **THEN** the question input and submit control MUST remain disabled
- **AND** the workbench MUST show a pending state that identifies the query being executed rather than only a generic spinner

#### Scenario: Failed resubmission does not relabel the last successful result
- **WHEN** a new market-query submission fails after the user has already received a previous successful result
- **THEN** the workbench MUST present the failed query as the current state
- **AND** any preserved previous successful briefing MUST be clearly labeled as earlier context rather than the answer to the failed query

### Requirement: Market-query state changes MUST preserve current-query context and visibility
The market-query workbench SHALL keep the active query visible across running, success, and failure states, and it MUST communicate major state changes through in-page visibility patterns that do not depend only on transient toast feedback.

#### Scenario: Success state identifies the question it answers
- **WHEN** the workbench renders a completed market-query result
- **THEN** the page MUST show which submitted `question` the result belongs to in the visible result context

#### Scenario: Error state identifies the failed question
- **WHEN** a market-query request fails
- **THEN** the page MUST show which submitted `question` failed
- **AND** the failure message MUST be visible in-page rather than communicated only through toast feedback

#### Scenario: Result-state change is discoverable on a long page
- **WHEN** a market-query request completes or fails
- **THEN** the workbench MUST move focus, scroll position, announcement context, or another equivalent visibility aid toward the updated result or error region
- **AND** the user MUST not need to rely solely on noticing a transient toast to discover the new state

### Requirement: Market-query briefing MUST prioritize operator decision support
The market-query workbench SHALL prioritize the answer, trust signals, and supporting evidence in its primary reading path, and it MUST demote static explanations and internal-looking fallback metadata to secondary treatments.

#### Scenario: Completed result foregrounds the most decision-relevant content
- **WHEN** the workbench renders a populated `MarketQueryResponse`
- **THEN** the answer, confidence, limitations, and evidence MUST appear in the primary content hierarchy before lower-priority explanatory chrome
- **AND** the user MUST be able to scan those elements without first reading static product guidance

#### Scenario: Result sections do not all use equal visual weight
- **WHEN** a completed result contains answer, trust signals, evidence, key events, and reasoning content
- **THEN** the answer and evidence MUST have stronger primary hierarchy than lower-priority supporting sections
- **AND** the page MUST avoid rendering every result subsection as an equally prominent rounded bordered card

#### Scenario: Raw fallback metadata is not treated as primary insight
- **WHEN** the backend lacks rich labels for related events, themes, or documents
- **THEN** the workbench MUST avoid presenting raw identifiers or slug-like values as the primary headline or primary call-to-action for a result card
- **AND** any necessary fallback metadata MUST be rendered as secondary context

### Requirement: Permission-aware traceability MUST stay informative without noisy disabled actions
The market-query workbench SHALL preserve analytical context for related entities, and it MUST communicate missing drill-down permissions in a compact way instead of repeating disabled controls across each result item.

#### Scenario: Evidence remains readable without related read permissions
- **WHEN** a query result contains evidence metadata for an event or source document that the current user cannot open
- **THEN** the workbench MUST continue rendering the evidence metadata itself
- **AND** it MUST avoid rendering repetitive disabled action buttons for each inaccessible related entity

#### Scenario: Drill-down remains interactive for authorized users
- **WHEN** a query result contains related event or source-document identifiers and the user has the corresponding read permission
- **THEN** the workbench MUST provide interactive navigation to the related detail route from the relevant result item

### Requirement: Market-query evidence navigation MUST align with SourceDocument
The market-query workbench SHALL use SourceDocument-oriented labels and internal navigation for evidence documents, while still allowing compatible route plumbing if the application currently redirects legacy routes.

#### Scenario: Evidence document has an internal identifier
- **WHEN** an evidence item includes a document identifier that can be opened inside the application
- **THEN** the workbench MUST label the action as opening a source document or source material rather than a legacy news article
- **AND** it MUST avoid assuming that every evidence item is a `NEWS_ARTICLE`

#### Scenario: Evidence document cannot be opened internally
- **WHEN** an evidence item lacks an internal route or the user lacks the required read permission
- **THEN** the workbench MUST still show the evidence title, source, publish time, and available external URL when present
- **AND** it MUST explain restricted internal drill-down compactly when needed

### Requirement: Market-query workbench MUST preserve the decision path on narrower layouts
The market-query workbench SHALL keep the primary operator task legible on smaller screens, and it MUST maintain a responsive reading order that prioritizes the composer, active query context, answer, trust signals, and evidence over lower-priority supporting material.

#### Scenario: Narrow layout keeps primary content first
- **WHEN** the market-query page is viewed on a narrow viewport
- **THEN** the composer and active query context MUST remain visible before lower-priority helper or supporting sections
- **AND** the answer, confidence, limitations, and evidence MUST remain ahead of lower-priority explanatory modules in the stacked reading order

#### Scenario: Trust signals do not rely on color alone
- **WHEN** the workbench renders confidence, limitation, or permission-related status cues
- **THEN** the page MUST not rely on color alone to communicate meaning
- **AND** textual labels or equivalent non-color signals MUST remain visible in the responsive layout

### Requirement: Market-query workbench implementation MUST be locally decomposed
The market-query workbench implementation SHALL be decomposed into focused local feature components once the target layout is defined, so future UI iteration can be reviewed without touching unrelated state and rendering logic.

#### Scenario: Workbench is refactored after layout decisions
- **WHEN** the UI refinement is implemented
- **THEN** state orchestration MUST remain clear in the main workbench component
- **AND** large presentational regions such as composer, query state, briefing content, evidence list, key events, and reasoning MUST be extracted into local feature components or equivalent focused modules
