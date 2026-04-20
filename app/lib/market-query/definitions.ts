import { z } from "zod"

import type { SourceDocumentType } from "@/app/lib/source-documents/definitions"

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
  sourceDocumentId?: number
  sourceDocumentTitle?: string
  sourceDocumentUrl?: string
  sourceName?: string
  publishedAt?: string | null
  documentType?: SourceDocumentType
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
  question: z.string().trim().min(1, "Vui lòng nhập câu hỏi."),
  asOfTime: z.string().datetime().nullish(),
}) satisfies z.ZodType<MarketQueryRequest>

export const marketQueryEvidenceResponseSchema = z.object({
  eventId: z.number().int().optional(),
  eventTitle: z.string().optional(),
  sourceDocumentId: z.number().int().optional(),
  sourceDocumentTitle: z.string().optional(),
  sourceDocumentUrl: z.string().optional(),
  sourceName: z.string().optional(),
  publishedAt: z.string().nullish(),
  documentType: z
    .enum(["NEWS", "ECONOMIC_CALENDAR", "RESEARCH", "MARKET_DATA", "SENTIMENT", "OTHER"])
    .optional(),
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

export const MARKET_QUERY_DOCUMENT_TYPE_LABELS: Record<SourceDocumentType, string> = {
  NEWS: "Tin tức",
  ECONOMIC_CALENDAR: "Lịch kinh tế",
  RESEARCH: "Nghiên cứu",
  MARKET_DATA: "Dữ liệu thị trường",
  SENTIMENT: "Tâm lý thị trường",
  OTHER: "Khác",
}

export const MARKET_QUERY_EVIDENCE_ROLE_LABELS: Record<MarketQueryEvidenceRole, string> = {
  PRIMARY: "Chính",
  SUPPORTING: "Hỗ trợ",
  UPDATE: "Cập nhật",
  CONTRADICTING: "Mâu thuẫn",
}
