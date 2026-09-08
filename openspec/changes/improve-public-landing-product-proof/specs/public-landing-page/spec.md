## ADDED Requirements

### Requirement: Landing feature-specific product proof composition
The landing page SHALL present Knowledge Graph, Live Charts, AI Assistant, and Telegram in their approved order with feature-specific editorial compositions. Each chapter MUST use the approved outcome as its semantic `h3`, present the feature name as a supporting label, keep essential meaning outside product captures, and preserve copy before media in DOM order.

#### Scenario: Knowledge Graph uses a wide evidence composition
- **WHEN** an approved Knowledge Graph capture exists for the active locale and the viewport is at least 1200 CSS pixels wide
- **THEN** the chapter presents its copy before a wide capture below it
- **AND** two or three adjacent text annotations identify the event, related asset, and source context actually visible in the approved capture
- **AND** the annotations are not interactive-looking hotspots positioned over the image

#### Scenario: Live Charts uses copy beside chart evidence
- **WHEN** an approved Live Charts capture exists for the active locale and the viewport is at least 1200 CSS pixels wide
- **THEN** the chapter visually presents copy on the left and the chart capture on the right
- **AND** the adjacent content explains price movement with event markers and economic-calendar context without presenting the static capture as a currently updating chart

#### Scenario: AI Assistant gives conversation evidence visual priority
- **WHEN** an approved AI Assistant capture exists for the active locale and the viewport is at least 1200 CSS pixels wide
- **THEN** the chapter visually presents the conversation capture on the left and copy on the right
- **AND** the DOM retains the feature label, outcome heading, and explanation before the media
- **AND** the chapter does not imply graph-node chat or automatic chart-context handoff

#### Scenario: Telegram prioritizes received content
- **WHEN** an approved Telegram capture exists for the active locale and the viewport is at least 1200 CSS pixels wide
- **THEN** the chapter visually presents copy on the left and a proportionally sized message capture on the right
- **AND** the capture emphasizes approved received content rather than a bot-administration screen
- **AND** it does not imply a public channel, unconfigured delivery, or guaranteed receipt

#### Scenario: Feature chapters reflow with semantic order
- **WHEN** the landing is viewed below 1200 CSS pixels or reflows at 200% zoom
- **THEN** every feature chapter renders as one column with the feature label, outcome heading, explanation, and optional capture in that order
- **AND** no CSS visual ordering places media before its explanatory copy
- **AND** the page has no product-chapter horizontal overflow

#### Scenario: Chapter hierarchy avoids repeated media copy
- **WHEN** a visitor reads any product chapter
- **THEN** the approved outcome is the chapter's primary heading and is visually more prominent than the feature label and body
- **AND** the page does not repeat the feature name and description inside a text-only media frame

### Requirement: Approved product capture governance
The landing build SHALL expose a product capture only when an explicit locale-specific approved descriptor references an available Signapse product surface or real Signapse Telegram message prepared from a demo source authorized for public use. The descriptor MUST record a non-sensitive source/demo identifier, intrinsic dimensions, localized content references, and final Product Owner approval state without storing credentials or private data.

#### Scenario: Approved descriptor enables a capture
- **WHEN** a capture file and its locale-specific descriptor have passed public-data, privacy, licensing, attribution, product-claim, localization, dimensions, and Product Owner review
- **THEN** the corresponding landing chapter may render that capture
- **AND** its descriptor identifies the approved source/demo scenario and localized caption and alternative text

#### Scenario: File existence does not imply approval
- **WHEN** a product image exists in the repository but has no approved descriptor for the active locale
- **THEN** the public landing does not render it as product proof
- **AND** the image's presence is not treated as Product Owner approval

#### Scenario: Capture records exclude sensitive data
- **WHEN** capture metadata is committed or inspected
- **THEN** it contains no account credential, bot token, private destination identifier, private workspace identity, or private conversation content
- **AND** it is sufficient to distinguish missing, awaiting-approval, and approved capture work outside the runtime UI

#### Scenario: Telegram capture preparation has no unauthorized side effect
- **WHEN** the Telegram proof asset is being prepared without separate authorization for a specific destination and message
- **THEN** the preparation does not send a Telegram message, enable routing, or create a schedule
- **AND** the Telegram capture remains missing or awaiting approval rather than being simulated as delivered content

### Requirement: Landing product capture enlargement
Every approved product capture rendered on the landing page SHALL provide a localized visible action that opens that same capture in an accessible static-image dialog. The dialog MUST preserve the visitor's route and reading context and MUST NOT present carousel, autoplay, hotspot, product-control, zoom, or pan behavior.

#### Scenario: Visitor opens the matching larger image
- **WHEN** a visitor activates `Xem ảnh lớn` on `/vi` or `View larger image` on `/en` for an approved feature capture
- **THEN** a dialog opens with the same locale-specific capture at a larger responsive size
- **AND** the dialog has a visible localized feature title and Close control
- **AND** opening the dialog does not change the current URL

#### Scenario: Keyboard focus is contained and restored
- **WHEN** a keyboard visitor opens a product capture dialog
- **THEN** focus moves to the visible Close control and remains within the dialog while it is open
- **AND** Escape and the Close control dismiss the dialog
- **AND** focus returns to the exact enlargement trigger that opened it

#### Scenario: Dialog remains usable on constrained viewports
- **WHEN** the dialog is viewed on a mobile viewport or at 200% zoom
- **THEN** the image preserves its aspect ratio without stretching or meaning-changing crop
- **AND** required overflow is confined to the image/dialog content region
- **AND** the localized title and Close control remain reachable without page-level horizontal overflow

#### Scenario: Large rendition loads on demand
- **WHEN** an approved inline capture is visible but its enlargement dialog has not been opened
- **THEN** the larger optimized image rendition is not mounted for loading
- **WHEN** the visitor opens the dialog
- **THEN** the dialog exposes localized loading feedback until that rendition resolves

#### Scenario: Enlarged image fails to load
- **WHEN** the enlarged image cannot be loaded
- **THEN** the dialog presents localized failure feedback while retaining its title and working Close control
- **AND** the chapter's adjacent explanation and caption remain available outside the dialog

## MODIFIED Requirements

### Requirement: Landing page visual media readiness
The landing page SHALL render a complete text-first chapter whenever the active locale lacks an approved product capture for that feature. The affected chapter MUST omit its entire media surface, caption, reserved media footprint, and enlargement action rather than render synthetic product UI, generated imagery presented as a product screenshot, a cross-locale image, or a text-only placeholder. The existing localized control-free interactive market-context figure SHALL remain the Hero's conceptual progressive enhancement over its server-rendered silent dual-view fallback.

#### Scenario: Feature capture is not approved
- **WHEN** the active locale has no approved capture for a feature
- **THEN** the feature chapter renders its complete localized label, outcome heading, explanation, and applicable supporting detail
- **AND** it renders no media container, image caption, reserved media height, or enlargement trigger for that feature
- **AND** the absence is not presented to visitors as an error or unfinished placeholder

#### Scenario: One locale lacks an approved capture
- **WHEN** a feature capture is approved for one supported locale but not the active locale
- **THEN** the active locale remains text-first for that feature
- **AND** it does not render the other locale's image, caption, alternative text, or enlargement action

#### Scenario: Approved feature capture renders safely
- **WHEN** a locale-appropriate approved descriptor is available
- **THEN** the chapter renders the approved capture with intrinsic dimensions, responsive sizing, localized alternative text, and adjacent localized caption
- **AND** essential meaning remains available outside the image
- **AND** the image does not expose private, backend-only, unreleased, misleading, or unlicensed content

#### Scenario: Inline product capture fails
- **WHEN** an approved inline capture fails to load
- **THEN** the chapter's localized outcome, explanation, and caption remain readable
- **AND** the failure does not create page-level overflow or make the image the only source of essential information

#### Scenario: Existing conceptual Hero figure remains bounded
- **WHEN** the landing renders with or without approved product captures
- **THEN** the Hero market-context figure continues to present the Market Knowledge Graph and price action as complementary conceptual views
- **AND** it does not present itself as a live product chart, trading signal, approved product capture, or claim that the graph generates, transforms into, or predicts market prices
- **AND** this change does not add visible Hero figure controls or change its approved interaction and reduced-motion behavior
