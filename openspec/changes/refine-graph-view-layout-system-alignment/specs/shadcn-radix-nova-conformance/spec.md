## ADDED Requirements

### Requirement: Graph view local chrome respects the shadcn Nova system
The system SHALL allow Graph View to use graph-specific local visual treatments while preserving shadcn/radix-nova primitive chrome and global theme token stability.

#### Scenario: Graph view uses a specialized canvas surface
- **WHEN** Graph View renders its dark analytical canvas
- **THEN** the canvas MAY use local feature styling for graph atmosphere, node colors, edge colors, and graph-local HUD treatments
- **AND** the implementation SHALL NOT change global theme tokens, sidebar tokens, chart tokens, or `components/ui/*` wrapper chrome to achieve the Graph View look

#### Scenario: Graph view composes shadcn controls
- **WHEN** Graph View renders buttons, tooltips, badges, popovers, dialogs, sheets, skeletons, or comparable shadcn-backed UI
- **THEN** feature code SHALL compose the installed shadcn wrappers from `@/components/ui/`
- **AND** icon-only controls SHALL use existing shadcn variants or sizes before adding hard-coded height, radius, border, shadow, or color overrides

#### Scenario: Graph-specific color is local and semantic
- **WHEN** Graph View needs category colors for event, asset, theme, article, narrative, or relationship kinds
- **THEN** those colors SHALL remain local to Graph View visuals
- **AND** they SHALL NOT redefine app-wide semantic tokens such as primary, accent, sidebar, border, foreground, or background
