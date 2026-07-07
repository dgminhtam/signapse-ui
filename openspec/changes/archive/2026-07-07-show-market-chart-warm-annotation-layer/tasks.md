## 1. Contract Mapping

- [x] 1.1 Replace the market chart annotation TypeScript type with the timeline shell: `id`, `annotationType`, `assetId`, `time`, `hotEvent`, and `warmEpisode`.
- [x] 1.2 Add nested DTO/Zod schemas for `MarketChartHotEventAnnotationResponse`, `MarketChartWarmEpisodeAnnotationResponse`, and `MarketChartWarmEpisodeEventAnnotationResponse`.
- [x] 1.3 Remove frontend reliance on removed flat annotation fields and legacy top-level warm event handling.

## 2. Hot Event Layer

- [x] 2.1 Update hot marker grouping to filter `HOT_EVENT` annotations with `hotEvent`.
- [x] 2.2 Keep hot marker placement at top-level `time` and derive marker direction, priority, title, summary, event id, reactions, evidence, and links from `hotEvent`.
- [x] 2.3 Preserve the current hot popup layout and interaction behavior.

## 3. Warm Episode Layer

- [x] 3.1 Update warm band grouping to filter `WARM_EPISODE` annotations with `warmEpisode`.
- [x] 3.2 Map warm band horizontal range from `warmEpisode.periodStart` to `warmEpisode.periodEnd`.
- [x] 3.3 Keep warm band vertical bounds based on highest candle high and lowest candle low inside the episode period.
- [x] 3.4 Omit invalid or unmappable warm episodes without affecting valid hot markers or warm bands.

## 4. Warm Episode Popup

- [x] 4.1 Split popup detail rendering into small hot event and warm episode paths.
- [x] 4.2 Render warm episode summary, episode outcome, and nested `warmEpisode.events[]` as compact timeline rows.
- [x] 4.3 Add market chart dictionary labels for warm episode copy and warm relation type badges.
- [x] 4.4 Ensure backend enum values are localized before display.

## 5. Verification

- [x] 5.1 Static search market chart code/specs to confirm legacy top-level warm event handling is removed, except documentation notes that say it no longer exists.
- [x] 5.2 Run `openspec.cmd validate show-market-chart-warm-annotation-layer --strict`.
- [x] 5.3 Run `pnpm.cmd typecheck`.
