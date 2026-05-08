## ADDED Requirements

### Requirement: Linked event cards hide technical canonical keys
The news article detail page SHALL NOT display linked event canonical keys in the primary linked event card.

#### Scenario: Linked event has a canonical key
- **WHEN** an authorized user opens a news article detail page with a linked event that includes `eventCanonicalKey`
- **THEN** the linked event card does not render the canonical key label or value

#### Scenario: Linked event title is missing
- **WHEN** a linked event lacks a title but has an event id
- **THEN** the linked event card may identify the event using the event id fallback rather than showing the canonical key

### Requirement: Article technical metadata hides backend identifiers
The news article detail page SHALL NOT display article id, external key, or news outlet id in the visible technical metadata section.

#### Scenario: Technical metadata renders
- **WHEN** an authorized user opens the `Thông tin kỹ thuật` section on a news article detail page
- **THEN** the section does not include `Mã bài viết`, `External Key`, or `News Outlet ID`

#### Scenario: Article response contains hidden identifiers
- **WHEN** the article response includes `id`, `externalKey`, or `newsOutletId`
- **THEN** those values are not rendered as visible metadata fields on the detail page

### Requirement: Article technical metadata keeps operational provenance fields
The news article detail page SHALL keep operational metadata that helps operators validate provenance and recency.

#### Scenario: Technical metadata renders remaining fields
- **WHEN** an authorized user opens the `Thông tin kỹ thuật` section on a news article detail page
- **THEN** the section includes `URL gốc`, `Tạo lúc`, and `Cập nhật` when the page has those values or fallback display text
