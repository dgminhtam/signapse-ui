import { z } from "zod"

export const MARKET_CHART_TIMEFRAMES = [
  "1m",
  "5m",
  "15m",
  "30m",
  "1h",
  "1d",
  "1w",
  "1mo",
] as const

export type MarketChartTimeframe = (typeof MARKET_CHART_TIMEFRAMES)[number]

export const MARKET_CHART_TIMEFRAME_LABELS: Record<MarketChartTimeframe, string> = {
  "1m": "1 phút",
  "5m": "5 phút",
  "15m": "15 phút",
  "30m": "30 phút",
  "1h": "1 giờ",
  "1d": "1 ngày",
  "1w": "1 tuần",
  "1mo": "1 tháng",
}

export const DEFAULT_MARKET_CHART_TIMEFRAME: MarketChartTimeframe = "1h"

export interface MarketChartCandleRequest {
  symbol: string
  timeframe: MarketChartTimeframe
  from: string
  to: string
}

export interface MarketChartCandleItemResponse {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number | null
}

export interface MarketChartCandleResponse {
  provider?: string | null
  symbol: string
  timeframe: MarketChartTimeframe
  from: string
  to: string
  candles: MarketChartCandleItemResponse[]
}

function isValidDateTime(value: string) {
  return !Number.isNaN(Date.parse(value))
}

export const marketChartCandleRequestSchema = z
  .object({
    symbol: z.string().trim().min(1, "Vui lòng nhập mã provider symbol."),
    timeframe: z.enum(MARKET_CHART_TIMEFRAMES, {
      message: "Khung thời gian không được hỗ trợ.",
    }),
    from: z
      .string()
      .trim()
      .min(1, "Vui lòng chọn thời điểm bắt đầu.")
      .refine(isValidDateTime, "Thời điểm bắt đầu không hợp lệ."),
    to: z
      .string()
      .trim()
      .min(1, "Vui lòng chọn thời điểm kết thúc.")
      .refine(isValidDateTime, "Thời điểm kết thúc không hợp lệ."),
  })
  .superRefine((value, context) => {
    const fromTime = Date.parse(value.from)
    const toTime = Date.parse(value.to)

    if (!Number.isNaN(fromTime) && !Number.isNaN(toTime) && fromTime >= toTime) {
      context.addIssue({
        code: "custom",
        path: ["to"],
        message: "Thời điểm kết thúc phải sau thời điểm bắt đầu.",
      })
    }
  }) satisfies z.ZodType<MarketChartCandleRequest>

export const marketChartCandleItemResponseSchema = z.object({
  time: z.string(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number().nullable().optional(),
}) satisfies z.ZodType<MarketChartCandleItemResponse>

export const marketChartCandleResponseSchema = z.object({
  provider: z.string().nullable().optional(),
  symbol: z.string(),
  timeframe: z.enum(MARKET_CHART_TIMEFRAMES),
  from: z.string(),
  to: z.string(),
  candles: z.array(marketChartCandleItemResponseSchema).default([]),
}) satisfies z.ZodType<MarketChartCandleResponse>

export function isMarketChartTimeframe(value: string): value is MarketChartTimeframe {
  return MARKET_CHART_TIMEFRAMES.includes(value as MarketChartTimeframe)
}
