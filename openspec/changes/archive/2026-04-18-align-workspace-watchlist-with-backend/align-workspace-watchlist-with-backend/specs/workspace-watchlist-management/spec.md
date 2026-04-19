## ADDED Requirements

### Requirement: Active workspace watchlist management
The system SHALL let authorized users manage a single tracked-asset watchlist for the active workspace using the existing backend watchlist API.

#### Scenario: Load watchlist for active workspace
- **WHEN** an authorized user opens the workspace watchlist editor while a workspace is active
- **THEN** the system loads the current tracked assets from the backend watchlist API and displays them as the workspace watchlist

#### Scenario: No active workspace
- **WHEN** a user attempts to access watchlist management without an active workspace
- **THEN** the system shows an empty or blocked state explaining that a workspace must be selected first

### Requirement: Watchlist editing uses asset-level add and remove operations
The system SHALL add and remove tracked assets by comparing the current editor selection with the initially loaded watchlist state and calling the existing add and delete watchlist actions per asset.

#### Scenario: Add tracked assets
- **WHEN** a user saves the editor after selecting one or more assets that were not previously tracked
- **THEN** the system calls the existing add-to-watchlist action for each newly selected asset and refreshes the UI after a successful save

#### Scenario: Remove tracked assets
- **WHEN** a user saves the editor after deselecting one or more assets that were previously tracked
- **THEN** the system calls the existing remove-from-watchlist action for each deselected asset and refreshes the UI after a successful save

#### Scenario: No changes to save
- **WHEN** a user saves the editor without changing the selected assets
- **THEN** the system does not call add or delete watchlist actions and informs the user that there is no change to save

### Requirement: Watchlist management reflects the backend-supported domain
The system SHALL present watchlist management as a workspace-scoped tracked asset list and MUST NOT expose grouped watchlist concepts that require unsupported backend behavior.

#### Scenario: User-facing terminology
- **WHEN** the watchlist feature is displayed to the user
- **THEN** the UI describes it as the tracked asset list of the active workspace using professional Vietnamese copy

#### Scenario: Unsupported grouped watchlists are not exposed
- **WHEN** a user navigates to watchlist-related surfaces
- **THEN** the system does not expose creation or management of named watchlist groups, descriptions, or nested watchlist collections

### Requirement: Failed synchronization returns the editor to server truth
The system SHALL treat any failed add or remove operation during save as a synchronization failure and restore the editor state from the backend before the user continues.

#### Scenario: Partial save failure
- **WHEN** one or more add or remove operations fail during watchlist save
- **THEN** the system keeps the editor open, shows an error toast, reloads the watchlist state from the backend, and lets the user retry from the refreshed state

#### Scenario: Save pending feedback
- **WHEN** the user submits watchlist changes
- **THEN** the save action shows pending feedback and prevents duplicate submission until the synchronization attempt finishes
