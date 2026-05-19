# product-localization Specification

## Purpose
TBD - created by archiving change add-product-localization. Update Purpose after archive.
## Requirements
### Requirement: Cookie-Based App Locale

The system SHALL use a cookie-based app locale preference as the source of truth for frontend product language.

#### Scenario: Locale cookie is valid

- **WHEN** the `signapse_locale` cookie contains `vi` or `en`
- **THEN** the system MUST use that locale for frontend copy, document language metadata, formatting, and backend API language propagation

#### Scenario: Locale cookie is absent or invalid

- **WHEN** the `signapse_locale` cookie is absent, empty, or contains an unsupported value
- **THEN** the system MUST fall back to Vietnamese (`vi`)
- **AND** the system MUST NOT expose the unsupported value to UI rendering or backend API requests

#### Scenario: Locale preference is stored

- **WHEN** a user selects a supported language
- **THEN** the system MUST persist the selected locale in a cookie scoped to `/`
- **AND** subsequent server-rendered pages and server actions MUST resolve the selected locale from that cookie

### Requirement: Language Selector

The system SHALL provide an authenticated app-shell language selector for Vietnamese and English.

#### Scenario: User changes language

- **WHEN** an authenticated user selects a different supported language from the app shell
- **THEN** the system MUST update the app locale cookie
- **AND** refresh the current route so Server Components, Client Components, and backend API calls use the selected locale

#### Scenario: Selector renders current language

- **WHEN** the language selector is visible
- **THEN** it MUST indicate the active language
- **AND** it MUST expose accessible labels in the active locale

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

