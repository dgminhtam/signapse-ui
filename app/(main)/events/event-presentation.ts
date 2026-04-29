import {
  EVENT_ENRICHMENT_STATUS_LABELS,
  EVENT_MARKET_REACTION_DIRECTION_LABELS,
  EVENT_MARKET_REACTION_TIME_HORIZON_LABELS,
  EVENT_STATUS_LABELS,
  EventEnrichmentResult,
  EventEnrichmentStatus,
  EventMarketReactionDerivationResult,
  EventMarketReactionDirection,
  EventMarketReactionTimeHorizon,
  PendingEventMarketReactionDerivationBatchResult,
  PendingEventEnrichmentBatchResult,
} from "@/app/lib/events/definitions"

type BadgeVariant = "default" | "secondary" | "outline" | "destructive"

export function getEventStatusLabel(status?: string) {
  if (!status) {
    return "Chưa có"
  }

  return EVENT_STATUS_LABELS[status] || status
}

export function getEventStatusVariant(status?: string): BadgeVariant {
  switch (status) {
    case "ENRICHED":
      return "default"
    case "ENRICHMENT_PENDING":
      return "secondary"
    case "ENRICHMENT_FAILED":
      return "destructive"
    case "ENRICHMENT_NO_MATCH":
    case "ARCHIVED":
    default:
      return "outline"
  }
}

export function getEventEnrichmentLabel(status?: EventEnrichmentStatus) {
  if (!status) {
    return "Chưa làm giàu"
  }

  return EVENT_ENRICHMENT_STATUS_LABELS[status]
}

export function getEventEnrichmentVariant(
  status?: EventEnrichmentStatus
): Exclude<BadgeVariant, "default"> {
  if (status === "FAILED") {
    return "destructive"
  }

  if (status === "SUCCESS") {
    return "secondary"
  }

  return "outline"
}

export function isEventEnrichmentFailure(result: EventEnrichmentResult) {
  return result.outcome === "ENRICHMENT_FAILED"
}

export function buildEventEnrichmentSummary(result: EventEnrichmentResult) {
  const parts: string[] = []

  switch (result.outcome) {
    case "ENRICHED":
      parts.push("Đã làm giàu liên kết tài sản và chủ đề cho sự kiện.")
      break
    case "ENRICHMENT_NO_MATCH":
      parts.push("Đã chạy làm giàu nhưng chưa tìm thấy liên kết phù hợp.")
      break
    case "ENRICHMENT_PENDING":
      parts.push("Yêu cầu làm giàu sự kiện đã được tiếp nhận.")
      break
    case "ENRICHMENT_FAILED":
      parts.push("Làm giàu liên kết tài sản và chủ đề không thành công.")
      break
    case "ARCHIVED":
      parts.push("Sự kiện đã được lưu trữ, không có thay đổi làm giàu mới.")
      break
  }

  if (
    typeof result.assetLinkCount === "number" ||
    typeof result.themeLinkCount === "number"
  ) {
    parts.push(
      `Tài sản: ${result.assetLinkCount ?? 0}, chủ đề: ${result.themeLinkCount ?? 0}.`
    )
  }

  if (result.message?.trim()) {
    parts.push(result.message.trim())
  }

  return parts.join(" ")
}

export function hasOnlyFailedPendingEventEnrichment(
  result: PendingEventEnrichmentBatchResult
) {
  return (
    (result.failedCount ?? 0) > 0 &&
    (result.enrichedCount ?? 0) === 0 &&
    (result.noMatchCount ?? 0) === 0 &&
    (result.deferredCount ?? 0) === 0
  )
}

export function buildPendingEventEnrichmentSummary(
  result: PendingEventEnrichmentBatchResult
) {
  const selectedCount = result.selectedCount ?? 0

  if (selectedCount === 0) {
    return "Không có sự kiện nào đang chờ làm giàu trong lô hiện tại."
  }

  const parts = [
    `đã xử lý ${result.processedCount ?? 0}/${selectedCount}`,
    `thành công ${result.enrichedCount ?? 0}`,
    `không khớp ${result.noMatchCount ?? 0}`,
    `bỏ qua ${result.skippedCount ?? 0}`,
    `hoãn ${result.deferredCount ?? 0}`,
    `lỗi ${result.failedCount ?? 0}`,
  ]

  return `Đã chạy làm giàu cho sự kiện chờ: ${parts.join(", ")}.`
}

export function getEventMarketReactionDirectionLabel(
  direction?: EventMarketReactionDirection
) {
  if (!direction) {
    return "Chưa có"
  }

  return EVENT_MARKET_REACTION_DIRECTION_LABELS[direction]
}

export function getEventMarketReactionDirectionVariant(
  direction?: EventMarketReactionDirection
): BadgeVariant {
  switch (direction) {
    case "BULLISH":
      return "default"
    case "BEARISH":
      return "destructive"
    case "MIXED":
      return "secondary"
    case "NEUTRAL":
    default:
      return "outline"
  }
}

export function getEventMarketReactionTimeHorizonLabel(
  timeHorizon?: EventMarketReactionTimeHorizon
) {
  if (!timeHorizon) {
    return "Chưa có"
  }

  return EVENT_MARKET_REACTION_TIME_HORIZON_LABELS[timeHorizon]
}

export function getEventMarketReactionTimeHorizonVariant(
  timeHorizon?: EventMarketReactionTimeHorizon
): Exclude<BadgeVariant, "destructive"> {
  if (timeHorizon === "INTRADAY" || timeHorizon === "SHORT_TERM") {
    return "secondary"
  }

  return "outline"
}

export function buildEventMarketReactionDerivationSummary(
  result: EventMarketReactionDerivationResult
) {
  const parts = [
    `tác động ${result.reactionCount ?? 0}`,
    `trung lập ${result.neutralCount ?? 0}`,
  ]

  const message = result.message?.trim()

  return [
    `Đã suy luận tác động thị trường cho sự kiện: ${parts.join(", ")}.`,
    message,
  ]
    .filter(Boolean)
    .join(" ")
}

export function hasOnlyFailedPendingEventMarketReactionDerivation(
  result: PendingEventMarketReactionDerivationBatchResult
) {
  return (
    (result.failedCount ?? 0) > 0 &&
    (result.derivedCount ?? 0) === 0 &&
    (result.neutralCount ?? 0) === 0
  )
}

export function buildPendingEventMarketReactionDerivationSummary(
  result: PendingEventMarketReactionDerivationBatchResult
) {
  const selectedCount = result.selectedCount ?? 0

  if (selectedCount === 0) {
    return "Không có sự kiện nào đang chờ suy luận tác động thị trường trong lô hiện tại."
  }

  const parts = [
    `đã xử lý ${result.processedCount ?? 0}/${selectedCount}`,
    `có tác động ${result.derivedCount ?? 0}`,
    `trung lập ${result.neutralCount ?? 0}`,
    `bỏ qua ${result.skippedCount ?? 0}`,
    `lỗi ${result.failedCount ?? 0}`,
  ]

  return `Đã chạy suy luận tác động thị trường cho sự kiện chờ: ${parts.join(", ")}.`
}
