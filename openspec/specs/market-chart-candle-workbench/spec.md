# market-chart-candle-workbench Specification

## Purpose
TBD - created by archiving change add-market-chart-candle-workbench. Update Purpose after archive.
## Requirements
### Requirement: Authorized market chart route
The system SHALL expose a protected market chart workbench route for users who can read market chart candles and the current workspace watchlist.

#### Scenario: Authorized user opens the workbench
- **WHEN** a user with `market-chart:read` and `watchlist:read` navigates to `/market-charts`
- **THEN** the system displays the market chart workbench shell

#### Scenario: Unauthorized user opens the workbench
- **WHEN** a user without `market-chart:read` or without `watchlist:read` navigates to `/market-charts`
- **THEN** the system displays an access denied state that names the missing permission context

#### Scenario: Navigation and breadcrumb copy
- **WHEN** the market chart route is available to the user
- **THEN** navigation and breadcrumbs label the screen in professional Vietnamese as `Biểu đồ giá`

### Requirement: Watchlist asset chart controls
The system SHALL let authorized users request candles only for assets in the current workspace watchlist.

#### Scenario: Load selectable watchlist assets
- **WHEN** the workbench opens for an authorized user
- **THEN** the system loads current workspace watchlist assets from `GET /watchlists`
- **AND** the asset selector options are derived from returned watchlist items

#### Scenario: Empty watchlist
- **WHEN** the current workspace watchlist has no assets
- **THEN** the system shows an empty state explaining that charts require tracked assets
- **AND** the system does not render a free-form symbol input as a fallback

#### Scenario: Select watchlist asset and timeframe
- **WHEN** the user selects a watchlist asset and supported timeframe
- **THEN** the system resolves the selected asset by `assetId`
- **AND** the system uses the selected watchlist item's `assetId` as the backend candle request `assetId`

#### Scenario: Prevent arbitrary symbol entry
- **WHEN** the user uses the market chart workbench
- **THEN** the system does not allow manual entry of arbitrary provider symbols

#### Scenario: Hide manual time window controls
- **WHEN** the user uses the market chart workbench
- **THEN** the system does not expose editable `from` or `to` controls

#### Scenario: Persist chart state in URL
- **WHEN** the chart selection changes
- **THEN** the route URL includes only `assetId` and `timeframe` query params for chart state
- **AND** the route URL does not include `symbol`, `from`, or `to`

#### Scenario: Reject invalid asset selection
- **WHEN** the URL includes an `assetId` that is not present in the loaded workspace watchlist
- **THEN** the system shows invalid-selection guidance in Vietnamese
- **AND** the system prevents a candle request for that asset

### Requirement: Latest candle API integration
The system SHALL define market chart frontend types, validation, and authenticated action for the backend candle bridge while hiding backend-only time params from the user.

#### Scenario: Fetch authenticated candle data
- **WHEN** the workbench needs candle data for the selected watchlist asset
- **THEN** the system calls the backend candle endpoint through `fetchAuthenticated()`

#### Scenario: Build latest rolling candle request
- **WHEN** the system requests candles
- **THEN** it sends flat query parameters `assetId`, `timeframe`, `from`, `to`, and `includeAnnotations` to `GET /market-charts/candles`
- **AND** `assetId` is the selected watchlist item's numeric asset id
- **AND** `to` is computed from the current request time
- **AND** `from` is computed from `to` using this initial lookback mapping: `1m=1 day`, `5m=1 day`, `15m=2 days`, `30m=4 days`, `1h=7 days`, `1d=150 days`, `1w=770 days`, `1mo=3650 days`
- **AND** `includeAnnotations` defaults to `true` when the caller does not explicitly provide a value
- **AND** the default candle request does not derive `includeAnnotations=false` solely because annotation markers are hidden in the UI

#### Scenario: Refresh uses current time
- **WHEN** the user refreshes or re-requests the current chart
- **THEN** the system recomputes `to` from the latest current time instead of reusing a stale timestamp

#### Scenario: Parse candle response
- **WHEN** the backend returns a candle response
- **THEN** the system validates and maps `provider`, `asset`, `timeframe`, `from`, `to`, `candles[]`, and `annotations[]` before rendering
- **AND** if a compatibility `symbol` field is present, the system treats it as optional metadata and prefers `asset.symbol` for UI display

#### Scenario: Parse annotations as chart payload
- **WHEN** the backend returns `annotations[]`
- **THEN** the system keeps the annotation payload typed and non-crashing
- **AND** marker and detail visibility are governed by the annotation marker capability

#### Scenario: Handle backend error
- **WHEN** the backend rejects the request or provider fetch fails
- **THEN** the system shows a non-crashing error state with retry guidance in Vietnamese

### Requirement: Candlestick chart rendering
The system SHALL render successful candle responses as a financial candlestick chart using the selected chart engine and SHALL keep optional volume visualization under explicit user control.

#### Scenario: Render candles
- **WHEN** the backend returns one or more candles
- **THEN** the system renders candlesticks using candle `time`, `open`, `high`, `low`, and `close`

#### Scenario: Keep available volume hidden by default
- **WHEN** candles include usable volume values
- **AND** the user has not enabled the Volume indicator
- **THEN** the system does not render the volume pane

#### Scenario: Render enabled volume when available
- **WHEN** candles include usable volume values
- **AND** the user enables the Volume indicator
- **THEN** the system renders volume as a secondary pane without competing with the price chart

#### Scenario: Resize chart surface
- **WHEN** the chart container size changes
- **THEN** the chart resizes without overflowing the app layout

### Requirement: Workbench states
The system SHALL provide clear visual states for the market chart workbench lifecycle.

#### Scenario: First run with watchlist assets
- **WHEN** the user opens the workbench without query params and the watchlist has assets
- **THEN** the system either auto-selects a valid watchlist asset or prompts the user to choose one without exposing a symbol input

#### Scenario: Loading watchlist data
- **WHEN** watchlist assets are pending
- **THEN** the system shows a skeleton or spinner state that mirrors the final selector and chart shell

#### Scenario: Loading candle data
- **WHEN** a candle request is pending
- **THEN** the system shows a skeleton or spinner state that preserves the selected asset and timeframe context

#### Scenario: No candle data
- **WHEN** the backend returns a successful response with an empty `candles[]`
- **THEN** the system shows a no-data state that preserves the selected asset, response asset metadata, timeframe, provider, and returned time window

### Requirement: Future overlay and lazy-load boundaries
The system SHALL make room for event overlays and lazy historical loading without exposing unsupported behavior.

#### Scenario: Annotation data is unavailable
- **WHEN** annotation marker rendering has not been explicitly implemented
- **THEN** the system does not render fake event markers, backend annotation markers, or event popups

#### Scenario: Future event panel placeholder
- **WHEN** the workbench displays contextual side content for event overlays
- **THEN** the panel clearly states that event marker support depends on a future backend contract

#### Scenario: Lazy historical loading keeps route state stable
- **WHEN** lazy historical loading is available and the user pans toward older candles
- **THEN** the system keeps `assetId` and `timeframe` as the only chart route state
- **AND** the system does not expose manual `from` or `to` controls

### Requirement: Minimal chart workspace
The system SHALL present the market chart as a data-first workspace with minimal explanatory copy.

#### Scenario: Avoid duplicate page identity
- **WHEN** the market chart page is displayed inside the main app shell
- **THEN** the body does not repeat a large page heading or hero paragraph when breadcrumb/app header already identifies the page

#### Scenario: Keep only operational controls
- **WHEN** the user reads the top chart controls
- **THEN** the screen shows only the watchlist asset selector, timeframe selector, refresh action, and compact freshness metadata
- **AND** the screen does not show decorative badges such as `Watchlist workspace`, `OHLCV mới nhất`, or `Candle bridge`

#### Scenario: Compact stats rail
- **WHEN** candle data is available
- **THEN** the side summary presents compact market stats such as selected asset, change percent, latest close, high/low, candle count, and returned range
- **AND** the stats rail does not include redundant card descriptions that restate obvious labels

#### Scenario: Hide future-event panel until useful
- **WHEN** annotation data is unavailable
- **THEN** the main workspace does not render a standalone future event panel
- **AND** the system may show future-event support only as small secondary metadata if needed

#### Scenario: Avoid implementation-detail copy
- **WHEN** the chart surface is displayed
- **THEN** the UI does not explain backend-only details such as `from/to`, provider bridge implementation, or chart engine internals unless needed for an error, empty state, or required attribution

### Requirement: Vendor attribution compliance
The system SHALL keep required vendor attribution when the selected chart engine requires it while avoiding unnecessary chart clutter.

#### Scenario: Selected engine requires attribution
- **WHEN** the active chart dependency requires user-visible attribution
- **THEN** the page or application provides that attribution in a low-clutter but accessible location

#### Scenario: Attribution is not duplicated
- **WHEN** the active chart dependency does not require primary-surface attribution
- **THEN** the chart surface does not render redundant explanatory footer copy about the chart engine unless there is a product or legal reason

### Requirement: Viewport-aware chart reading area
The system SHALL size the mounted market chart reading area from the available workspace viewport instead of using a fixed canvas height that leaves large unused vertical space.

#### Scenario: Tall desktop viewport
- **WHEN** the market chart workbench is displayed on a tall desktop viewport
- **THEN** the chart surface expands vertically to use the available workspace height
- **AND** the surface does not leave a large blank area below the chart solely because of a fixed canvas height

#### Scenario: Short desktop viewport
- **WHEN** the market chart workbench is displayed on a shorter desktop viewport
- **THEN** the chart surface keeps a usable minimum height without overflowing the app layout unexpectedly

#### Scenario: Chart container resizes
- **WHEN** the workspace size changes due to window resize, sidebar state, or full-screen state
- **THEN** the chart resizes to the current container without requiring a data reset

### Requirement: Live candle updates preserve user viewport
The system SHALL apply incoming live candle updates without resetting the chart dataset or stealing the user's visible chart range.

#### Scenario: User reviews older candles
- **WHEN** the user has panned away from the realtime edge to review older candles
- **AND** a live candle update arrives for the active asset and timeframe
- **THEN** the displayed chart data updates without calling a chart-wide data reset
- **AND** the visible historical range remains stable

#### Scenario: Live candle replaces latest bucket
- **WHEN** a live candle update has the same bucket time as the latest displayed candle
- **THEN** the latest candle is updated in place through a non-reset update path

#### Scenario: Live candle appends new bucket
- **WHEN** a live candle update has a newer bucket time than the latest displayed candle
- **THEN** the live candle is appended through a non-reset update path
- **AND** the chart does not reinitialize lazy-loaded historical candles

#### Scenario: Chart identity changes
- **WHEN** the selected asset, timeframe, workspace context, or chart reset identity changes
- **THEN** the system may reset and reload chart data for the new identity
- **AND** live updates from the previous identity no longer update the current chart
