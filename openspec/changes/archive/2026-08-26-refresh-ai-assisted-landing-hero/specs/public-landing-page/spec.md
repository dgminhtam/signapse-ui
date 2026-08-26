## MODIFIED Requirements

### Requirement: Landing page positioning
The landing page SHALL position Signapse as an AI-assisted, event-aware market analysis workspace for active and research-oriented traders and people monitoring assets, news, and economic events. It SHALL explain that AI supports natural-language market questions and synthesis while price, events, reactions, sources, and relationships remain inspectable Signapse surfaces and the user owns the trading decision.

#### Scenario: Product thesis is visible
- **WHEN** a visitor reads the Hero
- **THEN** the page explains that Signapse turns price data and related market context into trading context the visitor can verify
- **AND** it identifies the next access action and a short AI-assistance-not-prediction trust boundary in the same scan

#### Scenario: AI role is scoped to supported behavior
- **WHEN** a visitor reads the Hero proof and conceptual figure
- **THEN** the page explains that users can ask market questions in natural language and use Signapse surfaces to inspect chart context, events, reactions, sources, and relationships
- **AND** it does not imply that an Assistant response contains structured evidence, reasoning chains, a source sheet, trading signals, or execution controls

#### Scenario: Claims stay analysis-focused
- **WHEN** a visitor reads the Hero and primary product chapters
- **THEN** the page describes how users track assets, inspect related events, reactions, and sources when available, and explore relationships around a move
- **AND** it does not describe Signapse as an internal admin console, an AI pipeline, a prediction engine, a trading-signal product, or an automated-trading system

### Requirement: Landing page visual media readiness
The landing page SHALL render a text-first composition whenever no locale-appropriate product capture has completed approval. In that state it SHALL permit a localized conceptual figure that reinforces the adjacent product thesis without impersonating product UI, and it MUST NOT render synthetic product UI, a generated image presented as a product screenshot, or an empty media placeholder.

#### Scenario: Screenshot assets are not yet available
- **WHEN** the landing has no approved capture for the active locale
- **THEN** the Hero and product chapters render their complete story in localized text and may include a labelled conceptual market-context figure
- **AND** the page does not render the previous mock workspace, fake chart bars, fake confidence, fake evidence counts, Market Query preview, Theme node, control-looking decoration, or fake market values

#### Scenario: Conceptual figure communicates without product mimicry
- **WHEN** the text-first Hero renders its conceptual figure
- **THEN** the figure uses localized non-interactive labels and relationship geometry to connect market inputs with ask, explore, and verify actions
- **AND** it does not use tickers, prices, metrics, buttons, inputs, dashboard chrome, or other states that could be mistaken for a live product capture

#### Scenario: One locale lacks an approved capture
- **WHEN** a product capture is approved for one locale but not the other
- **THEN** the locale without an approved asset remains text-first and may use its own localized conceptual figure
- **AND** it does not fall back to the other locale's image or visible labels

#### Scenario: Screenshot assets become available
- **WHEN** a locale-appropriate capture passes public-data, privacy, licensing, attribution, claim, localization, intrinsic-size, and performance review
- **THEN** the corresponding media slot may render that capture with localized alternative text
- **AND** adjacent text communicates the same essential insight

### Requirement: Landing page metadata and social discovery
The system SHALL produce localized landing metadata from explicit server-side public-origin and indexability configuration, SHALL fail closed for unknown deployment state, and SHALL provide one brand-only social card for each supported locale.

The Vietnamese title SHALL be `Signapse | AI cho phân tích giao dịch` and its description SHALL be `Signapse kết nối giá, sự kiện, phản ứng và nguồn tin liên quan để hỗ trợ phân tích thị trường bằng AI với bối cảnh có thể kiểm tra.` The English title SHALL be `Signapse | AI-assisted market analysis` and its description SHALL be `Signapse connects price, events, market reactions, and related sources to support AI-assisted market analysis with context you can verify.`

#### Scenario: Valid non-indexable preview metadata renders
- **WHEN** the landing is configured as non-indexable with public origin `https://dev.signapse.cloud`
- **THEN** `/vi` and `/en` emit the locked localized AI-assisted title and description
- **AND** each locale URL is self-canonical on `dev.signapse.cloud`
- **AND** the metadata exposes Vietnamese and English language alternates plus root `/` as `x-default`
- **AND** the page emits `noindex`

#### Scenario: Invalid non-indexable origin fails closed
- **WHEN** the landing is configured as non-indexable and the public origin is absent or invalid
- **THEN** the landing still renders with `noindex`
- **AND** canonical and language-alternate URLs are omitted
- **AND** the system does not infer an origin from the request hostname

#### Scenario: Invalid indexable configuration is rejected
- **WHEN** the landing is configured as indexable with an origin other than exactly `https://signapse.cloud`
- **THEN** the application fails fast instead of rendering indexable landing metadata

#### Scenario: Indexable apex metadata can be verified before cutover
- **WHEN** the landing metadata policy is evaluated with indexable origin `https://signapse.cloud`
- **THEN** `/vi` and `/en` are self-canonical on the apex origin
- **AND** they expose each other as language alternates plus root `/` as `x-default`
- **AND** the metadata does not emit `noindex`

#### Scenario: Localized social cards render
- **WHEN** a crawler requests the social artwork for `/vi` or `/en`
- **THEN** it receives a brand-only card using the approved Signapse brand treatment and the corresponding localized AI-assisted metadata title
- **AND** the Vietnamese and English cards use the same layout
- **AND** neither card contains body copy, a product screenshot, a product mock, a metric, or an additional claim

### Requirement: Landing page accessible responsive experience
The landing page SHALL provide equivalent content, navigation, and CTA behavior across supported viewport sizes, light and dark themes, keyboard and assistive-technology use, 200% zoom, and reduced-motion preferences. The small-viewport header SHALL keep brand, the auth-aware primary CTA, and the navigation disclosure visible without clipping while preserving locale and secondary access actions inside the disclosure.

#### Scenario: Semantic page structure renders
- **WHEN** the landing page is inspected with accessibility semantics
- **THEN** it contains one H1, ordered H2 and H3 headings, a skip link to the main content, and labelled header navigation
- **AND** the conceptual figure exposes a concise localized text summary when it adds meaning
- **AND** decorative grid, connector, and node geometry is hidden from the accessibility tree
- **AND** visible brand text is not redundantly announced through the adjacent logo

#### Scenario: Keyboard navigation works
- **WHEN** a visitor uses only the keyboard
- **THEN** the skip link, locale links, mobile navigation disclosure, section links, sign-in or dashboard link, and access CTA are operable in logical order
- **AND** every interactive element has a visible focus state

#### Scenario: Small viewport header preserves primary actions
- **WHEN** the landing header is viewed at a width where its full navigation and locale controls do not fit
- **THEN** brand, the auth-aware primary CTA, and the disclosure trigger remain visible in the primary header row
- **AND** locale links, section navigation, and any anonymous secondary sign-in action remain available inside the disclosure
- **AND** no control is made inaccessible by page-level clipping

#### Scenario: Small viewport and zoom reflow
- **WHEN** the landing is viewed at 375, 768, 1024, or 1440 CSS pixels or at 200% zoom
- **THEN** content remains readable in canonical order
- **AND** the page has no page-level horizontal overflow or clipped brand, label, CTA, or navigation control
- **AND** mobile controls provide a practical touch target with a preferred minimum of 44 by 44 CSS pixels

#### Scenario: Default motion explains the conceptual flow
- **WHEN** the visitor has not requested reduced motion and the Hero first renders
- **THEN** copy and conceptual-flow emphasis may run once using opacity and transform without blocking interaction
- **AND** the animation does not loop, replay on scroll, or change layout bounds

#### Scenario: Theme and motion preferences preserve meaning
- **WHEN** the visitor selects light theme, dark theme, or reduced motion
- **THEN** the page preserves the same content hierarchy, contrast-dependent meaning, navigation, and CTA behavior
- **AND** reduced motion presents the complete final Hero and conceptual figure without entrance choreography
- **AND** no required content or action depends on animation, hover, or motion
