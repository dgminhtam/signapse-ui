import {
  NEWS_ARTICLE_STATUS_LABELS,
  NEWS_PRIMARY_EVENT_DERIVATION_CHANGE_TYPE_LABELS,
  NewsPrimaryEventDerivationResult,
  PendingNewsEventDerivationBatchResult,
} from "@/app/lib/news-articles/definitions"

export function isPrimaryEventDerivationFailure(
  result: NewsPrimaryEventDerivationResult
) {
  return result.status === "DERIVATION_FAILED"
}

export function buildPrimaryEventDerivationSummary(
  result: NewsPrimaryEventDerivationResult
) {
  const parts: string[] = []

  switch (result.status) {
    case "EVENT_RESOLVED":
      switch (result.changeType) {
        case "CREATED":
          parts.push("Đã suy diễn và tạo sự kiện mới.")
          break
        case "UPDATED":
          parts.push("Đã suy diễn và cập nhật sự kiện hiện có.")
          break
        case "NONE":
          parts.push("Đã suy diễn nhưng không thay đổi sự kiện hiện có.")
          break
        default:
          parts.push("Đã suy diễn sự kiện chính thành công.")
          break
      }
      break
    case "NO_PRIMARY_EVENT":
      parts.push("Đã suy diễn nhưng chưa tìm thấy sự kiện chính phù hợp.")
      break
    case "DERIVATION_PENDING":
      parts.push("Yêu cầu suy diễn đã được tiếp nhận.")
      break
    case "DERIVATION_FAILED":
      parts.push("Suy diễn sự kiện chính không thành công.")
      break
    case "CONTENT_FAILED":
      parts.push("Không thể suy diễn vì bài viết đang lỗi nội dung.")
      break
    case "INGESTED":
      parts.push("Đã nhận yêu cầu suy diễn cho bài viết.")
      break
    default:
      parts.push("Đã nhận kết quả suy diễn bài viết.")
      break
  }

  if (result.changeType && result.status !== "EVENT_RESOLVED") {
    parts.push(
      `Trạng thái thay đổi: ${NEWS_PRIMARY_EVENT_DERIVATION_CHANGE_TYPE_LABELS[
        result.changeType
      ].toLowerCase()}.`
    )
  }

  if (result.status) {
    parts.push(`Trạng thái bài viết: ${NEWS_ARTICLE_STATUS_LABELS[result.status].toLowerCase()}.`)
  }

  if (result.eventCanonicalKey) {
    parts.push(`Khóa sự kiện: ${result.eventCanonicalKey}.`)
  } else if (typeof result.eventId === "number") {
    parts.push(`ID sự kiện: ${result.eventId}.`)
  }

  if (result.message?.trim()) {
    parts.push(result.message.trim())
  }

  return parts.join(" ")
}

export function hasOnlyFailedPendingNewsEventDerivation(
  result: PendingNewsEventDerivationBatchResult
) {
  const successfulCount =
    (result.createdCount ?? 0) +
    (result.updatedCount ?? 0) +
    (result.noEventCount ?? 0)

  return (result.failedCount ?? 0) > 0 && successfulCount === 0
}

export function buildPendingNewsEventDerivationSummary(
  result: PendingNewsEventDerivationBatchResult
) {
  const selectedCount = result.selectedCount ?? 0

  if (selectedCount === 0) {
    return "Không có bài viết tin tức nào đang chờ suy diễn trong lô hiện tại."
  }

  const parts = [
    `đã xử lý ${result.processedCount ?? 0}/${selectedCount}`,
    `tạo mới ${result.createdCount ?? 0}`,
    `cập nhật ${result.updatedCount ?? 0}`,
    `không có sự kiện ${result.noEventCount ?? 0}`,
    `bỏ qua ${result.skippedCount ?? 0}`,
    `lỗi ${result.failedCount ?? 0}`,
  ]

  return `Đã chạy suy diễn cho lô bài viết đang chờ: ${parts.join(", ")}.`
}
