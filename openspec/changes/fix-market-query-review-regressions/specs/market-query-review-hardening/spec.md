## ADDED Requirements

### Requirement: Market-query copy is professional Vietnamese

The system SHALL render all user-facing market-query text in readable, professional Vietnamese, without mojibake, accidental English labels, or inconsistent unaccented fallback copy except for technical names that must remain in English.

#### Scenario: Main workbench states use readable Vietnamese

- **WHEN** a user views idle, running, success, error, empty, and permission-restricted states on `/market-query`
- **THEN** visible labels, descriptions, buttons, toasts, accessibility announcements, and empty-state messages contain readable Vietnamese text

#### Scenario: Related navigation copy is readable

- **WHEN** a user opens navigation that links to `/market-query`
- **THEN** the market-query label and description are readable Vietnamese and contain no mojibake

### Requirement: Workbench starts with the query composer

The system SHALL keep the route-level Card header as the page orientation and SHALL NOT render a second hero-style page title inside the market-query workbench.

#### Scenario: First-run layout avoids duplicated orientation

- **WHEN** a user opens `/market-query` before submitting a query
- **THEN** the page shows the route title and description once, followed by the query composer as the first meaningful workbench region

### Requirement: Completed briefing has a flattened decision hierarchy

The system SHALL present completed market-query results with a clear decision hierarchy where the answer and evidence path are visually primary, while confidence, assets, limitations, key events, and reasoning are secondary supporting information.

#### Scenario: Answer and evidence outrank supporting panels

- **WHEN** a query completes successfully
- **THEN** the answer and evidence sections are easier to identify than trust metadata, key events, and reasoning

#### Scenario: Supporting sections are not equal-weight card stacks

- **WHEN** a query result includes confidence, limitations, assets, key events, and reasoning
- **THEN** those supporting sections use lighter grouping or secondary placement instead of repeating the same dominant card treatment for every section

### Requirement: Evidence traceability uses SourceDocument language

The system SHALL use SourceDocument-oriented labels and internal navigation for source artifacts in market-query evidence.

#### Scenario: Evidence row links to source document detail

- **WHEN** an evidence item has a source document artifact id and the user has source-document read permission
- **THEN** the evidence row offers an internal link to the SourceDocument detail route using SourceDocument-oriented copy

#### Scenario: Non-source evidence avoids NEWS-only assumptions

- **WHEN** an evidence item is not a NEWS-only artifact
- **THEN** the row does not label the artifact as a news article or route only through legacy news-article wording

### Requirement: Market-query component boundaries remain focused

The system SHALL keep market-query rendering split into focused local components so future UI iteration does not require editing a single large component that owns all form state, result rendering, evidence rendering, key events, and reasoning presentation.

#### Scenario: Workbench orchestration stays separate from presentational regions

- **WHEN** a developer reviews the market-query feature files
- **THEN** the main workbench component owns orchestration and delegates composer, result content, evidence, key events, reasoning, and state surfaces to local components
