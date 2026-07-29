import type {
  MarketChatMessageResponse,
  MarketChatMessageRole,
  MarketChatMessageStatus,
} from "@/app/lib/market-query/definitions"
import type { ThreadMessageLike } from "@assistant-ui/react"

export type AssistantConversationRole = "user" | "assistant"
export type AssistantConversationMessageStatus = "completed" | "failed"

export interface AssistantConversationMessageSnapshot {
  id: string
  role: AssistantConversationRole
  status: AssistantConversationMessageStatus
  content: string
  failureReason: string | null
  createdDate: string
}

const roleMap: Record<MarketChatMessageRole, AssistantConversationRole> = {
  USER: "user",
  ASSISTANT: "assistant",
}

const statusMap: Record<
  MarketChatMessageStatus,
  AssistantConversationMessageStatus
> = {
  COMPLETED: "completed",
  FAILED: "failed",
}

export function mapMarketConversationMessage(
  message: MarketChatMessageResponse
): AssistantConversationMessageSnapshot {
  return {
    id: String(message.id),
    role: roleMap[message.role],
    status: statusMap[message.status],
    content: message.content ?? "",
    failureReason: message.failureReason,
    createdDate: message.createdDate,
  }
}

export function convertMarketConversationMessage(
  message: AssistantConversationMessageSnapshot
): ThreadMessageLike {
  const content =
    message.role === "assistant"
      ? message.content
        ? [{ type: "text" as const, text: message.content }]
        : []
      : message.content
  const common = {
    id: message.id,
    role: message.role,
    content,
    createdAt: new Date(message.createdDate),
  } as const

  if (message.role === "user") {
    return common
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
