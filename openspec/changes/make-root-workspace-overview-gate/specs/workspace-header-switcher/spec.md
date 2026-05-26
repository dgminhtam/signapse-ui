## ADDED Requirements

### Requirement: Protected app root uses overview identity
The protected app shell SHALL present the root route as the workspace overview rather than as a generic home page.

#### Scenario: Root breadcrumb renders
- **WHEN** a user opens the protected app root route
- **THEN** the breadcrumb/page identity uses `Tổng quan` in Vietnamese and `Overview` in English
- **AND** it does not label the protected root workspace surface as `Trang chủ` or `Home`

#### Scenario: Nested protected route breadcrumb renders
- **WHEN** a user opens a nested protected route
- **THEN** the root breadcrumb link points to `/` and uses the overview label
- **AND** the nested route label continues to use the existing localized friendly segment mapping

### Requirement: Overview identity copy stays localized
All user-facing copy introduced or changed for the root overview identity SHALL come from the app dictionaries.

#### Scenario: Developer reviews touched root identity copy
- **WHEN** the sidebar label, breadcrumb label, or root overview identity copy is reviewed
- **THEN** the code reads localized strings from the dictionary/provider helpers
- **AND** no new hardcoded user-facing Vietnamese or English labels are introduced in components
