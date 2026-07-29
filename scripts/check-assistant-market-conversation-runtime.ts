import assert from "node:assert/strict"

const { convertMarketConversationMessage } = await import(
  "../components/assistant-ui/market-conversation-runtime" + ".ts"
)

const message = {
  id: "1",
  role: "assistant",
  status: "completed",
  content: "Answer",
  failureReason: null,
  createdDate: "2026-06-11T00:00:00.000Z",
} as const

const completed = convertMarketConversationMessage(message)
assert.deepEqual(completed.content, [{ type: "text", text: "Answer" }])
assert.equal(completed.status?.type, "complete")

const failed = convertMarketConversationMessage({
  ...message,
  status: "failed",
  failureReason: "failed",
})
assert.deepEqual(failed.content, [{ type: "text", text: "Answer" }])
assert.equal(failed.status?.type, "incomplete")

console.log("Assistant market conversation runtime checks passed")
