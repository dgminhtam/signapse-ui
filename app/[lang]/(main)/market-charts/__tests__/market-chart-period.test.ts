import { describe, it, expect } from "vitest"
import {
  createKLinePeriod,
  ensureKLineChartLocales,
  resolveKLineChartLocale,
  KLINE_CHART_VI_LOCALE,
} from "../market-chart-period"
import type { MarketChartTimeframe } from "@/app/lib/market-charts/definitions"

describe("createKLinePeriod", () => {
  const cases: [MarketChartTimeframe, { type: string; span: number }][] = [
    ["1m", { type: "minute", span: 1 }],
    ["5m", { type: "minute", span: 5 }],
    ["15m", { type: "minute", span: 15 }],
    ["30m", { type: "minute", span: 30 }],
    ["1h", { type: "hour", span: 1 }],
    ["1d", { type: "day", span: 1 }],
    ["1w", { type: "week", span: 1 }],
    ["1mo", { type: "month", span: 1 }],
  ]

  for (const [tf, expected] of cases) {
    it(`maps ${tf} to { type: "${expected.type}", span: ${expected.span} }`, () => {
      const result = createKLinePeriod(tf)

      expect(result.type).toBe(expected.type)
      expect(result.span).toBe(expected.span)
    })
  }

  it("defaults to hour for unknown timeframe", () => {
    const result = createKLinePeriod("unknown" as MarketChartTimeframe)

    expect(result.type).toBe("hour")
    expect(result.span).toBe(1)
  })
})

describe("KLINE_CHART_VI_LOCALE", () => {
  it("has Vietnamese labels for common fields", () => {
    expect(KLINE_CHART_VI_LOCALE.open).toBe("Mở: ")
    expect(KLINE_CHART_VI_LOCALE.high).toBe("Cao: ")
    expect(KLINE_CHART_VI_LOCALE.low).toBe("Thấp: ")
    expect(KLINE_CHART_VI_LOCALE.close).toBe("Đóng: ")
    expect(KLINE_CHART_VI_LOCALE.volume).toBe("Khối lượng: ")
    expect(KLINE_CHART_VI_LOCALE.time).toBe("Thời gian: ")
  })

  it("has day/week/month/year labels", () => {
    expect(KLINE_CHART_VI_LOCALE.day).toBe("ngày")
    expect(KLINE_CHART_VI_LOCALE.week).toBe("tuần")
    expect(KLINE_CHART_VI_LOCALE.month).toBe("tháng")
    expect(KLINE_CHART_VI_LOCALE.year).toBe("năm")
  })
})

describe("ensureKLineChartLocales", () => {
  it("is idempotent (can be called multiple times)", () => {
    // Should not throw
    expect(() => {
      ensureKLineChartLocales()
      ensureKLineChartLocales()
      ensureKLineChartLocales()
    }).not.toThrow()
  })
})

describe("resolveKLineChartLocale", () => {
  it("returns en-US for unsupported locale", () => {
    // en-US is the default klinecharts locale
    expect(resolveKLineChartLocale("fr-FR")).toBeTruthy()
  })

  it("returns vi or vi-VN when supported", () => {
    const result = resolveKLineChartLocale("vi")
    expect(result).toBeTruthy()
  })
})
