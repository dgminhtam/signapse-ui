## MODIFIED Requirements

### Requirement: Landing page dictionary copy
The system SHALL render all landing-page user-facing and assistive content from Vietnamese and English frontend dictionaries selected by the active locale route. The localized contract SHALL cover headings, body copy, proof points, qualifiers, CTA and navigation labels, email behavior microcopy, locale-control labels, alternative text, document metadata, and social-card titles.

#### Scenario: Vietnamese landing copy
- **WHEN** a visitor opens `/vi`
- **THEN** landing headings, body copy, CTA labels, navigation labels, proof points, trust copy, email microcopy, metadata, social-card title, and accessibility labels render in natural Vietnamese from the selected dictionary
- **AND** the Analysis Flow uses `Theo dõi → Đặt vào bối cảnh → Kiểm tra → Khám phá`

#### Scenario: English landing copy
- **WHEN** a visitor opens `/en`
- **THEN** landing headings, body copy, CTA labels, navigation labels, proof points, trust copy, email microcopy, metadata, social-card title, and accessibility labels render in English from the selected dictionary
- **AND** the Analysis Flow uses `Track → Contextualize → Inspect → Explore`

#### Scenario: Dictionary parity includes landing keys
- **WHEN** the frontend dictionaries are typechecked
- **THEN** Vietnamese and English dictionaries expose matching message keys for the canonical eight-part landing story, CTA states, metadata, social artwork, locale navigation, and accessibility labels
- **AND** obsolete problem, pillars, pipeline, personalization, synthetic-preview, and Market Query landing keys are absent when no runtime caller remains

#### Scenario: Landing copy avoids hardcoded user-facing strings
- **WHEN** the localized landing implementation is statically inspected
- **THEN** visible and assistive copy comes from the selected dictionary
- **AND** only canonical product identifiers, route fragments, the locked request-access address and subject, and other non-translated machine values may remain outside dictionary copy

#### Scenario: Locale-specific media text does not fall back across languages
- **WHEN** a localized social card or later approved capture contains visible language-dependent text
- **THEN** the active route uses the corresponding Vietnamese or English asset or generated output
- **AND** a missing locale-specific product capture causes text-first rendering rather than fallback to the other language

## REMOVED Requirements

### Requirement: Cookie-Based App Locale
**Reason**: Locale-prefixed routes already provide the canonical product locale, and retaining a cookie source of truth creates a contradictory localization contract.

**Migration**: Resolve locale from the supported URL segment and follow the canonical `nextjs-locale-routing` requirements; stale `signapse_locale` values do not affect rendering.

### Requirement: Language Selector
**Reason**: The cookie-mutating app-shell selector contract is superseded by route-based language switching and cannot define the landing link behavior.

**Migration**: Follow the canonical `nextjs-locale-routing` language-switching requirement and the landing-specific localized-navigation requirement in `public-landing-page`.

### Requirement: Landing V2 localized copy parity
**Reason**: The V2 landing schema encodes the removed problem, pillars, pipeline, personalization, and synthetic visual composition.

**Migration**: Use the modified `Landing page dictionary copy` requirement for the canonical landing schema and complete visible, assistive, metadata, and social-card parity.
