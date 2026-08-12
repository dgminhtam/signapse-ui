export const MARKET_CHART_DRAWING_COLOR_PRESETS = [
  { value: "sky", color: "#0284c7" },
  { value: "blue", color: "#2563eb" },
  { value: "indigo", color: "#4f46e5" },
  { value: "violet", color: "#7c3aed" },
  { value: "fuchsia", color: "#c026d3" },
  { value: "rose", color: "#e11d48" },
  { value: "red", color: "#dc2626" },
  { value: "orange", color: "#ea580c" },
  { value: "amber", color: "#d97706" },
  { value: "lime", color: "#65a30d" },
  { value: "emerald", color: "#059669" },
  { value: "slate", color: "#64748b" },
] as const

export const MARKET_CHART_DRAWING_SIZES = [1, 2, 3, 4, 5] as const

export type MarketChartDrawingColor =
  (typeof MARKET_CHART_DRAWING_COLOR_PRESETS)[number]["value"]

export type MarketChartDrawingSize = (typeof MARKET_CHART_DRAWING_SIZES)[number]

export type MarketChartDrawingStyle = {
  color: MarketChartDrawingColor
  size: MarketChartDrawingSize
}

export const DEFAULT_MARKET_CHART_DRAWING_STYLE = {
  color: "blue",
  size: 1,
} satisfies MarketChartDrawingStyle

const MARKET_CHART_DRAWING_COLOR_VALUES = new Set<string>(
  MARKET_CHART_DRAWING_COLOR_PRESETS.map((preset) => preset.value)
)

const MARKET_CHART_DRAWING_SIZE_VALUES = new Set<number>(
  MARKET_CHART_DRAWING_SIZES
)

export function isMarketChartDrawingColor(
  value: unknown
): value is MarketChartDrawingColor {
  return (
    typeof value === "string" && MARKET_CHART_DRAWING_COLOR_VALUES.has(value)
  )
}

export function isMarketChartDrawingSize(
  value: unknown
): value is MarketChartDrawingSize {
  return (
    typeof value === "number" && MARKET_CHART_DRAWING_SIZE_VALUES.has(value)
  )
}

export function normalizeMarketChartDrawingStyle(
  value: unknown
): MarketChartDrawingStyle {
  if (!value || typeof value !== "object") {
    return DEFAULT_MARKET_CHART_DRAWING_STYLE
  }

  const candidate = value as Record<string, unknown>

  return {
    color: isMarketChartDrawingColor(candidate.color)
      ? candidate.color
      : DEFAULT_MARKET_CHART_DRAWING_STYLE.color,
    size: isMarketChartDrawingSize(candidate.size)
      ? candidate.size
      : DEFAULT_MARKET_CHART_DRAWING_STYLE.size,
  }
}

export function mergeMarketChartDrawingStyle(
  currentStyle: unknown,
  patch: Partial<MarketChartDrawingStyle>
): MarketChartDrawingStyle {
  const current = normalizeMarketChartDrawingStyle(currentStyle)

  return {
    color: isMarketChartDrawingColor(patch.color) ? patch.color : current.color,
    size: isMarketChartDrawingSize(patch.size) ? patch.size : current.size,
  }
}

export function resolveMarketChartDrawingColor(value: MarketChartDrawingColor) {
  return (
    MARKET_CHART_DRAWING_COLOR_PRESETS.find((preset) => preset.value === value)
      ?.color ?? MARKET_CHART_DRAWING_COLOR_PRESETS[0].color
  )
}
