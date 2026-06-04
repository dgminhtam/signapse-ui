## ADDED Requirements

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

