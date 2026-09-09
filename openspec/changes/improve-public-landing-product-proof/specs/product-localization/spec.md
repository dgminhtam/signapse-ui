## ADDED Requirements

### Requirement: Landing product capture localization
For the media-enabled Knowledge Graph and Live Charts chapters, the system SHALL source all product-capture labels, captions, alternative text, adjacent Knowledge Graph annotations, and inline failure feedback from matching Vietnamese and English frontend dictionaries. The two dictionaries MUST expose the same product-media message structure while allowing natural localized wording based on each approved capture. AI Assistant and Telegram SHALL require no media-specific dictionary keys.

#### Scenario: Vietnamese approved capture content renders
- **WHEN** a visitor opens `/vi` and an approved capture exists for a feature
- **THEN** its caption and alternative text render in Vietnamese
- **AND** its accessible media label and inline failure feedback are Vietnamese

#### Scenario: English approved capture content renders
- **WHEN** a visitor opens `/en` and an approved capture exists for a feature
- **THEN** its caption and alternative text render in English
- **AND** its accessible media label and inline failure feedback are English

#### Scenario: Knowledge Graph annotations preserve locale and image truth
- **WHEN** the approved Knowledge Graph capture renders with adjacent annotations
- **THEN** each annotation is sourced from the active locale dictionary
- **AND** it describes a relationship or entity actually visible in that locale's approved image
- **AND** it does not introduce a causal or product-capability claim absent from the image and adjacent chapter copy

#### Scenario: Media dictionary parity is typechecked
- **WHEN** the Vietnamese and English frontend dictionaries are typechecked
- **THEN** they expose matching keys for every configured feature label, caption, alternative text, optional annotation, and failure state
- **AND** visible or assistive product-media copy is not hardcoded in the landing components

#### Scenario: Missing localized capture does not borrow another language
- **WHEN** the active locale has no approved descriptor for Knowledge Graph or Live Charts
- **THEN** the chapter omits that feature's capture and caption
- **AND** dictionary availability alone does not cause an image from another locale to render
