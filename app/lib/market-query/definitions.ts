import { z } from "zod"

import { artifactTypes, type ArtifactType } from "@/app/lib/artifacts/definitions"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"

export type MarketQueryEvidenceRole =
  | "PRIMARY"
  | "SUPPORTING"
  | "UPDATE"
  | "CONTRADICTING"

export interface MarketQueryRequest {
  question: string
  asOfTime?: string | null
}

export interface MarketQueryEvidenceResponse {
  eventId?: number
  eventTitle?: string
  artifactId?: number
  artifactTitle?: string
  artifactUrl?: string
  newsOutletName?: string
  publishedAt?: string | null
  artifactType?: ArtifactType
  evidenceRole?: MarketQueryEvidenceRole
  evidenceConfidence?: number
}

export interface MarketQueryKeyEventResponse {
  id?: number
  title?: string
  summary?: string
  occurredAt?: string | null
  confidence?: number
  assetSymbols?: string[]
  themeSlugs?: string[]
}

export interface MarketQueryResponse {
  answer?: string
  reasoningChain?: string[]
  keyEvents?: MarketQueryKeyEventResponse[]
  assetsConsidered?: string[]
  confidence?: number
  limitations?: string[]
  evidence?: MarketQueryEvidenceResponse[]
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
  artifactId: z.number().int().optional(),
  artifactTitle: z.string().optional(),
  artifactUrl: z.string().optional(),
  newsOutletName: z.string().optional(),
  publishedAt: z.string().nullish(),
  artifactType: z.enum(artifactTypes).optional(),
  evidenceRole: z.enum(["PRIMARY", "SUPPORTING", "UPDATE", "CONTRADICTING"]).optional(),
  evidenceConfidence: z.number().optional(),
}) satisfies z.ZodType<MarketQueryEvidenceResponse>

export const marketQueryKeyEventResponseSchema = z.object({
  id: z.number().int().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  occurredAt: z.string().nullish(),
  confidence: z.number().optional(),
  assetSymbols: z.array(z.string()).optional(),
  themeSlugs: z.array(z.string()).optional(),
}) satisfies z.ZodType<MarketQueryKeyEventResponse>

export const marketQueryResponseSchema = z.object({
  answer: z.string().optional(),
  reasoningChain: z.array(z.string()).optional(),
  keyEvents: z.array(marketQueryKeyEventResponseSchema).optional(),
  assetsConsidered: z.array(z.string()).optional(),
  confidence: z.number().optional(),
  limitations: z.array(z.string()).optional(),
  evidence: z.array(marketQueryEvidenceResponseSchema).optional(),
}) satisfies z.ZodType<MarketQueryResponse>

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
