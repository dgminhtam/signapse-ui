import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

import type { MarketChatMessageResponse } from "../app/lib/market-query/definitions"

const {
  getMessagePreviewText,
  getRenderableConversationMessages,
  getTrackingRailState,
  shouldLoadConversationHistory,
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

assert.equal(
  shouldLoadConversationHistory({
    query: "",
    loadedQuery: null,
    isLoading: false,
    hasError: false,
  }),
  true
)
assert.equal(
  shouldLoadConversationHistory({
    query: "  Gold ",
    loadedQuery: "Gold",
    isLoading: false,
    hasError: false,
  }),
  false
)
assert.equal(
  shouldLoadConversationHistory({
    query: "",
    loadedQuery: "",
    isLoading: false,
    hasError: false,
  }),
  false
)
assert.equal(
  shouldLoadConversationHistory({
    query: "Gold",
    loadedQuery: null,
    isLoading: true,
    hasError: false,
  }),
  false
)
assert.equal(
  shouldLoadConversationHistory({
    query: "Gold",
    loadedQuery: null,
    isLoading: false,
    hasError: true,
  }),
  false
)
assert.equal(
  shouldLoadConversationHistory({
    query: "Oil",
    loadedQuery: "Gold",
    isLoading: false,
    hasError: false,
  }),
  true
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
assert.doesNotMatch(source, /<Card/)
assert.match(source, /<PopoverHeader/)
assert.match(source, /<PopoverTitle/)
assert.match(source, /<Separator(?:\s|\/)/)
assert.match(source, /historyLoadedQueryRef\.current = query\.trim\(\)/)
assert.match(source, /historyLoadedQueryRef\.current = null/)
assert.doesNotMatch(source, /setHistoryPopoverOpen[\s\S]*setHistoryQuery\(""\)/)
assert.match(source, /navigator\.clipboard\.writeText\(text\)/)
assert.doesNotMatch(source, /writeText\([^)]*(innerText|textContent)/)
assert.match(source, /message\.role === "ASSISTANT"/)
assert.match(source, /message\.status === "COMPLETED"/)
assert.match(source, /accessibleText === undefined/)
assert.match(source, /labels\.sendToTelegram/)
assert.match(source, /labels\.telegramUnavailable/)
assert.match(source, /<MessageFooter/)
assert.match(source, /labels\.copySuccess/)
assert.match(source, /labels\.copyError/)
assert.match(source, /<time/)
assert.match(source, /<CopyIcon\s*\/>/)
assert.doesNotMatch(source, /ClipboardIcon/)
assert.match(source, /className="flex items-center gap-0\.5"/)

const userTimeIndex = source.indexOf("{isUser ? timeMetadata : null}")
const actionsIndex = source.indexOf("{messageActions}")
const assistantTimeIndex = source.indexOf("{!isUser ? timeMetadata : null}")
assert.ok(userTimeIndex >= 0)
assert.ok(userTimeIndex < actionsIndex)
assert.ok(actionsIndex < assistantTimeIndex)

console.log("Demo conversation checks passed")
