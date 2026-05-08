## ADDED Requirements

### Requirement: Event responses match the current backend schema
The system SHALL model event list and detail responses without `slug` or `confirmedAt`, and event evidence MUST use `newsArticleId`, `newsArticleTitle`, and `newsArticleUrl` instead of generic `artifact*` fields.

#### Scenario: Event list uses occurred time only
- **WHEN** a user opens the event list
- **THEN** each row renders the event time from `occurredAt`
- **THEN** the list does not depend on `slug` or `confirmedAt`

#### Scenario: Event detail evidence uses news article fields
- **WHEN** a user opens an event detail page with evidence
- **THEN** evidence titles come from `newsArticleTitle`
- **THEN** the news article detail link uses `newsArticleId` when the user has permission
- **THEN** the original source link uses `newsArticleUrl` when present

#### Scenario: Quick detail evidence uses news article fields
- **WHEN** a user opens an event quick detail drawer with evidence
- **THEN** the drawer uses the same `newsArticle*` evidence fields as the full detail page

### Requirement: Removed event timestamp and identifiers are not displayed
The system SHALL remove event detail UI that displays `confirmedAt`, event id as "Mã sự kiện", or event slug.

#### Scenario: Detail facts omit confirmed time
- **WHEN** a user opens an event detail page
- **THEN** the core fact cards include confidence and occurred time
- **THEN** no card or quick fact labeled "Xác nhận lúc" is displayed

#### Scenario: Technical information omits removed identifiers
- **WHEN** a user reviews the technical information section on event detail
- **THEN** "Mã sự kiện" is not displayed
- **THEN** "Slug" is not displayed
- **THEN** remaining technical fields are limited to current backend fields such as `canonicalKey`, `createdDate`, and `lastModifiedDate`

#### Scenario: Quick detail omits confirmed time
- **WHEN** a user opens an event quick detail drawer
- **THEN** no quick fact labeled "Xác nhận lúc" is displayed

### Requirement: Event detail actions use a compact title-row cluster
The system SHALL place the asset/theme enrichment action and market reaction derivation action in a compact action cluster aligned to the right of the event title area on desktop, following the news article detail layout rhythm.

#### Scenario: Desktop title row has right-aligned actions
- **WHEN** a user opens event detail on a desktop viewport
- **THEN** the event title/status/description block is on the leading side
- **THEN** the two operator actions are grouped on the trailing side in the same title row

#### Scenario: Narrow viewport keeps actions usable
- **WHEN** a user opens event detail on a narrow viewport
- **THEN** the action cluster wraps below the title content without overlapping text
- **THEN** both actions remain reachable and readable

#### Scenario: Action labels are shorter
- **WHEN** the event detail action cluster is rendered
- **THEN** the asset/theme enrichment button uses a shorter Vietnamese label than "Làm giàu tài sản và chủ đề"
- **THEN** the market reaction derivation button uses a shorter Vietnamese label than "Suy luận tác động thị trường"

#### Scenario: Action behavior is preserved
- **WHEN** a user triggers either event operator action
- **THEN** the action keeps permission gating, pending disabled state, inline spinner, toast result, and route refresh behavior

### Requirement: Event detail skeleton mirrors the cleaned layout
The system SHALL update event detail loading skeletons to match the cleaned detail layout and avoid placeholders for removed fields.

#### Scenario: Skeleton omits removed fields
- **WHEN** event detail data is loading
- **THEN** the skeleton does not reserve a card for confirmed time
- **THEN** the skeleton does not reserve technical placeholders for event id or slug

#### Scenario: Skeleton mirrors action cluster
- **WHEN** event detail data is loading
- **THEN** the skeleton reserves the same title-row action cluster shape as the final detail UI
