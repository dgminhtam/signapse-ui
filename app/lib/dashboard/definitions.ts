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

const dashboardEventThemeRelationTypeSchema = z.enum([
  "PRIMARY_THEME",
  "SECONDARY_THEME",
])

const dashboardEventAssetRelationTypeSchema = z.enum([
  "PRIMARY_SUBJECT",
  "AFFECTED_ASSET",
  "REFERENCE_ASSET",
])

const dashboardEventAssetTypeSchema = z.enum([
  "COMMODITY",
  "CRYPTO",
  "EQUITY",
  "ETF",
  "FX",
  "INDEX",
])

export const dashboardRecentEventThemeSummarySchema = z.object({
  themeId: z.number().int().nullish(),
  themeTitle: z.string().nullish(),
  themeSlug: z.string().nullish(),
  relationType: dashboardEventThemeRelationTypeSchema.nullish(),
  weight: z.number().nullish(),
})

export const dashboardRecentEventAssetSummarySchema = z.object({
  assetId: z.number().int().nullish(),
  assetName: z.string().nullish(),
  assetSymbol: z.string().nullish(),
  assetType: dashboardEventAssetTypeSchema.nullish(),
  relationType: dashboardEventAssetRelationTypeSchema.nullish(),
  weight: z.number().nullish(),
})

export const dashboardRecentEventItemResponseSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  occurredAt: z.string(),
  confidence: z.number(),
  themes: z.array(dashboardRecentEventThemeSummarySchema),
  affectedAssets: z.array(dashboardRecentEventAssetSummarySchema),
})

export const dashboardRecentEventsMetricResponseSchema = z.object({
  state: dashboardMetricStateSchema,
  items: z.array(dashboardRecentEventItemResponseSchema),
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
  recentEvents: dashboardRecentEventsMetricResponseSchema,
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
export type DashboardRecentEventThemeSummary = z.infer<
  typeof dashboardRecentEventThemeSummarySchema
>
export type DashboardRecentEventAssetSummary = z.infer<
  typeof dashboardRecentEventAssetSummarySchema
>
export type DashboardRecentEventItemResponse = z.infer<
  typeof dashboardRecentEventItemResponseSchema
>
export type DashboardRecentEventsMetricResponse = z.infer<
  typeof dashboardRecentEventsMetricResponseSchema
>
export type DashboardSummaryScopeResponse = z.infer<
  typeof dashboardSummaryScopeResponseSchema
>
export type DashboardSummaryResponse = z.infer<
  typeof dashboardSummaryResponseSchema
>
