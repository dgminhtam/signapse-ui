import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

import type { MarketChatMessageResponse } from "../app/lib/market-query/definitions"

const {
  getMessagePreviewText,
  getRenderableConversationMessages,
  getTrackingRailState,
} = await import(
  "../components/market-conversation-assistant/history-state" + ".ts"
)
const message = (
  id: number,
  role: "USER" | "ASSISTANT",
  content: string | null,
  status: "COMPLETED" | "FAILED" = "COMPLETED",
  failureReason: string | null = null
): MarketChatMessageResponse => ({
  id,
  role,
  status,
  content,
  failureReason,
  createdDate: "2026-07-29T00:00:00Z",
})

const failed = message(2, "ASSISTANT", null, "FAILED", "Backend failed")
assert.deepEqual(
  getRenderableConversationMessages([
    message(1, "USER", "Question"),
    failed,
    message(3, "ASSISTANT", null),
  ]).map((item: MarketChatMessageResponse) => item.id),
  [1, 2]
)
assert.equal(getMessagePreviewText(failed, "Fallback"), "Backend failed")
assert.equal(
  getMessagePreviewText(message(3, "ASSISTANT", null, "FAILED"), "Fallback"),
  "Fallback"
)

assert.deepEqual(
  Array.from(
    { length: 9 },
    (_, index) =>
      getTrackingRailState({
        index,
        hoveredIndex: 4,
        isActive: false,
        isVisible: false,
      }).width
  ),
  [6, 10, 14, 20, 26, 20, 14, 10, 6]
)

const source = await readFile(
  new URL(
    "../components/market-conversation-assistant/market-conversation-assistant.tsx",
    import.meta.url
  ),
  "utf8"
)
const selectCreatedIndex = source.indexOf(
  "setSelectedConversation(conversation)"
)
const submitCreatedIndex = source.indexOf(
  "submitMarketConversationMessage(",
  selectCreatedIndex
)
const pendingUserIndex = source.indexOf("setPendingUserMessage(message)")
assert.ok(selectCreatedIndex >= 0)
assert.ok(submitCreatedIndex > selectCreatedIndex)
assert.ok(pendingUserIndex >= 0)
assert.ok(pendingUserIndex < submitCreatedIndex)
assert.match(source, /let conversation = selectedConversation/)
assert.match(source, /deriveMarketConversationTitle\(message\)/)
assert.match(source, /reconcileMarketConversationMessages\(current,/)
assert.match(source, /if \(!submissionSucceeded\) \{\s+setDraft\(message\)/)
assert.match(source, /<Popover modal=\{false\} open=\{open\}/)
assert.doesNotMatch(source, /<Dialog/)

console.log("Demo conversation checks passed")
