## 1. Drawing Tool Model

- [x] 1.1 Expand `MarketChartDrawingTool` to include all line, channel, shape, and pattern tools from the proposal.
- [x] 1.2 Add a typed drawing palette model with stable palette ids, ordered tool lists, default tools, and palette-to-tool membership helpers.
- [x] 1.3 Update drawing tool icon and dictionary label mappings so every new tool and palette has typechecked labels in Vietnamese and English.
- [x] 1.4 Update drawing state to remember the last selected tool per palette while preserving one active drawing tool.

## 2. Overlay Mapping And Templates

- [x] 2.1 Map line and channel tools to KLineChart built-in overlay names where available.
- [x] 2.2 Keep existing circle and rectangle custom overlays compatible with the expanded tool model.
- [x] 2.3 Add custom overlay templates for parallelogram and triangle.
- [x] 2.4 Add custom overlay templates for XABCD pattern, ABCD pattern, three waves, five waves, eight waves, and any waves.
- [x] 2.5 Ensure all Signapse-owned custom overlays register once and share existing drawing styles, lock, visibility, magnet mode, selection, delete, and clear-all behavior.

## 3. Drawing Toolbar Palettes

- [x] 3.1 Replace the flat drawing tool `ToggleGroup` with four click-open shadcn `DropdownMenu` palettes.
- [x] 3.2 Render palette triggers as compact shadcn buttons that show the last selected tool icon for each palette.
- [x] 3.3 Render palette menu items inside `DropdownMenuGroup` and select a tool by click without hover-open timers.
- [x] 3.4 Keep magnet, lock, and visibility as the existing separated `ToggleGroup type="multiple"` section.
- [x] 3.5 Keep delete selected and clear all as action buttons outside palette menus, separated with shadcn `Separator`.
- [x] 3.6 Preserve accessible labels for palette triggers, palette items, state controls, and destructive actions.

## 4. Annotation Default State

- [x] 4.1 Initialize market chart annotations as enabled by default.
- [x] 4.2 Ensure the default candle request sends `includeAnnotations=true`.
- [x] 4.3 Preserve the annotation toggle behavior so disabling annotations sends or refreshes requests with `includeAnnotations=false` and hides annotation marker copy.
- [x] 4.4 Confirm annotation visibility does not add new route params or manual chart time controls.

## 5. Verification

- [x] 5.1 Run static search or deterministic review to confirm feature code does not import raw Radix primitives or add custom hover timer state for palette menus.
- [x] 5.2 Run static search or deterministic review to confirm every `MarketChartDrawingTool` has an overlay mapping, icon, and dictionary label.
- [x] 5.3 Run `openspec validate expand-market-chart-drawing-tool-palettes --strict`.
- [x] 5.4 Run `pnpm typecheck`.
- [x] 5.5 Run `pnpm lint`.

User-owned manual QA note: after implementation, open `/vi/market-charts`, confirm annotation markers are on by default, each drawing palette opens on click, every listed tool can create or cancel a drawing without leaving the toolbar stuck, and disabling annotations hides markers without changing `assetId` or `timeframe` route state.
