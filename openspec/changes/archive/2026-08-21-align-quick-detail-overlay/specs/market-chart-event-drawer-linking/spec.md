## MODIFIED Requirements

### Requirement: Event inspection navigation behavior

The system SHALL use a local Market Charts Event inspection quick-detail overlay for event title actions from market chart annotations.

#### Scenario: User opens linked event title

- **WHEN** a user activates an annotation event title from the market chart popup
- **THEN** the market chart opens a local event quick-detail drawer
- **AND** the chart route, selected asset, timeframe, loaded candles, lazy history state, and chart instance are not reset by the open action
- **AND** the local chart annotation popup is dismissed while the quick-detail modal is open
- **AND** the owner retains the originating annotation context and title trigger for dismissal recovery

#### Scenario: User closes local event detail

- **WHEN** a user closes the market chart event quick-detail drawer
- **THEN** the drawer closes without calling `router.back()`
- **AND** the chart route, selected asset, timeframe, loaded candles, lazy history state, and chart instance are not reset by the close action
- **AND** the originating annotation context is restored before focus returns to the exact annotation title trigger

#### Scenario: Drawer owns deeper event content

- **WHEN** the local event quick-detail drawer opens from a market chart annotation title
- **THEN** the shared Event inspection profile owns the bounded event facts, evidence, and related assets
- **AND** related news actions use their canonical article routes rather than nesting Article reader inside Event inspection
- **AND** the market chart popup does not add article or source-document detail links for this change

#### Scenario: Full detail escalation remains available

- **WHEN** a user needs the complete event detail page
- **THEN** the local event quick-detail drawer provides an action to open `/events/{eventId}` as the canonical full detail page

#### Scenario: Existing chart marker behavior is preserved

- **WHEN** a user clicks a red chart annotation marker
- **THEN** the chart annotation popup still opens as before
- **AND** annotation grouping, marker rendering, popup positioning, and lazy history loading remain unchanged
