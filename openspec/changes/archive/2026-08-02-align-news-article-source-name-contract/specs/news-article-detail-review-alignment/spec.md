## MODIFIED Requirements

### Requirement: Detail header is the primary metadata location
The news article detail page SHALL use the header provenance row as the single visible location for the article-owned source-name snapshot, publication time, and original-article access.

#### Scenario: Article header renders core provenance
- **WHEN** an authorized user opens a news article detail page
- **THEN** the header shows `sourceName`, published time, and original-article access once beneath the headline

#### Scenario: Reading content renders
- **WHEN** summary, image, and body content render below the header
- **THEN** those regions do not repeat status, source name, publication time, or technical metadata cards
