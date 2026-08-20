## MODIFIED Requirements

### Requirement: Shared Plate toolbar tooltips use the shadcn wrapper
The shared Plate toolbar SHALL compose `Tooltip`, `TooltipTrigger`, and `TooltipContent` from `@/components/ui/tooltip` without directly composing `@radix-ui/react-tooltip` primitives. When a Toolbar button opts into tooltip rendering, the Tooltip trigger SHALL render that Base UI Toolbar button through `render`.

#### Scenario: Tooltip is enabled for a toolbar button
- **WHEN** a mounted toolbar button opts into tooltip rendering and provides tooltip content
- **THEN** the existing Base UI Toolbar button remains the tooltip trigger through `render`
- **AND** the tooltip content uses the standard wrapper surface and arrow

#### Scenario: Tooltip placement props are resolved
- **WHEN** no tooltip content offset is supplied by the caller
- **THEN** the toolbar uses a side offset of `4`
- **AND** when the caller supplies a content offset or other content props, those caller values take precedence

#### Scenario: Tooltip rendering is not requested
- **WHEN** the toolbar button is not mounted, disables tooltip rendering, or has no tooltip content
- **THEN** it renders without creating the tooltip overlay composition

### Requirement: Overlay adoption preserves wrapper boundaries during the Toolbar migration
The Plate editor SHALL reuse the installed dropdown-menu, popover, and tooltip wrappers without changing their generated source. The Toolbar migration MAY update package manifests and lockfiles only to remove the direct `@radix-ui/react-toolbar` dependency and SHALL preserve existing Plate overlay portal, surface, and focus behavior.

#### Scenario: Review Toolbar overlay migration sources
- **WHEN** the Toolbar migration source is reviewed
- **THEN** the local dropdown-menu, popover, and tooltip wrapper sources remain unchanged by this work
- **AND** package manifests and lockfiles remove only the direct Radix Toolbar dependency required by the migration
- **AND** existing Plate overlay portal placement, keyboard interaction, and focus restoration remain available
