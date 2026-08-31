## MODIFIED Requirements

### Requirement: Sidebar hover and parent context use accent treatment

The system SHALL use `sidebar-accent` only for lightweight hover feedback on inactive navigation rows. Opening a parent or rendering a parent that contains the active child SHALL NOT add background treatment or increased font weight; parent context SHALL remain visible through hierarchy, child disclosure, and chevron state.

#### Scenario: User hovers a non-active item

- **WHEN** a user hovers a sidebar item that is not the current page
- **THEN** the item uses `sidebar-accent` and `sidebar-accent-foreground`
- **AND** the hover treatment remains visually lighter than the current-page selected surface

#### Scenario: Parent group is opened

- **WHEN** a sidebar parent group is expanded
- **THEN** the parent communicates disclosure through chevron rotation and visible children
- **AND** it does not add an expanded-state background or increased font weight

#### Scenario: Parent contains active child

- **WHEN** a sidebar parent contains the active child route
- **THEN** the parent remains visually secondary without selected background or bold text
- **AND** the child item remains the only selected surface in that group

### Requirement: Sidebar primitive remains unchanged

The system SHALL implement Signapse-specific hierarchy, flyout, mobile close, density, and account-menu behavior through app-level composition. A shared sidebar wrapper change, if required, MUST be limited to generic localized assistive metadata with backward-compatible defaults and MUST NOT add feature-specific visual chrome or navigation policy.

#### Scenario: Sidebar hierarchy is implemented

- **WHEN** the redesigned sidebar is reviewed
- **THEN** app-level navigation composition contains the section, flyout, close, density, and account-menu behavior
- **AND** shared sidebar tokens and default Nova visual chrome remain unchanged

#### Scenario: Mobile assistive metadata requires a wrapper input

- **WHEN** the mobile sidebar sheet needs localized title or description text
- **THEN** the wrapper SHALL accept only generic accessibility metadata with backward-compatible defaults
- **AND** the wrapper does not acquire Signapse-specific labels, routes, permissions, or visual variants

### Requirement: Sidebar hierarchy distinguishes parent section and current page

The system SHALL distinguish localized section labels, grouped parent context, and the current destination through hierarchy, spacing, disclosure, and the neutral selected surface without heavy custom colors.

#### Scenario: Child route is active

- **WHEN** the current route matches a child navigation item
- **THEN** its parent group is initially open in expanded mode
- **AND** the child uses the neutral selected surface while the parent remains visually quiet

#### Scenario: Direct route is active

- **WHEN** the current route matches a direct section destination
- **THEN** that destination uses the neutral selected surface directly
- **AND** unrelated parents and destinations do not appear selected

### Requirement: Sidebar exposes root overview navigation

The sidebar navigation SHALL expose the protected `/dashboard` route as the first Analysis destination using `Tổng quan` in Vietnamese and `Overview` in English.

#### Scenario: Sidebar renders protected navigation

- **WHEN** an authenticated user opens the protected app sidebar
- **THEN** the Analysis section starts with the localized overview destination
- **AND** the destination links to `/dashboard` through locale-aware navigation

#### Scenario: Dashboard overview item is active

- **WHEN** the locale-normalized protected pathname is `/dashboard` or a descendant owned by that destination
- **THEN** the overview destination is the current item
- **AND** Market Knowledge Graph and Market Charts are not current

#### Scenario: Non-dashboard route is active

- **WHEN** the current protected pathname matches another canonical destination
- **THEN** the overview destination is not current
- **AND** the matching direct or child destination uses the selected treatment

### Requirement: Root overview navigation preserves sidebar behavior

The overview destination SHALL use the shared section-aware configuration, route matching, locale-aware link, tooltip, icon, density, permission, selected-surface, and responsive navigation contracts.

#### Scenario: Sidebar implementation is reviewed

- **WHEN** the overview destination is rendered
- **THEN** it is derived from the canonical localized navigation configuration
- **AND** it is not hardcoded into an individual desktop or mobile render branch

#### Scenario: Sidebar is collapsed

- **WHEN** the desktop sidebar is collapsed to icon mode
- **THEN** the overview destination remains directly reachable with `LayoutDashboard` and a localized tooltip

## ADDED Requirements

### Requirement: Sidebar uses the canonical localized information architecture

The system SHALL render the protected sidebar in the fixed Analysis, Data, and Administration section order with stable identifiers, fixed destination order, existing route URLs, and the approved primary icon mapping.

#### Scenario: Vietnamese full-permission navigation renders

- **WHEN** a Vietnamese user with all navigation permissions opens the expanded sidebar
- **THEN** `Phân tích` contains `Tổng quan`, `Đồ thị tri thức thị trường`, and `Biểu đồ thị trường` in that order
- **AND** `Dữ liệu` contains grouped `Tin tức`, direct `Sự kiện`, and direct `Lịch kinh tế` in that order
- **AND** `Tin tức` contains `Bài viết tin tức`, `Nguồn tin`, and `Blog` in that order
- **AND** `Quản trị` contains grouped `Cấu hình hệ thống`, grouped `Người dùng & phân quyền`, and direct `Duyệt phản hồi` in that order
- **AND** `Cấu hình hệ thống` contains `Nhà cung cấp AI`, `Prompt hệ thống`, `Tác vụ định kỳ`, and `Tích hợp Telegram` in that order
- **AND** `Người dùng & phân quyền` contains `Người dùng` followed by `Vai trò & phân quyền`

#### Scenario: English navigation renders

- **WHEN** the same user opens the English protected app
- **THEN** the sidebar renders the same section, group, destination, and ordering model with English dictionary copy
- **AND** changing locale does not change routes, permissions, icons, or hierarchy

#### Scenario: Primary icon mapping renders

- **WHEN** primary destinations and groups render
- **THEN** Overview uses `LayoutDashboard`, Market Knowledge Graph uses `Waypoints`, Market Charts uses `ChartCandlestick`, News uses `Newspaper`, Events uses `CalendarDays`, Economic calendar uses `CalendarClock`, System configuration uses `Settings2`, Users & permissions uses `UsersRound`, Feedback review uses `MessageSquareWarning`, and API access token uses `KeyRound`
- **AND** child destinations remain text-only

### Requirement: Sidebar permission filtering preserves hierarchy

The system SHALL filter the navigation tree bottom-up using existing navigation permissions while preserving canonical grouping and order.

#### Scenario: Parent has no permitted child

- **WHEN** permission filtering removes every child of a grouped destination
- **THEN** the parent is omitted

#### Scenario: Parent has one permitted child

- **WHEN** permission filtering leaves exactly one child in a grouped destination
- **THEN** the parent and child remain at their canonical hierarchy levels
- **AND** the child is not promoted to a direct section destination

#### Scenario: Section is empty

- **WHEN** permission filtering removes every destination from a section
- **THEN** the section label and section content are omitted

#### Scenario: Permission filtering leaves a subset

- **WHEN** a user can access only a subset of destinations
- **THEN** the remaining sections, parents, and children retain canonical relative order
- **AND** unavailable destinations do not leave empty rows or broken controls

### Requirement: Expanded sidebar groups use temporary independent disclosure

Expanded desktop and mobile sidebar groups SHALL open independently, SHALL initially expose a group containing the current route, and SHALL NOT persist temporary disclosure state across reloads.

#### Scenario: Current route belongs to a group

- **WHEN** the expanded sidebar first renders on a grouped child route
- **THEN** the owning parent is open and the current child is visible

#### Scenario: User explores multiple groups

- **WHEN** the user opens more than one parent group
- **THEN** opening a later group does not automatically close an earlier group

#### Scenario: Page reloads after temporary disclosure

- **WHEN** the user reloads after opening groups that do not own the current route
- **THEN** temporary disclosure state is not restored
- **AND** only the current-route initialization policy determines which group starts open

### Requirement: Collapsed desktop groups provide flyout navigation

When the desktop sidebar is collapsed, every permitted grouped destination SHALL open a click- and keyboard-accessible flyout that exposes its permitted children without expanding the sidebar or changing workspace width.

#### Scenario: User activates collapsed group

- **WHEN** a pointer or keyboard user activates a collapsed grouped destination
- **THEN** a localized flyout opens beside the navigation rail with the permitted children in canonical order
- **AND** the sidebar and workspace widths remain unchanged

#### Scenario: User selects flyout destination

- **WHEN** the user activates a child destination in the flyout
- **THEN** locale-aware navigation goes to the existing route
- **AND** the flyout closes

#### Scenario: User dismisses flyout without navigation

- **WHEN** the user presses Escape or interacts outside the open flyout
- **THEN** the flyout closes
- **AND** focus returns to the grouped trigger

#### Scenario: Direct destination is collapsed

- **WHEN** the desktop sidebar is collapsed and a direct destination renders
- **THEN** its icon remains directly navigable
- **AND** its localized label remains available through the existing tooltip treatment

### Requirement: Sidebar preference defaults to discoverable navigation

The system SHALL treat an absent sidebar preference as expanded while preserving explicit expanded and collapsed cookie values.

#### Scenario: Sidebar preference is absent

- **WHEN** an authenticated user opens the protected app without a sidebar-state cookie
- **THEN** the desktop sidebar starts expanded

#### Scenario: Explicit preference exists

- **WHEN** the sidebar-state cookie contains the existing explicit expanded or collapsed value
- **THEN** the app restores that value

### Requirement: Mobile sidebar is touch-friendly and dismissible

The mobile sidebar sheet SHALL provide localized assistive metadata, a visible localized close control, navigation targets at least 44 CSS pixels high, independent content scrolling, and a reachable account footer.

#### Scenario: Mobile sheet opens

- **WHEN** a user opens sidebar navigation on a narrow viewport
- **THEN** the sheet has a localized accessible title and description
- **AND** a visible close control is available without relying on backdrop or gesture dismissal

#### Scenario: Mobile user selects navigation

- **WHEN** direct, parent, or child navigation rows render in the mobile sheet
- **THEN** their interactive target height is at least 44 CSS pixels
- **AND** long navigation content scrolls without making the account footer unreachable

### Requirement: API access token belongs to the authenticated account

The system SHALL expose the existing API access token route from the authenticated account menu and SHALL NOT list it in Administration.

#### Scenario: Authenticated account menu opens

- **WHEN** an authenticated user opens the account menu
- **THEN** a localized `Token truy cập API` or `API access token` entry with `KeyRound` links to the existing developer-token route

#### Scenario: Administration navigation renders

- **WHEN** the Administration section is displayed
- **THEN** it does not include the API access token destination

## REMOVED Requirements

### Requirement: Sidebar active color uses shadcn sidebar accent behavior

**Reason**: This historical requirement conflicts with the accepted neutral `sidebar-primary` selected-surface contract and the current design system.
**Migration**: Current destinations continue using the `sidebar-primary` selected surface; hover alone uses `sidebar-accent`.

### Requirement: Sidebar behavior remains unchanged

**Reason**: The redesign intentionally changes first-visit default state, collapsed grouped navigation, mobile dismissal, account placement, and section hierarchy.
**Migration**: Use the explicit expanded, collapsed-flyout, mobile, permission-filtering, and account-menu requirements defined by this change.
