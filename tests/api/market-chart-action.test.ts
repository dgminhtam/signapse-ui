import { beforeEach, describe, expect, it, vi } from "vitest"

const { testDictionary } = vi.hoisted(() => ({
  testDictionary: {
    marketCharts: {
      invalidAsset: "Asset is invalid",
      selectWatchlistAsset: "Select a watchlist asset",
      unsupportedTimeframe: "Timeframe is unsupported",
      toRequired: "To is required",
      toInvalid: "To is invalid",
      validationInvalid: "Request is invalid",
      responseInvalid: "Response is invalid",
      loadError: "Chart failed to load",
    },
  },
}))

vi.mock("@/app/api/auth/action", () => ({
  fetchAuthenticated: vi.fn(),
}))

vi.mock("@/app/lib/i18n/dictionaries", () => ({
  getDictionary: vi.fn(async () => testDictionary),
}))

vi.mock("@/app/lib/i18n/server", () => ({
  getRequestLocale: vi.fn(async () => "vi"),
}))

import { fetchAuthenticated } from "@/app/api/auth/action"
import { getMarketChartCandles } from "@/app/api/market-charts/action"
import type { MarketChartCandleRequest } from "@/app/lib/market-charts/definitions"

const request: MarketChartCandleRequest = {
  assetId: 7,
  timeframe: "1h",
  to: "2026-08-19T11:00:00Z",
  countBack: 300,
}

const response = {
  provider: "fixture",
  symbol: "XAUUSD",
  asset: {
    id: 7,
    name: "Gold",
    symbol: "XAUUSD",
    type: "COMMODITY",
  },
  timeframe: "1h",
  from: "2026-08-19T10:00:00.000Z",
  to: "2026-08-19T11:00:00.000Z",
  candles: [
    {
      time: "2026-08-19T10:00:00.000Z",
      open: 100,
      high: 105,
      low: 99,
      close: 104,
      partial: true,
    },
  ],
}

describe("market chart candle action", () => {
  beforeEach(() => {
    vi.mocked(fetchAuthenticated).mockReset()
  })

  it("serializes to plus countBack and never sends legacy from", async () => {
    vi.mocked(fetchAuthenticated).mockResolvedValue(response)

    await expect(getMarketChartCandles(request)).resolves.toEqual({
      success: true,
      data: response,
    })
    expect(fetchAuthenticated).toHaveBeenCalledWith(
      "/market-charts/candles?assetId=7&timeframe=1h&to=2026-08-19T11%3A00%3A00Z&countBack=300"
    )
  })

  it("rejects legacy from and out-of-range countBack before transport", async () => {
    const legacyRequest = {
      ...request,
      from: "2026-08-18T11:00:00Z",
    } as unknown as MarketChartCandleRequest

    await expect(getMarketChartCandles(legacyRequest)).resolves.toMatchObject({
      success: false,
    })
    expect(fetchAuthenticated).not.toHaveBeenCalled()

    await expect(
      getMarketChartCandles({ ...request, countBack: 1001 })
    ).resolves.toMatchObject({ success: false })
    expect(fetchAuthenticated).not.toHaveBeenCalled()

    await expect(
      getMarketChartCandles({ ...request, countBack: 0 })
    ).resolves.toMatchObject({ success: false })
    expect(fetchAuthenticated).not.toHaveBeenCalled()
  })

  it("accepts only an exact anchor for terminal empty history", async () => {
    vi.mocked(fetchAuthenticated).mockResolvedValue({
      ...response,
      from: request.to,
      to: request.to,
      candles: [],
    })

    await expect(getMarketChartCandles(request)).resolves.toMatchObject({
      success: true,
      data: { candles: [] },
    })

    vi.mocked(fetchAuthenticated).mockResolvedValue({
      ...response,
      from: "2026-08-19T10:00:00Z",
      to: "2026-08-19T10:00:00Z",
      candles: [],
    })

    await expect(getMarketChartCandles(request)).resolves.toEqual({
      success: false,
      error: testDictionary.marketCharts.responseInvalid,
    })
  })
})
