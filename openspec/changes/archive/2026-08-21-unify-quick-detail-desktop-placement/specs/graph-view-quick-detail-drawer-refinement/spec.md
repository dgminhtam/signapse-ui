## RENAMED Requirements

- FROM: `Graph quick detail uses bottom Drawer`
  TO: `Graph quick detail follows shared responsive Drawer placement`
- FROM: `Bottom drawer preserves readability and context`
  TO: `Quick detail preserves readability and context across placements`

## MODIFIED Requirements

### Requirement: Graph quick detail follows shared responsive Drawer placement

Graph View quick detail SHALL use the shared shadcn Drawer composition and responsive Quick Detail policy. At an effective CSS viewport of `1440px` or wider, Event inspection SHALL open as a `32rem`, `100dvh` right-side sheet and Article reader SHALL open as a `44rem`, `100dvh` right-side sheet. Below `1440px`, both profiles SHALL use the shared bottom-sheet geometry.

#### Scenario: Event detail opens in the shared desktop sheet

- **WHEN** a user opens an event quick detail from Graph View at an effective CSS viewport of at least `1440px`
- **THEN** Event inspection appears in the shared right-side Drawer with the documented Event width
- **AND** Graph View canvas context remains mounted behind the modal

#### Scenario: News article detail opens in the shared desktop sheet

- **WHEN** a user opens a news article quick detail from Graph View at an effective CSS viewport of at least `1440px`
- **THEN** Article reader appears in the shared right-side Drawer with the documented Article width
- **AND** Graph View canvas context remains mounted behind the modal

#### Scenario: Narrow Graph View retains bottom geometry

- **WHEN** a user opens either supported quick-detail entity from Graph View below `1440px`
- **THEN** the Drawer uses the documented bottom-sheet geometry for that profile

#### Scenario: Drawer uses shadcn composition

- **WHEN** the quick detail shell is implemented
- **THEN** it uses the shadcn Drawer primitive with the shared accessible entity-or-state title, visible Close control, canonical action, no generic header description, and single-scroll body contract

### Requirement: Quick detail preserves readability and context across placements

Quick detail SHALL provide stable profile-specific reading layout while preserving the selected Graph View node and inspector context behind the modal. Bottom-sheet-only layout constraints SHALL apply only when the resolved placement is bottom.

#### Scenario: Drawer has stable resolved geometry and scroll

- **WHEN** Graph View quick detail is open
- **THEN** it uses the documented right-side or bottom-sheet constraints for its effective CSS viewport and one internal scroll body
- **AND** resize or zoom preserves the selected entity, focus, and body scroll without replaying an opening animation

#### Scenario: Node inspector context survives desktop drill-down

- **WHEN** a user opens quick detail from a Graph node inspector at an effective CSS viewport of at least `1440px`
- **THEN** the right-side Drawer may cover the inspector while the inspector and selected node remain mounted behind the modal
- **AND** closing quick detail restores focus to the initiating inspector action

#### Scenario: Drawer content remains focused

- **WHEN** event or news article quick detail is displayed
- **THEN** Event inspection keeps its structured content within a centered `64rem` maximum cluster when bottom placement is resolved
- **AND** Article reader keeps Markdown prose within a `72ch` maximum measure
- **AND** neither profile adds mutation-heavy actions from a full detail page
