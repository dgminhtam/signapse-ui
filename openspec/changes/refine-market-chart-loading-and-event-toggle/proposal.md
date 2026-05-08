## Why

The market chart is close visually, but two interaction/loading details still weaken polish: the event milestone controls show scroll artifacts and weak active/focus feedback, while the page and chart skeletons no longer mirror the current two-level chart layout. This change tightens those states so loading and selection feel intentional instead of leftover from earlier layouts.

## What Changes

- Keep the market chart loading model as two levels:
  - Page/Suspense skeleton for server permission and watchlist bootstrap.
  - Chart/data skeleton for client-side candle fetches after the workbench is mounted.
- Update the page skeleton to mirror the current cardless toolbar and single chart surface; remove the old right-side panel/card-shell skeleton.
- Update the chart/data skeleton to mirror the chart canvas and optional event rail instead of rendering fake in-chart metadata/header pills.
- Replace bottom event rail milestone `Button` controls with shadcn `ToggleGroup` / `ToggleGroupItem` single-selection composition.
- Fix the event rail bugs where selected/focused milestones reveal scrollbars and where active/focus feedback is too subtle.
- Add the official shadcn `toggle-group` primitive if it is not already present; do not manually customize existing `@/components/ui` primitives.
- Do not change backend APIs, chart data loading, annotation marker rendering, popup content, lazy history behavior, or route query params.

## Capabilities

### New Capabilities

- `market-chart-two-level-skeletons`: Covers page-level and chart-level skeleton behavior for the market chart workbench.
- `market-chart-event-rail-toggle-group`: Covers bottom event rail milestone selection using shadcn ToggleGroup semantics and interaction feedback.

### Modified Capabilities

- None.

## Impact

- Affected frontend files:
  - `app/(main)/market-charts/page.tsx`
  - `app/(main)/market-charts/market-chart-workbench.tsx`
- Potentially added shadcn primitive:
  - `components/ui/toggle-group.tsx`
- No backend API, chart engine, global theme token, dependency beyond shadcn primitive requirements, or route state changes are expected.
- Verification should include targeted market chart lint, typecheck, build, OpenSpec validation, and visual smoke when an authenticated chart session with annotations is available.
