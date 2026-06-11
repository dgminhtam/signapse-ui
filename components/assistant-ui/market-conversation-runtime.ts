import type {
  MarketChatMessageKind,
  MarketChatMessageResponse,
  MarketChatMessageRole,
  MarketChatMessageStatus,
} from "@/app/lib/market-query/definitions"
import type { ThreadMessageLike } from "@assistant-ui/react"

export type AssistantConversationRole = "user" | "assistant"
export type AssistantConversationMessageStatus =
  | "pending"
  | "completed"
  | "failed"

export interface AssistantConversationMessageSnapshot {
  id: string
  role: AssistantConversationRole
  kind: MarketChatMessageKind
  status: AssistantConversationMessageStatus
  content: string
  failureReason: string | null
  analysisId: number | null
  createdDate: string
}

export interface MarketAnalysisPartData {
  analysisId: number
  messageStatus: AssistantConversationMessageStatus
  failureReason: string | null
}

function isValidAnalysisId(value: number | null): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0
}

const roleMap: Record<MarketChatMessageRole, AssistantConversationRole> = {
  USER: "user",
  ASSISTANT: "assistant",
}

const statusMap: Record<
  MarketChatMessageStatus,
  AssistantConversationMessageStatus
> = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
}

export function mapMarketConversationMessage(
  message: MarketChatMessageResponse
): AssistantConversationMessageSnapshot {
  return {
    id: String(message.id),
    role: roleMap[message.role],
    kind: message.kind,
    status: statusMap[message.status],
    content: message.content ?? "",
    failureReason: message.failureReason,
    analysisId: message.analysisId,
    createdDate: message.createdDate,
  }
}

export function convertMarketConversationMessage(
  message: AssistantConversationMessageSnapshot
): ThreadMessageLike {
  const analysisPart =
    message.role === "assistant" &&
    message.kind === "ANALYSIS" &&
    isValidAnalysisId(message.analysisId)
      ? [
          {
            type: "data-market-analysis" as const,
            data: {
              analysisId: message.analysisId,
              messageStatus: message.status,
              failureReason: message.failureReason,
            } satisfies MarketAnalysisPartData,
          },
        ]
      : []
  const content =
    message.role === "assistant"
      ? [
          ...(message.content
            ? [{ type: "text" as const, text: message.content }]
            : []),
          ...analysisPart,
        ]
      : message.content
  const common = {
    id: message.id,
    role: message.role,
    content,
    createdAt: new Date(message.createdDate),
    metadata: {
      custom: {
        analysisId: message.analysisId,
        failureReason: message.failureReason,
      },
    },
  } as const

  if (message.role === "user") {
    return common
  }

  if (message.status === "pending") {
    return { ...common, status: { type: "running" } }
  }

  if (message.status === "failed") {
    return {
      ...common,
      status: {
        type: "incomplete",
        reason: "error",
        ...(message.failureReason ? { error: message.failureReason } : {}),
      },
    }
  }

  return {
    ...common,
    status: { type: "complete", reason: "stop" },
  }
}

export function isMarketAnalysisPartData(
  value: unknown
): value is MarketAnalysisPartData {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const candidate = value as Partial<MarketAnalysisPartData>

  return (
    typeof candidate.analysisId === "number" &&
    Number.isInteger(candidate.analysisId) &&
    candidate.analysisId > 0 &&
    (candidate.messageStatus === "pending" ||
      candidate.messageStatus === "completed" ||
      candidate.messageStatus === "failed") &&
    (candidate.failureReason === null ||
      typeof candidate.failureReason === "string")
  )
}

export function getAppendMessageText(
  message: {
    content: readonly unknown[]
  }
): string {
  return message.content
    .filter(
      (part): part is { type: "text"; text: string } =>
        typeof part === "object" &&
        part !== null &&
        "type" in part &&
        part.type === "text" &&
        "text" in part &&
        typeof part.text === "string"
    )
    .map((part) => part.text)
    .join("\n")
    .trim()
}
