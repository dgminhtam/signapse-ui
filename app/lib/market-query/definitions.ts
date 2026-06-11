import { z } from "zod"

import { artifactTypes, type ArtifactType } from "@/app/lib/artifacts/definitions"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"

export type MarketQueryEvidenceRole =
  | "PRIMARY"
  | "SUPPORTING"
  | "UPDATE"
  | "CONTRADICTING"
  | "CONTEXT"

export interface MarketQueryRequest {
  question: string
  asOfTime?: string | null
}

export interface MarketQueryEvidenceResponse {
  eventId?: number
  eventTitle?: string
  newsArticleId?: number
  newsArticleTitle?: string
  newsArticleUrl?: string
  newsOutletName?: string
  publishedAt?: string | null
  artifactType?: ArtifactType
  evidenceRole?: MarketQueryEvidenceRole
  evidenceConfidence?: number
  evidenceNote?: string
}

export interface MarketQueryKeyEventResponse {
  id?: number
  title?: string
  description?: string
  occurredAt?: string | null
  confidence?: number
  assetSymbols?: string[]
  themeSlugs?: string[]
}

export interface MarketQueryKeyNarrativeResponse {
  id?: number
  title?: string
  thesis?: string
  status?: string
  confidence?: number
  primaryAssetSymbol?: string
  primaryThemeSlug?: string
  supportingEventIds?: number[]
}

export interface MarketQueryResponse {
  answer?: string
  reasoningChain?: string[]
  keyEvents?: MarketQueryKeyEventResponse[]
  keyNarratives?: MarketQueryKeyNarrativeResponse[]
  assetsConsidered?: string[]
  confidence?: number
  limitations?: string[]
  evidence?: MarketQueryEvidenceResponse[]
}

export type MarketChatMessageRole = "USER" | "ASSISTANT"
export type MarketChatMessageKind = "TEXT" | "ANALYSIS"
export type MarketChatMessageStatus = "PENDING" | "COMPLETED" | "FAILED"
export type MarketAnalysisStatus = "PENDING" | "COMPLETED" | "FAILED"
export type MarketAnalysisEvidenceSourceType =
  | "EVENT"
  | "NARRATIVE"
  | "NEWS_ARTICLE"
  | "EVENT_NEWS_ARTICLE_EVIDENCE"
  | "ECONOMIC_CALENDAR_ENTRY"

export interface CreateMarketConversationRequest {
  title: string
}

export interface MarketConversationSummaryResponse {
  id: number
  title: string
  workspaceId: number
  createdDate: string
  lastModifiedDate: string
}

export interface MarketChatMessageResponse {
  id: number
  role: MarketChatMessageRole
  kind: MarketChatMessageKind
  status: MarketChatMessageStatus
  content: string | null
  analysisId: number | null
  failureReason: string | null
  createdDate: string
}

export interface MarketConversationDetailResponse
  extends MarketConversationSummaryResponse {
  messages: MarketChatMessageResponse[]
}

export interface MarketConversationMessagePageResponse {
  content: MarketChatMessageResponse[]
  hasMore: boolean
  nextBeforeMessageId?: number | null
}

export interface SubmitMarketConversationMessageRequest {
  message: string
}

export interface SubmitMarketConversationMessageResponse {
  userMessage: MarketChatMessageResponse
  assistantMessage: MarketChatMessageResponse
  analysisId: number | null
}

export interface MarketAnalysisResponse {
  id: number
  conversationId: number
  userMessageId: number
  assistantMessageId: number
  workspaceId: number
  questionSnapshot: string
  assetScopeSnapshot: Record<string, unknown>[] | null
  answer: string
  reasoningChain: string[]
  keyEvents: Record<string, unknown>[]
  keyNarratives: Record<string, unknown>[]
  assetsConsidered: string[]
  confidence: number | null
  limitations: string[]
  modelProvider: string | null
  modelName: string | null
  status: MarketAnalysisStatus
  completedAt: string | null
  failureReason?: string | null
  createdDate: string
  lastModifiedDate: string
}

export interface MarketAnalysisEvidenceResponse {
  id: number
  analysisId: number
  sourceType: MarketAnalysisEvidenceSourceType
  eventId: number | null
  narrativeId: number | null
  newsArticleId: number | null
  eventNewsArticleEvidenceId: number | null
  economicCalendarEntryId: number | null
  titleSnapshot: string
  urlSnapshot: string | null
  sourceSnapshot: string | null
  publishedAtSnapshot: string | null
  evidenceNoteSnapshot: string | null
  role: Exclude<MarketQueryEvidenceRole, "UPDATE">
  sortOrder: number
}

export interface DeliverMarketAnalysisTelegramRequest {
  destinationId: number
}

export interface MarketAnalysisTelegramDeliveryResponse {
  id: number
  workflow: string
  workflowKey: string
  destinationId: number
  status: string
  attemptCount: number
  sentAt: string | null
  failureReason: string | null
  duplicate: boolean
}

export function getMarketQueryRequestSchema(dictionary: Dictionary) {
  return z.object({
    question: z.string().trim().min(1, dictionary.marketQuery.questionRequired),
    asOfTime: z.string().datetime().nullish(),
  }) satisfies z.ZodType<MarketQueryRequest>
}

export const marketQueryEvidenceResponseSchema = z.object({
  eventId: z.number().int().optional(),
  eventTitle: z.string().optional(),
  newsArticleId: z.number().int().optional(),
  newsArticleTitle: z.string().optional(),
  newsArticleUrl: z.string().optional(),
  newsOutletName: z.string().optional(),
  publishedAt: z.string().nullish(),
  artifactType: z.enum(artifactTypes).optional(),
  evidenceRole: z.enum(["PRIMARY", "SUPPORTING", "UPDATE", "CONTRADICTING", "CONTEXT"]).optional(),
  evidenceConfidence: z.number().optional(),
  evidenceNote: z.string().optional(),
}) satisfies z.ZodType<MarketQueryEvidenceResponse>

export const marketQueryKeyEventResponseSchema = z.object({
  id: z.number().int().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  occurredAt: z.string().nullish(),
  confidence: z.number().optional(),
  assetSymbols: z.array(z.string()).optional(),
  themeSlugs: z.array(z.string()).optional(),
}) satisfies z.ZodType<MarketQueryKeyEventResponse>

export const marketQueryKeyNarrativeResponseSchema = z.object({
  id: z.number().int().optional(),
  title: z.string().optional(),
  thesis: z.string().optional(),
  status: z.string().optional(),
  confidence: z.number().optional(),
  primaryAssetSymbol: z.string().optional(),
  primaryThemeSlug: z.string().optional(),
  supportingEventIds: z.array(z.number().int()).optional(),
}) satisfies z.ZodType<MarketQueryKeyNarrativeResponse>

export const marketQueryResponseSchema = z.object({
  answer: z.string().optional(),
  reasoningChain: z.array(z.string()).optional(),
  keyEvents: z.array(marketQueryKeyEventResponseSchema).optional(),
  keyNarratives: z.array(marketQueryKeyNarrativeResponseSchema).optional(),
  assetsConsidered: z.array(z.string()).optional(),
  confidence: z.number().optional(),
  limitations: z.array(z.string()).optional(),
  evidence: z.array(marketQueryEvidenceResponseSchema).optional(),
}) satisfies z.ZodType<MarketQueryResponse>

const nullableStringSchema = z.string().nullable()
const nullableNumberSchema = z.number().int().nullable()
const jsonObjectSchema = z.record(z.string(), z.unknown())

export function getCreateMarketConversationSchema(dictionary: Dictionary) {
  return z.object({
    title: z.string().trim().min(1, dictionary.marketConversations.titleRequired),
  }) satisfies z.ZodType<CreateMarketConversationRequest>
}

export function getSubmitMarketConversationMessageSchema(dictionary: Dictionary) {
  return z.object({
    message: z.string().trim().min(1, dictionary.marketConversations.messageRequired),
  }) satisfies z.ZodType<SubmitMarketConversationMessageRequest>
}

export function getDeliverMarketAnalysisTelegramSchema() {
  return z.object({
    destinationId: z.coerce.number().int().positive(),
  }) satisfies z.ZodType<DeliverMarketAnalysisTelegramRequest>
}

export const marketChatMessageResponseSchema = z.object({
  id: z.number().int(),
  role: z.enum(["USER", "ASSISTANT"]),
  kind: z.enum(["TEXT", "ANALYSIS"]),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
  content: nullableStringSchema,
  analysisId: nullableNumberSchema,
  failureReason: nullableStringSchema,
  createdDate: z.string(),
}) satisfies z.ZodType<MarketChatMessageResponse>

export const marketConversationSummaryResponseSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  workspaceId: z.number().int(),
  createdDate: z.string(),
  lastModifiedDate: z.string(),
}) satisfies z.ZodType<MarketConversationSummaryResponse>

export const marketConversationDetailResponseSchema =
  marketConversationSummaryResponseSchema.extend({
    messages: z.array(marketChatMessageResponseSchema),
  }) satisfies z.ZodType<MarketConversationDetailResponse>

export const marketConversationMessagePageResponseSchema = z
  .object({
    content: z.array(marketChatMessageResponseSchema),
    hasMore: z.boolean(),
    nextBeforeMessageId: nullableNumberSchema.optional(),
  })
  .superRefine((page, context) => {
    if (page.hasMore && page.nextBeforeMessageId == null) {
      context.addIssue({
        code: "custom",
        path: ["nextBeforeMessageId"],
        message: "A next cursor is required when more messages are available.",
      })
    }
  }) satisfies z.ZodType<MarketConversationMessagePageResponse>

export const submitMarketConversationMessageResponseSchema = z.object({
  userMessage: marketChatMessageResponseSchema,
  assistantMessage: marketChatMessageResponseSchema,
  analysisId: nullableNumberSchema,
}) satisfies z.ZodType<SubmitMarketConversationMessageResponse>

export const pageMarketConversationSummaryResponseSchema = z.object({
  content: z.array(marketConversationSummaryResponseSchema),
  pageable: z.object({
    pageNumber: z.number().int(),
    pageSize: z.number().int(),
    offset: z.number().int(),
    paged: z.boolean(),
    unpaged: z.boolean(),
  }),
  last: z.boolean(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  size: z.number().int(),
  number: z.number().int(),
  first: z.boolean(),
  numberOfElements: z.number().int(),
  empty: z.boolean(),
})

export const marketAnalysisResponseSchema = z.object({
  id: z.number().int(),
  conversationId: z.number().int(),
  userMessageId: z.number().int(),
  assistantMessageId: z.number().int(),
  workspaceId: z.number().int(),
  questionSnapshot: z.string(),
  assetScopeSnapshot: z.array(jsonObjectSchema).nullable(),
  answer: z.string(),
  reasoningChain: z.array(z.string()),
  keyEvents: z.array(jsonObjectSchema),
  keyNarratives: z.array(jsonObjectSchema),
  assetsConsidered: z.array(z.string()),
  confidence: z.number().nullable(),
  limitations: z.array(z.string()),
  modelProvider: nullableStringSchema,
  modelName: nullableStringSchema,
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
  completedAt: nullableStringSchema,
  failureReason: nullableStringSchema.optional(),
  createdDate: z.string(),
  lastModifiedDate: z.string(),
}) satisfies z.ZodType<MarketAnalysisResponse>

export const marketAnalysisEvidenceResponseSchema = z.object({
  id: z.number().int(),
  analysisId: z.number().int(),
  sourceType: z.enum([
    "EVENT",
    "NARRATIVE",
    "NEWS_ARTICLE",
    "EVENT_NEWS_ARTICLE_EVIDENCE",
    "ECONOMIC_CALENDAR_ENTRY",
  ]),
  eventId: nullableNumberSchema,
  narrativeId: nullableNumberSchema,
  newsArticleId: nullableNumberSchema,
  eventNewsArticleEvidenceId: nullableNumberSchema,
  economicCalendarEntryId: nullableNumberSchema,
  titleSnapshot: z.string(),
  urlSnapshot: nullableStringSchema,
  sourceSnapshot: nullableStringSchema,
  publishedAtSnapshot: nullableStringSchema,
  evidenceNoteSnapshot: nullableStringSchema,
  role: z.enum(["PRIMARY", "SUPPORTING", "CONTRADICTING", "CONTEXT"]),
  sortOrder: z.number().int(),
}) satisfies z.ZodType<MarketAnalysisEvidenceResponse>

export const marketAnalysisEvidenceListResponseSchema = z.array(
  marketAnalysisEvidenceResponseSchema
)

export const marketAnalysisTelegramDeliveryResponseSchema = z.object({
  id: z.number().int(),
  workflow: z.string(),
  workflowKey: z.string(),
  destinationId: z.number().int(),
  status: z.string(),
  attemptCount: z.number().int(),
  sentAt: nullableStringSchema,
  failureReason: nullableStringSchema,
  duplicate: z.boolean(),
}) satisfies z.ZodType<MarketAnalysisTelegramDeliveryResponse>

export function deriveMarketConversationTitle(
  question: string,
  maxLength = 80
): string {
  const normalized = question.trim().replace(/\s+/g, " ")

  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, Math.max(1, maxLength - 3)).trimEnd()}...`
}

export function normalizeMarketConversationMessages(
  messages: readonly MarketChatMessageResponse[]
): MarketChatMessageResponse[] {
  return [...messages].sort((left, right) => left.id - right.id)
}

export function reconcileMarketConversationMessages(
  current: readonly MarketChatMessageResponse[],
  incoming: readonly MarketChatMessageResponse[]
): MarketChatMessageResponse[] {
  const messagesById = new Map(
    current.map((message) => [message.id, message] as const)
  )

  for (const message of incoming) {
    messagesById.set(message.id, message)
  }

  return normalizeMarketConversationMessages([...messagesById.values()])
}

export function getMarketQueryArtifactTypeLabels(
  dictionary: Dictionary
): Record<ArtifactType, string> {
  return dictionary.marketQuery.artifactTypes
}

export function getMarketQueryEvidenceRoleLabels(
  dictionary: Dictionary
): Record<MarketQueryEvidenceRole, string> {
  return dictionary.marketQuery.evidenceRoles
}
