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
          parts.push("Da suy dien va tao su kien moi.")
          break
        case "UPDATED":
          parts.push("Da suy dien va cap nhat su kien hien co.")
          break
        case "NONE":
          parts.push("Da suy dien nhung khong thay doi su kien hien co.")
          break
        default:
          parts.push("Da suy dien su kien chinh thanh cong.")
          break
      }
      break
    case "NO_PRIMARY_EVENT":
      parts.push("Da suy dien nhung chua tim thay su kien chinh phu hop.")
      break
    case "DERIVATION_PENDING":
      parts.push("Yeu cau suy dien da duoc tiep nhan.")
      break
    case "DERIVATION_FAILED":
      parts.push("Suy dien su kien chinh khong thanh cong.")
      break
    case "CONTENT_FAILED":
      parts.push("Khong the suy dien vi bai viet dang loi noi dung.")
      break
    case "INGESTED":
      parts.push("Da nhan yeu cau suy dien cho bai viet.")
      break
    default:
      parts.push("Da nhan ket qua suy dien bai viet.")
      break
  }

  if (result.changeType && result.status !== "EVENT_RESOLVED") {
    parts.push(
      `Trang thai thay doi: ${NEWS_PRIMARY_EVENT_DERIVATION_CHANGE_TYPE_LABELS[
        result.changeType
      ].toLowerCase()}.`
    )
  }

  if (result.status) {
    parts.push(`Trang thai bai viet: ${NEWS_ARTICLE_STATUS_LABELS[result.status].toLowerCase()}.`)
  }

  if (result.eventCanonicalKey) {
    parts.push(`Khoa su kien: ${result.eventCanonicalKey}.`)
  } else if (typeof result.eventId === "number") {
    parts.push(`ID su kien: ${result.eventId}.`)
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
    return "Khong co bai viet tin tuc nao dang cho suy dien trong lo hien tai."
  }

  const parts = [
    `da xu ly ${result.processedCount ?? 0}/${selectedCount}`,
    `tao moi ${result.createdCount ?? 0}`,
    `cap nhat ${result.updatedCount ?? 0}`,
    `khong co su kien ${result.noEventCount ?? 0}`,
    `bo qua ${result.skippedCount ?? 0}`,
    `loi ${result.failedCount ?? 0}`,
  ]

  return `Da chay suy dien cho lo bai viet dang cho: ${parts.join(", ")}.`
}
