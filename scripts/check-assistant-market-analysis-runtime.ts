import assert from "node:assert/strict"

const {
  convertMarketConversationMessage,
  isMarketAnalysisPartData,
} = await import(
  "../components/assistant-ui/market-conversation-runtime" + ".ts"
)

const baseMessage = {
  id: "1",
  role: "assistant",
  status: "completed",
  content: "Answer",
  failureReason: null,
  analysisId: 42,
  createdDate: "2026-06-11T00:00:00.000Z",
}

const textMessage = convertMarketConversationMessage({
  ...baseMessage,
  kind: "TEXT",
  analysisId: null,
})

assert.equal(Array.isArray(textMessage.content), true)
assert.deepEqual(textMessage.content, [{ type: "text", text: "Answer" }])

const textMessageWithStrayAnalysisId = convertMarketConversationMessage({
  ...baseMessage,
  kind: "TEXT",
  analysisId: 42,
})

assert.deepEqual(textMessageWithStrayAnalysisId.content, [
  { type: "text", text: "Answer" },
])

const analysisMessage = convertMarketConversationMessage({
  ...baseMessage,
  kind: "ANALYSIS",
})

assert.deepEqual(analysisMessage.content, [
  { type: "text", text: "Answer" },
  {
    type: "data-market-analysis",
    data: {
      analysisId: 42,
      messageStatus: "completed",
      failureReason: null,
    },
  },
])

const missingAnalysisId = convertMarketConversationMessage({
  ...baseMessage,
  kind: "ANALYSIS",
  analysisId: null,
})

assert.deepEqual(missingAnalysisId.content, [{ type: "text", text: "Answer" }])

const invalidAnalysisId = convertMarketConversationMessage({
  ...baseMessage,
  kind: "ANALYSIS",
  analysisId: 0,
})

assert.deepEqual(invalidAnalysisId.content, [{ type: "text", text: "Answer" }])

const failedMessage = convertMarketConversationMessage({
  ...baseMessage,
  kind: "ANALYSIS",
  status: "failed",
  failureReason: "failed",
})

assert.equal(failedMessage.status?.type, "incomplete")
assert.equal(
  isMarketAnalysisPartData({
    analysisId: 42,
    messageStatus: "completed",
    failureReason: null,
  }),
  true
)
assert.equal(
  isMarketAnalysisPartData({
    analysisId: 0,
    messageStatus: "completed",
    failureReason: null,
  }),
  false
)

console.log("Assistant market analysis runtime checks passed")
