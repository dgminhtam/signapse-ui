## ADDED Requirements

### Requirement: Builder accepts backend-supported nullable schemas
The system SHALL render supported response schemas in builder mode when they use backend-supported nullable forms.

#### Scenario: Render schema using nullable keyword
- **WHEN** a system prompt response schema node contains a supported base `type` and `nullable: true`
- **THEN** the schema builder MUST treat the node as supported and MUST preserve `nullable: true` when editing other supported fields on that node

#### Scenario: Render schema using nullable type array
- **WHEN** a system prompt response schema node uses `type` as an array containing exactly one supported non-null builder type and `null`
- **THEN** the schema builder MUST treat the node as supported and MUST preserve nullable semantics when editing other supported fields on that node

#### Scenario: Reject complex type arrays
- **WHEN** a system prompt response schema node uses `type` as an array containing multiple non-null builder types or unsupported type values
- **THEN** the schema builder MUST show the JSON-only fallback instead of silently simplifying the schema

### Requirement: Builder accepts backend-supported string length constraints
The system SHALL render and edit backend-supported string length constraints in builder mode.

#### Scenario: Render seeded minLength schema
- **WHEN** a system prompt response schema contains a string node with numeric `minLength`
- **THEN** the schema builder MUST treat the schema as supported and MUST show the `minLength` value as an editable string constraint

#### Scenario: Update minLength constraint
- **WHEN** a user changes the string `minLength` value in builder mode
- **THEN** the parsed response schema MUST update `minLength` as a number when the value is present and MUST remove `minLength` when the value is cleared

#### Scenario: Preserve string enum with minLength
- **WHEN** a string schema contains both `enum` and numeric `minLength`
- **THEN** editing either constraint in builder mode MUST preserve the other constraint

### Requirement: Builder fallback remains strict for unsupported schema structures
The system SHALL continue to use JSON-only mode for schema structures that the builder cannot safely represent.

#### Scenario: Unsupported structural keyword
- **WHEN** a response schema contains structural keywords outside the supported builder subset, including `$ref`, `oneOf`, `anyOf`, `allOf`, `not`, `if`, `then`, or `else`
- **THEN** the builder MUST show the JSON-only fallback and MUST preserve the parsed schema for raw JSON editing

#### Scenario: Backend seed schemas remain buildable
- **WHEN** the frontend checks backend-seeded system prompt schemas that contain only supported builder constructs plus `nullable` or `minLength`
- **THEN** the support check MUST classify those schemas as buildable
