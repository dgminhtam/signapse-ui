## ADDED Requirements

### Requirement: Graph view viewport controls use shadcn grouping
The system SHALL compose Graph View viewport controls with installed shadcn wrappers instead of custom recreations of grouped button chrome.

#### Scenario: Graph view renders zoom and recenter controls
- **WHEN** Graph View renders zoom out, recenter, and zoom in controls
- **THEN** the controls SHALL use `ButtonGroup` from `@/components/ui/button-group`
- **AND** each action SHALL use `Button` from `@/components/ui/button`
- **AND** feature code SHALL NOT edit `components/ui/button.tsx` or `components/ui/button-group.tsx` for this local Graph View polish

#### Scenario: Graph view needs local placement
- **WHEN** the grouped controls need canvas placement
- **THEN** Graph View MAY use local layout classes around the shadcn group
- **AND** those classes SHALL place the control group without recreating button radius, separator, border, or background behavior owned by the shadcn wrappers
