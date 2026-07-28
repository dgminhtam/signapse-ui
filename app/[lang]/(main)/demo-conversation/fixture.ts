import type { UIMessage } from "ai"

import type { Dictionary } from "@/app/lib/i18n/dictionary-types"

export type DemoConversationLabels = Dictionary["demoConversation"]

export function getMessageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
}
