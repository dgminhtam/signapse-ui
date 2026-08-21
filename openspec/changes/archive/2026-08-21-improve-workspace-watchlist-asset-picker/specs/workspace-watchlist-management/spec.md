## ADDED Requirements

### Requirement: Compact tracked-asset selection
The system SHALL present active-workspace tracked-asset editing through one accessible multi-select combobox that combines selection chips and asset search.

#### Scenario: Selected assets are visible in the field
- **WHEN** an authorized user opens an editable workspace watchlist
- **THEN** the editor displays every currently selected tracked asset as a removable chip within the selection field
- **AND** each chip identifies the asset by symbol and exposes its full asset identity to assistive technology

#### Scenario: Result rows provide decision information
- **WHEN** the user views an asset result in the combobox
- **THEN** the result displays the asset name, symbol, type, and selected state

#### Scenario: Selecting multiple assets is continuous
- **WHEN** the user selects an asset result
- **THEN** the combobox keeps its popup open, retains the current query, and immediately updates the selected chips and result state

#### Scenario: Large selections remain operable
- **WHEN** the selected tracked assets exceed the field's visible chip capacity
- **THEN** the chip area scrolls within a bounded height
- **AND** the dialog save and dismissal controls remain reachable without page-level horizontal overflow

### Requirement: Complete paginated asset discovery
The system SHALL allow an authorized user to discover every asset matching a name-or-symbol query while editing the active workspace watchlist.

#### Scenario: Initial catalog discovery
- **WHEN** the user opens the tracked-asset combobox without a query
- **THEN** the system displays the first page of catalog results and an instruction that the user can filter the list

#### Scenario: Name-or-symbol search
- **WHEN** the user enters a search query
- **THEN** the system debounces a backend query that matches asset names or symbols

#### Scenario: Load more matching assets
- **WHEN** the current search has more asset pages available
- **THEN** the combobox exposes an explicit localized load-more action
- **AND** loading another page appends unique result assets without removing selected chips or prior loaded results

#### Scenario: Search feedback is recoverable
- **WHEN** a catalog query is loading, empty, or fails
- **THEN** the combobox communicates the corresponding localized state accessibly
- **AND** a failed query provides a retry path for the current query

### Requirement: Watchlist drafts are protected before dismissal
The system SHALL protect a changed tracked-asset draft from accidental dialog dismissal.

#### Scenario: Reverted draft is clean
- **WHEN** the user changes the selection and then returns it to the initially loaded tracked-asset set
- **THEN** the editor treats the draft as clean and closes normally

#### Scenario: Dirty draft dismissal
- **WHEN** the user attempts to close a changed editor through Close, Cancel, Escape, or backdrop interaction
- **THEN** the system keeps the editor open and asks the user to continue editing or discard changes

#### Scenario: Save-pending dismissal
- **WHEN** watchlist synchronization is pending
- **THEN** the system prevents dialog dismissal and duplicate save submission until the attempt finishes

#### Scenario: Keyboard focus supports editing
- **WHEN** the complete initial watchlist has loaded into an editable dialog
- **THEN** keyboard focus moves to the asset search input
- **AND** Escape closes an open combobox popup before it initiates dialog dismissal

### Requirement: Partial synchronization preserves the editor draft
The system SHALL retain an operator's unsynchronized tracked-asset draft when one or more watchlist operations fail.

#### Scenario: Successful operations establish the new baseline
- **WHEN** a save attempt contains both successful and failed add or remove operations
- **THEN** the system updates the editor baseline only for the successful operations
- **AND** keeps the user-visible draft open and intact for operations that did not succeed

#### Scenario: Failed bulk add batch is retried as a batch
- **WHEN** a bulk add request fails
- **THEN** every asset ID in that failed request remains outstanding in the editor draft
- **AND** a retry submits that outstanding bulk batch without repeating successful operations

#### Scenario: Failed remove remains outstanding
- **WHEN** an asset-level remove operation fails
- **THEN** the asset remains in the editor baseline and draft
- **AND** the user can retry the outstanding removal

## MODIFIED Requirements

### Requirement: Active workspace watchlist management
The system SHALL let authorized users manage a single tracked-asset watchlist for the active workspace using the existing backend watchlist API.

#### Scenario: Load complete watchlist for active workspace
- **WHEN** an authorized user opens the workspace watchlist editor while a workspace is active
- **THEN** the system loads every available page of current tracked assets from the backend watchlist API before presenting an editable watchlist selection

#### Scenario: No active workspace
- **WHEN** a user attempts to access watchlist management without an active workspace
- **THEN** the system shows an empty or blocked state explaining that a workspace must be selected first

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

## REMOVED Requirements

### Requirement: Failed synchronization returns the editor to server truth
**Reason**: Reloading after any failed operation discards valid unsynchronized user intent and prevents targeted retry.

**Migration**: Reconcile successful add and remove operations into the editor baseline, retain failed work in the draft, and expose retry without closing the editor.
