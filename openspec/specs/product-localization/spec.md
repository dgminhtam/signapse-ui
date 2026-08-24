# product-localization Specification

## Purpose
TBD - created by archiving change add-product-localization. Update Purpose after archive.
## Requirements
### Requirement: Document Language Metadata

The system SHALL reflect the active app locale in document language metadata.

#### Scenario: Root layout renders

- **WHEN** the application root layout renders
- **THEN** the `<html>` element MUST use `lang="vi"` for Vietnamese and `lang="en"` for English

### Requirement: Dictionary-Backed User-Facing Copy

The system SHALL render product UI copy from Vietnamese and English frontend dictionaries.

#### Scenario: User-facing copy renders

- **WHEN** navigation, toolbar controls, buttons, forms, dialogs, sheets, empty states, errors, toasts, list labels, detail labels, placeholders, or accessibility labels are displayed
- **THEN** the visible or assistive text MUST come from the active locale dictionary

#### Scenario: Locale changes

- **WHEN** a user changes the app locale from Vietnamese to English or from English to Vietnamese
- **THEN** user-facing product copy MUST update to the selected language after the route refresh

#### Scenario: Dictionary parity

- **WHEN** the frontend dictionaries are typechecked
- **THEN** Vietnamese and English dictionaries MUST expose the same message keys

### Requirement: Editor feedback avoids native browser dialogs

The application SHALL present editor input and recoverable editor failures through dictionary-backed application dialogs or toasts and MUST NOT invoke browser-native `prompt()`, `alert()`, or `confirm()` dialogs from application paths.

#### Scenario: Application source is inspected for native dialogs

- **WHEN** the editor application paths are statically inspected
- **THEN** no reachable browser-native `prompt()`, `alert()`, or `confirm()` call remains

### Requirement: Canonical Identifiers Are Not Translated

The system SHALL NOT translate canonical API identifiers or persisted/generated domain content as part of frontend localization.

#### Scenario: Backend data contains canonical values

- **WHEN** the UI displays enum values, permission keys, provider identifiers, model names, endpoint paths, request field names, `$filter` fields, upstream provider content, persisted domain content, or AI-generated records
- **THEN** the system MUST preserve the canonical value unless an existing presentation helper intentionally maps that value to localized display copy

#### Scenario: Backend returns localized error message

- **WHEN** a backend error response includes a `message` field
- **THEN** the frontend MUST render that message as received
- **AND** MUST NOT infer or mutate a separate `language` field in the response body

### Requirement: Locale-Aware Formatting

The system SHALL format human-facing dates, times, numbers, percentages, and currency values according to the active app locale.

#### Scenario: Vietnamese locale formats values

- **WHEN** the active app locale is `vi`
- **THEN** user-facing date, time, number, percent, and currency formatting MUST use Vietnamese-compatible locale settings

#### Scenario: English locale formats values

- **WHEN** the active app locale is `en`
- **THEN** user-facing date, time, number, percent, and currency formatting MUST use English-compatible locale settings

#### Scenario: Machine identifiers render

- **WHEN** the UI displays machine identifiers, cron expressions, route paths, permission keys, model ids, or API field names
- **THEN** the system MUST NOT apply locale formatting that changes the identifier value

### Requirement: Backend Language Header Propagation

The system SHALL send the active app locale to backend APIs using the standard `Accept-Language` request header.

#### Scenario: Authenticated backend call

- **WHEN** `fetchAuthenticated()` calls a backend endpoint
- **THEN** the request MUST include `Accept-Language` set to the active app locale
- **AND** the request MUST include `Accept: application/json`

#### Scenario: Public backend call

- **WHEN** `fetchPublic()` calls a backend endpoint
- **THEN** the request MUST include `Accept-Language` set to the active app locale
- **AND** the request MUST include `Accept: application/json`

#### Scenario: JSON request body is sent

- **WHEN** a backend request sends a JSON body
- **THEN** the request MUST include `Content-Type: application/json`

#### Scenario: FormData request body is sent

- **WHEN** a backend request sends `FormData`
- **THEN** the request MUST NOT force `Content-Type: application/json`

#### Scenario: Backend returns language metadata

- **WHEN** a backend response includes `Content-Language`
- **THEN** the frontend MUST NOT require that header for ordinary UI rendering
- **AND** smoke checks MAY inspect that header for debugging or contract verification

### Requirement: Localization Documentation

The system SHALL document the frontend/backend language contract for maintainers.

#### Scenario: API mapping documentation is reviewed

- **WHEN** a developer reads the API mapping documentation
- **THEN** it MUST describe that frontend backend calls use `Accept-Language` from the active app locale
- **AND** it MUST note that localized backend errors retain the existing `message` response shape

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
