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

### Requirement: Knowledge Graph Hero proof
The landing page SHALL present the first Hero proof as a specialized AI Assistant operating on the Signapse Market Knowledge Graph. The localized copy SHALL state that the graph is built from multi-source market data through aggregation, evaluation, and analysis, while retaining Signapse's analysis-support and user-decision boundaries.

#### Scenario: Vietnamese Knowledge Graph proof renders
- **WHEN** a visitor reads the first Hero proof on `/vi`
- **THEN** its title is `Trợ lý AI chuyên biệt`
- **AND** its body is `Vận hành trên Đồ thị Tri thức, được xây dựng từ dữ liệu thị trường đa nguồn đã qua tổng hợp, đánh giá và phân tích.`
- **AND** the surrounding Hero continues to state that the user verifies sources and makes the trading decision

#### Scenario: English Knowledge Graph proof renders
- **WHEN** a visitor reads the first Hero proof on `/en`
- **THEN** its title is `Specialized AI Assistant`
- **AND** its body is `Powered by a Knowledge Graph built from multi-source market data—aggregated, evaluated, and analyzed.`
- **AND** the localized proof communicates the same market-context meaning as the Vietnamese copy

#### Scenario: Knowledge Graph claim remains bounded
- **WHEN** a visitor reads the localized Knowledge Graph Hero proof
- **THEN** the page describes analysis context rather than model training, trading signals, prediction accuracy, or automated execution
- **AND** it does not imply that every Assistant response contains a complete graph, evidence sheet, reasoning chain, or source citation

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
The landing page SHALL render a text-first composition whenever no locale-appropriate product capture has completed approval. In that state it SHALL render a localized interactive market-context figure as progressive enhancement over a server-rendered static dual-view fallback, and it MUST NOT render synthetic product UI, a generated image presented as a product screenshot, or an empty media placeholder.

#### Scenario: Screenshot assets are not yet available
- **WHEN** the landing has no approved capture for the active locale
- **THEN** the Hero and product chapters render their complete story in localized text and the Hero renders a labelled interactive market-context figure
- **AND** the page does not render the previous mock workspace, fake chart bars, fake confidence, fake evidence counts, Market Query preview, Theme node, control-looking product decoration, or fake market values

#### Scenario: Conceptual figure communicates without product mimicry
- **WHEN** the text-first Hero renders its interactive market-context figure
- **THEN** the figure presents the Market Knowledge Graph and price action as complementary views of market context
- **AND** it does not imply that the graph generates, transforms into, or predicts market prices
- **AND** it does not present itself as a live product chart, trading signal, automated-execution surface, or approved product capture
- **AND** it does not display tickers, prices, axes, metrics, trading controls, dashboard chrome, or data that could be mistaken for live market output

#### Scenario: Localized figure identity renders
- **WHEN** a visitor reads the interactive market-context figure on `/vi`
- **THEN** its visible title is `Hai góc nhìn về bối cảnh thị trường`
- **AND** its visible mode labels are `Đồ thị Tri thức thị trường` and `Diễn biến giá`
- **AND** all hints, controls, status messages, and accessible descriptions are natural Vietnamese
- **AND** the obsolete `01 / 03` metadata is absent

#### Scenario: English figure identity renders
- **WHEN** a visitor reads the interactive market-context figure on `/en`
- **THEN** its visible title is `Two views of market context`
- **AND** its visible mode labels are `Market Knowledge Graph` and `Price action`
- **AND** all hints, controls, status messages, and accessible descriptions are natural English
- **AND** the obsolete `01 / 03` metadata is absent

#### Scenario: Static fallback preserves the complete figure meaning
- **WHEN** JavaScript has not hydrated, WebGL cannot initialize, or the interactive renderer loses its graphics context
- **THEN** the Hero keeps a server-rendered static dual-view figure in the same layout footprint
- **AND** the fallback communicates both the Market Knowledge Graph and price action through localized adjacent text
- **AND** unavailable interactive controls are not presented as operable
- **AND** a runtime failure returns to the fallback without exposing a technical exception or blocking the landing journey

#### Scenario: Surrounding Hero content remains stable
- **WHEN** the interactive market-context figure replaces the previous conceptual diagram
- **THEN** the localized Hero headline, supporting copy, CTA behavior, trust note, proof label, and three proof points remain unchanged
- **AND** the canonical landing section order and all sections outside the figure remain unchanged

#### Scenario: One locale lacks an approved capture
- **WHEN** a product capture is approved for one locale but not the other
- **THEN** the locale without an approved asset remains text-first and renders its localized interactive market-context figure
- **AND** it does not fall back to the other locale's image or visible labels

#### Scenario: Screenshot assets become available
- **WHEN** a locale-appropriate capture passes public-data, privacy, licensing, attribution, claim, localization, intrinsic-size, and performance review
- **THEN** the corresponding media slot may render that capture with localized alternative text
- **AND** adjacent text communicates the same essential insight
- **AND** adopting that capture requires an explicit follow-up decision rather than silently removing the interactive market-context figure

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
The landing page SHALL provide equivalent content, navigation, CTA behavior, and interactive market-context figure behavior across supported viewport sizes, light and dark themes, fine and coarse pointers, keyboard and assistive-technology use, 200% zoom, and reduced-motion preferences. The small-viewport header SHALL keep brand, the auth-aware primary CTA, and the navigation disclosure visible without clipping while preserving locale and secondary access actions inside the disclosure.

#### Scenario: Semantic page structure renders
- **WHEN** the landing page is inspected with accessibility semantics
- **THEN** it contains one H1, ordered H2 and H3 headings, a skip link to the main content, and labelled header navigation
- **AND** the interactive market-context figure exposes a concise localized text summary and input instructions
- **AND** the interactive stage uses a labelled focusable group rather than application-mode semantics
- **AND** the canvas and decorative geometry are hidden from the accessibility tree
- **AND** visible brand text is not redundantly announced through the adjacent logo

#### Scenario: Keyboard navigation works
- **WHEN** a visitor uses only the keyboard
- **THEN** the skip link, locale links, mobile navigation disclosure, section links, sign-in or dashboard link, access CTA, interactive figure, and auto-rotation control are operable in logical order
- **AND** Enter or Space switches between Market Knowledge Graph and price action
- **AND** the arrow keys rotate the current visual mode without trapping focus
- **AND** mode changes are announced through a polite status region
- **AND** every interactive element has a visible focus state

#### Scenario: Fine pointer previews and pins price action
- **WHEN** a visitor with a fine pointer hovers an unpinned interactive figure
- **THEN** the figure previews price action
- **AND** leaving the figure returns to the Market Knowledge Graph
- **WHEN** the visitor clicks to pin price action
- **THEN** leaving the figure does not change the pinned mode
- **AND** clicking again returns to the Market Knowledge Graph

#### Scenario: Touch distinguishes mode switching from rotation
- **WHEN** a visitor taps the interactive figure without crossing the drag threshold
- **THEN** the figure switches and pins the complementary mode
- **WHEN** the visitor drags beyond the threshold
- **THEN** the current mode rotates without switching modes
- **AND** releasing the drag resumes auto-rotation when the visitor has not paused it

#### Scenario: Auto-rotation remains controllable
- **WHEN** the visitor has not requested reduced motion
- **THEN** the figure begins with bounded auto-rotation and provides a visible localized Pause control
- **WHEN** the visitor pauses auto-rotation
- **THEN** automatic rotation stops while hover, tap, click, drag, keyboard rotation, and mode switching remain available
- **AND** the same control can resume auto-rotation without resetting the current mode or orientation

#### Scenario: Small viewport header preserves primary actions
- **WHEN** the landing header is viewed at a width where its full navigation and locale controls do not fit
- **THEN** brand, the auth-aware primary CTA, and the disclosure trigger remain visible in the primary header row
- **AND** locale links, section navigation, and any anonymous secondary sign-in action remain available inside the disclosure
- **AND** no control is made inaccessible by page-level clipping

#### Scenario: Small viewport and zoom reflow
- **WHEN** the landing is viewed at 375, 768, 1024, or 1440 CSS pixels or at 200% zoom
- **THEN** content remains readable in canonical order
- **AND** the figure remains within the existing Hero reading flow and does not use the standalone demo's oversized layout
- **AND** the page has no page-level horizontal overflow or clipped brand, label, CTA, or navigation control
- **AND** mobile controls provide a practical touch target with a preferred minimum of 44 by 44 CSS pixels

#### Scenario: Default motion explains the conceptual flow
- **WHEN** the visitor has not requested reduced motion and the Hero first renders
- **THEN** copy and Hero entrance emphasis may run once without blocking interaction or changing layout bounds
- **AND** the interactive figure may morph and auto-rotate only while it remains active and controllable
- **AND** its animation does not replay on scroll or reset the visitor's selected mode or orientation

#### Scenario: Theme and motion preferences preserve meaning
- **WHEN** the visitor selects light theme or dark theme
- **THEN** the figure preserves equivalent hierarchy and contrast through the active visual theme without resetting its in-memory interaction state
- **WHEN** the visitor has requested reduced motion
- **THEN** the figure starts without auto-rotation and switches modes immediately without animated morphing
- **AND** a localized control allows the visitor to opt into auto-rotation for the current page while mode changes remain immediate
- **AND** no required content or action depends on animation, hover, or motion

#### Scenario: Inactive rendering is suspended
- **WHEN** the figure is outside the active viewport, the document is hidden, or auto-rotation is paused with no morph or manual interaction in progress
- **THEN** ongoing animation work stops
- **AND** returning the figure to an active state resumes from the current in-memory mode and orientation rather than resetting the visual
