# dev-auth-mode Specification

## Purpose
TBD - created by archiving change add-dev-auth-mode. Update Purpose after archive.
## Requirements
### Requirement: Development auth mode guard
The system SHALL support a server-side development auth mode that is enabled only when the configured auth mode is disabled and the app is not running in production.

#### Scenario: Enable outside production
- **WHEN** `SIGNAPSE_AUTH_MODE` is `disabled`
- **AND** the app is running outside production
- **THEN** development auth mode is enabled

#### Scenario: Ignore in production
- **WHEN** `SIGNAPSE_AUTH_MODE` is `disabled`
- **AND** the app is running in production
- **THEN** development auth mode remains disabled

### Requirement: No-login dashboard access in development auth mode
The system SHALL allow protected dashboard routes to render without a Clerk session when development auth mode is enabled.

#### Scenario: Open protected dashboard without session
- **WHEN** development auth mode is enabled
- **AND** a request opens a protected dashboard route without a Clerk session
- **THEN** the request is not redirected to sign-in
- **AND** the dashboard layout treats the request as authenticated

#### Scenario: Keep normal protection when disabled
- **WHEN** development auth mode is disabled
- **AND** a request opens a protected dashboard route without a Clerk session
- **THEN** the normal Clerk protection behavior applies

### Requirement: Backend requests omit Clerk tokens in development auth mode
The system SHALL omit Clerk bearer tokens from backend API and live stream proxy requests when development auth mode is enabled.

#### Scenario: Fetch backend without bearer token
- **WHEN** development auth mode is enabled
- **AND** a server-side backend request is made through the authenticated fetch path
- **THEN** the request is sent without an `Authorization` bearer token

#### Scenario: Stream backend without bearer token
- **WHEN** development auth mode is enabled
- **AND** the market chart live SSE proxy opens the backend stream
- **THEN** the backend stream request is sent without an `Authorization` bearer token

#### Scenario: Keep bearer token when disabled
- **WHEN** development auth mode is disabled
- **AND** a backend request requires authentication
- **THEN** the request uses the existing Clerk bearer token behavior

### Requirement: Development permissions
The system SHALL grant frontend permission gates in development auth mode without requiring a real `/me` permission list.

#### Scenario: Wildcard permission grants access
- **WHEN** development auth mode is enabled
- **AND** a page or component checks for any specific permission
- **THEN** the permission check passes

#### Scenario: Navigation is visible
- **WHEN** development auth mode is enabled
- **THEN** permission-gated dashboard navigation items are available

### Requirement: Development user fallback
The system SHALL provide a minimal development user identity when development auth mode is enabled and no Clerk user exists.

#### Scenario: Render sidebar user area
- **WHEN** development auth mode is enabled
- **AND** no Clerk user exists
- **THEN** the dashboard can render a development user display without crashing

#### Scenario: User API route in development auth mode
- **WHEN** development auth mode is enabled
- **AND** a request calls the user API route without a Clerk session
- **THEN** the route returns a development user response instead of an unauthorized response

