const UNTITLED_NOTE_LABEL = "Ghi chú chưa có tiêu đề"
const MAX_NOTE_LABEL_LENGTH = 80
const MAX_NOTE_EXCERPT_LENGTH = 160

export interface PersonalNoteResponse {
  id: number
  contentHtml: string
  createdDate?: string
  lastModifiedDate?: string
}

export interface CreatePersonalNoteRequest {
  contentHtml: string
}

export interface UpdatePersonalNoteRequest {
  contentHtml: string
}

function decodeHtmlEntity(entity: string) {
  if (entity === "nbsp") {
    return " "
  }

  if (entity === "amp") {
    return "&"
  }

  if (entity === "lt") {
    return "<"
  }

  if (entity === "gt") {
    return ">"
  }

  if (entity === "quot") {
    return '"'
  }

  if (entity === "apos") {
    return "'"
  }

  if (entity.startsWith("#x")) {
    const codePoint = Number.parseInt(entity.slice(2), 16)
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : ""
  }

  if (entity.startsWith("#")) {
    const codePoint = Number.parseInt(entity.slice(1), 10)
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : ""
  }

  return ""
}

export function getPersonalNoteText(contentHtml?: string | null) {
  if (!contentHtml) {
    return ""
  }

  return contentHtml
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|blockquote|tr|td|th)>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&([a-zA-Z0-9#]+);/g, (_, entity: string) =>
      decodeHtmlEntity(entity)
    )
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function isMeaningfulPersonalNoteHtml(contentHtml?: string | null) {
  return getPersonalNoteText(contentHtml).length > 0
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength).trimEnd()}...`
}

export function getPersonalNoteLabel(contentHtml?: string | null) {
  const text = getPersonalNoteText(contentHtml)

  if (!text) {
    return UNTITLED_NOTE_LABEL
  }

  return truncateText(text, MAX_NOTE_LABEL_LENGTH)
}

export function getPersonalNoteExcerpt(contentHtml?: string | null) {
  const text = getPersonalNoteText(contentHtml)

  if (!text) {
    return "Chưa có nội dung để xem trước."
  }

  return truncateText(text, MAX_NOTE_EXCERPT_LENGTH)
}

export function createEmptyPersonalNoteHtml() {
  return "<p></p>"
}
