import { z } from "zod"

import { artifactTypes, type ArtifactType } from "@/app/lib/artifacts/definitions"

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

export const marketQueryRequestSchema = z.object({
  question: z.string().trim().min(1, "Vui long nhap cau hoi."),
  asOfTime: z.string().datetime().nullish(),
}) satisfies z.ZodType<MarketQueryRequest>

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

export const MARKET_QUERY_ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  NEWS_ARTICLE: "Bai viet tin tuc",
  ECONOMIC_CALENDAR_ENTRY: "Muc lich kinh te",
  RESEARCH_DOCUMENT: "Tai lieu nghien cuu",
  STRATEGY_PLAYBOOK: "Playbook chien luoc",
  OTHER: "Khac",
}

export const MARKET_QUERY_EVIDENCE_ROLE_LABELS: Record<MarketQueryEvidenceRole, string> = {
  PRIMARY: "Chinh",
  SUPPORTING: "Ho tro",
  UPDATE: "Cap nhat",
  CONTRADICTING: "Mau thuan",
}
