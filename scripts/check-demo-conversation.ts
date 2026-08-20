import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

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

console.log("Demo conversation structural checks passed")
