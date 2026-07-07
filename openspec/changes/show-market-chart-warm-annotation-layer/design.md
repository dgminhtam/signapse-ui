## Context

The market chart annotation endpoint now returns a timeline shell instead of flat annotation objects. Top-level annotations are only:

- `HOT_EVENT`: render a point marker at top-level `time`; popup content comes from `annotation.hotEvent`.
- `WARM_EPISODE`: render a range overlay from `annotation.warmEpisode.periodStart` to `annotation.warmEpisode.periodEnd`; popup content comes from `annotation.warmEpisode`.

The current implementation and earlier artifacts still preserve old flat fields and still mention the legacy top-level warm event type. Warm display also reuses the hot event popup, which makes an episode feel like a single event instead of a market period.

## Goals / Non-Goals

**Goals:**
- Map the annotation DTO/Zod schema to the new timeline shell.
- Keep hot marker UI and interaction behavior unchanged, with data sourced from `hotEvent`.
- Render warm episodes as non-persisted chart range bands bounded by the loaded candle high/low inside the episode period.
- Render warm episode detail as an episode overview with summary, outcome, and compact nested event timeline.
- Remove legacy top-level warm event and stale flat field handling from market chart annotation code/specs.
- Keep annotation layer toggle semantics unchanged: disabled means no hot markers or warm bands.

**Non-Goals:**
- No klinecharts custom overlay for warm bands.
- No separate warm-layer toggle.
- No direct warm event marker/tick implementation inside the band.
- No popup abstraction framework beyond a small hot detail and warm detail split.
- No backend contract changes.

## Decisions

1. Map annotations by top-level timeline type only.
   - `HOT_EVENT` requires `hotEvent` and stays on the existing point grouping path.
   - `WARM_EPISODE` requires `warmEpisode` and becomes a range band.
   - The legacy top-level warm event type is removed. If an unknown or incomplete annotation arrives, omit it without crashing.
   - API direction values are `BULLISH`, `BEARISH`, and `NEUTRAL`; keep any existing internal `MIXED` only for aggregate marker color logic.

2. Keep the hot layer behavior as-is.
   - Marker time remains top-level `annotation.time`.
   - Popup fields move from flat annotation fields to `annotation.hotEvent`: title, summary, severity, direction, confidence, top reaction, reactions, evidence, and links.
   - Existing reaction/outcome presentation remains the hot event preview.

3. Render warm episodes with the existing HTML band approach.
   - Horizontal range maps `warmEpisode.periodStart` to `warmEpisode.periodEnd`.
   - Vertical range uses the highest candle high and lowest candle low inside the episode period.
   - Bands remain low-opacity, below point markers, and outside persisted drawing state.
   - Periods with invalid dates, no chart mapping, or no loaded candle price data are omitted.

4. Give warm episodes their own compact popup layout.
   - Use a small `WarmEpisodeAnnotationDetail` beside the existing hot detail component.
   - Header uses an episode label such as `Giai đoạn`; nested event count is secondary copy such as `2 sự kiện`.
   - Body starts with `warmEpisode.summary`.
   - Episode outcome appears below the summary and uses `warmEpisode.direction` plus `warmEpisode.outcome`.
   - `warmEpisode.events[]` renders as a compact timeline: time, `title || summary`, optional summary, relation type, reaction direction, reaction horizon, and confidence.
   - Event-level `reaction.outcome` is deferred unless it is later needed; avoid nested cards inside the episode popup.

5. Keep i18n explicit.
   - Add dictionary keys for warm episode labels, nested event timeline title, episode outcome title, and relation type labels.
   - Do not display backend enum strings directly for user-facing badges.

## Risks / Trade-offs

- Warm bands can visually compete with candles -> use low opacity, bound to the price range, and place below markers.
- Some episodes may span outside loaded candle data -> render only when candle data can produce a valid high/low range.
- A warm episode with many nested events could make the popup long -> use the existing scroll area surface and compact rows.
- Deferring warm event ticks means users inspect nested events after clicking the band -> add ticks later only if range density scanning becomes a real need.
