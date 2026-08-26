## MODIFIED Requirements

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
- **AND** the page has no page-level horizontal overflow or clipped brand, label, CTA, figure control, or navigation control
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
