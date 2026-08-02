## MODIFIED Requirements

### Requirement: Article technical metadata hides backend identifiers
The news article detail page SHALL omit the visible technical information section and SHALL NOT display article id, created time, or updated time in the reading surface.

#### Scenario: Article response contains technical values
- **WHEN** the article response includes technical identifiers or lifecycle timestamps
- **THEN** those values are not rendered on `/news-articles/{id}`

#### Scenario: Article detail renders
- **WHEN** an authorized user reads a news article detail page
- **THEN** the page does not include a collapsible or expanded technical information section
