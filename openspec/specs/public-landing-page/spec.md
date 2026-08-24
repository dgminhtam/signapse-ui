# public-landing-page Specification

## Purpose
TBD - created by archiving change revise-public-landing-content-v2. Update Purpose after archive.
## Requirements
### Requirement: Public localized landing page
The system SHALL render a public Signapse application landing page at each supported locale root without requiring authentication or workspace permissions and without rendering the protected dashboard shell. Public landing access MUST NOT make dashboard, application, or API routes public.

#### Scenario: Vietnamese landing route
- **WHEN** an unauthenticated visitor opens `/vi`
- **THEN** the system renders the Vietnamese public landing page without redirecting to sign-in
- **AND** the protected dashboard sidebar shell is not rendered

#### Scenario: English landing route
- **WHEN** an unauthenticated visitor opens `/en`
- **THEN** the system renders the English public landing page without redirecting to sign-in
- **AND** the protected dashboard sidebar shell is not rendered

#### Scenario: Protected routes remain protected
- **WHEN** an unauthenticated visitor requests a localized dashboard route, another protected application route, or a protected API route
- **THEN** the existing authentication and authorization behavior remains in effect
- **AND** the request is not made public by the landing route exception

#### Scenario: Root locale negotiation remains canonical
- **WHEN** a visitor opens an unprefixed page route
- **THEN** the existing locale negotiation selects Vietnamese or English from the request preference
- **AND** it falls back to Vietnamese when no supported preference is available

### Requirement: Landing page positioning
The landing page SHALL position Signapse as an event-aware market intelligence workspace for market analysts, research-oriented traders, and people monitoring assets, news, and economic events.

#### Scenario: Product thesis is visible
- **WHEN** a visitor reads the Hero
- **THEN** the page explains that Signapse combines price data with related market context in one analysis experience
- **AND** it identifies the next access action and a short analysis-not-prediction trust boundary in the same scan

#### Scenario: Claims stay analysis-focused
- **WHEN** a visitor reads the Hero and primary product chapters
- **THEN** the page describes how users track assets, inspect related events, reactions, and sources when available, and explore relationships around a move
- **AND** it does not describe Signapse as an internal admin console, an AI pipeline, a prediction engine, or a trading-signal product

### Requirement: Landing page CTA states
The landing page SHALL expose a single auth-aware access model across the header, Hero, final CTA, and footer, using only destinations that exist.

The request-access destination MUST be `mailto:request-access@signapse.ai?subject=Signapse%20access%20request`, the localized sign-in destination MUST be `/{lang}/sign-in`, the localized dashboard destination MUST be `/{lang}/dashboard`, and the Hero journey destination MUST be `#how-it-works`.

#### Scenario: Public user sees gated CTAs
- **WHEN** an unauthenticated visitor views the landing page
- **THEN** the header primary, Hero primary, and final CTA offer `Yêu cầu truy cập` or `Request access` using the locked mail destination
- **AND** adjacent microcopy explains that the action opens an email application
- **AND** the footer exposes the plain request-access email address for copying

#### Scenario: Anonymous visitor sees sign-in actions
- **WHEN** an unauthenticated visitor views the landing page
- **THEN** the header and footer expose the localized sign-in destination
- **AND** the Hero secondary action links to `#how-it-works` rather than sign-in

#### Scenario: Authenticated user can open dashboard
- **WHEN** an authenticated visitor views the landing page
- **THEN** the header primary, Hero primary, final CTA, and footer app-entry action open the localized dashboard
- **AND** the Hero secondary action still links to `#how-it-works`

#### Scenario: Mail action does not claim delivery
- **WHEN** a visitor activates request access
- **THEN** the landing opens the locked mail destination in the visitor's email application
- **AND** it does not display a success toast or confirmation claiming the email was sent or received

#### Scenario: Preview uses the production access destination
- **WHEN** the landing renders on the preview application host
- **THEN** it uses the same locked request-access destination as production
- **AND** it does not substitute a test mailbox or environment-specific CTA

### Requirement: Landing page product story
The landing page SHALL organize the product story into the canonical sequence: Public Header, Hero Product Proof, Analysis Flow, Product Story, Workspace and Assistant support, Trust Boundary, Final Access CTA, and Public Footer.

#### Scenario: Core thesis section renders
- **WHEN** a visitor reaches `#how-it-works`
- **THEN** the page presents `Theo dõi → Đặt vào bối cảnh → Kiểm tra → Khám phá` in Vietnamese or `Track → Contextualize → Inspect → Explore` in English
- **AND** it does not describe an internal data or AI pipeline

#### Scenario: Feature highlights render
- **WHEN** a visitor reaches `#product`
- **THEN** the page presents Event-aware Charts, Reaction & Evidence, and Connected Market Graph as three editorial chapters
- **AND** each chapter contains an outcome heading, an explanation, no more than three proof points, and the applicable claim boundary

#### Scenario: Event-aware chart chapter stays runtime-faithful
- **WHEN** the chart chapter describes product behavior
- **THEN** it explains tracked-asset selection, historical candles, event annotations, economic-calendar context, and live chart states when available
- **AND** it does not imply arbitrary symbol coverage, system-wide realtime intelligence, causal proof, or trading signals

#### Scenario: Reaction and evidence chapter stays runtime-faithful
- **WHEN** the reaction and evidence chapter describes product behavior
- **THEN** it explains concise chart annotation previews and event detail with optional reactions and linked sources
- **AND** it does not claim that event detail contains evaluated trading outcomes or a structured Market Query evidence sheet

#### Scenario: Connected graph chapter stays runtime-faithful
- **WHEN** the graph chapter describes product behavior
- **THEN** it describes relationships among events, assets, news articles, and narratives
- **AND** it states that themes provide context rather than a distinct graph entity type
- **AND** it does not claim workspace or watchlist filtering

#### Scenario: Workspace and Assistant remain supporting capabilities
- **WHEN** a visitor reaches `#workspace-ai`
- **THEN** the page explains active-workspace tracked assets and persisted text conversation sessions and history for the same workspace
- **AND** the AI Assistant is not presented as one of the three primary product chapters
- **AND** it does not claim token streaming, attachments, evidence sheets, Telegram delivery, or team collaboration

#### Scenario: Footer exposes only real destinations
- **WHEN** a visitor reaches the footer
- **THEN** it exposes brand identity, locale links, the request-access email, and the auth-appropriate sign-in or dashboard destination
- **AND** it does not render Docs, Privacy, Terms, pricing, or integration links unless corresponding destinations exist

### Requirement: Landing page visual media readiness
The landing page SHALL render a text-first composition whenever no locale-appropriate product capture has completed approval. It MUST NOT render synthetic product UI, a generated image presented as a product screenshot, or an empty media placeholder.

#### Scenario: Screenshot assets are not yet available
- **WHEN** the landing has no approved capture for the active locale
- **THEN** the Hero and product chapters render their complete story in text without reserving an empty media slot
- **AND** the page does not render the previous mock workspace, fake chart bars, fake confidence, fake evidence counts, Market Query preview, Theme node, or control-looking decoration

#### Scenario: One locale lacks an approved capture
- **WHEN** a product capture is approved for one locale but not the other
- **THEN** the locale without an approved asset remains text-first
- **AND** it does not fall back to the other locale's image

#### Scenario: Screenshot assets become available
- **WHEN** a locale-appropriate capture passes public-data, privacy, licensing, attribution, claim, localization, intrinsic-size, and performance review
- **THEN** the corresponding media slot may render that capture with localized alternative text
- **AND** adjacent text communicates the same essential insight

### Requirement: Landing page trust and claim boundaries
The landing page SHALL present Signapse as analysis support for inspecting market context and linked sources, SHALL qualify optional product data, and MUST NOT imply prediction performance, trading advice, signal generation, or automated execution.

#### Scenario: Trust boundary is visible before conversion
- **WHEN** a visitor reviews the trust section before the final access CTA
- **THEN** the page explains that Signapse supports analysis and source inspection rather than prediction
- **AND** it does not claim buy or sell advice, entries, stops, targets, P&L, forecast accuracy, guaranteed outcomes, or automated trading

#### Scenario: Optional data is qualified
- **WHEN** landing copy describes event annotations, calendar context, reactions, evidence, confidence, or evaluated outcomes
- **THEN** the copy states that the information appears when data is available
- **AND** it does not present temporal proximity as proof of causation

#### Scenario: Unsupported product claims are absent
- **WHEN** the localized landing content is reviewed
- **THEN** it does not claim structured Market Query evidence, reasoning chains, watchlist evidence boundaries, workspace-scoped graph data, Theme graph nodes, shared workspaces, or team collaboration

### Requirement: Landing page localized navigation
The landing page SHALL expose semantic Vietnamese and English locale links in the header and footer, SHALL treat the locale URL segment as the source of truth, and MUST NOT read or write an app locale cookie.

#### Scenario: Locale links expose language semantics
- **WHEN** a visitor reviews a landing locale control
- **THEN** it contains links for `Tiếng Việt` and `English` with matching `lang` and `hreflang` attributes
- **AND** the active locale is visibly indicated and carries `aria-current="page"`

#### Scenario: Locale switch preserves supported location state
- **WHEN** a visitor switches locale with a query string and a hash in `#top`, `#how-it-works`, `#product`, `#workspace-ai`, `#trust`, or `#access`
- **THEN** only the locale pathname segment changes
- **AND** the query string and supported hash are preserved
- **AND** no locale cookie mutation occurs

#### Scenario: Locale switch drops an unsupported hash
- **WHEN** a visitor switches locale while the URL contains an unsupported hash
- **THEN** the destination preserves the non-locale pathname and query string
- **AND** the unsupported hash is omitted

#### Scenario: Locale switch preserves access state
- **WHEN** an anonymous or authenticated visitor switches locale
- **THEN** the destination remains the equivalent public landing route
- **AND** the CTA state continues to reflect the same authentication state

### Requirement: Landing page metadata and social discovery
The system SHALL produce localized landing metadata from explicit server-side public-origin and indexability configuration, SHALL fail closed for unknown deployment state, and SHALL provide one brand-only social card for each supported locale.

The Vietnamese title SHALL be `Signapse | Phân tích thị trường theo bối cảnh sự kiện` and its description SHALL be `Signapse kết hợp dữ liệu giá với sự kiện, phản ứng, nguồn tin và quan hệ thị trường liên quan khi dữ liệu khả dụng.` The English title SHALL be `Signapse | Event-aware market intelligence` and its description SHALL be `Signapse brings price data together with related market events, reactions, sources, and relationships when available.`

#### Scenario: Valid non-indexable preview metadata renders
- **WHEN** the landing is configured as non-indexable with public origin `https://dev.signapse.cloud`
- **THEN** `/vi` and `/en` emit the locked localized title and description
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
- **THEN** it receives a brand-only card using the approved Signapse brand treatment and the corresponding localized metadata title
- **AND** the Vietnamese and English cards use the same layout
- **AND** neither card contains body copy, a product screenshot, a product mock, a metric, or an additional claim

### Requirement: Landing page accessible responsive experience
The landing page SHALL provide equivalent content, navigation, and CTA behavior across supported viewport sizes, light and dark themes, keyboard and assistive-technology use, 200% zoom, and reduced-motion preferences.

#### Scenario: Semantic page structure renders
- **WHEN** the landing page is inspected with accessibility semantics
- **THEN** it contains one H1, ordered H2 and H3 headings, a skip link to the main content, and labelled header navigation
- **AND** decorative relationship treatments are hidden from the accessibility tree
- **AND** visible brand text is not redundantly announced through the adjacent logo

#### Scenario: Keyboard navigation works
- **WHEN** a visitor uses only the keyboard
- **THEN** the skip link, locale links, mobile navigation disclosure, section links, sign-in or dashboard link, and access CTA are operable in logical order
- **AND** every interactive element has a visible focus state

#### Scenario: Small viewport and zoom reflow
- **WHEN** the landing is viewed at 375, 768, 1024, or 1440 CSS pixels or at 200% zoom
- **THEN** content remains readable in canonical order
- **AND** the page has no page-level horizontal overflow
- **AND** mobile controls provide a practical touch target with a preferred minimum of 44 by 44 CSS pixels

#### Scenario: Theme and motion preferences preserve meaning
- **WHEN** the visitor selects light theme, dark theme, or reduced motion
- **THEN** the page preserves the same content hierarchy, contrast-dependent meaning, navigation, and CTA behavior
- **AND** no required content or action depends on animation, hover, or motion
