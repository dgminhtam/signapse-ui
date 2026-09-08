## ADDED Requirements

### Requirement: Landing product capture localization
The system SHALL source all product-capture captions, alternative text, adjacent Knowledge Graph annotations, enlargement actions, dialog titles, Close labels, loading feedback, and failure feedback from matching Vietnamese and English frontend dictionaries. The two dictionaries MUST expose the same product-media message structure while allowing natural localized wording based on each approved capture.

#### Scenario: Vietnamese approved capture controls render
- **WHEN** a visitor opens `/vi` and an approved capture exists for a feature
- **THEN** its caption and alternative text render in Vietnamese
- **AND** its visible enlargement action is `Xem ảnh lớn`
- **AND** the opened dialog uses a Vietnamese feature title, visible `Đóng` control, and Vietnamese loading or failure feedback when applicable

#### Scenario: English approved capture controls render
- **WHEN** a visitor opens `/en` and an approved capture exists for a feature
- **THEN** its caption and alternative text render in English
- **AND** its visible enlargement action is `View larger image`
- **AND** the opened dialog uses an English feature title, visible `Close` control, and English loading or failure feedback when applicable

#### Scenario: Knowledge Graph annotations preserve locale and image truth
- **WHEN** the approved Knowledge Graph capture renders with adjacent annotations
- **THEN** each annotation is sourced from the active locale dictionary
- **AND** it describes a relationship or entity actually visible in that locale's approved image
- **AND** it does not introduce a causal or product-capability claim absent from the image and adjacent chapter copy

#### Scenario: Media dictionary parity is typechecked
- **WHEN** the Vietnamese and English frontend dictionaries are typechecked
- **THEN** they expose matching keys for every configured feature caption, alternative text, optional annotation, enlargement action, dialog title, Close label, loading state, and failure state
- **AND** visible or assistive product-media copy is not hardcoded in the landing components

#### Scenario: Missing localized capture does not borrow another language
- **WHEN** the active locale has no approved descriptor for a feature
- **THEN** the chapter omits that feature's capture, caption, and enlargement action
- **AND** dictionary availability alone does not cause an image from another locale to render
