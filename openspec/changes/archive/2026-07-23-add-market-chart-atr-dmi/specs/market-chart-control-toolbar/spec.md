## ADDED Requirements

### Requirement: Market chart indicator controls expose ATR and DMI
The system SHALL expose ATR and DMI as independently selectable, default-off options in the Signapse-owned market chart indicator control surface.

#### Scenario: User opens indicator controls
- **WHEN** the user opens the market chart indicator control surface
- **THEN** ATR and DMI are listed with the existing curated indicators
- **AND** neither indicator is selected unless the user has explicitly enabled it

#### Scenario: User selects ATR or DMI
- **WHEN** the user selects ATR or DMI
- **THEN** the selected technical name is included in the active indicator selection
- **AND** the indicator command count includes the selection

#### Scenario: Assistive technology reads ATR and DMI
- **WHEN** a screen reader user navigates the ATR and DMI options
- **THEN** the options expose the locale-neutral technical names `ATR` and `DMI`
- **AND** each option exposes its selected state
