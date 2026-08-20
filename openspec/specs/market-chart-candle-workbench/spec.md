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
The system SHALL define market chart frontend types, validation, and an authenticated action for the backend candle bridge while hiding backend-only retrieval parameters from the user.

#### Scenario: Fetch authenticated candle data
- **WHEN** the workbench needs candle data for the selected watchlist asset
- **THEN** the system calls the backend candle endpoint through `fetchAuthenticated()`

#### Scenario: Build latest count-back candle request
- **WHEN** the system requests initial or refreshed candles
- **THEN** it sends flat query parameters `assetId`, `timeframe`, exclusive `to`, and `countBack` to `GET /market-charts/candles`
- **AND** it does not send `from` or `includeAnnotations`
- **AND** `assetId` is the selected watchlist item's numeric asset id
- **AND** `to` is the UTC end boundary of the candle bucket containing the current request time
- **AND** weekly boundaries use ISO Monday `00:00:00Z`
- **AND** `countBack` uses this initial mapping: `1m=1000`, `5m=288`, `15m=192`, `30m=192`, `1h=720`, `4h=180`, `1d=150`, `1w=110`, `1mo=120`
- **AND** `countBack` is a positive integer no greater than `1000`

#### Scenario: Do not fall back to a calendar-time request
- **WHEN** the backend candle request fails or returns no candles
- **THEN** the system does not retry the same chart load with `from` and `to` calendar-time parameters

#### Scenario: Refresh uses a fresh aligned boundary
- **WHEN** the user refreshes or re-requests the current chart
- **THEN** the system recomputes exclusive `to` as the UTC end boundary for the latest current request time instead of reusing a stale timestamp

#### Scenario: Parse candle response
- **WHEN** the backend returns a candle response
- **THEN** the system validates and maps `provider`, optional `symbol`, `asset`, `timeframe`, `from`, `to`, and `candles[]` before rendering
- **AND** it requires `candles[]` to be explicitly present rather than defaulting a missing field to an empty result
- **AND** it retains optional candle `partial` flags
- **AND** if a compatibility `symbol` field is present, the system treats it as optional metadata and prefers `asset.symbol` for UI display

#### Scenario: Render a partial historical candle
- **WHEN** a valid candle response contains a candle with `partial=true`
- **THEN** the system renders that candle as available price data
- **AND** it does not forward-fill, replace, or discard the candle solely because it is partial

#### Scenario: Keep annotations outside the candle payload
- **WHEN** the workbench loads annotations for a non-empty candle result
- **THEN** it loads them through the annotation capability for the displayed candle interval
- **AND** it does not require `annotations[]` in the candle response

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

#### Scenario: No available candle data
- **WHEN** a successful count-back response explicitly contains `candles=[]` and its `from` and `to` both equal the requested anchor
- **THEN** the system shows a localized no-data state that preserves the selected asset and timeframe context
- **AND** the state provides a retry action
- **AND** the system does not synthesize a candle from a live quote or request annotations or calendar events for that empty result

#### Scenario: Do not classify an API error as empty history
- **WHEN** the backend rejects the request or the provider fetch fails
- **THEN** the system shows the error state rather than the no-data state
- **AND** it does not infer candle-history exhaustion from that error

#### Scenario: Do not classify a malformed response as empty history
- **WHEN** a candle response omits `candles[]`, contains invalid candles, or has an empty array whose `from` or `to` does not equal the requested anchor
- **THEN** the system treats the response as a retryable response error rather than available-empty history

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

### Requirement: Market chart supports four-hour selection and candle requests
The system SHALL expose backend timeframe `4h` through the existing market chart selection, URL, localization, and candle request flow.

#### Scenario: User selects four-hour timeframe
- **WHEN** the market chart timeframe control is available
- **THEN** it includes `4H` after `1H` and before `1D`
- **AND** its accessible label is `4 giờ` in Vietnamese and `4 hours` in English

#### Scenario: Four-hour timeframe is stored in the URL
- **WHEN** the user selects `4H`
- **THEN** the route stores `timeframe=4h`
- **AND** the value is accepted as a supported timeframe rather than replaced with the default

#### Scenario: Initial four-hour candles are requested
- **WHEN** the workbench loads or refreshes a valid `4h` selection
- **THEN** it requests candles with backend timeframe `4h`
- **AND** the initial request uses a rolling 30-day lookback ending at the current request time

#### Scenario: Four-hour candle response is parsed
- **WHEN** the backend returns a valid candle response with timeframe `4h`
- **THEN** frontend runtime validation accepts the response
- **AND** the workbench renders it through the existing successful chart state
