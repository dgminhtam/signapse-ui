## ADDED Requirements

### Requirement: Knowledge Graph Hero proof
The landing page SHALL present the first Hero proof as a specialized AI Assistant operating on the Signapse Market Knowledge Graph. The localized copy SHALL state that the graph is built from multi-source market data through aggregation, evaluation, and analysis, while retaining Signapse's analysis-support and user-decision boundaries.

#### Scenario: Vietnamese Knowledge Graph proof renders
- **WHEN** a visitor reads the first Hero proof on `/vi`
- **THEN** its title is `Trợ lý AI chuyên biệt`
- **AND** its body is `Vận hành trên Đồ thị Tri thức, được xây dựng từ dữ liệu thị trường đa nguồn đã qua tổng hợp, đánh giá và phân tích.`
- **AND** the surrounding Hero continues to state that the user verifies sources and makes the trading decision

#### Scenario: English Knowledge Graph proof renders
- **WHEN** a visitor reads the first Hero proof on `/en`
- **THEN** its title is `Specialized AI Assistant`
- **AND** its body is `Powered by a Knowledge Graph built from multi-source market data—aggregated, evaluated, and analyzed.`
- **AND** the localized proof communicates the same market-context meaning as the Vietnamese copy

#### Scenario: Knowledge Graph claim remains bounded
- **WHEN** a visitor reads the localized Knowledge Graph Hero proof
- **THEN** the page describes analysis context rather than model training, trading signals, prediction accuracy, or automated execution
- **AND** it does not imply that every Assistant response contains a complete graph, evidence sheet, reasoning chain, or source citation

### Requirement: Chart-context Hero proof
The landing page SHALL present the second Hero proof as reading chart context rather than only individual candles. Its localized copy SHALL identify price action, market reactions, related events, and economic-calendar context without implying causal proof, trading signals, or guaranteed data coverage.

#### Scenario: Vietnamese chart-context proof renders
- **WHEN** a visitor reads the second Hero proof on `/vi`
- **THEN** its title is `Đọc bối cảnh, không chỉ nhìn nến`
- **AND** its body is `Đọc diễn biến giá trên chart cùng phản ứng thị trường, sự kiện và lịch kinh tế liên quan.`

#### Scenario: English chart-context proof renders
- **WHEN** a visitor reads the second Hero proof on `/en`
- **THEN** its title is `Read the context, not just the candles`
- **AND** its body is `Read price action alongside market reactions, related events, and economic-calendar context.`

#### Scenario: Detailed copy retains availability qualifiers
- **WHEN** a visitor reads detailed chart, event, reaction, or economic-calendar descriptions on the landing
- **THEN** the page continues to qualify information that appears only when data is available
- **AND** the concise second Hero proof does not imply causal proof, trading signals, or universal data coverage

### Requirement: Two-proof Hero hierarchy
The landing page SHALL render exactly two Hero proof points: the specialized AI Assistant and chart context. It SHALL NOT render the former relationship-inspection proof in the Hero, while relationship inspection remains part of the detailed product story.

#### Scenario: Hero shows only the two approved proof points
- **WHEN** a visitor reads the Hero on `/vi` or `/en`
- **THEN** the proof list contains the localized specialized-AI and chart-context proofs
- **AND** it does not contain `Kiểm tra mối liên hệ` or `Inspect relationships`
- **AND** no empty third proof slot is rendered at tablet widths

#### Scenario: Relationship inspection remains in the product story
- **WHEN** a visitor continues from the Hero to the product-story chapters
- **THEN** the page still describes inspecting related events, reactions, sources, and relationships within the applicable detailed chapters
- **AND** the removal does not change the conceptual figure's separate behavior or semantics

## MODIFIED Requirements

### Requirement: Landing page positioning
The landing page SHALL position Signapse as a Market Intelligence Platform for active and research-oriented traders and people monitoring assets, news, and economic events. It SHALL explain that the AI Assistant uses contextual market relationships from the Market Knowledge Graph while price, events, reactions, sources, and relationships remain inspectable Signapse surfaces and the user owns the trading decision.

#### Scenario: Vietnamese Market Intelligence Hero renders
- **WHEN** a visitor reads the Hero on `/vi`
- **THEN** its eyebrow is `MARKET INTELLIGENCE PLATFORM`
- **AND** its H1 is `Biến dữ liệu thị trường thành Đồ thị Tri thức.`
- **AND** its supporting copy is `Signapse tổng hợp, đánh giá và phân tích dữ liệu giá, sự kiện, phản ứng và tin tức từ nhiều nguồn thành các mối liên hệ có thể kiểm tra — tạo ngữ cảnh cho Trợ lý AI khi bạn đặt câu hỏi và đọc từng biến động.`
- **AND** the Hero keeps the next access action and analysis-support trust boundary in the same scan

#### Scenario: English Market Intelligence Hero renders
- **WHEN** a visitor reads the Hero on `/en`
- **THEN** its eyebrow is `MARKET INTELLIGENCE PLATFORM`
- **AND** its H1 is `Turn market data into a Knowledge Graph.`
- **AND** its supporting copy is `Signapse aggregates, evaluates, and analyzes multi-source price, event, reaction, and news data into inspectable relationships—giving the AI Assistant context when you ask questions and read market moves.`
- **AND** the localized message communicates the same Knowledge-Graph context as the Vietnamese copy

#### Scenario: Market Intelligence claim remains bounded
- **WHEN** a visitor reads the primary Hero message
- **THEN** it presents the Knowledge Graph as analysis context for the AI Assistant rather than model training, prediction performance, trading signals, or automated execution
- **AND** it does not imply that every AI response exposes a complete graph, evidence sheet, reasoning chain, or source citation

#### Scenario: Claims stay analysis-focused
- **WHEN** a visitor reads the Hero and primary product chapters
- **THEN** the page describes how users track assets, inspect related events, reactions, and sources when available, and explore relationships around a move
- **AND** it does not describe Signapse as an internal admin console, an AI pipeline, a prediction engine, a trading-signal product, or an automated-trading system

### Requirement: Landing page metadata and social discovery
The system SHALL produce localized landing metadata from explicit server-side public-origin and indexability configuration, SHALL fail closed for unknown deployment state, and SHALL provide one brand-only social card for each supported locale.

The Vietnamese title SHALL be `Signapse | Market Intelligence Platform` and its description SHALL be `Signapse kết nối giá, sự kiện, phản ứng và nguồn tin liên quan để hỗ trợ phân tích thị trường bằng AI với bối cảnh có thể kiểm tra.` The English title SHALL be `Signapse | Market Intelligence Platform` and its description SHALL be `Signapse connects price, events, market reactions, and related sources to support AI-assisted market analysis with context you can verify.`

#### Scenario: Valid non-indexable preview metadata renders
- **WHEN** the landing is configured as non-indexable with public origin `https://dev.signapse.cloud`
- **THEN** `/vi` and `/en` emit the locked localized Market Intelligence title and description
- **AND** each locale URL is self-canonical on `dev.signapse.cloud`
- **AND** the metadata exposes Vietnamese and English language alternates plus root `/` as `x-default`
- **AND** the page emits `noindex`

#### Scenario: Invalid non-indexable origin fails closed
- **WHEN** the landing is configured as non-indexable and the public origin is absent or invalid
- **THEN** the landing still renders with `noindex`
- **AND** canonical and language-alternate URLs are omitted
- **AND** the system does not infer an origin from the request hostname

#### Scenario: Invalid indexable configuration is rejected
- **WHEN** the landing is configured as indexable with an origin other than exactly `https://signapse.cloud`
- **THEN** the application fails fast instead of rendering indexable landing metadata

#### Scenario: Indexable apex metadata can be verified before cutover
- **WHEN** the landing metadata policy is evaluated with indexable origin `https://signapse.cloud`
- **THEN** `/vi` and `/en` are self-canonical on the apex origin
- **AND** they expose each other as language alternates plus root `/` as `x-default`
- **AND** the metadata does not emit `noindex`

#### Scenario: Localized social cards render
- **WHEN** a crawler requests the social artwork for `/vi` or `/en`
- **THEN** it receives a brand-only card using the approved Signapse brand treatment and the corresponding localized Market Intelligence Platform title
- **AND** the Vietnamese and English cards use the same layout
- **AND** neither card contains body copy, a product screenshot, a product mock, a metric, or an additional claim

### Requirement: Landing page trust and claim boundaries
The landing page SHALL present Signapse as analysis support for inspecting market context and linked sources, SHALL qualify optional product data in detailed product descriptions, and MUST NOT imply prediction performance, trading advice, signal generation, or automated execution. A concise Hero proof MAY name high-level chart context without repeating an individual data-availability clause when the detailed landing story retains the applicable qualifier.

#### Scenario: Trust boundary is visible before conversion
- **WHEN** a visitor reviews the trust section before the final access CTA
- **THEN** the page explains that Signapse supports analysis and source inspection rather than prediction
- **AND** it does not claim buy or sell advice, entries, stops, targets, P&L, forecast accuracy, guaranteed outcomes, or automated trading

#### Scenario: Optional data is qualified in detailed copy
- **WHEN** detailed landing copy describes event annotations, calendar context, reactions, evidence, confidence, or evaluated outcomes
- **THEN** the copy states that the information appears when data is available
- **AND** it does not present temporal proximity as proof of causation

#### Scenario: Concise Hero chart proof remains bounded
- **WHEN** a visitor reads the second Hero proof
- **THEN** it may name price action, market reactions, related events, and economic-calendar context without an individual availability qualifier
- **AND** the detailed chart and product-story copy retains the relevant availability boundaries
- **AND** it does not imply causal proof, trading signals, or universal data coverage

#### Scenario: Unsupported product claims are absent
- **WHEN** the localized landing content is reviewed
- **THEN** it does not claim structured Market Query evidence, reasoning chains, watchlist evidence boundaries, workspace-scoped graph data, Theme graph nodes, shared workspaces, or team collaboration
