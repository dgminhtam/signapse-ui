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

export type MarketChartAssetType = "COMMODITY" | "CRYPTO" | "FX" | "INDEX" | string

export interface MarketChartCandleRequest {
  assetId: number
  timeframe: MarketChartTimeframe
  from: string
  to: string
  includeAnnotations?: boolean
}

export interface MarketChartAssetResponse {
  id: number
  name: string
  symbol: string
  type: MarketChartAssetType
}

export interface MarketChartCandleItemResponse {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number | null
}

export type MarketChartAnnotationDirection =
  | "BULLISH"
  | "BEARISH"
  | "MIXED"
  | "NEUTRAL"
  | string

export interface MarketChartAnnotationEvidenceResponse {
  sourceDocumentId?: number | null
  title?: string | null
  publisher?: string | null
  url?: string | null
  publishedAt?: string | null
  evidenceRole?: string | null
  confidence?: number | null
  evidenceNote?: string | null
}

export interface MarketChartAnnotationLinksResponse {
  eventDetail?: string | null
}

export interface MarketChartAnnotationReactionResponse {
  id?: number | null
  direction?: MarketChartAnnotationDirection | null
  timeHorizon?: string | null
  confidence?: number | null
  reasoning?: string | null
  observedAt?: string | null
}

export interface MarketChartAnnotationResponse {
  id: string
  eventId?: number | null
  assetId?: number | null
  time: string
  severity?: string | null
  direction?: MarketChartAnnotationDirection | null
  title: string
  summary?: string | null
  confidence?: number | null
  reaction?: MarketChartAnnotationReactionResponse | null
  evidence: MarketChartAnnotationEvidenceResponse[]
  links?: MarketChartAnnotationLinksResponse | null
}

export interface MarketChartCandleResponse {
  provider?: string | null
  symbol?: string | null
  asset: MarketChartAssetResponse
  timeframe: MarketChartTimeframe
  from: string
  to: string
  candles: MarketChartCandleItemResponse[]
  annotations: MarketChartAnnotationResponse[]
}

function isValidDateTime(value: string) {
  return !Number.isNaN(Date.parse(value))
}

export const marketChartCandleRequestSchema = z
  .object({
    assetId: z
      .number({
        message: "Tài sản biểu đồ không hợp lệ.",
      })
      .int("Tài sản biểu đồ không hợp lệ.")
      .positive("Vui lòng chọn tài sản trong watchlist."),
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
    includeAnnotations: z.boolean().optional(),
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

export const marketChartAssetResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  symbol: z.string(),
  type: z.string(),
}) satisfies z.ZodType<MarketChartAssetResponse>

export const marketChartCandleItemResponseSchema = z.object({
  time: z.string(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number().nullable().optional(),
}) satisfies z.ZodType<MarketChartCandleItemResponse>

export const marketChartAnnotationEvidenceResponseSchema = z.object({
  sourceDocumentId: z.number().nullable().optional(),
  title: z.string().nullable().optional(),
  publisher: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  evidenceRole: z.string().nullable().optional(),
  confidence: z.number().nullable().optional(),
  evidenceNote: z.string().nullable().optional(),
}) satisfies z.ZodType<MarketChartAnnotationEvidenceResponse>

export const marketChartAnnotationLinksResponseSchema = z.object({
  eventDetail: z.string().nullable().optional(),
}) satisfies z.ZodType<MarketChartAnnotationLinksResponse>

export const marketChartAnnotationReactionResponseSchema = z.object({
  id: z.number().nullable().optional(),
  direction: z.string().nullable().optional(),
  timeHorizon: z.string().nullable().optional(),
  confidence: z.number().nullable().optional(),
  reasoning: z.string().nullable().optional(),
  observedAt: z.string().nullable().optional(),
}) satisfies z.ZodType<MarketChartAnnotationReactionResponse>

export const marketChartAnnotationResponseSchema = z.object({
  id: z.string(),
  eventId: z.number().nullable().optional(),
  assetId: z.number().nullable().optional(),
  time: z.string(),
  severity: z.string().nullable().optional(),
  direction: z.string().nullable().optional(),
  title: z.string(),
  summary: z.string().nullable().optional(),
  confidence: z.number().nullable().optional(),
  reaction: marketChartAnnotationReactionResponseSchema.nullable().optional(),
  evidence: z.array(marketChartAnnotationEvidenceResponseSchema).default([]),
  links: marketChartAnnotationLinksResponseSchema.nullable().optional(),
}) satisfies z.ZodType<MarketChartAnnotationResponse>

export const marketChartCandleResponseSchema = z.object({
  provider: z.string().nullable().optional(),
  symbol: z.string().nullable().optional(),
  asset: marketChartAssetResponseSchema,
  timeframe: z.enum(MARKET_CHART_TIMEFRAMES),
  from: z.string(),
  to: z.string(),
  candles: z.array(marketChartCandleItemResponseSchema).default([]),
  annotations: z.array(marketChartAnnotationResponseSchema).default([]),
}) satisfies z.ZodType<MarketChartCandleResponse>

export function isMarketChartTimeframe(value: string): value is MarketChartTimeframe {
  return MARKET_CHART_TIMEFRAMES.includes(value as MarketChartTimeframe)
}
