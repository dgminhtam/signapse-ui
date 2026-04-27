import { format } from "date-fns"

export const EXAMPLE_PROMPTS = [
  "Những sự kiện nào đang hỗ trợ xu hướng tăng của vàng trong 7 ngày gần đây?",
  "Các tín hiệu hiện tại có đang nghiêng về áp lực giảm đối với dầu Brent không?",
  "Trong tuần này, yếu tố nào đang ảnh hưởng mạnh nhất tới tâm lý thị trường tiền điện tử?",
] as const

export function getScrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") {
    return "auto"
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
}

export function formatTraceabilityHint(
  hasBlockedEvent: boolean,
  hasBlockedSourceDocument: boolean
) {
  if (hasBlockedEvent && hasBlockedSourceDocument) {
    return "Bạn chưa có quyền mở chi tiết sự kiện và tài liệu nguồn liên quan."
  }

  if (hasBlockedEvent) {
    return "Bạn chưa có quyền mở chi tiết sự kiện liên quan."
  }

  if (hasBlockedSourceDocument) {
    return "Bạn chưa có quyền mở tài liệu nguồn liên quan."
  }

  return null
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "Chưa có"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Chưa có"
  }

  return format(date, "dd/MM/yyyy HH:mm")
}

export function formatConfidence(value?: number) {
  if (typeof value !== "number") {
    return "Chưa có"
  }

  return `${Math.round(value * 100)}%`
}

export function getConfidenceVariant(
  value?: number
): "default" | "secondary" | "outline" | "destructive" {
  if (typeof value !== "number") {
    return "outline"
  }

  if (value >= 0.75) {
    return "default"
  }

  if (value >= 0.5) {
    return "secondary"
  }

  if (value < 0.3) {
    return "destructive"
  }

  return "outline"
}

export function formatEventFallbackMeta(id?: number) {
  return typeof id === "number" ? `Mã sự kiện #${id}` : null
}

export function formatSourceDocumentFallbackMeta(id?: number) {
  return typeof id === "number" ? `Mã tài liệu nguồn #${id}` : null
}

export function getSourceDocumentHref(id: number) {
  return `/source-documents/${id}`
}
