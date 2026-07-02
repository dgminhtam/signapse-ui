import { z } from "zod"

import type { Dictionary } from "@/app/lib/i18n/dictionary-types"

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

export function getMarketChartTimeframeLabels(
  dictionary: Dictionary
): Record<MarketChartTimeframe, string> {
  return dictionary.marketCharts.timeframes
}

export const DEFAULT_MARKET_CHART_TIMEFRAME: MarketChartTimeframe = "1h"

export type MarketChartAssetType = "COMMODITY" | "CRYPTO" | "FX" | "INDEX" | string

export interface MarketChartCandleRequest {
  assetId: number
  timeframe: MarketChartTimeframe
  from: string
  to: string
}

export interface MarketChartAnnotationRequest {
  assetId: number
  from: string
  to: string
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
  newsArticleId?: number | null
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

export interface MarketChartAnnotationOutcomeResponse {
  anchorTime?: string | null
  anchorPrice?: number | null
  evaluationTime?: string | null
  evaluationPrice?: number | null
  realizedReturn?: number | null
  actualDirection?: MarketChartAnnotationDirection | null
  alignment?: string | null
  evaluatedAt?: string | null
}

export interface MarketChartAnnotationReactionResponse {
  id?: number | null
  direction?: MarketChartAnnotationDirection | null
  timeHorizon?: string | null
  confidence?: number | null
  reasoning?: string | null
  observedAt?: string | null
  outcome?: MarketChartAnnotationOutcomeResponse | null
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
  topMarketReaction?: MarketChartAnnotationReactionResponse | null
  marketReactions?: MarketChartAnnotationReactionResponse[]
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
}

export type MarketChartLiveStreamState =
  | "CONNECTING"
  | "CONNECTED"
  | "DISCONNECTED"
  | "RECONNECTING"
  | "SUBSCRIBED"
  | "UNSUBSCRIBED"
  | "STALE"
  | "MARKET_CLOSED"
  | "ERROR"

export interface MarketChartLiveRequest {
  assetId: number
  timeframe: MarketChartTimeframe
}

export interface MarketChartLiveStatusResponse {
  assetId: number
  symbol: string
  state: MarketChartLiveStreamState
  message?: string | null
  stale: boolean
  observedAt: string
}

export interface MarketChartLiveQuoteResponse {
  assetId: number
  symbol: string
  price: number
  volume?: number | null
  providerTime?: string | null
  receivedAt: string
  stale: boolean
}

export interface MarketChartLiveCandleResponse {
  assetId: number
  symbol: string
  timeframe: MarketChartTimeframe
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number | null
  updatedAt: string
  partial: true
}

export interface MarketChartLiveSnapshotResponse {
  asset: MarketChartAssetResponse
  symbol: string
  timeframe: MarketChartTimeframe
  quote?: MarketChartLiveQuoteResponse | null
  candle?: MarketChartLiveCandleResponse | null
  status: MarketChartLiveStatusResponse
}

export interface MarketChartLiveErrorResponse {
  assetId: number
  symbol: string
  message: string
  observedAt: string
}

function isValidDateTime(value: string) {
  return !Number.isNaN(Date.parse(value))
}

export function getMarketChartCandleRequestSchema(dictionary: Dictionary) {
  return z
    .object({
      assetId: z
        .number({
          message: dictionary.marketCharts.invalidAsset,
        })
        .int(dictionary.marketCharts.invalidAsset)
        .positive(dictionary.marketCharts.selectWatchlistAsset),
      timeframe: z.enum(MARKET_CHART_TIMEFRAMES, {
        message: dictionary.marketCharts.unsupportedTimeframe,
      }),
      from: z
        .string()
        .trim()
        .min(1, dictionary.marketCharts.fromRequired)
        .refine(isValidDateTime, dictionary.marketCharts.fromInvalid),
      to: z
        .string()
        .trim()
        .min(1, dictionary.marketCharts.toRequired)
        .refine(isValidDateTime, dictionary.marketCharts.toInvalid),
    })
    .superRefine((value, context) => {
      const fromTime = Date.parse(value.from)
      const toTime = Date.parse(value.to)

      if (!Number.isNaN(fromTime) && !Number.isNaN(toTime) && fromTime >= toTime) {
        context.addIssue({
          code: "custom",
          path: ["to"],
          message: dictionary.marketCharts.toAfterFrom,
        })
      }
    }) satisfies z.ZodType<MarketChartCandleRequest>
}

export function getMarketChartAnnotationRequestSchema(dictionary: Dictionary) {
  return z
    .object({
      assetId: z
        .number({
          message: dictionary.marketCharts.invalidAsset,
        })
        .int(dictionary.marketCharts.invalidAsset)
        .positive(dictionary.marketCharts.selectWatchlistAsset),
      from: z
        .string()
        .trim()
        .min(1, dictionary.marketCharts.fromRequired)
        .refine(isValidDateTime, dictionary.marketCharts.fromInvalid),
      to: z
        .string()
        .trim()
        .min(1, dictionary.marketCharts.toRequired)
        .refine(isValidDateTime, dictionary.marketCharts.toInvalid),
    })
    .superRefine((value, context) => {
      const fromTime = Date.parse(value.from)
      const toTime = Date.parse(value.to)

      if (!Number.isNaN(fromTime) && !Number.isNaN(toTime) && fromTime >= toTime) {
        context.addIssue({
          code: "custom",
          path: ["to"],
          message: dictionary.marketCharts.toAfterFrom,
        })
      }
    }) satisfies z.ZodType<MarketChartAnnotationRequest>
}

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
  newsArticleId: z.number().nullable().optional(),
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

export const marketChartAnnotationOutcomeResponseSchema = z.object({
  anchorTime: z.string().nullable().optional(),
  anchorPrice: z.number().nullable().optional(),
  evaluationTime: z.string().nullable().optional(),
  evaluationPrice: z.number().nullable().optional(),
  realizedReturn: z.number().nullable().optional(),
  actualDirection: z.string().nullable().optional(),
  alignment: z.string().nullable().optional(),
  evaluatedAt: z.string().nullable().optional(),
}) satisfies z.ZodType<MarketChartAnnotationOutcomeResponse>

export const marketChartAnnotationReactionResponseSchema = z.object({
  id: z.number().nullable().optional(),
  direction: z.string().nullable().optional(),
  timeHorizon: z.string().nullable().optional(),
  confidence: z.number().nullable().optional(),
  reasoning: z.string().nullable().optional(),
  observedAt: z.string().nullable().optional(),
  outcome: marketChartAnnotationOutcomeResponseSchema.nullable().optional(),
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
  topMarketReaction: marketChartAnnotationReactionResponseSchema.nullable().optional(),
  marketReactions: z.array(marketChartAnnotationReactionResponseSchema).default([]),
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
}) satisfies z.ZodType<MarketChartCandleResponse>

export const marketChartLiveStreamStateSchema = z.enum([
  "CONNECTING",
  "CONNECTED",
  "DISCONNECTED",
  "RECONNECTING",
  "SUBSCRIBED",
  "UNSUBSCRIBED",
  "STALE",
  "MARKET_CLOSED",
  "ERROR",
]) satisfies z.ZodType<MarketChartLiveStreamState>

export const marketChartLiveRequestSchema = z.object({
  assetId: z.number().int().positive(),
  timeframe: z.enum(MARKET_CHART_TIMEFRAMES),
}) satisfies z.ZodType<MarketChartLiveRequest>

export const marketChartLiveStatusResponseSchema = z.object({
  assetId: z.number(),
  symbol: z.string(),
  state: marketChartLiveStreamStateSchema,
  message: z.string().nullable().optional(),
  stale: z.boolean(),
  observedAt: z.string(),
}) satisfies z.ZodType<MarketChartLiveStatusResponse>

export const marketChartLiveQuoteResponseSchema = z.object({
  assetId: z.number(),
  symbol: z.string(),
  price: z.number(),
  volume: z.number().nullable().optional(),
  providerTime: z.string().nullable().optional(),
  receivedAt: z.string(),
  stale: z.boolean(),
}) satisfies z.ZodType<MarketChartLiveQuoteResponse>

export const marketChartLiveCandleResponseSchema = z.object({
  assetId: z.number(),
  symbol: z.string(),
  timeframe: z.enum(MARKET_CHART_TIMEFRAMES),
  time: z.string(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number().nullable().optional(),
  updatedAt: z.string(),
  partial: z.literal(true),
}) satisfies z.ZodType<MarketChartLiveCandleResponse>

export const marketChartLiveSnapshotResponseSchema = z.object({
  asset: marketChartAssetResponseSchema,
  symbol: z.string(),
  timeframe: z.enum(MARKET_CHART_TIMEFRAMES),
  quote: marketChartLiveQuoteResponseSchema.nullable().optional(),
  candle: marketChartLiveCandleResponseSchema.nullable().optional(),
  status: marketChartLiveStatusResponseSchema,
}) satisfies z.ZodType<MarketChartLiveSnapshotResponse>

export const marketChartLiveErrorResponseSchema = z.object({
  assetId: z.number(),
  symbol: z.string(),
  message: z.string(),
  observedAt: z.string(),
}) satisfies z.ZodType<MarketChartLiveErrorResponse>

export function isMarketChartTimeframe(value: string): value is MarketChartTimeframe {
  return MARKET_CHART_TIMEFRAMES.includes(value as MarketChartTimeframe)
}
