## ADDED Requirements

### Requirement: Repository guidance covers simplified backend surfaces

The repository guidance SHALL instruct implementers to simplify frontend information hierarchy when a backend feature contract is simplified.

#### Scenario: AGENTS includes simplified surface rule

- **WHEN** a developer reads `AGENTS.md`
- **THEN** the document includes a rule requiring simplified backend feature screens to remove obsolete fields and prioritize the remaining user-relevant information

#### Scenario: Rule applies to future admin screens

- **WHEN** a future backend API removes fields or collapses multiple lifecycle concepts into one field
- **THEN** frontend implementation guidance tells developers to update the UI concept and hierarchy instead of preserving stale badges, sections, filters, or metadata cards

### Requirement: Important information appears before technical metadata

The repository guidance SHALL require admin screens to place user decision information before technical identifiers when a feature contract is simplified.

#### Scenario: Simplified list page hierarchy

- **WHEN** a simplified backend list response has fewer fields than the previous frontend screen
- **THEN** the resulting list page prioritizes the entity title, short description, current status, primary timestamp, confidence or impact signal when available, and primary action before technical fields

#### Scenario: Simplified detail page hierarchy

- **WHEN** a simplified backend detail response has core facts, supporting evidence, and technical metadata
- **THEN** the resulting detail page places core facts and evidence before identifiers, slugs, canonical keys, created timestamps, and modified timestamps

### Requirement: Obsolete UI concepts are removed after contract simplification

The repository guidance SHALL require obsolete UI concepts to be removed when the backend no longer returns their data.

#### Scenario: Removed backend field is not shown as empty UI

- **WHEN** a backend field is removed from the current contract
- **THEN** the frontend does not keep an empty badge, placeholder card, or stale section for that field

#### Scenario: Collapsed lifecycle fields become one UI signal

- **WHEN** the backend collapses multiple lifecycle fields into a single status field
- **THEN** the frontend presents one clear status signal instead of keeping multiple old lifecycle badges
