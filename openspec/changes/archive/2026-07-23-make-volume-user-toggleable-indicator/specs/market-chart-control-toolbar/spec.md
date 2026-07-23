## ADDED Requirements

### Requirement: Indicator controls expose data-aware Volume selection

The system SHALL expose Volume as a default-off option in the Signapse-owned market chart indicator control surface and SHALL prevent users from activating it when the active chart has no usable numeric volume.

#### Scenario: Volume data is available

- **WHEN** the active chart contains at least one candle with finite numeric volume
- **THEN** the indicator control lists an enabled Volume option
- **AND** Volume remains unselected until the user explicitly enables it

#### Scenario: User enables Volume

- **WHEN** the user selects Volume while usable volume data is available
- **THEN** Volume is included in the active indicator selection
- **AND** the indicator command count includes Volume

#### Scenario: Volume data is unavailable

- **WHEN** a successfully loaded active chart contains no finite numeric volume
- **THEN** the Volume option is disabled
- **AND** Volume is not retained as an active indicator

#### Scenario: Assistive technology reads the Volume option

- **WHEN** a screen reader user navigates the indicator control surface
- **THEN** the Volume option exposes the locale-neutral technical name `Volume` and its disabled or selected state
