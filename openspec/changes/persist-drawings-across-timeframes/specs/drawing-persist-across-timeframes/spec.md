# drawing-persist-across-timeframes Specification

## Purpose

Drawings được cache in-memory khi user switch timeframe và restore khi quay lại, giúp drawings không bị mất hoặc hiển thị sai data.

## Requirements

### Requirement: Drawings của timeframe cũ bị xoá khi switch

The system SHALL remove overlay drawings from the chart when the user switches to a different timeframe.

#### Scenario: Switch timeframe
- **WHEN** the user selects a different timeframe
- **THEN** all overlays with the old timeframe's groupId are removed from the chart
- **AND** the overlays are saved in an in-memory cache before removal

### Requirement: Drawings được restore khi quay lại

The system SHALL restore overlay drawings when the user returns to a previously-used timeframe.

#### Scenario: Return to previous timeframe
- **WHEN** the user switches back to a timeframe that had drawings
- **THEN** the saved overlays are recreated on the chart with the correct groupId
- **AND** the overlays appear at the correct data coordinates

### Requirement: Asset change clears drawings

The system SHALL not restore drawings when the user switches to a different asset, even if the same timeframe is selected.

#### Scenario: Switch asset
- **WHEN** the user selects a different watchlist asset
- **THEN** no drawings are restored from cache (cache key includes assetId)
- **AND** the chart starts with no overlays for the new asset
