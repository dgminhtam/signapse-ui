import { describe, it, expect } from "vitest"
import {
  createMarketChartAnnotationGroups,
  getMarketChartAnnotationColorClassNames,
  mergeMarketChartAnnotations,
  toMarketChartEpochMillis,
} from "../market-chart-annotations"
import type {
  MarketChartAnnotationResponse,
  MarketChartCandleItemResponse,
} from "@/app/lib/market-charts/definitions"

function makeCandle(time: string): MarketChartCandleItemResponse {
  return { time, open: 100, high: 110, low: 95, close: 105 }
}

function makeAnnotation(id: string, time: string, overrides: Partial<MarketChartAnnotationResponse> = {}): MarketChartAnnotationResponse {
  return {
    id,
    time,
    title: `Event ${id}`,
    evidence: [],
    direction: "NEUTRAL",
    ...overrides,
  }
}

describe("toMarketChartEpochMillis", () => {
  it("converts ISO string to millis", () => {
    expect(toMarketChartEpochMillis("2026-01-15T10:00:00Z")).toBe(
      new Date("2026-01-15T10:00:00Z").getTime()
    )
  })

  it("returns null for invalid string", () => {
    expect(toMarketChartEpochMillis("not-a-date")).toBeNull()
  })

  it("returns null for non-string", () => {
    expect(toMarketChartEpochMillis(123)).toBeNull()
    expect(toMarketChartEpochMillis(null)).toBeNull()
  })
})

describe("mergeMarketChartAnnotations", () => {
  it("merges two arrays deduplicating by id", () => {
    const current = [makeAnnotation("a", "2026-01-15T10:00:00Z", { title: "Old A" })]
    const incoming = [makeAnnotation("a", "2026-01-15T10:00:00Z", { title: "New A" })]

    const result = mergeMarketChartAnnotations(current, incoming)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("New A")
  })

  it("sorts by time ascending", () => {
    const current = [makeAnnotation("a", "2026-01-15T14:00:00Z")]
    const incoming = [makeAnnotation("b", "2026-01-15T10:00:00Z")]

    const result = mergeMarketChartAnnotations(current, incoming)

    expect(result[0].id).toBe("b")
    expect(result[1].id).toBe("a")
  })

  it("filters invalid annotations", () => {
    const current = [makeAnnotation("a", "2026-01-15T10:00:00Z")]
    const incoming = [{ id: "b", time: "bad-time", title: "Bad" }] as MarketChartAnnotationResponse[]

    const result = mergeMarketChartAnnotations(current, incoming)

    expect(result).toHaveLength(1)
  })
})

describe("createMarketChartAnnotationGroups", () => {
  const candles = [
    makeCandle("2026-01-15T10:00:00Z"),
    makeCandle("2026-01-15T11:00:00Z"),
    makeCandle("2026-01-15T12:00:00Z"),
  ]

  it("groups single annotation to nearest candle", () => {
    const annotations = [makeAnnotation("a", "2026-01-15T10:02:00Z")]

    const groups = createMarketChartAnnotationGroups(annotations, candles)

    expect(groups).toHaveLength(1)
    expect(groups[0].annotations).toHaveLength(1)
    expect(groups[0].time).toBe(new Date("2026-01-15T10:00:00Z").getTime())
  })

  it("groups multiple annotations at same time", () => {
    const annotations = [
      makeAnnotation("a", "2026-01-15T11:01:00Z"),
      makeAnnotation("b", "2026-01-15T11:02:00Z"),
    ]

    const groups = createMarketChartAnnotationGroups(annotations, candles)

    expect(groups).toHaveLength(1)
    expect(groups[0].annotations).toHaveLength(2)
  })

  it("excludes annotation outside candle range", () => {
    const annotations = [makeAnnotation("a", "2026-01-14T00:00:00Z")]

    const groups = createMarketChartAnnotationGroups(annotations, candles)

    expect(groups).toHaveLength(0)
  })

  it("computes MIXED direction for conflicting annotations", () => {
    const annotations = [
      makeAnnotation("a", "2026-01-15T11:01:00Z", { direction: "BULLISH" }),
      makeAnnotation("b", "2026-01-15T11:02:00Z", { direction: "BEARISH" }),
    ]

    const groups = createMarketChartAnnotationGroups(annotations, candles)

    expect(groups[0].direction).toBe("MIXED")
  })

  it("keeps single direction when all agree", () => {
    const annotations = [
      makeAnnotation("a", "2026-01-15T11:01:00Z", { direction: "BULLISH" }),
      makeAnnotation("b", "2026-01-15T11:02:00Z", { direction: "BULLISH" }),
    ]

    const groups = createMarketChartAnnotationGroups(annotations, candles)

    expect(groups[0].direction).toBe("BULLISH")
  })

  it("assigns high priority for multiple annotations", () => {
    const annotations = [
      makeAnnotation("a", "2026-01-15T11:01:00Z"),
      makeAnnotation("b", "2026-01-15T11:02:00Z"),
    ]

    const groups = createMarketChartAnnotationGroups(annotations, candles)

    expect(groups[0].priority).toBe("high")
  })

  it("assigns high priority for high-severity annotation", () => {
    const annotations = [
      makeAnnotation("a", "2026-01-15T11:01:00Z", { severity: "HIGH" }),
    ]

    const groups = createMarketChartAnnotationGroups(annotations, candles)

    expect(groups[0].priority).toBe("high")
  })

  it("assigns normal priority for single low-severity annotation", () => {
    const annotations = [
      makeAnnotation("a", "2026-01-15T11:01:00Z", { severity: "LOW" }),
    ]

    const groups = createMarketChartAnnotationGroups(annotations, candles)

    expect(groups[0].priority).toBe("normal")
  })
})

describe("getMarketChartAnnotationColorClassNames", () => {
  it("returns emerald for BULLISH", () => {
    expect(getMarketChartAnnotationColorClassNames("BULLISH").dot).toContain("emerald")
  })

  it("returns destructive for BEARISH", () => {
    expect(getMarketChartAnnotationColorClassNames("BEARISH").dot).toContain("destructive")
  })

  it("returns amber for NEUTRAL", () => {
    expect(getMarketChartAnnotationColorClassNames("NEUTRAL").dot).toContain("amber")
  })

  it("returns orange for MIXED", () => {
    expect(getMarketChartAnnotationColorClassNames("MIXED").dot).toContain("orange")
  })

  it("returns muted for null direction", () => {
    expect(getMarketChartAnnotationColorClassNames(null).dot).toContain("muted")
  })
})
