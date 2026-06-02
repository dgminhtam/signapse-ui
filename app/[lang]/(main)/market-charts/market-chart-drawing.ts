import {
  registerOverlay,
  type Coordinate,
  type OverlayCreate,
  type OverlayMode,
  type OverlayTemplate,
} from "klinecharts"

import type { MarketChartTimeframe } from "@/app/lib/market-charts/definitions"

import {
  DEFAULT_MARKET_CHART_DRAWING_STYLE,
  normalizeMarketChartDrawingStyle,
  type MarketChartDrawingStyle,
} from "./market-chart-drawing-style"

export type MarketChartDrawingTool =
  | "horizontal-line"
  | "horizontal-ray"
  | "horizontal-segment"
  | "vertical-line"
  | "vertical-ray"
  | "vertical-segment"
  | "trend-line"
  | "ray"
  | "segment"
  | "arrow"
  | "price-line"
  | "price-channel-line"
  | "parallel-line"
  | "circle"
  | "rectangle"
  | "parallelogram"
  | "triangle"
  | "fibonacci-line"
  | "fibonacci-segment"
  | "fibonacci-circle"
  | "fibonacci-spiral"
  | "fibonacci-sector"
  | "fibonacci-extension"
  | "gann-box"
  | "xabcd-pattern"
  | "abcd-pattern"
  | "three-waves"
  | "five-waves"
  | "eight-waves"
  | "any-waves"

export type MarketChartDrawingPalette =
  | "line"
  | "channel"
  | "shape"
  | "fibonacci"
  | "pattern"

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
  style: MarketChartDrawingStyle
} & Record<string, unknown>

export const MARKET_CHART_DRAWING_TOOLS: MarketChartDrawingTool[] = [
  "horizontal-line",
  "horizontal-ray",
  "horizontal-segment",
  "vertical-line",
  "vertical-ray",
  "vertical-segment",
  "trend-line",
  "ray",
  "segment",
  "arrow",
  "price-line",
  "price-channel-line",
  "parallel-line",
  "circle",
  "rectangle",
  "parallelogram",
  "triangle",
  "fibonacci-line",
  "fibonacci-segment",
  "fibonacci-circle",
  "fibonacci-spiral",
  "fibonacci-sector",
  "fibonacci-extension",
  "gann-box",
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
  "fibonacci",
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
    "segment",
    "arrow",
    "price-line",
  ],
  channel: ["price-channel-line", "parallel-line"],
  shape: ["circle", "rectangle", "parallelogram", "triangle"],
  fibonacci: [
    "fibonacci-line",
    "fibonacci-segment",
    "fibonacci-circle",
    "fibonacci-spiral",
    "fibonacci-sector",
    "fibonacci-extension",
    "gann-box",
  ],
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
    fibonacci: "fibonacci-line",
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
  "trend-line": "straightLine",
  ray: "rayLine",
  segment: "segment",
  arrow: "signapseArrow",
  "price-line": "priceLine",
  "price-channel-line": "priceChannelLine",
  "parallel-line": "parallelStraightLine",
  circle: "signapseCircle",
  rectangle: "signapseRectangle",
  parallelogram: "signapseParallelogram",
  triangle: "signapseTriangle",
  "fibonacci-line": "fibonacciLine",
  "fibonacci-segment": "signapseFibonacciSegment",
  "fibonacci-circle": "signapseFibonacciCircle",
  "fibonacci-spiral": "signapseFibonacciSpiral",
  "fibonacci-sector": "signapseFibonacciSector",
  "fibonacci-extension": "signapseFibonacciExtension",
  "gann-box": "signapseGannBox",
  "xabcd-pattern": "signapseXabcdPattern",
  "abcd-pattern": "signapseAbcdPattern",
  "three-waves": "signapseThreeWaves",
  "five-waves": "signapseFiveWaves",
  "eight-waves": "signapseEightWaves",
  "any-waves": "signapseAnyWaves",
}

const MARKET_CHART_DRAWING_OVERLAY_TOOLS = new Map<string, MarketChartDrawingTool>(
  Object.entries(MARKET_CHART_DRAWING_TOOL_OVERLAYS).map(([tool, name]) => [
    name,
    tool as MarketChartDrawingTool,
  ])
)

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
  style = DEFAULT_MARKET_CHART_DRAWING_STYLE,
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
  style?: MarketChartDrawingStyle
  tool: MarketChartDrawingTool
  onDeselected: NonNullable<OverlayCreate["onDeselected"]>
  onDrawEnd: NonNullable<OverlayCreate["onDrawEnd"]>
  onRemoved: NonNullable<OverlayCreate["onRemoved"]>
  onSelected: NonNullable<OverlayCreate["onSelected"]>
}): OverlayCreate {
  return {
    extendData: mergeMarketChartDrawingMetadata(null, { style, tool }),
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

export function getMarketChartDrawingToolFromOverlayName(
  name: string
): MarketChartDrawingTool | null {
  return MARKET_CHART_DRAWING_OVERLAY_TOOLS.get(name) ?? null
}

export function getMarketChartDrawingMetadataStyle(
  extendData: unknown
): MarketChartDrawingStyle {
  if (!extendData || typeof extendData !== "object") {
    return DEFAULT_MARKET_CHART_DRAWING_STYLE
  }

  return normalizeMarketChartDrawingStyle(
    (extendData as Record<string, unknown>).style
  )
}

export function getMarketChartDrawingMetadataTool(
  extendData: unknown,
  fallbackTool: MarketChartDrawingTool | null
): MarketChartDrawingTool | null {
  if (!extendData || typeof extendData !== "object") {
    return fallbackTool
  }

  const tool = (extendData as Record<string, unknown>).tool

  return typeof tool === "string" && isMarketChartDrawingTool(tool)
    ? tool
    : fallbackTool
}

export function mergeMarketChartDrawingMetadata(
  extendData: unknown,
  {
    style,
    tool,
  }: {
    style: MarketChartDrawingStyle
    tool: MarketChartDrawingTool
  }
): MarketChartDrawingMetadata {
  const existing =
    extendData && typeof extendData === "object"
      ? (extendData as Record<string, unknown>)
      : {}

  return {
    ...existing,
    source: "signapse-market-chart",
    style: normalizeMarketChartDrawingStyle(style),
    tool,
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
const FIBONACCI_RATIOS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
const FIBONACCI_EXTENSION_RATIOS = [0, 0.618, 1, 1.618, 2.618]
const GANN_BOX_DIVISIONS = 8

export function registerMarketChartDrawingOverlays() {
  if (marketChartDrawingOverlaysRegistered) {
    return
  }

  registerOverlay(createArrowOverlayTemplate())
  registerOverlay(createCircleOverlayTemplate())
  registerOverlay(createRectangleOverlayTemplate())
  registerOverlay(createParallelogramOverlayTemplate())
  registerOverlay(createTriangleOverlayTemplate())
  registerOverlay(createFibonacciSegmentOverlayTemplate())
  registerOverlay(createFibonacciCircleOverlayTemplate())
  registerOverlay(createFibonacciSpiralOverlayTemplate())
  registerOverlay(createFibonacciSectorOverlayTemplate())
  registerOverlay(createFibonacciExtensionOverlayTemplate())
  registerOverlay(createGannBoxOverlayTemplate())
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

function createArrowOverlayTemplate(): OverlayTemplate<MarketChartDrawingMetadata> {
  return {
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS.arrow,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    totalStep: 3,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 2) {
        return []
      }

      const [start, end] = coordinates
      const arrowHead = createArrowHeadCoordinates(start, end)

      return [
        createLineFigure([start, end]),
        createLineFigure([arrowHead.left, end, arrowHead.right]),
      ]
    },
  }
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

      return {
        type: "polygon",
        attrs: { coordinates: [start, end, fourth, offset] },
      }
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

      return {
        type: "polygon",
        attrs: { coordinates: [coordinates[0], coordinates[1], coordinates[2]] },
      }
    },
  }
}

function createFibonacciSegmentOverlayTemplate(): OverlayTemplate<MarketChartDrawingMetadata> {
  return {
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS["fibonacci-segment"],
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    totalStep: 3,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 2) {
        return []
      }

      const [start, end] = coordinates

      return createFibonacciLevelFigures({
        endX: end.x,
        from: start,
        ratios: FIBONACCI_RATIOS,
        startX: start.x,
        to: end,
      })
    },
  }
}

function createFibonacciCircleOverlayTemplate(): OverlayTemplate<MarketChartDrawingMetadata> {
  return {
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS["fibonacci-circle"],
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

      return FIBONACCI_RATIOS.filter((ratio) => ratio > 0).map((ratio) => ({
        type: "circle",
        attrs: {
          r: radius * ratio,
          x: center.x,
          y: center.y,
        },
      }))
    },
  }
}

function createFibonacciSpiralOverlayTemplate(): OverlayTemplate<MarketChartDrawingMetadata> {
  return {
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS["fibonacci-spiral"],
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
      const startAngle = Math.atan2(edge.y - center.y, edge.x - center.x)
      const spiralPoints = Array.from({ length: 48 }, (_, index) => {
        const progress = index / 47
        const angle = startAngle + progress * Math.PI * 3
        const nextRadius = radius * progress

        return {
          x: center.x + Math.cos(angle) * nextRadius,
          y: center.y + Math.sin(angle) * nextRadius,
        }
      })

      return createLineFigure(spiralPoints)
    },
  }
}

function createFibonacciSectorOverlayTemplate(): OverlayTemplate<MarketChartDrawingMetadata> {
  return {
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS["fibonacci-sector"],
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    totalStep: 3,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 2) {
        return []
      }

      const [origin, edge] = coordinates
      const radius = getDistance(origin, edge)
      const angle = Math.atan2(edge.y - origin.y, edge.x - origin.x)

      return FIBONACCI_RATIOS.map((ratio) => {
        const spread = (ratio - 0.5) * Math.PI
        const end = {
          x: origin.x + Math.cos(angle + spread) * radius,
          y: origin.y + Math.sin(angle + spread) * radius,
        }

        return createLineFigure([origin, end])
      })
    },
  }
}

function createFibonacciExtensionOverlayTemplate(): OverlayTemplate<MarketChartDrawingMetadata> {
  return {
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS["fibonacci-extension"],
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

      const [start, end, projection] = coordinates
      const height = end.y - start.y

      return createFibonacciLevelFigures({
        endX: projection.x + Math.abs(end.x - start.x),
        from: projection,
        ratios: FIBONACCI_EXTENSION_RATIOS,
        startX: projection.x,
        to: {
          x: projection.x,
          y: projection.y + height,
        },
      })
    },
  }
}

function createGannBoxOverlayTemplate(): OverlayTemplate<MarketChartDrawingMetadata> {
  return {
    name: MARKET_CHART_DRAWING_TOOL_OVERLAYS["gann-box"],
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    totalStep: 3,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 2) {
        return []
      }

      const [start, end] = coordinates
      const left = Math.min(start.x, end.x)
      const right = Math.max(start.x, end.x)
      const top = Math.min(start.y, end.y)
      const bottom = Math.max(start.y, end.y)
      const figures = [
        {
          type: "rect",
          attrs: {
            height: bottom - top,
            width: right - left,
            x: left,
            y: top,
          },
        },
        createLineFigure([
          { x: left, y: bottom },
          { x: right, y: top },
        ]),
        createLineFigure([
          { x: left, y: top },
          { x: right, y: bottom },
        ]),
      ]

      for (let index = 1; index < GANN_BOX_DIVISIONS; index += 1) {
        const x = left + ((right - left) * index) / GANN_BOX_DIVISIONS
        const y = top + ((bottom - top) * index) / GANN_BOX_DIVISIONS

        figures.push(
          createLineFigure([
            { x, y: top },
            { x, y: bottom },
          ]),
          createLineFigure([
            { x: left, y },
            { x: right, y },
          ])
        )
      }

      return figures
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

function createFibonacciLevelFigures({
  endX,
  from,
  ratios,
  startX,
  to,
}: {
  endX: number
  from: Coordinate
  ratios: number[]
  startX: number
  to: Coordinate
}) {
  return ratios.flatMap((ratio) => {
    const y = interpolate(from.y, to.y, ratio)

    return [
      createLineFigure([
        { x: startX, y },
        { x: endX, y },
      ]),
      {
        type: "text",
        attrs: {
          text: formatFibonacciRatio(ratio),
          x: startX + 6,
          y: y - 6,
        },
        ignoreEvent: true,
      },
    ]
  })
}

function createLineFigure(coordinates: Coordinate[]) {
  return {
    type: "line",
    attrs: {
      coordinates,
    },
  }
}

function interpolate(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio
}

function formatFibonacciRatio(ratio: number) {
  return `${Math.round(ratio * 1000) / 10}%`
}

function createArrowHeadCoordinates(start: Coordinate, end: Coordinate) {
  const angle = Math.atan2(end.y - start.y, end.x - start.x)
  const arrowLength = 10
  const spread = Math.PI / 7

  return {
    left: {
      x: end.x - arrowLength * Math.cos(angle - spread),
      y: end.y - arrowLength * Math.sin(angle - spread),
    },
    right: {
      x: end.x - arrowLength * Math.cos(angle + spread),
      y: end.y - arrowLength * Math.sin(angle + spread),
    },
  }
}

function getDistance(start: Coordinate, end: Coordinate) {
  return Math.hypot(end.x - start.x, end.y - start.y)
}
