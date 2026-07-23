## 1. Localized Quick-List Copy

- [x] 1.1 Add typed EN/VI Market Charts calendar status labels for published and pending states, reusing the existing localized economic calendar detail-action copy.

## 2. Event Presentation

- [x] 2.1 Restructure `MarketChartCalendarEventList` so time and impact share the first row, title remains the event identity, and currency plus the localized status Badge share the next row without event type.
- [x] 2.2 Replace generic release-value chips with the ordered actual, forecast, and previous comparison; render revision secondarily and remove both better/worse fields from the quick list.
- [x] 2.3 Replace the linked title and separate content-availability sentence with one localized, focus-visible detail action to the existing locale-preserving economic calendar route.
- [x] 2.4 Replace the native overflow container with the shared ScrollArea and render a decorative Separator only between adjacent event articles.
- [x] 2.5 Shorten the detail action by reusing the shared `Details` / `Chi tiết` dictionary label.

## 3. Verification

- [x] 3.1 Run targeted lint for the touched dictionary and Market Chart renderer files, then run project typecheck.
- [x] 3.2 Run strict OpenSpec validation and inspect the final diff for raw backend status text, event type, either better/worse field, duplicate detail links, unrelated edits, and preserved impact-badge behavior.
- [x] 3.3 Run targeted lint, project typecheck, strict OpenSpec validation, and inspect the incremental diff for ScrollArea bounds, separator placement, and the shared detail label.

User-owned manual QA: At narrow and desktop widths, open both a chart marker popover and the calendar-summary popover; confirm scan order, wrapping, keyboard focus, and the detail action.
