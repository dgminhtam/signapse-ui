## ADDED Requirements

### Requirement: Canonical Locale-Prefixed Routes
The application SHALL use a locale-prefixed route segment as the canonical source of truth for product locale. Supported locale route segments MUST be `vi` and `en`.

#### Scenario: Localized route renders with matching locale
- **WHEN** a user opens `/en/events`
- **THEN** the application renders the events screen with active locale `en`
- **AND** the root document language is `en`

#### Scenario: Vietnamese route renders with matching locale
- **WHEN** a user opens `/vi/events`
- **THEN** the application renders the events screen with active locale `vi`
- **AND** the root document language is `vi`

### Requirement: Proxy Locale Negotiation
The application SHALL redirect page requests without a supported locale prefix to a locale-prefixed URL. Locale negotiation MUST use the request `Accept-Language` header when available and MUST fall back to `vi` when no supported preference is found.

#### Scenario: Unprefixed request with English preference
- **WHEN** a user requests `/news-articles` with `Accept-Language: en-US,en;q=0.9`
- **THEN** the proxy redirects the request to `/en/news-articles`

#### Scenario: Unprefixed request without supported preference
- **WHEN** a user requests `/news-articles` without a supported `Accept-Language` preference
- **THEN** the proxy redirects the request to `/vi/news-articles`

#### Scenario: API request remains unprefixed
- **WHEN** a request targets `/api/auth/action`
- **THEN** the proxy MUST NOT rewrite or redirect it to a locale-prefixed API path

### Requirement: Locale Route Validation
The application SHALL validate the dynamic `lang` route parameter before rendering localized layouts or pages. Unsupported locale segments MUST not render localized product UI.

#### Scenario: Unsupported locale segment
- **WHEN** a user opens `/fr/events`
- **THEN** the application returns the framework not-found behavior for the unsupported locale

### Requirement: Server-First Dictionary Loading
The application SHALL load localized dictionaries through a server-only boundary using the active route locale. Client Components MUST NOT import the full multi-locale dictionary module as runtime data.

#### Scenario: Layout loads selected dictionary
- **WHEN** `app/[lang]/layout.tsx` renders with `params.lang` set to `en`
- **THEN** it loads the English dictionary through the server-only dictionary loader
- **AND** it passes only the selected dictionary to client localization context

#### Scenario: Client code consumes selected dictionary
- **WHEN** a Client Component needs localized copy
- **THEN** it reads the selected dictionary from the localization provider
- **AND** it does not import all locale dictionaries directly

### Requirement: Locale-Bound Formatting
The application SHALL expose date, number, percent, and currency formatters that are bound to the active route locale for normal UI usage. Product UI MUST NOT accidentally fall back to Vietnamese formatting while the active route locale is English.

#### Scenario: English route formats numbers with English locale
- **WHEN** a user views `/en` and a component calls the localization context number formatter without passing an explicit locale
- **THEN** the displayed number uses the English locale mapping

#### Scenario: Vietnamese route formats dates with Vietnamese locale
- **WHEN** a user views `/vi/events` and a component calls the localization context date formatter without passing an explicit locale
- **THEN** the displayed date uses the Vietnamese locale mapping

### Requirement: Language Switching Through Routes
The language selector SHALL switch languages by replacing the locale prefix in the current URL while preserving the non-locale path and query string. It MUST NOT set or depend on an app locale cookie.

#### Scenario: Switch from Vietnamese to English
- **WHEN** a user is on `/vi/events?page=2` and selects English
- **THEN** the app navigates to `/en/events?page=2`
- **AND** no app locale cookie mutation is required

#### Scenario: Switch from English to Vietnamese
- **WHEN** a user is on `/en/news-articles/42` and selects Vietnamese
- **THEN** the app navigates to `/vi/news-articles/42`

### Requirement: Backend Language Propagation From Route Locale
The application SHALL send backend `Accept-Language` from the active route locale for authenticated and public backend calls. Backend language propagation MUST NOT read the removed app locale cookie.

#### Scenario: English route calls backend
- **WHEN** a Server Component or Server Action runs for an English route and calls the backend
- **THEN** the backend request includes `Accept-Language: en`

#### Scenario: Vietnamese route calls backend
- **WHEN** a Server Component or Server Action runs for a Vietnamese route and calls the backend
- **THEN** the backend request includes `Accept-Language: vi`

### Requirement: Cookie Locale Removal
The application SHALL remove the cookie-based app locale source of truth. Runtime localization MUST NOT depend on `signapse_locale`, locale cookie parsing, or a locale-setting Server Action.

#### Scenario: Removed cookie does not affect active route locale
- **WHEN** a user opens `/en/events` with a stale `signapse_locale=vi` cookie
- **THEN** the application uses `en` as the active locale

#### Scenario: Static search finds no cookie locale runtime
- **WHEN** the implementation is complete
- **THEN** static search finds no runtime dependency on `signapse_locale` or `setAppLocale`
