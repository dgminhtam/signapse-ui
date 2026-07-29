import assert from "node:assert/strict"

import {
  buildConversationHistorySearchParams,
  getConversationHistoryFilterFields,
  getMessagePreviewText,
  getRenderableConversationMessages,
  getResponseRevealCount,
  getResponseRevealDuration,
  mergeConversationHistory,
  splitResponseIntoGraphemes,
} from "./history-state.ts"

const emptyFilter = getConversationHistoryFilterFields("   ")
assert.deepEqual(emptyFilter, { "title[containsIgnoreCase]": "" })

const normalizedFilter = getConversationHistoryFilterFields("  inflation  ")
assert.deepEqual(normalizedFilter, {
  "title[containsIgnoreCase]": "inflation",
})

const unfiltered = buildConversationHistorySearchParams("")
assert.equal(unfiltered.filter, "")
assert.equal(unfiltered.page, 0)
assert.equal(unfiltered.size, 10)
assert.deepEqual(unfiltered.sort, [
  { field: "lastModifiedDate", direction: "desc" },
])

const filtered = buildConversationHistorySearchParams(
  "containsIgnoreCase(title,'inflation')",
  2
)
assert.equal(filtered.filter, "containsIgnoreCase(title,'inflation')")
assert.equal(filtered.page, 2)

const conversation = (id, title) => ({
  id,
  title,
  workspaceId: 1,
  createdDate: "2026-07-29T00:00:00Z",
  lastModifiedDate: "2026-07-29T00:00:00Z",
})

assert.deepEqual(
  mergeConversationHistory(
    [conversation(1, "Old")],
    [conversation(2, "Replacement")],
    0
  ).map(({ id }) => id),
  [2]
)

const merged = mergeConversationHistory(
  [conversation(1, "First"), conversation(2, "Stale")],
  [conversation(2, "Updated"), conversation(3, "Third")],
  1
)
assert.deepEqual(
  merged.map(({ id }) => id),
  [1, 2, 3]
)
assert.equal(merged[1]?.title, "Updated")

const message = (
  id,
  role,
  content,
  status = "COMPLETED",
  failureReason = null
) => ({
  id,
  role,
  status,
  content,
  failureReason,
  createdDate: "2026-07-29T00:00:00Z",
})

const failed = message(3, "ASSISTANT", null, "FAILED", "Analysis failed")
const messages = [
  message(1, "USER", "Question"),
  message(2, "ASSISTANT", "Answer"),
  failed,
  message(4, "ASSISTANT", null),
]
assert.deepEqual(
  getRenderableConversationMessages(messages).map(({ id }) => id),
  [1, 2, 3]
)
assert.equal(getMessagePreviewText(failed, "Fallback"), "Analysis failed")

const graphemes = splitResponseIntoGraphemes("A\u0301 👨‍👩‍👧‍👦")
assert.deepEqual(graphemes, ["A\u0301", " ", "👨‍👩‍👧‍👦"])
assert.equal(getResponseRevealDuration(0), 0)
assert.equal(getResponseRevealDuration(10), 600)
assert.equal(getResponseRevealDuration(100), 1_200)
assert.equal(getResponseRevealDuration(1_000), 4_000)
assert.equal(getResponseRevealCount(0, 100), 1)
assert.equal(getResponseRevealCount(600, 100), 50)
assert.equal(getResponseRevealCount(1_200, 100), 100)

console.log("Demo conversation history state assertions passed")
