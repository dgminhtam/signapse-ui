import {
  registerOverlay,
  type Coordinate,
  type OverlayCreate,
  type OverlayMode,
  type OverlayTemplate,
} from "klinecharts"

import type { MarketChartTimeframe } from "@/app/lib/market-charts/definitions"

export type MarketChartDrawingTool =
  | "horizontal-line"
  | "trend-line"
  | "channel"
  | "fibonacci"
  | "circle"
  | "rectangle"

export type MarketChartDrawingState = {
  activeTool: MarketChartDrawingTool | null
  hasSelectedDrawing: boolean
  isCollapsed: boolean
  isLocked: boolean
  isMagnetEnabled: boolean
  isVisible: boolean
}

export type MarketChartDrawingMetadata = {
  source: "signapse-market-chart"
  tool: MarketChartDrawingTool
}

export const MARKET_CHART_DRAWING_TOOLS: MarketChartDrawingTool[] = [
  "horizontal-line",
  "trend-line",
  "channel",
  "fibonacci",
  "circle",
  "rectangle",
]

export const MARKET_CHART_DRAWING_TOOL_OVERLAYS: Record<
  MarketChartDrawingTool,
  string
> = {
  "horizontal-line": "horizontalStraightLine",
  "trend-line": "segment",
  channel: "priceChannelLine",
  fibonacci: "fibonacciLine",
  circle: "signapseCircle",
  rectangle: "signapseRectangle",
}

export function createMarketChartDrawingGroupId({
  assetId,
  timeframe,
}: {
  assetId: number
  timeframe: MarketChartTimeframe
}) {
  return `signapse-market-chart-drawings:${assetId}:${timeframe}`
}

export function createMarketChartDrawingOverlay({
  groupId,
  isLocked,
  isMagnetEnabled,
  isVisible,
  paneId,
  styles,
  tool,
  onDeselected,
  onDrawEnd,
  onRemoved,
  onSelected,
}: {
  groupId: string
  isLocked: boolean
  isMagnetEnabled: boolean
  isVisible: boolean
  paneId: string
  styles: OverlayCreate["styles"]
  tool: MarketChartDrawingTool
  onDeselected: NonNullable<OverlayCreate["onDeselected"]>
  onDrawEnd: NonNullable<OverlayCreate["onDrawEnd"]>
  onRemoved: NonNullable<OverlayCreate["onRemoved"]>
  onSelected: NonNullable<OverlayCreate["onSelected"]>
}): OverlayCreate {
  return {
    extendData: {
      source: "signapse-market-chart",
      tool,
    },
    groupId,
    lock: isLocked,
    mode: createMarketChartDrawingMode(isMagnetEnabled),
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS[tool],
    onDeselected,
    onDrawEnd,
    onRemoved,
    onSelected,
    paneId,
    styles,
    visible: isVisible,
  }
}

export function isMarketChartDrawingTool(
  value: string
): value is MarketChartDrawingTool {
  return (MARKET_CHART_DRAWING_TOOLS as string[]).includes(value)
}

export function createMarketChartDrawingMode(
  isMagnetEnabled: boolean
): OverlayMode {
  return isMagnetEnabled ? "weak_magnet" : "normal"
}

let marketChartDrawingOverlaysRegistered = false

export function registerMarketChartDrawingOverlays() {
  if (marketChartDrawingOverlaysRegistered) {
    return
  }

  registerOverlay(createCircleOverlayTemplate())
  registerOverlay(createRectangleOverlayTemplate())
  marketChartDrawingOverlaysRegistered = true
}

function createCircleOverlayTemplate(): OverlayTemplate<MarketChartDrawingMetadata> {
  return {
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS.circle,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    totalStep: 3,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 2) {
        return []
      }

      const [center, edge] = coordinates
      const radius = getDistance(center, edge)

      return {
        type: "circle",
        attrs: {
          r: radius,
          x: center.x,
          y: center.y,
        },
      }
    },
  }
}

function createRectangleOverlayTemplate(): OverlayTemplate<MarketChartDrawingMetadata> {
  return {
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS.rectangle,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    totalStep: 3,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 2) {
        return []
      }

      const [start, end] = coordinates

      return {
        type: "rect",
        attrs: {
          height: Math.abs(end.y - start.y),
          width: Math.abs(end.x - start.x),
          x: Math.min(start.x, end.x),
          y: Math.min(start.y, end.y),
        },
      }
    },
  }
}

function getDistance(start: Coordinate, end: Coordinate) {
  return Math.hypot(end.x - start.x, end.y - start.y)
}
