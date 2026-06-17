# public-landing-page Specification

## Purpose
TBD - created by archiving change revise-public-landing-content-v2. Update Purpose after archive.
## Requirements
### Requirement: Landing page V2 product story
The public landing page SHALL present Signapse around Chart Annotation, Market Query, and Knowledge Graph as the primary product pillars.

#### Scenario: Product pillars render
- **WHEN** a user reviews the main product sections on `/vi` or `/en`
- **THEN** the landing page presents Chart Annotation, Market Query, and Knowledge Graph as the three primary pillars
- **AND** the page does not rely on small feature cards as the primary product explanation

### Requirement: Landing page V2 hero visual
The landing hero SHALL show a product-accurate mock workspace centered on market context rather than generic finance or AI imagery.

#### Scenario: Hero visual communicates product surfaces
- **WHEN** a user views the first viewport
- **THEN** the visual includes a watchlist or workspace rail, an asset chart with event annotation, a scoped market query answer, and a knowledge graph preview
- **AND** it does not show trade entries, stop-loss, take-profit, guaranteed forecast, or performance-return UI

### Requirement: Landing page V2 intelligence flow
The landing page SHALL explain how raw market signals become structured knowledge and personalized market intelligence.

#### Scenario: Data pipeline renders
- **WHEN** a user reaches the data pipeline section
- **THEN** the page shows market inputs flowing into event intelligence, reactions, narratives, evidence, and personalized workspace surfaces

#### Scenario: Workspace personalization renders
- **WHEN** a user reaches the personalization section
- **THEN** the page explains that market knowledge is shared while the experience is personalized by workspace and watchlist scope

### Requirement: Landing page V2 trust guardrails
The landing page SHALL keep market intelligence claims analysis-focused and evidence-centered.

#### Scenario: Trust copy avoids trading claims
- **WHEN** landing copy describes Signapse AI or market interpretation
- **THEN** the copy states or implies analysis support based on evidence
- **AND** it does not claim trade signals, entry/stop-loss/take-profit, guaranteed prediction, autonomous trading, or buy/sell advice

### Requirement: Public localized landing page
The system SHALL render a public Signapse landing page at each supported locale root without the protected dashboard shell.

#### Scenario: Vietnamese landing route
- **WHEN** a user opens `/vi`
- **THEN** the system renders the Vietnamese public landing page
- **AND** the protected dashboard sidebar shell is not rendered

#### Scenario: English landing route
- **WHEN** a user opens `/en`
- **THEN** the system renders the English public landing page
- **AND** the protected dashboard sidebar shell is not rendered

### Requirement: Landing page positioning
The landing page SHALL position Signapse as an AI Market Intelligence Workspace for market-focused external users.

#### Scenario: Product thesis is visible
- **WHEN** a user reads the landing hero and primary product sections
- **THEN** the page communicates that Signapse helps users understand market events, reactions, narratives, evidence, workspaces, and watchlists
- **AND** the page does not describe Signapse as an internal admin console

#### Scenario: Claims stay analysis-focused
- **WHEN** landing page copy describes AI behavior or market interpretation
- **THEN** the copy presents Signapse as evidence-based analysis support
- **AND** it does not claim guaranteed predictions, trading advice, signal generation, or automated trade execution

### Requirement: Landing page CTA states
The landing page SHALL expose CTA destinations that match public and authenticated user states.

#### Scenario: Public user sees gated CTAs
- **WHEN** an unauthenticated user views the landing page
- **THEN** the primary CTA offers request access
- **AND** the secondary CTA offers sign in

#### Scenario: Authenticated user can open dashboard
- **WHEN** an authenticated user views the landing page
- **THEN** the primary app-entry CTA opens the localized dashboard route

### Requirement: Landing page product story
The landing page SHALL organize the product story around `Event -> Reaction -> Narrative`.

#### Scenario: Core thesis section renders
- **WHEN** a user reaches the core thesis section
- **THEN** the page explains that Signapse connects market events to asset reactions, evidence, and narratives

#### Scenario: Feature highlights render
- **WHEN** a user reviews feature highlights
- **THEN** the page includes workspace/watchlist, news and event intelligence, economic calendar, graph view, market chart context, and market query capabilities

### Requirement: Landing page visual media readiness
The landing page SHALL include a first-viewport product visual area that can be replaced with user-provided screenshots or media later.

#### Scenario: Screenshot assets are not yet available
- **WHEN** no final screenshot assets have been provided
- **THEN** the page renders a product-style illustrative workspace preview without requiring external media assets

#### Scenario: Screenshot assets become available
- **WHEN** approved screenshot or media assets are added later
- **THEN** the visual area can use those assets without changing the landing route contract

