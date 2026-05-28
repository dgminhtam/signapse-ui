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
  | "horizontal-ray"
  | "horizontal-segment"
  | "vertical-line"
  | "vertical-ray"
  | "vertical-segment"
  | "trend-line"
  | "ray"
  | "price-channel-line"
  | "parallel-line"
  | "circle"
  | "rectangle"
  | "parallelogram"
  | "triangle"
  | "xabcd-pattern"
  | "abcd-pattern"
  | "three-waves"
  | "five-waves"
  | "eight-waves"
  | "any-waves"

export type MarketChartDrawingPalette = "line" | "channel" | "shape" | "pattern"

export type MarketChartDrawingPaletteSelection = Record<
  MarketChartDrawingPalette,
  MarketChartDrawingTool
>

export type MarketChartDrawingState = {
  activeTool: MarketChartDrawingTool | null
  hasSelectedDrawing: boolean
  isLocked: boolean
  isMagnetEnabled: boolean
  isVisible: boolean
  selectedTools: MarketChartDrawingPaletteSelection
}

export type MarketChartDrawingMetadata = {
  source: "signapse-market-chart"
  tool: MarketChartDrawingTool
}

export const MARKET_CHART_DRAWING_TOOLS: MarketChartDrawingTool[] = [
  "horizontal-line",
  "horizontal-ray",
  "horizontal-segment",
  "vertical-line",
  "vertical-ray",
  "vertical-segment",
  "trend-line",
  "ray",
  "price-channel-line",
  "parallel-line",
  "circle",
  "rectangle",
  "parallelogram",
  "triangle",
  "xabcd-pattern",
  "abcd-pattern",
  "three-waves",
  "five-waves",
  "eight-waves",
  "any-waves",
]

export const MARKET_CHART_DRAWING_PALETTES: MarketChartDrawingPalette[] = [
  "line",
  "channel",
  "shape",
  "pattern",
]

export const MARKET_CHART_DRAWING_PALETTE_TOOLS: Record<
  MarketChartDrawingPalette,
  MarketChartDrawingTool[]
> = {
  line: [
    "horizontal-line",
    "horizontal-ray",
    "horizontal-segment",
    "vertical-line",
    "vertical-ray",
    "vertical-segment",
    "trend-line",
    "ray",
  ],
  channel: ["price-channel-line", "parallel-line"],
  shape: ["circle", "rectangle", "parallelogram", "triangle"],
  pattern: [
    "xabcd-pattern",
    "abcd-pattern",
    "three-waves",
    "five-waves",
    "eight-waves",
    "any-waves",
  ],
}

export const DEFAULT_MARKET_CHART_DRAWING_PALETTE_TOOLS: MarketChartDrawingPaletteSelection =
  {
    line: "horizontal-line",
    channel: "price-channel-line",
    shape: "circle",
    pattern: "xabcd-pattern",
  }

export const MARKET_CHART_DRAWING_TOOL_OVERLAYS: Record<
  MarketChartDrawingTool,
  string
> = {
  "horizontal-line": "horizontalStraightLine",
  "horizontal-ray": "horizontalRayLine",
  "horizontal-segment": "horizontalSegment",
  "vertical-line": "verticalStraightLine",
  "vertical-ray": "verticalRayLine",
  "vertical-segment": "verticalSegment",
  "trend-line": "segment",
  ray: "rayLine",
  "price-channel-line": "priceChannelLine",
  "parallel-line": "parallelStraightLine",
  circle: "signapseCircle",
  rectangle: "signapseRectangle",
  parallelogram: "signapseParallelogram",
  triangle: "signapseTriangle",
  "xabcd-pattern": "signapseXabcdPattern",
  "abcd-pattern": "signapseAbcdPattern",
  "three-waves": "signapseThreeWaves",
  "five-waves": "signapseFiveWaves",
  "eight-waves": "signapseEightWaves",
  "any-waves": "signapseAnyWaves",
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

export function getMarketChartDrawingToolPalette(
  tool: MarketChartDrawingTool
): MarketChartDrawingPalette {
  const palette = MARKET_CHART_DRAWING_PALETTES.find((candidate) =>
    MARKET_CHART_DRAWING_PALETTE_TOOLS[candidate].includes(tool)
  )

  return palette ?? "line"
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
  registerOverlay(createParallelogramOverlayTemplate())
  registerOverlay(createTriangleOverlayTemplate())
  registerOverlay(
    createPolylineOverlayTemplate({
      labels: ["X", "A", "B", "C", "D"],
      pointCount: 5,
      tool: "xabcd-pattern",
    })
  )
  registerOverlay(
    createPolylineOverlayTemplate({
      labels: ["A", "B", "C", "D"],
      pointCount: 4,
      tool: "abcd-pattern",
    })
  )
  registerOverlay(
    createPolylineOverlayTemplate({
      labels: ["1", "2", "3", "4"],
      pointCount: 4,
      tool: "three-waves",
    })
  )
  registerOverlay(
    createPolylineOverlayTemplate({
      labels: ["1", "2", "3", "4", "5", "6"],
      pointCount: 6,
      tool: "five-waves",
    })
  )
  registerOverlay(
    createPolylineOverlayTemplate({
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      pointCount: 9,
      tool: "eight-waves",
    })
  )
  registerOverlay(
    createPolylineOverlayTemplate({
      labels: ["1", "2", "3", "4", "5", "N"],
      pointCount: 6,
      tool: "any-waves",
    })
  )
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

function createParallelogramOverlayTemplate(): OverlayTemplate<MarketChartDrawingMetadata> {
  return {
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS.parallelogram,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    totalStep: 4,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 2) {
        return []
      }

      if (coordinates.length < 3) {
        return createLineFigure(coordinates)
      }

      const [start, end, offset] = coordinates
      const fourth = {
        x: offset.x + end.x - start.x,
        y: offset.y + end.y - start.y,
      }

      return createLineFigure([start, end, fourth, offset, start])
    },
  }
}

function createTriangleOverlayTemplate(): OverlayTemplate<MarketChartDrawingMetadata> {
  return {
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS.triangle,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    totalStep: 4,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 2) {
        return []
      }

      if (coordinates.length < 3) {
        return createLineFigure(coordinates)
      }

      return createLineFigure([
        coordinates[0],
        coordinates[1],
        coordinates[2],
        coordinates[0],
      ])
    },
  }
}

function createPolylineOverlayTemplate({
  labels,
  pointCount,
  tool,
}: {
  labels: string[]
  pointCount: number
  tool: MarketChartDrawingTool
}): OverlayTemplate<MarketChartDrawingMetadata> {
  return {
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS[tool],
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    totalStep: pointCount + 1,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 2) {
        return []
      }

      return [
        createLineFigure(coordinates),
        ...coordinates.map((coordinate, index) => ({
          type: "text",
          attrs: {
            text: labels[index] ?? String(index + 1),
            x: coordinate.x + 6,
            y: coordinate.y - 18,
          },
          ignoreEvent: true,
        })),
      ]
    },
  }
}

function createLineFigure(coordinates: Coordinate[]) {
  return {
    type: "line",
    attrs: {
      coordinates,
    },
  }
}

function getDistance(start: Coordinate, end: Coordinate) {
  return Math.hypot(end.x - start.x, end.y - start.y)
}
