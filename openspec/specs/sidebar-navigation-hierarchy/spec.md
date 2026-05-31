# sidebar-navigation-hierarchy Specification

## Purpose
TBD - created by archiving change refine-sidebar-primary-active-state. Update Purpose after archive.
## Requirements
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

### Requirement: Sidebar active color uses shadcn sidebar accent behavior
The system SHALL use the original shadcn sidebar accent color behavior for selected, hover, and open navigation states instead of dedicated custom active color tokens.

#### Scenario: Active color is reverted
- **WHEN** a sidebar navigation item represents the current route
- **THEN** the item uses the sidebar accent treatment rather than `sidebar-active` styling

#### Scenario: Custom active tokens are removed
- **WHEN** sidebar active styling is updated
- **THEN** `sidebar-active` token definitions and usage are removed from the active implementation

### Requirement: Sidebar hierarchy distinguishes parent section and current page
The system SHALL distinguish parent section and child page hierarchy through spacing, row height, width, and typography without introducing heavy custom active colors.

#### Scenario: Child route is active
- **WHEN** the current route matches a child navigation item
- **THEN** the parent group is shown as open context and the child item remains readable within the original sidebar accent color model

#### Scenario: Parent route without children is active
- **WHEN** the current route matches a top-level navigation item without children
- **THEN** that top-level item uses the original sidebar selected navigation treatment directly

### Requirement: Sidebar item density remains readable
The system SHALL make sidebar navigation parent and child rows large enough to scan comfortably while preserving the existing rhythm between same-level items.

#### Scenario: Expanded sidebar is shown
- **WHEN** the sidebar is expanded
- **THEN** parent and child navigation items have enough height, icon alignment, and text contrast to read comfortably in normal dashboard usage

#### Scenario: Parent and child rows are compared
- **WHEN** an expanded parent item and its child list are visible
- **THEN** parent rows are visually more substantial than child rows, and child rows are still taller than the previous undersized treatment

#### Scenario: Parent group is expanded
- **WHEN** a parent group reveals child navigation items
- **THEN** the child list has clear breathing room from the parent without increasing the gap between sibling children unnecessarily

### Requirement: Sidebar behavior remains unchanged
The system SHALL preserve navigation behavior while changing only visual hierarchy and active-state styling.

#### Scenario: Sidebar navigation is used
- **WHEN** a user clicks a sidebar item
- **THEN** existing route links, permission filtering, route matching, and collapsed tooltip behavior continue to work as before

### Requirement: Sidebar exposes root overview navigation
The sidebar navigation SHALL expose the protected app root route as a first-class overview destination.

#### Scenario: Sidebar renders protected navigation
- **WHEN** an authenticated user opens the protected app sidebar
- **THEN** the sidebar includes a top-level item labeled `Tổng quan` in Vietnamese and `Overview` in English
- **AND** the item links to `/` through the existing locale-aware link behavior

#### Scenario: Root overview item is active
- **WHEN** the current protected pathname is the locale-normalized root path
- **THEN** the root overview sidebar item is the active item
- **AND** feature items such as Graph View and Market Charts are not active

#### Scenario: Non-root route is active
- **WHEN** the current protected pathname is a feature route such as `/graph-view`
- **THEN** the root overview sidebar item is not active
- **AND** the matching feature item continues to use the existing active treatment

### Requirement: Root overview navigation preserves sidebar behavior
The root overview sidebar item SHALL use the existing sidebar composition, route matching, tooltip, icon, density, and permission-filtering patterns.

#### Scenario: Sidebar implementation is reviewed
- **WHEN** the overview item is added
- **THEN** it is defined through the existing site navigation config rather than hardcoded directly in the sidebar render loop
- **AND** shadcn sidebar primitives remain unchanged

#### Scenario: Sidebar is collapsed
- **WHEN** the sidebar is collapsed to icon mode
- **THEN** the overview item remains reachable with the same tooltip behavior as other top-level items

