import { describe, it, expect } from "vitest"
import {
  createChartStyles,
  createDrawingOverlayStyles,
  getMarketChartThemePalette,
  resolveChartThemeMode,
  MARKET_CHART_THEME_PALETTES,
} from "../market-chart-theme"

describe("resolveChartThemeMode", () => {
  it("returns dark for 'dark'", () => {
    expect(resolveChartThemeMode("dark")).toBe("dark")
  })

  it("returns light for 'light'", () => {
    expect(resolveChartThemeMode("light")).toBe("light")
  })

  it("returns light for undefined", () => {
    expect(resolveChartThemeMode(undefined)).toBe("light")
  })

  it("returns light for unrecognized string", () => {
    expect(resolveChartThemeMode("system")).toBe("light")
  })
})

describe("MARKET_CHART_THEME_PALETTES", () => {
  it("has light and dark palettes defined", () => {
    expect(MARKET_CHART_THEME_PALETTES.light).toBeDefined()
    expect(MARKET_CHART_THEME_PALETTES.dark).toBeDefined()
  })

  const requiredKeys = [
    "axis", "crosshairBackground", "crosshairText", "down",
    "drawing", "drawingMuted", "drawingSelected", "grid",
    "noChange", "up", "volumeDown", "volumeNoChange", "volumeUp",
  ]

  for (const key of requiredKeys) {
    it(`light palette has ${key}`, () => {
      expect(MARKET_CHART_THEME_PALETTES.light[key]).toBeTruthy()
    })

    it(`dark palette has ${key}`, () => {
      expect(MARKET_CHART_THEME_PALETTES.dark[key]).toBeTruthy()
    })
  }
})

describe("getMarketChartThemePalette", () => {
  it("returns light palette for 'light'", () => {
    expect(getMarketChartThemePalette("light")).toBe(MARKET_CHART_THEME_PALETTES.light)
  })

  it("returns dark palette for 'dark'", () => {
    expect(getMarketChartThemePalette("dark")).toBe(MARKET_CHART_THEME_PALETTES.dark)
  })
})

describe("createChartStyles", () => {
  const palette = getMarketChartThemePalette("light")

  it("returns grid, candle, indicator, axis, crosshair, overlay sections", () => {
    const styles = createChartStyles(palette)

    expect(styles).toHaveProperty("grid")
    expect(styles).toHaveProperty("candle")
    expect(styles).toHaveProperty("indicator")
    expect(styles).toHaveProperty("xAxis")
    expect(styles).toHaveProperty("yAxis")
    expect(styles).toHaveProperty("crosshair")
    expect(styles).toHaveProperty("overlay")
  })

  it("grid has horizontal and vertical with dashed style", () => {
    const styles = createChartStyles(palette)
    expect(styles.grid.horizontal.style).toBe("dashed")
    expect(styles.grid.vertical.style).toBe("dashed")
  })

  it("candle bar has up/down/noChange colors", () => {
    const styles = createChartStyles(palette)
    expect(styles.candle.bar.upColor).toBe(palette.up)
    expect(styles.candle.bar.downColor).toBe(palette.down)
  })

  it("overlay text has font family and size", () => {
    const styles = createChartStyles(palette)
    expect(styles.overlay.text).toHaveProperty("family")
    expect(styles.overlay.text).toHaveProperty("size")
  })
})

describe("createDrawingOverlayStyles", () => {
  const palette = getMarketChartThemePalette("light")

  it("returns circle, line, point, rect, polygon sections", () => {
    const styles = createDrawingOverlayStyles(palette)

    expect(styles).toHaveProperty("circle")
    expect(styles).toHaveProperty("line")
    expect(styles).toHaveProperty("point")
    expect(styles).toHaveProperty("rect")
    expect(styles).toHaveProperty("polygon")
  })

  it("circle uses stroke_fill", () => {
    expect(createDrawingOverlayStyles(palette).circle.style).toBe("stroke_fill")
  })

  it("rect uses stroke_fill", () => {
    expect(createDrawingOverlayStyles(palette).rect.style).toBe("stroke_fill")
  })

  it("polygon uses stroke_fill", () => {
    expect(createDrawingOverlayStyles(palette).polygon.style).toBe("stroke_fill")
  })

  it("colors include alpha channel", () => {
    const styles = createDrawingOverlayStyles(palette)
    expect(styles.circle.color).toContain("33")
    expect(styles.rect.color).toContain("33")
  })
})
