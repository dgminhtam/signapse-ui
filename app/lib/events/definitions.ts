export type EventStatus =
  | "ENRICHMENT_PENDING"
  | "ENRICHED"
  | "ENRICHMENT_NO_MATCH"
  | "ENRICHMENT_FAILED"
  | "ARCHIVED"

export type EventEnrichmentStatus =
  | "PENDING"
  | "SUCCESS"
  | "NO_MATCH"
  | "FAILED"

export type EventAssetType = "COMMODITY" | "CRYPTO" | "FX" | "INDEX"

export type EventMarketReactionDirection =
  | "BULLISH"
  | "BEARISH"
  | "MIXED"
  | "NEUTRAL"

export type EventMarketReactionTimeHorizon =
  | "INTRADAY"
  | "SHORT_TERM"
  | "MEDIUM_TERM"
  | "LONG_TERM"

export type EventAssetRelationType =
  | "PRIMARY_SUBJECT"
  | "AFFECTED_ASSET"
  | "REFERENCE_ASSET"

export type EventThemeRelationType = "PRIMARY_THEME" | "SECONDARY_THEME"

export type EventEvidenceRole =
  | "PRIMARY"
  | "SUPPORTING"
  | "UPDATE"
  | "CONTRADICTING"

export type EventEnrichmentOutcome = EventStatus

export interface EventListResponse {
  id: number
  title: string
  canonicalKey?: string
  description?: string
  status: EventStatus
  confidence?: number
  occurredAt?: string
  createdDate: string
  lastModifiedDate?: string
}

export interface EventAssetSummaryResponse {
  assetId?: number
  assetName?: string
  assetSymbol?: string
  assetType?: EventAssetType
  relationType?: EventAssetRelationType
  weight?: number
}

export interface EventThemeSummaryResponse {
  themeId?: number
  themeTitle?: string
  themeSlug?: string
  relationType?: EventThemeRelationType
  weight?: number
}

export interface EventEvidenceSummaryResponse {
  newsArticleId?: number
  newsArticleTitle?: string
  newsArticleUrl?: string
  newsOutletName?: string
  publishedAt?: string | null
  evidenceRole?: EventEvidenceRole
  confidence?: number
  evidenceNote?: string
}

export interface EventMarketReactionSummaryResponse {
  id?: number
  assetId?: number
  assetName?: string
  assetSymbol?: string
  assetType?: EventAssetType
  direction?: EventMarketReactionDirection
  timeHorizon?: EventMarketReactionTimeHorizon
  confidence?: number
  reasoning?: string
  observedAt?: string | null
}

export interface EventResponse extends EventListResponse {
  assets: EventAssetSummaryResponse[]
  themes: EventThemeSummaryResponse[]
  evidence: EventEvidenceSummaryResponse[]
  marketReactions?: EventMarketReactionSummaryResponse[]
}

export interface EventEnrichmentResult {
  eventId?: number
  eventTitle?: string
  eventCanonicalKey?: string
  outcome: EventEnrichmentOutcome
  assetLinkCount?: number
  themeLinkCount?: number
  message?: string
}

export interface PendingEventEnrichmentBatchResult {
  requestedBatchSize?: number
  selectedCount?: number
  processedCount?: number
  skippedCount?: number
  deferredCount?: number
  enrichedCount?: number
  noMatchCount?: number
  failedCount?: number
  results?: EventEnrichmentResult[]
}

export interface EventMarketReactionDerivationResult {
  eventId?: number
  eventTitle?: string
  eventCanonicalKey?: string
  reactionCount?: number
  neutralCount?: number
  message?: string
}

export interface PendingEventMarketReactionDerivationBatchResult {
  requestedBatchSize?: number
  selectedCount?: number
  processedCount?: number
  skippedCount?: number
  derivedCount?: number
  neutralCount?: number
  failedCount?: number
  results?: EventMarketReactionDerivationResult[]
}

export const EVENT_STATUS_LABELS: Record<string, string> = {
  ENRICHMENT_PENDING: "Chờ làm giàu",
  ENRICHED: "Đã làm giàu",
  ENRICHMENT_NO_MATCH: "Không có liên kết phù hợp",
  ENRICHMENT_FAILED: "Lỗi làm giàu",
  ARCHIVED: "Lưu trữ",
}

export const EVENT_ENRICHMENT_STATUS_LABELS: Record<
  EventEnrichmentStatus,
  string
> = {
  PENDING: "Đang chờ",
  SUCCESS: "Thành công",
  NO_MATCH: "Không khớp",
  FAILED: "Thất bại",
}

export const EVENT_ASSET_TYPE_LABELS: Record<EventAssetType, string> = {
  COMMODITY: "Hàng hóa",
  CRYPTO: "Tiền mã hóa",
  FX: "Ngoại hối",
  INDEX: "Chỉ số",
}

export const EVENT_MARKET_REACTION_DIRECTION_LABELS: Record<
  EventMarketReactionDirection,
  string
> = {
  BULLISH: "Tăng giá",
  BEARISH: "Giảm giá",
  MIXED: "Trái chiều",
  NEUTRAL: "Trung lập",
}

export const EVENT_MARKET_REACTION_TIME_HORIZON_LABELS: Record<
  EventMarketReactionTimeHorizon,
  string
> = {
  INTRADAY: "Trong ngày",
  SHORT_TERM: "Ngắn hạn",
  MEDIUM_TERM: "Trung hạn",
  LONG_TERM: "Dài hạn",
}

export const EVENT_ASSET_RELATION_LABELS: Record<
  EventAssetRelationType,
  string
> = {
  PRIMARY_SUBJECT: "Chủ thể chính",
  AFFECTED_ASSET: "Tài sản bị ảnh hưởng",
  REFERENCE_ASSET: "Tài sản tham chiếu",
}

export const EVENT_THEME_RELATION_LABELS: Record<
  EventThemeRelationType,
  string
> = {
  PRIMARY_THEME: "Chủ đề chính",
  SECONDARY_THEME: "Chủ đề phụ",
}

export const EVENT_EVIDENCE_ROLE_LABELS: Record<EventEvidenceRole, string> = {
  PRIMARY: "Chính",
  SUPPORTING: "Hỗ trợ",
  UPDATE: "Cập nhật",
  CONTRADICTING: "Mâu thuẫn",
}
