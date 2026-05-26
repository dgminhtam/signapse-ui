import { z } from "zod"

export const narrativeStatuses = [
  "EMERGING",
  "ACTIVE",
  "WEAKENING",
  "INVALIDATED",
  "ARCHIVED",
] as const

export type NarrativeStatus = (typeof narrativeStatuses)[number]

export interface NarrativeSummaryResponse {
  id: number
  title?: string | null
  slug?: string | null
  thesis?: string | null
  summary?: string | null
  status?: NarrativeStatus | null
  confidence?: number | null
  firstObservedAt?: string | null
  lastUpdatedAt?: string | null
  createdDate?: string | null
  lastModifiedDate?: string | null
  primaryAssetId?: number | null
  primaryAssetName?: string | null
  primaryAssetSymbol?: string | null
  primaryAssetType?: string | null
  primaryThemeId?: number | null
  primaryThemeTitle?: string | null
  primaryThemeSlug?: string | null
}

export const narrativeSummaryResponseSchema = z.object({
  id: z.number().int(),
  title: z.string().nullish(),
  slug: z.string().nullish(),
  thesis: z.string().nullish(),
  summary: z.string().nullish(),
  status: z.enum(narrativeStatuses).nullish(),
  confidence: z.number().nullish(),
  firstObservedAt: z.string().nullish(),
  lastUpdatedAt: z.string().nullish(),
  createdDate: z.string().nullish(),
  lastModifiedDate: z.string().nullish(),
  primaryAssetId: z.number().int().nullish(),
  primaryAssetName: z.string().nullish(),
  primaryAssetSymbol: z.string().nullish(),
  primaryAssetType: z.string().nullish(),
  primaryThemeId: z.number().int().nullish(),
  primaryThemeTitle: z.string().nullish(),
  primaryThemeSlug: z.string().nullish(),
}) satisfies z.ZodType<NarrativeSummaryResponse>

const pageableSchema = z.object({
  pageNumber: z.number().int().default(0),
  pageSize: z.number().int().default(0),
  offset: z.number().int().default(0),
  paged: z.boolean().default(true),
  unpaged: z.boolean().default(false),
})

export const narrativeSummaryPageResponseSchema = z.object({
  content: z.array(narrativeSummaryResponseSchema).default([]),
  pageable: pageableSchema.default({
    pageNumber: 0,
    pageSize: 0,
    offset: 0,
    paged: true,
    unpaged: false,
  }),
  last: z.boolean().default(true),
  totalElements: z.number().int().default(0),
  totalPages: z.number().int().default(0),
  size: z.number().int().default(0),
  number: z.number().int().default(0),
  first: z.boolean().default(true),
  numberOfElements: z.number().int().default(0),
  empty: z.boolean().default(false),
})

export type NarrativeSummaryPageResponse = z.infer<
  typeof narrativeSummaryPageResponseSchema
>
