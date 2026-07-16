## MODIFIED Requirements

### Requirement: Article technical metadata hides backend identifiers
The news article detail page SHALL omit the visible technical information section and SHALL NOT display article id, external key, news outlet id, created time, or updated time in the reading surface.

#### Scenario: Article response contains technical values
- **WHEN** the article response includes technical identifiers or lifecycle timestamps
- **THEN** those values are not rendered on `/news-articles/{id}`

#### Scenario: Article detail renders
- **WHEN** an authorized user reads an article detail page
- **THEN** the page does not include a collapsible or expanded technical information section

## REMOVED Requirements

### Requirement: Linked event cards hide technical canonical keys

**Reason**: Linked-event cards are no longer rendered on the reading-first article route.

**Migration**: No replacement is required on `/news-articles/{id}`; event-focused surfaces own event identifiers.

### Requirement: Article technical metadata keeps operational provenance fields

**Reason**: Created and updated timestamps are operational lifecycle metadata and no longer belong on the reading route.

**Migration**: Keep only a user-friendly original-article link in the header provenance row; omit raw URL, created time, and updated time.
