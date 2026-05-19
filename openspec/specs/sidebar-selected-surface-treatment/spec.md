# sidebar-selected-surface-treatment Specification

## Purpose
TBD - created by archiving change refine-sidebar-primary-selected-surface. Update Purpose after archive.
## Requirements
### Requirement: Sidebar active item uses selected surface background
The sidebar navigation MUST render the current page item with `sidebar-primary` as a neutral selected surface background and MUST NOT rely on font weight to communicate active state.

#### Scenario: Top-level leaf item is current page
- **WHEN** a top-level sidebar item without children matches the current route
- **THEN** the item uses `sidebar-primary` selected background and keeps normal text weight

#### Scenario: Child item is current page
- **WHEN** a child sidebar item matches the current route
- **THEN** the child item uses `sidebar-primary` selected background and keeps normal text weight

### Requirement: Sidebar primary token is neutral selected surface
The sidebar theme MUST define `sidebar-primary` as a neutral selected-navigation surface that is visually stronger than `sidebar-accent` hover but less forceful than an inverse primary CTA treatment.

#### Scenario: Light theme selected state
- **WHEN** the app is in light theme
- **THEN** `sidebar-primary` is a neutral gray selected surface darker than `sidebar-accent` and `sidebar-primary-foreground` remains readable without inverse button styling

#### Scenario: Dark theme selected state
- **WHEN** the app is in dark theme
- **THEN** `sidebar-primary` is a neutral gray selected surface stronger than `sidebar-accent` and `sidebar-primary-foreground` remains readable

### Requirement: Sidebar hover remains accent feedback
The sidebar navigation MUST keep hover feedback on `sidebar-accent` and MUST keep hover visually quieter than the selected/current page state.

#### Scenario: User hovers inactive item
- **WHEN** a user hovers an inactive sidebar item
- **THEN** the item uses `sidebar-accent` hover feedback rather than selected-state styling

### Requirement: Sidebar parent expanded state uses chevron only
The sidebar navigation MUST NOT add a background or font emphasis solely because a parent item is expanded.

#### Scenario: Parent item is expanded
- **WHEN** a parent sidebar item is open
- **THEN** the parent item shows only chevron rotation for expanded state

### Requirement: Sidebar parent with active child stays quiet
The sidebar navigation MUST keep a parent item with an active child visually secondary and MUST NOT bold the parent label or apply selected background to the parent.

#### Scenario: Child route is active
- **WHEN** a child sidebar item is the current page
- **THEN** the parent item does not use selected background and does not become bold

### Requirement: Sidebar selected treatment avoids new tokens
The sidebar selected-state refinement MUST use existing sidebar namespace tokens and MUST NOT introduce a custom active token.

#### Scenario: Implementing selected treatment
- **WHEN** the sidebar selected-state treatment is updated
- **THEN** the implementation does not introduce `--sidebar-active` and does not change global `--primary` or `--accent`

