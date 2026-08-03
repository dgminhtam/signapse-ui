import { z } from "zod"

export const dashboardMetricStates = [
  "AVAILABLE",
  "EMPTY",
  "DENIED",
  "ERROR",
] as const

export const dashboardSummaryErrorCodes = [
  "WORKSPACE_READ_REQUIRED",
  "NO_ACTIVE_WORKSPACE",
  "ECONOMIC_CALENDAR_READ_REQUIRED",
  "EVENT_READ_REQUIRED",
  "NARRATIVE_READ_REQUIRED",
  "NEWS_ARTICLE_READ_REQUIRED",
  "WATCHLIST_READ_REQUIRED",
  "ASSET_READ_REQUIRED",
  "UPSTREAM_TIMEOUT",
  "UPSTREAM_UNAVAILABLE",
  "SUMMARY_UNAVAILABLE",
] as const

const dashboardMetricStateSchema = z.enum(dashboardMetricStates)
const dashboardSummaryErrorCodeSchema = z.enum(dashboardSummaryErrorCodes)
const dashboardTimeWindowResponseSchema = z.object({
  from: z.string(),
  to: z.string(),
})

const dashboardMetricErrorCodeSchema = dashboardSummaryErrorCodeSchema.nullish()

export const dashboardNextKeyEventDataSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  currencyCode: z.string(),
  impact: z.string(),
  scheduledAt: z.string(),
})

export const dashboardNextKeyEventResponseSchema = z.object({
  state: dashboardMetricStateSchema,
  data: dashboardNextKeyEventDataSchema.nullish(),
  errorCode: dashboardMetricErrorCodeSchema,
})

export const dashboardCountMetricResponseSchema = z.object({
  state: dashboardMetricStateSchema,
  count: z.number().int().nullish(),
  window: dashboardTimeWindowResponseSchema.nullish(),
  errorCode: dashboardMetricErrorCodeSchema,
})

export const dashboardNarrativeMetricResponseSchema = z.object({
  state: dashboardMetricStateSchema,
  count: z.number().int().nullish(),
  statuses: z.array(z.string()),
  errorCode: dashboardMetricErrorCodeSchema,
})

export const dashboardSummaryScopeResponseSchema = z.object({
  workspaceId: z.number().int(),
  watchlistAssetCount: z.number().int().nullish(),
})

export const dashboardSummaryResponseSchema = z.object({
  asOf: z.string(),
  timezone: z.string(),
  scope: dashboardSummaryScopeResponseSchema,
  nextKeyEvent: dashboardNextKeyEventResponseSchema,
  marketEvents24h: dashboardCountMetricResponseSchema,
  activeNarratives: dashboardNarrativeMetricResponseSchema,
  latestNews6h: dashboardCountMetricResponseSchema,
})

export type DashboardMetricState = z.infer<typeof dashboardMetricStateSchema>
export type DashboardSummaryErrorCode = z.infer<
  typeof dashboardSummaryErrorCodeSchema
>
export type DashboardNextKeyEventData = z.infer<
  typeof dashboardNextKeyEventDataSchema
>
export type DashboardNextKeyEventResponse = z.infer<
  typeof dashboardNextKeyEventResponseSchema
>
export type DashboardCountMetricResponse = z.infer<
  typeof dashboardCountMetricResponseSchema
>
export type DashboardNarrativeMetricResponse = z.infer<
  typeof dashboardNarrativeMetricResponseSchema
>
export type DashboardSummaryScopeResponse = z.infer<
  typeof dashboardSummaryScopeResponseSchema
>
export type DashboardSummaryResponse = z.infer<
  typeof dashboardSummaryResponseSchema
>
