## ADDED Requirements

### Requirement: Locale root public entry
The application SHALL use each supported locale root as the public product landing entry instead of the authenticated dashboard entry.

#### Scenario: Locale root opens public landing
- **WHEN** a user opens `/vi` or `/en`
- **THEN** the application renders the localized public landing page
- **AND** it does not require workspace permissions before rendering the page

#### Scenario: Dashboard opens at explicit path
- **WHEN** an authenticated user opens `/vi/dashboard` or `/en/dashboard`
- **THEN** the application renders the protected dashboard entry in the matching route locale

