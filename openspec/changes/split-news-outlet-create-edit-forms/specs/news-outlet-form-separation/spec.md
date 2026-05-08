## ADDED Requirements

### Requirement: News outlet create and edit forms are separate
The news outlet create and edit flows SHALL use separate submit-owning form components instead of one shared form component that switches behavior by `initialData`, `mode`, or `isEdit`.

#### Scenario: Create page renders the create form
- **WHEN** `/news-outlets/create` renders
- **THEN** it MUST render a create-specific form component that owns create copy, create defaults, create payload construction, and `createNewsOutlet` submission

#### Scenario: Edit page renders the update form
- **WHEN** `/news-outlets/{id}` renders the current edit surface
- **THEN** it MUST render an update-specific form component that owns update copy, fetched initial values, metadata display, reset-to-original behavior, and `updateNewsOutlet` submission

#### Scenario: No shared submit-owning form remains
- **WHEN** the news outlet feature is searched for form components
- **THEN** there MUST NOT be a shared `NewsOutletForm`-style component that decides create versus edit using `initialData`, `mode`, or `isEdit`

### Requirement: Shared field primitives remain mode-agnostic
The news outlet feature MAY share field-level primitives or helpers between create and edit only when those shared pieces do not own submission and do not branch on create/edit mode.

#### Scenario: Shared field helper is used
- **WHEN** create and edit forms share input field JSX or helper functions
- **THEN** the shared code MUST receive concrete field/control props and MUST NOT call `createNewsOutlet`, call `updateNewsOutlet`, own footer actions, or branch on `isEdit`

#### Scenario: Flow-specific behavior is needed
- **WHEN** copy, metadata, reset behavior, payload construction, or mutation handling differs between create and edit
- **THEN** that behavior MUST live in the create-specific or update-specific form component rather than in a shared form container

### Requirement: Repo rules forbid shared create/edit form containers
The repository guidance SHALL explicitly state that create and edit screens must not share the same submit-owning form component.

#### Scenario: Developer reads create/update form rules
- **WHEN** a developer reads `AGENTS.md`
- **THEN** the create/update form rules MUST say each create and edit flow needs its own form component and MUST NOT use a single form that branches by `initialData`, `mode`, or `isEdit`

#### Scenario: Shared field code is considered
- **WHEN** a developer wants to reduce duplication between create and edit forms
- **THEN** the rules MUST allow only mode-agnostic field primitives/helpers that do not own submit behavior or create/edit branching
