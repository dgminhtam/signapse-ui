## ADDED Requirements

### Requirement: Sidebar primary token remains neutral-consistent
The system SHALL keep sidebar primary tokens consistent with the project's shadcn neutral theme baseline when those tokens are used for selected navigation.

#### Scenario: Dark sidebar primary does not use unrelated chromatic preset color
- **WHEN** the dark theme CSS variables are reviewed
- **THEN** `--sidebar-primary` is neutral-consistent with the app theme
- **AND** it does not use the blue/purple preset value `oklch(0.488 0.243 264.376)` for sidebar navigation chrome

#### Scenario: Sidebar primary foreground remains readable
- **WHEN** a current-page sidebar item uses `bg-sidebar-primary`
- **THEN** its text and icon color use `text-sidebar-primary-foreground`
- **AND** the foreground/background pairing remains readable in light and dark themes

### Requirement: Sidebar active item uses primary treatment
The system SHALL render only the navigation item representing the current page with `sidebar-primary` and `sidebar-primary-foreground`.

#### Scenario: Top-level route is active
- **WHEN** the current pathname matches a top-level sidebar item without children
- **THEN** that item uses `bg-sidebar-primary`
- **AND** that item uses `text-sidebar-primary-foreground`
- **AND** that item is visually stronger than hover, open parent, and parent context states

#### Scenario: Child route is active
- **WHEN** the current pathname matches a sidebar child item
- **THEN** the child item uses `bg-sidebar-primary`
- **AND** the child item uses `text-sidebar-primary-foreground`
- **AND** the child item is the strongest visual selection within its parent group

### Requirement: Sidebar hover and parent context use accent treatment
The system SHALL keep sidebar hover, expanded parent, and parent-with-active-child states on the sidebar accent token model.

#### Scenario: User hovers a non-active item
- **WHEN** a user hovers a sidebar item that is not the current page
- **THEN** the item uses `sidebar-accent` and `sidebar-accent-foreground`
- **AND** the hover treatment remains visually lighter than the current-page active item

#### Scenario: Parent group is opened
- **WHEN** a sidebar parent group is expanded
- **THEN** the parent row uses contextual `sidebar-accent` treatment
- **AND** it does not use `sidebar-primary` unless the parent itself is a direct current-page item

#### Scenario: Parent contains active child
- **WHEN** a sidebar parent contains the active child route
- **THEN** the parent row uses `sidebar-accent` context treatment
- **AND** the parent may use font or chevron emphasis
- **AND** the parent remains visually weaker than the active child item

### Requirement: Sidebar focus remains an accessibility state
The system SHALL preserve focus-visible behavior as a keyboard accessibility state that uses `sidebar-ring` instead of active colors.

#### Scenario: Keyboard focus moves through sidebar
- **WHEN** keyboard focus is on a sidebar menu item
- **THEN** the focus-visible indicator uses `sidebar-ring`
- **AND** the focus indicator does not make the item appear selected unless the item is also the current page

### Requirement: Sidebar density and hierarchy are preserved
The system SHALL preserve the accepted sidebar row density, parent-child spacing, and child indentation while changing color hierarchy.

#### Scenario: Sidebar rows render after color update
- **WHEN** sidebar parent, top-level, and child items render
- **THEN** their row heights remain aligned with the accepted readable density
- **AND** child rows keep the accepted left indentation and right-side width expansion
- **AND** the child list keeps `py-1` breathing room between parent and children

### Requirement: Sidebar primitive remains unchanged
The system SHALL implement Signapse-specific sidebar hierarchy through app-level composition and theme tokens without modifying shadcn sidebar primitives.

#### Scenario: Sidebar active hierarchy is implemented
- **WHEN** the sidebar hierarchy change is applied
- **THEN** `components/app-sidebar.tsx` and `app/globals.css` contain the needed app-specific adjustments
- **AND** `components/ui/sidebar.tsx` remains unchanged
