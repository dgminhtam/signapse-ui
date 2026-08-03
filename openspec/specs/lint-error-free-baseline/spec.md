# Lint Error-Free Baseline

## Purpose

Keep the repository ESLint gate free of blocking errors while preserving the existing warning baseline.

## Requirements

### Requirement: Repository lint has no blocking errors

The repository SHALL complete its configured ESLint package command with zero errors after the 16 identified errors are fixed. Existing warnings SHALL remain outside the acceptance scope and SHALL NOT require cleanup for this change.

#### Scenario: Full lint verification

- **WHEN** `pnpm.cmd lint` is run from the repository root
- **THEN** the command exits successfully with zero ESLint errors
- **AND** the existing warning set is not treated as a reason to expand the change

### Requirement: Lint cleanup is configuration-neutral

The change SHALL resolve the identified errors in their owning source files without disabling rules, broadening ignores, changing dependencies, or altering user-visible behavior.

#### Scenario: Source-level remediation

- **WHEN** the implementation diff is reviewed after lint passes
- **THEN** each of the 16 errors is addressed by a local source-level fix
- **AND** ESLint configuration, package dependencies, API contracts, and UI behavior remain unchanged
