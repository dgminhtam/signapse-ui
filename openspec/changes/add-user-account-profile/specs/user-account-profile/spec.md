## ADDED Requirements

### Requirement: Authenticated users can open the account profile screen
The system SHALL provide an account profile screen inside the protected main application route group.

#### Scenario: User opens account from the sidebar avatar menu
- **WHEN** an authenticated user opens the sidebar avatar menu and selects the account item
- **THEN** the app navigates to the localized account route
- **AND** the route is implemented under `app/[lang]/(main)/account/`
- **AND** the page uses the existing protected main layout shell

#### Scenario: Account route is rendered
- **WHEN** the authenticated user visits `/{lang}/account`
- **THEN** the account page renders inside the main app sidebar and header layout
- **AND** the page does not add a main card shell that duplicates breadcrumb identity

### Requirement: Account screen exposes personal and billing tabs
The system SHALL organize account content into personal information and billing tabs.

#### Scenario: Account page loads
- **WHEN** the user opens the account profile screen
- **THEN** the page shows a tab for personal information
- **AND** the page shows a tab for billing information
- **AND** the personal information tab is available as the primary account editing area

#### Scenario: User opens billing tab before billing scope exists
- **WHEN** the user selects the billing tab
- **THEN** the app shows an empty placeholder state
- **AND** the billing tab does not show fake billing data, payment controls, or billing API results

### Requirement: Personal profile data includes required contact fields
The system SHALL load user profile data with date of birth, phone number, and current user role name in addition to existing identity fields.

#### Scenario: Profile data is requested
- **WHEN** the account page loads the current user profile
- **THEN** the profile response includes `email`
- **AND** the profile response includes `birthDay` in `yyyy-MM-dd` format
- **AND** the profile response includes `phoneNumber`
- **AND** the profile response includes `role_name`
- **AND** the profile response includes the existing profile image data when available

#### Scenario: Existing user lacks new contact data
- **WHEN** the profile response has no saved date of birth or phone number
- **THEN** the personal information form renders those fields empty
- **AND** submitting the form requires the user to provide values before saving

#### Scenario: Profile data includes role classification
- **WHEN** the account page loads the current user profile
- **THEN** the personal information area displays the current user's `role_name`

### Requirement: Personal information form edits only editable profile fields
The system SHALL allow users to update first name, last name, date of birth, and phone number while keeping email disabled and role classification read-only.

#### Scenario: User views personal information
- **WHEN** the personal information tab is active
- **THEN** the form displays avatar, last name, first name, date of birth, email, phone number, and role classification
- **AND** last name and first name are marked and validated as required
- **AND** date of birth is marked and validated as required
- **AND** email is marked as required account information
- **AND** phone number is marked and validated as required
- **AND** role classification is displayed as read-only account information

#### Scenario: User edits profile fields
- **WHEN** the user changes first name, last name, date of birth, or phone number and saves
- **THEN** the update request sends `firstName`, `lastName`, `birthDay`, and `mobilePhone`
- **AND** the update request does not send email
- **AND** the update request does not send `role_name`
- **AND** the user receives localized success or error feedback

#### Scenario: User attempts to edit email
- **WHEN** the personal information form is displayed
- **THEN** the email control is disabled
- **AND** the user cannot change the email value through the profile form

#### Scenario: User views role classification
- **WHEN** the personal information form is displayed
- **THEN** the role classification is read-only
- **AND** the user cannot change role values through the profile form

#### Scenario: User cancels edits
- **WHEN** the user changes editable personal information and activates cancel
- **THEN** the form resets to the initially loaded profile data
- **AND** no profile update request is sent

### Requirement: Account profile UI follows Signapse composition rules
The system SHALL compose the account profile screen using existing Signapse UI, i18n, and accessibility patterns.

#### Scenario: Form is rendered
- **WHEN** the personal information form is displayed
- **THEN** it uses the existing focused form shell pattern
- **AND** submit shows a spinner and is disabled while pending
- **AND** user-facing copy comes from dictionaries instead of hardcoded component strings

#### Scenario: Localized routing is used
- **WHEN** navigation links to the account profile screen are rendered
- **THEN** they preserve the current locale with existing localized navigation helpers
- **AND** they do not hardcode `/vi` or `/en`

### Requirement: Users can start an account upgrade path
The system SHALL expose an upgrade account action next to the current role classification without implementing billing checkout in this change.

#### Scenario: User sees current role classification
- **WHEN** the personal information tab displays role classification
- **THEN** an upgrade account button is available near the role display
- **AND** the button uses localized copy

#### Scenario: User activates upgrade account
- **WHEN** the user activates the upgrade account button
- **THEN** the app opens or navigates to the billing area of the account screen
- **AND** the app does not mutate the user's role locally
- **AND** the app does not start a fake checkout or show fake billing data
