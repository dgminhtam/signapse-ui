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

## MODIFIED Requirements

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
