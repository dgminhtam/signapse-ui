## ADDED Requirements

### Requirement: Landing V2 localized copy parity
The system SHALL provide English and Vietnamese dictionary copy for every visible or assistive landing V2 string.

#### Scenario: V2 dictionary parity
- **WHEN** the landing V2 implementation is typechecked
- **THEN** English and Vietnamese dictionaries expose matching keys for hero, problem, pillars, pipeline, personalization, trust, final CTA, and visual labels

#### Scenario: Landing V2 page uses dictionary copy
- **WHEN** `app/[lang]/page.tsx` renders visible or assistive landing text
- **THEN** the text comes from the active locale dictionary except canonical product identifiers, route paths, symbols, and numeric illustrative values

