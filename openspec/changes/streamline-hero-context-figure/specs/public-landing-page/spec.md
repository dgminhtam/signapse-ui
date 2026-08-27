## ADDED Requirements

### Requirement: Control-free Hero visual chrome
The text-first Hero SHALL render its market-context figure without visible control chrome. The Hero visual area SHALL NOT display its section label, proof heading, figure caption, hover hint, pause control, mode label, runtime status, fallback labels, or a persistent canvas border. The localized Hero headline, supporting copy, CTA behavior, trust note, and three proof points SHALL remain visible.

#### Scenario: Vietnamese visual chrome is absent
- **WHEN** a visitor views the text-first Hero on `/vi`
- **THEN** `Bối cảnh có thể kiểm tra`, `Từ dữ liệu đến bối cảnh giao dịch`, and `Hai góc nhìn về bối cảnh thị trường` are not visibly rendered in the Hero visual area
- **AND** no visible hint, pause control, mode label, runtime status, fallback label, or persistent canvas border is rendered
- **AND** the Hero headline, supporting copy, CTA behavior, trust note, and three proof points remain visible

#### Scenario: English visual chrome is absent
- **WHEN** a visitor views the text-first Hero on `/en`
- **THEN** `Context you can verify`, `From data to trading context`, and `Two views of market context` are not visibly rendered in the Hero visual area
- **AND** no visible hint, pause control, mode label, runtime status, fallback label, or persistent canvas border is rendered
- **AND** the Hero headline, supporting copy, CTA behavior, trust note, and three proof points remain visible

#### Scenario: Canvas reclaims removed visual-copy space
- **WHEN** a visitor views the text-first Hero at a desktop breakpoint
- **THEN** the market-context canvas uses the visual space released by the removed heading and caption without materially increasing the Hero footprint
- **AND** the canvas remains within the Hero layout without horizontal overflow

#### Scenario: Canvas remains viable on narrow viewports
- **WHEN** a visitor views the text-first Hero on a narrow viewport or at 200% zoom
- **THEN** the market-context canvas retains its mobile minimum footprint
- **AND** the Hero does not create horizontal overflow

### Requirement: Control-free figure interaction and motion
The market-context figure SHALL retain exploration without visible controls. It SHALL support fine-pointer hover preview, pointer drag rotation, keyboard rotation and mode switching, and localized nonvisual guidance. It SHALL NOT expose click or tap pinning. Its graph-only introductory rotation SHALL run once per page view for no more than four seconds, SHALL NOT replay after viewport re-entry, and SHALL respect reduced-motion preferences.

#### Scenario: Fine-pointer hover previews price action
- **WHEN** a fine-pointer visitor enters the market-context figure without dragging
- **THEN** the figure previews price action
- **AND** the figure returns to graph mode when the pointer leaves
- **AND** no visible control or mode label is required to trigger or explain the preview

#### Scenario: Pointer drag rotates the current view
- **WHEN** a visitor drags within the market-context figure with a supported pointer
- **THEN** the current graph or price-action view rotates during the gesture
- **AND** the gesture does not activate a click or tap pinning mode

#### Scenario: Coarse pointer has no hidden tap mode
- **WHEN** a coarse-pointer visitor taps the market-context figure without dragging
- **THEN** the tap does not pin, toggle, or otherwise change the figure mode
- **AND** a drag gesture remains available for rotation

#### Scenario: Keyboard interaction remains accessible without visible chrome
- **WHEN** a keyboard visitor focuses the enhanced market-context figure
- **THEN** a visible focus indicator is shown only while the figure has keyboard focus
- **AND** Arrow keys rotate the active view
- **AND** Enter and Space switch between graph and price-action views
- **AND** localized nonvisual name, description, and keyboard guidance are available

#### Scenario: Intro motion is bounded and respects reduced motion
- **WHEN** a visitor first views the enhanced market-context figure during a page view without reduced motion
- **THEN** graph-only introductory rotation runs for no more than four seconds and then settles
- **AND** it does not replay solely because the figure leaves and re-enters the viewport
- **WHEN** the visitor prefers reduced motion
- **THEN** the figure does not start introductory rotation

## MODIFIED Requirements

### Requirement: Landing page visual media readiness
The landing page SHALL render a text-first composition whenever no locale-appropriate product capture has completed approval. In that state it SHALL render a localized control-free interactive market-context figure as progressive enhancement over a server-rendered silent dual-view fallback, and it MUST NOT render synthetic product UI, a generated image presented as a product screenshot, or an empty media placeholder.

#### Scenario: Screenshot assets are not yet available
- **WHEN** the landing has no approved capture for the active locale
- **THEN** the Hero and product chapters render their complete story in localized text and the Hero renders a control-free interactive market-context figure
- **AND** the page does not render the previous mock workspace, fake chart bars, fake confidence, fake evidence counts, Market Query preview, Theme node, visible control-looking product decoration, or fake market values

#### Scenario: Conceptual figure communicates without product mimicry
- **WHEN** the text-first Hero renders its interactive market-context figure
- **THEN** the figure presents the Market Knowledge Graph and price action as complementary views of market context
- **AND** it does not imply that the graph generates, transforms into, or predicts market prices
- **AND** it does not present itself as a live product chart, trading signal, automated-execution surface, or approved product capture
- **AND** it does not display tickers, prices, axes, metrics, trading controls, dashboard chrome, or data that could be mistaken for live market output

#### Scenario: Vietnamese nonvisual figure identity renders
- **WHEN** a visitor uses assistive technology with the interactive market-context figure on `/vi`
- **THEN** a natural Vietnamese nonvisual name, description, and keyboard guidance identify the Market Knowledge Graph and price action views
- **AND** the figure does not visibly render its former title, mode labels, hints, controls, or status messages
- **AND** the obsolete `01 / 03` metadata is absent

#### Scenario: English nonvisual figure identity renders
- **WHEN** a visitor uses assistive technology with the interactive market-context figure on `/en`
- **THEN** a natural English nonvisual name, description, and keyboard guidance identify the Market Knowledge Graph and price action views
- **AND** the figure does not visibly render its former title, mode labels, hints, controls, or status messages
- **AND** the obsolete `01 / 03` metadata is absent

#### Scenario: Static fallback preserves the complete figure meaning without visual copy
- **WHEN** JavaScript has not hydrated, WebGL cannot initialize, or the interactive renderer loses its graphics context
- **THEN** the Hero keeps a server-rendered silent dual-view figure in the same layout footprint
- **AND** the fallback does not visually render labels, controls, or runtime status
- **AND** a localized nonvisual description communicates the graph and price-action context
- **AND** a runtime failure returns to the fallback without exposing a technical exception or blocking the landing journey

#### Scenario: Surrounding Hero content remains stable
- **WHEN** the interactive market-context figure replaces the previous conceptual diagram
- **THEN** the localized Hero headline, supporting copy, CTA behavior, trust note, and three proof points remain unchanged
- **AND** the Hero visual section label and proof heading are absent
- **AND** the canonical landing section order and all sections outside the figure remain unchanged

#### Scenario: One locale lacks an approved capture
- **WHEN** a product capture is approved for one locale but not the other
- **THEN** the locale without an approved asset remains text-first and renders its localized control-free interactive market-context figure
- **AND** it does not fall back to the other locale's image or expose the figure's former visible labels

#### Scenario: Screenshot assets become available
- **WHEN** a locale-appropriate capture passes public-data, privacy, licensing, attribution, claim, localization, intrinsic-size, and performance review
- **THEN** the corresponding media slot may render that capture with localized alternative text
- **AND** adjacent text communicates the same essential insight
- **AND** adopting that capture requires an explicit follow-up decision rather than silently removing the interactive market-context figure
