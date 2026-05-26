## MODIFIED Requirements

### Requirement: Watchlist editing uses asset-level add and remove operations
The system SHALL add tracked assets through the backend bulk watchlist asset API and remove tracked assets through the existing asset-level delete API by comparing the current editor selection with the initially loaded watchlist state.

#### Scenario: Add tracked assets
- **WHEN** a user saves the editor after selecting one or more assets that were not previously tracked
- **THEN** the system MUST call `POST /watchlists/assets` with the newly selected asset ids
- **AND** the system MUST refresh the UI after a successful save

#### Scenario: Bulk add respects backend batch size
- **WHEN** a user saves more than 100 newly selected assets
- **THEN** the system MUST split add requests into batches of at most 100 asset ids
- **AND** each batch MUST use `POST /watchlists/assets`

#### Scenario: Existing asset ids are idempotent success
- **WHEN** the bulk add response includes `existingAssetIds`
- **THEN** the system MUST treat those ids as successfully synchronized rather than as failed operations

#### Scenario: Remove tracked assets
- **WHEN** a user saves the editor after deselecting one or more assets that were previously tracked
- **THEN** the system calls the existing remove-from-watchlist action for each deselected asset and refreshes the UI after a successful save

#### Scenario: No changes to save
- **WHEN** a user saves the editor without changing the selected assets
- **THEN** the system does not call add or delete watchlist actions and informs the user that there is no change to save
