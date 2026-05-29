import { describe, it, expect } from "vitest"
import {
  createMarketChartDrawingGroupId,
  getMarketChartDrawingToolPalette,
  isMarketChartDrawingTool,
  MARKET_CHART_DRAWING_TOOLS,
  MARKET_CHART_DRAWING_TOOL_OVERLAYS,
  MARKET_CHART_DRAWING_PALETTES,
  MARKET_CHART_DRAWING_PALETTE_TOOLS,
} from "../market-chart-drawing"
import type { MarketChartDrawingTool } from "../market-chart-drawing"

describe("createMarketChartDrawingGroupId", () => {
  it("includes assetId and timeframe", () => {
    const id = createMarketChartDrawingGroupId({ assetId: 42, timeframe: "1h" })

    expect(id).toContain("42")
    expect(id).toContain("1h")
    expect(id).toContain("signapse-market-chart-drawings")
  })
})

describe("isMarketChartDrawingTool", () => {
  it("returns true for valid tools", () => {
    expect(isMarketChartDrawingTool("horizontal-line")).toBe(true)
    expect(isMarketChartDrawingTool("circle")).toBe(true)
    expect(isMarketChartDrawingTool("xabcd-pattern")).toBe(true)
    expect(isMarketChartDrawingTool("fibonacci-line")).toBe(true)
  })

  it("returns false for invalid tools", () => {
    expect(isMarketChartDrawingTool("not-a-tool")).toBe(false)
    expect(isMarketChartDrawingTool("")).toBe(false)
  })
})

describe("getMarketChartDrawingToolPalette", () => {
  it("maps horizontal-line to line palette", () => {
    expect(getMarketChartDrawingToolPalette("horizontal-line")).toBe("line")
  })

  it("maps price-channel-line to channel palette", () => {
    expect(getMarketChartDrawingToolPalette("price-channel-line")).toBe("channel")
  })

  it("maps circle to shape palette", () => {
    expect(getMarketChartDrawingToolPalette("circle")).toBe("shape")
  })

  it("maps fibonacci-line to fibonacci palette", () => {
    expect(getMarketChartDrawingToolPalette("fibonacci-line")).toBe("fibonacci")
  })

  it("maps xabcd-pattern to pattern palette", () => {
    expect(getMarketChartDrawingToolPalette("xabcd-pattern")).toBe("pattern")
  })
})

describe("MARKET_CHART_DRAWING_TOOLS", () => {
  it("has 30 tools", () => {
    expect(MARKET_CHART_DRAWING_TOOLS).toHaveLength(30)
  })
})

describe("MARKET_CHART_DRAWING_PALETTES", () => {
  it("has 5 palettes", () => {
    expect(MARKET_CHART_DRAWING_PALETTES).toHaveLength(5)
  })

  it("includes line, channel, shape, fibonacci, pattern", () => {
    expect(MARKET_CHART_DRAWING_PALETTES).toContain("line")
    expect(MARKET_CHART_DRAWING_PALETTES).toContain("channel")
    expect(MARKET_CHART_DRAWING_PALETTES).toContain("shape")
    expect(MARKET_CHART_DRAWING_PALETTES).toContain("fibonacci")
    expect(MARKET_CHART_DRAWING_PALETTES).toContain("pattern")
  })
})

describe("MARKET_CHART_DRAWING_TOOL_OVERLAYS", () => {
  it("every tool has a corresponding overlay name", () => {
    for (const tool of MARKET_CHART_DRAWING_TOOLS) {
      expect(MARKET_CHART_DRAWING_TOOL_OVERLAYS[tool]).toBeTruthy()
    }
  })

  it("maps built-in tools to correct klinecharts built-in names", () => {
    expect(MARKET_CHART_DRAWING_TOOL_OVERLAYS["horizontal-line"]).toBe("horizontalStraightLine")
    expect(MARKET_CHART_DRAWING_TOOL_OVERLAYS["horizontal-ray"]).toBe("horizontalRayLine")
    expect(MARKET_CHART_DRAWING_TOOL_OVERLAYS["horizontal-segment"]).toBe("horizontalSegment")
    expect(MARKET_CHART_DRAWING_TOOL_OVERLAYS["vertical-line"]).toBe("verticalStraightLine")
    expect(MARKET_CHART_DRAWING_TOOL_OVERLAYS["price-line"]).toBe("priceLine")
    expect(MARKET_CHART_DRAWING_TOOL_OVERLAYS["price-channel-line"]).toBe("priceChannelLine")
    expect(MARKET_CHART_DRAWING_TOOL_OVERLAYS["parallel-line"]).toBe("parallelStraightLine")
    expect(MARKET_CHART_DRAWING_TOOL_OVERLAYS["fibonacci-line"]).toBe("fibonacciLine")
  })
})

describe("MARKET_CHART_DRAWING_PALETTE_TOOLS", () => {
  it("every tool in palette tools exists in MARKET_CHART_DRAWING_TOOLS", () => {
    for (const palette of MARKET_CHART_DRAWING_PALETTES) {
      for (const tool of MARKET_CHART_DRAWING_PALETTE_TOOLS[palette]) {
        expect(MARKET_CHART_DRAWING_TOOLS).toContain(tool)
      }
    }
  })

  it("line palette has 11 tools", () => {
    expect(MARKET_CHART_DRAWING_PALETTE_TOOLS.line).toHaveLength(11)
  })
})
