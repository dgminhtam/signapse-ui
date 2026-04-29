## ADDED Requirements

### Requirement: Shadcn Neutral Theme Baseline

The system SHALL use the shadcn neutral default CSS variable scaffold as the baseline for global theme tokens, and `components.json` SHALL declare the matching neutral base color.

#### Scenario: Theme config matches neutral baseline

- **WHEN** a developer reviews `components.json`
- **THEN** `tailwind.baseColor` is `neutral`

#### Scenario: Global theme tokens follow shadcn neutral default

- **WHEN** a developer reviews `app/globals.css`
- **THEN** the global, chart, and sidebar theme variables match the shadcn neutral default scaffold unless a future approved proposal intentionally changes the baseline

#### Scenario: Sidebar active color uses default shadcn treatment

- **WHEN** the application sidebar renders hover, open, and selected navigation rows
- **THEN** row color treatment follows the shadcn sidebar neutral token model without page-level raw colors or custom active color tokens

#### Scenario: Local visual adjustments do not mutate global tokens

- **WHEN** a developer needs to improve a local component's hierarchy, density, or spacing
- **THEN** the implementation uses component composition or shared app-level surfaces instead of silently changing global shadcn theme tokens
