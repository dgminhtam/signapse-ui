## ADDED Requirements

### Requirement: Account profile excludes unsupported commercial capabilities

The system SHALL present the Account profile without billing, payment, package, plan, subscription, checkout, or upgrade affordances until a corresponding product capability and contract are defined.

#### Scenario: User views the account profile

- **WHEN** an authenticated user opens the Account profile
- **THEN** the page does not show billing tabs, billing placeholders, payment controls, package labels, or upgrade actions
- **AND** the page does not imply that an Account role is a commercial tier

#### Scenario: User opens the account avatar menu

- **WHEN** an authenticated user opens the account avatar menu
- **THEN** the menu does not show Upgrade or Billing items
- **AND** the existing Account entry remains available
- **AND** unrelated Notifications behavior remains unchanged

#### Scenario: User opens a legacy billing query

- **WHEN** an authenticated user opens `/{lang}/account?tab=billing`
- **THEN** the app renders the normal Account profile
- **AND** the app does not redirect to another billing destination or show roadmap messaging

## MODIFIED Requirements

### Requirement: Authenticated users can open the account profile screen

The system SHALL provide a single Account profile editing screen inside the protected main application route group.

#### Scenario: User opens account from the sidebar avatar menu

- **WHEN** an authenticated user opens the sidebar avatar menu and selects the Account item
- **THEN** the app navigates to the localized account route
- **AND** the route is implemented under `app/[lang]/(main)/account/`
- **AND** the page uses the existing protected main layout shell

#### Scenario: Account route is rendered

- **WHEN** the authenticated user visits `/{lang}/account`
- **THEN** the account page renders one direct profile editing surface inside the main app sidebar and header layout
- **AND** the page does not render a tab list
- **AND** the page does not add a main card shell that duplicates breadcrumb identity

### Requirement: Personal profile data includes required contact fields

The system SHALL load user profile data with date of birth, phone number, current Account role, and existing identity data.

#### Scenario: Profile data is requested

- **WHEN** the account page loads the current user profile
- **THEN** the profile response includes `email`
- **AND** the profile response includes `birthday` in `yyyy-MM-dd` format
- **AND** the profile response includes `phone`
- **AND** the profile response includes `role_name`
- **AND** the profile response includes the existing profile image data when available

#### Scenario: Existing user lacks required contact data

- **WHEN** the profile response has no saved date of birth or phone number
- **THEN** the profile form renders those fields empty
- **AND** submitting the form requires the user to provide values before saving

#### Scenario: Profile data includes an Account role

- **WHEN** the account page loads the current user profile
- **THEN** the profile form displays the current user's `role_name` as the read-only Account role
- **AND** a missing or empty `role_name` uses a localized missing-role fallback
- **AND** the Account role is not labeled as a package, plan, or subscription tier

### Requirement: Personal information form edits only editable profile fields

The system SHALL allow users to update first name, last name, date of birth, and phone number while keeping avatar, email, and Account role non-editable.

#### Scenario: User views personal information

- **WHEN** the Account profile form is displayed
- **THEN** the form displays avatar, last name, first name, date of birth, email, phone number, and Account role
- **AND** last name and first name are marked and validated as required
- **AND** date of birth is marked and validated as required
- **AND** phone number is marked and validated as required
- **AND** email and Account role are displayed as read-only account information

#### Scenario: User views the current avatar

- **WHEN** the Account profile form is displayed
- **THEN** the current avatar or its identity fallback is displayed as static content
- **AND** the avatar does not expose upload, replace, crop, or delete controls

#### Scenario: User edits profile fields

- **WHEN** the user changes first name, last name, date of birth, or phone number and saves
- **THEN** the app calls `PATCH /me` with `firstName`, `lastName`, `birthday`, and `phone`
- **AND** the update request does not send email, avatar data, or `role_name`
- **AND** the submitted strings are trimmed before transmission
- **AND** the user receives localized success or error feedback

#### Scenario: User views the sign-in email

- **WHEN** the Account profile form is displayed
- **THEN** the email control is read-only and has no required indicator
- **AND** the user can focus, select, and copy the email value
- **AND** localized helper text explains that the sign-in email cannot be edited in the profile form

#### Scenario: User views Account role

- **WHEN** the Account profile form is displayed
- **THEN** the Account role is read-only
- **AND** the user cannot change role values through the profile form
- **AND** no upgrade action is displayed near the role

#### Scenario: User changes a valid editable value

- **WHEN** the user changes an editable field and the form is valid
- **THEN** Restore and Save actions become enabled
- **AND** the form does not submit until the user activates Save

#### Scenario: User restores edits

- **WHEN** the user changes editable personal information and activates Restore
- **THEN** the form resets every editable field to the initially loaded profile data
- **AND** no profile update request is sent
- **AND** Restore and Save return to their pristine disabled state

#### Scenario: User saves valid edits

- **WHEN** the user activates Save on a dirty and valid form
- **THEN** Save and Restore are disabled while the update is pending
- **AND** Save displays a localized spinner state without changing the footer footprint
- **AND** a successful response makes the submitted values the new clean baseline

#### Scenario: Profile update fails

- **WHEN** the profile update returns an error
- **THEN** the form retains every value entered by the user
- **AND** the app displays localized error feedback
- **AND** the relevant actions become available for recovery

### Requirement: Account profile UI follows Signapse composition rules

The system SHALL compose the Account profile using the documented cardless focused-form, localization, responsive, and accessibility patterns.

#### Scenario: Cardless profile form is rendered

- **WHEN** the Account profile form is displayed
- **THEN** it uses the documented plain focused-form surface at the large form width
- **AND** the surface is centered within the app content pane and inherits app-shell gutters
- **AND** the surface has no outer card border, radius, background, or shadow
- **AND** the footer uses a top divider without a separate card background

#### Scenario: Identity and fields are arranged

- **WHEN** the Account profile form has sufficient width
- **THEN** the static avatar is aligned with the visible profile title and description
- **AND** related editable fields use a two-column grid
- **AND** email and Account role use the available full row width

#### Scenario: Profile form is constrained

- **WHEN** the profile is viewed on mobile, in a narrow content pane, or at 200% zoom
- **THEN** identity content and form fields reflow without horizontal page overflow
- **AND** editable fields use one column when two columns no longer fit
- **AND** all content and actions remain visible and operable

#### Scenario: Form controls are exposed accessibly

- **WHEN** the user navigates the Account profile form
- **THEN** each editable input has a visible localized label, native required state, semantic input type, and appropriate autocomplete metadata
- **AND** validation errors appear beside and are programmatically associated with their fields
- **AND** keyboard order follows visual order and visible focus is preserved
- **AND** placeholders do not merely repeat visible labels

#### Scenario: Account profile is loading

- **WHEN** account profile data has not finished loading
- **THEN** the route displays a cardless skeleton matching the final surface width, identity row, field grid, and footer footprint
- **AND** the loading state does not change the route content-width mode

#### Scenario: Account profile fails to load

- **WHEN** the account route encounters a loading error
- **THEN** the route displays a cardless localized error state aligned with the profile surface
- **AND** the error state provides a localized Retry action
- **AND** the error state does not expose a raw exception message

#### Scenario: Localized routing and copy are used

- **WHEN** navigation or user-facing account copy is rendered
- **THEN** internal navigation preserves the current locale through existing localized helpers
- **AND** labels, validation, loading, success, error, and recovery copy come from dictionaries
- **AND** the implementation does not hardcode `/vi` or `/en`

## REMOVED Requirements

### Requirement: Account screen exposes personal and billing tabs

**Reason**: Signapse has no billing, payment, subscription, or checkout capability, and the placeholder tab creates a false product affordance.

**Migration**: Render the existing Account profile form directly. Legacy billing query parameters have no special behavior and resolve to the normal profile page.

### Requirement: Users can start an account upgrade path

**Reason**: An upgrade action implies a commercial package and destination that are not defined by current product or backend contracts.

**Migration**: Keep Account role as read-only authorization information and remove the upgrade action without replacement.
