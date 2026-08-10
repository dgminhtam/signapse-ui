## ADDED Requirements

### Requirement: Independently served static launch site
The system SHALL serve the coming-soon experience from a self-contained static deployment for `signapse.cloud` without requiring the Signapse application runtime, Clerk authentication, or backend APIs.

#### Scenario: Apex site loads independently
- **WHEN** a visitor opens `https://signapse.cloud/`
- **THEN** the coming-soon page loads using only static site assets
- **AND** it does not redirect to authentication or request application API data

#### Scenario: Development application remains isolated
- **WHEN** the coming-soon site is deployed or updated
- **THEN** the deployment and DNS target for `dev.signapse.cloud` remain unchanged

### Requirement: Vietnamese and English canonical routes
The static site SHALL render Vietnamese at `/` and English at `/en/`, with localized visible copy, assistive copy, metadata, and document language.

#### Scenario: Vietnamese root renders
- **WHEN** a visitor opens `/`
- **THEN** the document uses `lang="vi"`
- **AND** all visible and assistive page copy is Vietnamese

#### Scenario: English route renders
- **WHEN** a visitor opens `/en/`
- **THEN** the document uses `lang="en"`
- **AND** all visible and assistive page copy is English

#### Scenario: Visitor switches language
- **WHEN** a visitor activates the visible language switch on either locale page
- **THEN** the site navigates to the equivalent canonical route in the other language

#### Scenario: Locale metadata is discoverable
- **WHEN** a crawler inspects either locale document
- **THEN** that document exposes its own canonical URL
- **AND** it links Vietnamese, English, and `x-default` alternatives with `hreflang`

### Requirement: Concise Signapse product introduction
The static site SHALL identify Signapse with the approved logo and concise, evidence-centered product copy covering Chart Annotation, grounded Market Query, and connected Knowledge Graph context.

#### Scenario: First viewport communicates the launch
- **WHEN** a visitor views the first viewport
- **THEN** the page shows the Signapse logo, coming-soon status, primary product statement, launch date or countdown, and no more than one short supporting paragraph

#### Scenario: Product pillars render
- **WHEN** a visitor reviews the product summary
- **THEN** the page presents exactly three concise pillars for understanding price moves, asking grounded AI, and exploring connected market context
- **AND** each pillar explains a user value in one short supporting sentence

#### Scenario: Claims remain analysis-focused
- **WHEN** the page describes market intelligence or AI behavior
- **THEN** the copy centers evidence, context, and research support
- **AND** it does not claim guaranteed predictions, returns, trade signals, buy or sell advice, or automated execution

### Requirement: Approved dark brand presentation
The static site SHALL use the approved dark-background Signapse logo variant and a responsive dark visual system derived from the logo's mint, navy, and off-white colors.

#### Scenario: Approved logo renders
- **WHEN** either locale page loads
- **THEN** it renders an unmodified site-local copy sourced from `public/images/signapse_logo_dark.svg`
- **AND** the logo has an appropriate localized accessible name

#### Scenario: Layout adapts to viewport size
- **WHEN** the page is viewed at mobile, tablet, or desktop widths
- **THEN** the hero, countdown, language switch, and product pillars remain readable without horizontal page overflow

#### Scenario: Decorative signal visual renders
- **WHEN** the page includes signal nodes, lines, grids, or ambient effects
- **THEN** those elements remain decorative and hidden from assistive technology
- **AND** they do not present fictional market data or trading recommendations

### Requirement: Fixed launch countdown
The static site SHALL count down to `2026-09-01T09:00:00+07:00` as one absolute instant and SHALL localize countdown labels for the active page language.

#### Scenario: Countdown runs before launch
- **WHEN** the current instant is before `2026-09-01T09:00:00+07:00`
- **THEN** the page displays non-negative remaining days, hours, minutes, and seconds
- **AND** it displays the absolute launch date with the `UTC+7` timezone

#### Scenario: Countdown reaches launch
- **WHEN** the current instant reaches or passes `2026-09-01T09:00:00+07:00`
- **THEN** the page replaces the countdown with a localized launched state
- **AND** it does not display negative values or automatically redirect the visitor

#### Scenario: JavaScript is unavailable
- **WHEN** JavaScript is disabled or fails before the countdown initializes
- **THEN** the page still displays a localized no-script message containing the absolute launch date and timezone

#### Scenario: Countdown is announced accessibly
- **WHEN** assistive technology reads the pre-launch page
- **THEN** it can determine the fixed launch date without receiving per-second live announcements
- **AND** the transition to the launched state is announced politely

### Requirement: No lead capture or fabricated social proof
The coming-soon site MUST remain informational and MUST NOT collect visitor data or present unverifiable conversion claims.

#### Scenario: Visitor reviews available actions
- **WHEN** either locale page renders
- **THEN** it contains no waitlist form, request-access control, email input, referral control, or user-data submission

#### Scenario: Visitor reviews launch claims
- **WHEN** either locale page renders
- **THEN** it contains no fabricated waitlist count, testimonial, customer logo, scarcity claim, or usage metric

### Requirement: Accessible and lightweight static experience
The static site SHALL remain usable with keyboard navigation, reduced motion, zoom, and constrained networks without external runtime frameworks or client-side dependencies.

#### Scenario: Keyboard and focus behavior is inspected
- **WHEN** a keyboard user traverses the page
- **THEN** every interactive element is reachable in a logical order
- **AND** focus is visibly indicated

#### Scenario: Reduced motion is requested
- **WHEN** the visitor has enabled `prefers-reduced-motion: reduce`
- **THEN** decorative animation is disabled while countdown information remains available

#### Scenario: Text and boundaries are inspected
- **WHEN** foreground, muted text, focus indicators, or meaningful component boundaries appear on the dark background
- **THEN** they meet the applicable WCAG 2.2 AA contrast requirements

#### Scenario: Static dependencies are inspected
- **WHEN** the site files and network requests are reviewed
- **THEN** the experience uses no application bundle, remote JavaScript library, authentication SDK, or backend request
