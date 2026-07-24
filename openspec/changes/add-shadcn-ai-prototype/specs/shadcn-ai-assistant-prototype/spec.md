## ADDED Requirements

### Requirement: Isolated protected prototype route
The system SHALL expose a locale-prefixed prototype route inside the protected app shell without changing the existing global AI assistant modal, its trigger, or its runtime.

#### Scenario: Authorized user opens the prototype route
- **WHEN** a user with market-query execution permission opens the localized prototype URL
- **THEN** the system SHALL render the shadcn AI assistant prototype in the protected application layout
- **AND** the existing global assistant remains independently available

#### Scenario: Unauthorized user opens the prototype route
- **WHEN** a user without market-query execution permission opens the localized prototype URL
- **THEN** the system SHALL not expose a usable prototype conversation surface

### Requirement: Fixture-driven prototype behavior
The prototype SHALL use deterministic local conversation fixtures and browser-local interaction state and MUST NOT call market-conversation server actions or persist data.

#### Scenario: User interacts with the prototype
- **WHEN** a user selects fixture history, loads older fixture messages, expands analysis, or submits a non-empty fixture draft
- **THEN** the prototype SHALL update only local UI state
- **AND** it SHALL not create, read, update, or delete persisted market conversations

#### Scenario: Prototype route is loaded
- **WHEN** the prototype route renders
- **THEN** the transcript SHALL include representative empty, history, older-message, pending, failure, and market-analysis states through local fixtures

### Requirement: Shadcn conversation composition
The prototype SHALL compose the conversation viewport with the installed shadcn message-scroller, message, bubble, and marker wrappers.

#### Scenario: Conversation messages render
- **WHEN** the prototype renders user, assistant, pending, or failed fixture messages
- **THEN** message rows SHALL use the shadcn message wrapper
- **AND** message content SHALL use the shadcn bubble wrapper
- **AND** pending or status content SHALL use the shadcn marker wrapper

#### Scenario: Older fixture messages are added
- **WHEN** a user activates the older-message control
- **THEN** the prototype SHALL prepend the fixture messages through the shadcn message scroller
- **AND** the scroller SHALL retain a stable reading position

### Requirement: Localized and accessible prototype controls
The prototype SHALL use dictionary-backed English and Vietnamese copy and provide accessible names and keyboard behavior for its history, composer, analysis, and message-navigation controls.

#### Scenario: Keyboard user operates the prototype
- **WHEN** a keyboard user tabs through the prototype
- **THEN** interactive controls SHALL have an accessible name and a predictable focus order
- **AND** the composer SHALL have an associated label

#### Scenario: User changes the active locale
- **WHEN** a user opens the prototype in English or Vietnamese
- **THEN** all prototype-visible copy SHALL come from the active locale dictionary
