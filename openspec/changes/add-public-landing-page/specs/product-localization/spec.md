## ADDED Requirements

### Requirement: Landing page dictionary copy
The system SHALL render landing page user-facing copy from Vietnamese and English frontend dictionaries.

#### Scenario: Vietnamese landing copy
- **WHEN** a user opens `/vi`
- **THEN** landing page headings, body copy, CTA labels, navigation labels, feature labels, trust copy, and accessibility labels render in Vietnamese from the dictionary

#### Scenario: English landing copy
- **WHEN** a user opens `/en`
- **THEN** landing page headings, body copy, CTA labels, navigation labels, feature labels, trust copy, and accessibility labels render in English from the dictionary

#### Scenario: Dictionary parity includes landing keys
- **WHEN** the frontend dictionaries are typechecked
- **THEN** Vietnamese and English dictionaries expose matching landing page message keys

