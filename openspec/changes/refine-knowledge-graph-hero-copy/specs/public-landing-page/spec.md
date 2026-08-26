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
