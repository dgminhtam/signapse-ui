## 1. Harden Chart Time Data

- [x] 1.1 Add narrow candle and annotation item guards near the existing market chart normalization helpers.
- [x] 1.2 Apply candle guards before timestamp conversion, KLine data creation, de-duplication, oldest timestamp lookup, and lazy older candle merge.
- [x] 1.3 Apply annotation guards before annotation merge, sorting, grouping, and marker placement.
- [x] 1.4 Ensure invalid candle or annotation entries are omitted without rendering placeholder data or crashing the chart.

## 2. Move Drawing Toolbar To Side Rail

- [x] 2.1 Refactor the market chart surface body into a flex layout with a compact drawing rail and a `min-w-0 flex-1` chart viewport.
- [x] 2.2 Remove absolute overlay positioning from the drawing toolbar and restyle it as a dedicated side rail using existing shadcn wrappers and semantic tokens.
- [x] 2.3 Preserve drawing tool selection, magnet, lock, visibility, selected delete, clear-all confirmation, and active/disabled states after the layout move.
- [x] 2.4 Prevent chart canvas or annotation popup click handling from swallowing drawing rail actions.
- [x] 2.5 Preserve fullscreen resizing, annotation marker placement, screenshot behavior, and no page-level horizontal overflow.

## 3. Verification

- [x] 3.1 Run `openspec validate fix-market-chart-time-and-drawing-toolbar --strict`.
- [x] 3.2 Run `pnpm typecheck`.
- [x] 3.3 Run `pnpm lint`.
- [x] 3.4 Static-review market chart source for unsafe `.time` reads, remaining absolute drawing toolbar placement, direct primitive imports, and unintended chart dependency changes.
