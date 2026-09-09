## ADDED Requirements

### Requirement: Fixed Signapse landing composition
The localized public landing page SHALL render a fixed route-scoped Signapse brand composition independently of the active global light or dark theme. It MUST use the approved Signapse navy, navy-surface, mint, off-white, muted, and boundary palette as its visual authority, MAY use contrast-safe derived shades from the same color families, and MUST NOT change the global theme tokens, shared component chrome, or the visitor's stored application theme preference.

#### Scenario: Landing renders the same composition under either global theme
- **WHEN** a visitor opens the landing while the application theme is light or dark
- **THEN** the header, Hero, final access CTA, and footer render with the dark navy surface family
- **AND** Product Story, Analysis Flow, and Trust Boundary render with the off-white surface family
- **AND** mint remains the landing's primary decorative and interactive accent
- **AND** changing the global theme does not change those landing surface roles or reset the in-memory market-context figure state

#### Scenario: Landing preserves the visitor's application preference
- **WHEN** a visitor with a stored light or dark preference visits the landing and then opens the protected dashboard
- **THEN** the landing has not changed or removed that preference
- **AND** the protected dashboard renders using the visitor's stored application theme

#### Scenario: Landing palette remains route-scoped
- **WHEN** the fixed landing composition is applied
- **THEN** its palette is owned by the public landing composition and inherited only by landing descendants
- **AND** global light/dark tokens, the Nova preset, shared shadcn wrapper chrome, and protected application surfaces remain unchanged

#### Scenario: Brand assets follow the landing surface
- **WHEN** the Signapse logo appears on a dark or light landing surface
- **THEN** the logo variant is selected for contrast with that surface
- **AND** its variant does not depend on the active global theme

### Requirement: Landing visual palette integrity
The public landing SHALL apply its route-scoped palette to the existing grid, boundaries, surfaces, focus treatment, controls, and capture frames without introducing a new decorative system. The interactive Hero renderer and its server-rendered fallback MUST resolve the same landing palette while retaining the existing figure geometry, meaning, interaction, motion, lifecycle, and accessibility contracts. Approved product captures MUST retain their original image pixels and approval identity.

#### Scenario: Interactive and fallback Hero visuals share one palette
- **WHEN** the interactive renderer initializes successfully or the static fallback is shown
- **THEN** the visible figure uses the landing navy, mint, off-white, muted, and boundary semantics from the landing palette owner
- **AND** switching the global light/dark theme does not select a different figure palette
- **AND** figure geometry, graph and price-action modes, pointer and keyboard interaction, reduced-motion behavior, and nonvisual meaning remain unchanged

#### Scenario: Existing decoration is retinted without expansion
- **WHEN** the landing renders its grid, borders, surfaces, controls, and focus indicators
- **THEN** those treatments use the fixed landing palette with accessible contrast
- **AND** the page does not add mathematical-symbol fields, noise textures, connector backgrounds, new decorative motion, or Graphify assets

#### Scenario: Approved product captures remain unmodified
- **WHEN** an approved Graph View or Live Charts capture renders on the landing
- **THEN** it retains its approved source, intrinsic dimensions, localized alternative text and caption, approval status, and original image colors
- **AND** no filter, tint, overlay, blend mode, or decorative opacity is applied to the image
- **AND** only the surrounding frame, caption, loading surface, and localized failure treatment use landing palette semantics

## MODIFIED Requirements

### Requirement: Landing page accessible responsive experience
The landing page SHALL provide equivalent content, navigation, CTA behavior, fixed branded composition, and interactive market-context figure behavior across supported viewport sizes, either global light or dark theme setting, fine and coarse pointers, keyboard and assistive-technology use, 200% zoom, and reduced-motion preferences. Its fixed composition MUST maintain WCAG 2.2 AA contrast and MUST preserve rather than modify the visitor's global theme preference. The small-viewport header SHALL keep brand, the auth-aware primary CTA, and the navigation disclosure visible without clipping while preserving locale and secondary access actions inside the disclosure.

#### Scenario: Semantic page structure renders
- **WHEN** the landing page is inspected with accessibility semantics
- **THEN** it contains one H1, ordered H2 and H3 headings, a skip link to the main content, and labelled header navigation
- **AND** the interactive market-context figure exposes a concise localized nonvisual name, description, and input instructions
- **AND** the interactive stage uses a labelled focusable group rather than application-mode semantics
- **AND** the canvas and decorative geometry are hidden from the accessibility tree
- **AND** visible brand text is not redundantly announced through the adjacent logo

#### Scenario: Keyboard navigation works
- **WHEN** a visitor uses only the keyboard
- **THEN** the skip link, locale links, mobile navigation disclosure, section links, sign-in or dashboard link, access CTA, and interactive figure are operable in logical order
- **AND** Enter or Space switches between Market Knowledge Graph and price action
- **AND** the arrow keys rotate the current visual mode without trapping focus
- **AND** mode changes are announced through a polite status region
- **AND** every interactive element has a visible focus state

#### Scenario: Fine pointer previews without click pinning
- **WHEN** a visitor with a fine pointer enters an interactive figure without dragging
- **THEN** the figure previews price action
- **AND** leaving the figure returns to the Market Knowledge Graph
- **AND** clicking the figure does not pin or toggle its mode

#### Scenario: Touch preserves rotation without a hidden tap mode
- **WHEN** a visitor taps the interactive figure without crossing the drag threshold
- **THEN** the figure mode does not change or become pinned
- **WHEN** the visitor drags beyond the threshold
- **THEN** the current mode rotates without switching modes

#### Scenario: Automatic rotation remains control-free
- **WHEN** the visitor views the figure without requesting reduced motion
- **THEN** the active view keeps rotating while visible and not being dragged
- **AND** the figure provides no visible pause or mode control

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
- **AND** the interactive figure may keep rotating its active view while visible and not being dragged
- **AND** its animation does not reset the visitor's selected mode or orientation

#### Scenario: Fixed palette and motion preferences preserve meaning
- **WHEN** the visitor selects light theme or dark theme while viewing the landing
- **THEN** the landing and figure retain the same fixed branded hierarchy and contrast without resetting in-memory interaction state or changing the stored theme preference
- **WHEN** the visitor has requested reduced motion
- **THEN** the figure starts without automatic rotation and switches modes immediately without animated morphing
- **AND** no required content or action depends on animation, hover, or motion

#### Scenario: Inactive rendering is suspended
- **WHEN** the figure is outside the active viewport, the document is hidden, or automatic rotation is disabled by reduced motion with no morph or manual interaction in progress
- **THEN** ongoing animation work stops
- **AND** returning the figure to an active state preserves the current in-memory mode and orientation
