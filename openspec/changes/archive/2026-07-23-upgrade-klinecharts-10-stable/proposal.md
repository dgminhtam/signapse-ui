## Why

Signapse currently depends on the prerelease `klinecharts@10.0.0-beta1`, while the stable `10.0.0` release changes layout and indicator pane APIs. Upgrading now removes the beta dependency and keeps the market chart adapter aligned with the supported stable contract.

## What Changes

- Pin `klinecharts` to stable version `10.0.0` and refresh the pnpm lockfile.
- Replace the beta array-based chart layout with the stable default layout object while preserving the candle-axis gap.
- Adapt indicator creation to the stable `createIndicator(indicator, isStack?)` signature and configure secondary panes through `setPaneOptions`.
- Preserve the existing chart lifecycle, data loader, indicator toggles, Volume behavior, custom drawings, annotations, theme, locale, screenshot, and fullscreen behavior.
- Verify the stable dependency through repository checks and record focused user-owned chart interaction QA without making it an archive-blocking task.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-klinechart-engine`: Require the market chart adapter to use stable KLineChart 10 APIs while preserving existing chart behavior and pane identity.

## Impact

- Dependency manifests: `package.json` and `pnpm-lock.yaml`.
- Market chart adapter: `app/[lang]/(main)/market-charts/market-chart-canvas.tsx`.
- No backend API, candle DTO, route, localization, or workbench control contract changes.
- Custom drawing and style helpers are compatibility-review surfaces but should only change if stable types or verification expose an incompatibility.
