# time-metadata-presentation Specification

## Purpose
TBD - created by archiving change standardize-time-metadata-presentation. Update Purpose after archive.
## Requirements
### Requirement: Time metadata uses a compact secondary presentation

The system SHALL render visible time metadata as compact secondary metadata rather than primary content.

#### Scenario: Supporting time value is displayed

- **WHEN** a timestamp such as created, updated, published, occurred, scheduled, synced, validated, or next-triggered time is rendered as supporting metadata
- **THEN** it uses compact muted typography equivalent to `text-xs text-muted-foreground tabular-nums`
- **AND** it does not use `font-medium`, large card value typography, or foreground emphasis

#### Scenario: Time metadata is shown in a table

- **WHEN** a list table renders a time metadata column
- **THEN** the time value uses the compact secondary time metadata presentation
- **AND** the column remains width-stable for scanning

#### Scenario: Time metadata is shown in a detail or drawer surface

- **WHEN** a detail page, technical panel, dashboard panel, quick detail drawer, or preview table renders a time metadata value
- **THEN** the time value uses the compact secondary time metadata presentation instead of generic primary value styling

### Requirement: Time metadata always includes a compact icon

The system SHALL render every visible time metadata value with an icon that uses the same compact size.

#### Scenario: Time metadata icon is rendered

- **WHEN** a time metadata value is visible
- **THEN** an icon is displayed next to the time value
- **AND** the icon uses `size-3`
- **AND** the icon is aligned inline with the time text

#### Scenario: Time metadata has a semantic label

- **WHEN** a time metadata value includes a label such as "Tạo lúc", "Cập nhật", "Công bố", or "Đồng bộ"
- **THEN** the label and value remain in the same compact icon-bearing metadata treatment

### Requirement: Time metadata avoids badge treatment by default

The system SHALL NOT render plain time metadata as a badge unless the timestamp is part of a true status or business signal.

#### Scenario: Plain timestamp appears near badges

- **WHEN** a timestamp is displayed near status, confidence, or workflow badges
- **THEN** the timestamp uses the compact time metadata presentation
- **AND** it is not rendered as a `Badge` solely for decoration

### Requirement: Time metadata convention is documented

The repository guidance SHALL document the compact icon-bearing time metadata rule.

#### Scenario: Future UI work references time metadata rules

- **WHEN** an implementer reads `AGENTS.md`
- **THEN** the guidance states that rendered time metadata uses compact muted typography, tabular numbers, an icon with `size-3`, and avoids primary value or badge styling unless the timestamp is a true business signal

