import assert from "node:assert/strict"
import { createChat } from "@shadcn/helpers/ai-sdk"
import type { UIMessage } from "ai"

const { en } = await import("../app/lib/i18n/dictionaries/en" + ".ts")
const { getMessageText } = await import(
  "../app/[lang]/(main)/demo-conversation/fixture" + ".ts"
)

const chat = createChat()
const scriptedTurns = [
  [
    en.demoConversation.script.scrollQuestion,
    en.demoConversation.script.scrollAnswer,
  ],
  [
    en.demoConversation.script.anchorQuestion,
    en.demoConversation.script.anchorAnswer,
  ],
  [
    en.demoConversation.script.readerQuestion,
    en.demoConversation.script.readerAnswer,
  ],
  [
    en.demoConversation.script.accessibilityQuestion,
    en.demoConversation.script.accessibilityAnswer,
  ],
] as const

for (let index = 0; index < 25; index += 1) {
  const turn = scriptedTurns[index % scriptedTurns.length]

  if (turn) {
    chat.user(turn[0]).assistant(turn[1])
  }
}

const messages: UIMessage[] = chat.get()
const historySnapshots = Array.from({ length: 25 }, (_, index) =>
  chat.get((index + 1) * 2)
)

assert.equal(messages.length, 50)
assert.equal(historySnapshots.length, 25)
assert.equal(historySnapshots[0]?.length, 2)
assert.equal(historySnapshots.at(-1)?.length, 50)
assert.equal(messages.filter((message) => message.role === "user").length, 25)
assert.equal(
  messages.filter((message) => message.role === "assistant").length,
  25
)
assert.equal(
  getMessageText(messages[0]),
  en.demoConversation.script.scrollQuestion
)
assert.equal(chat.next([])?.id, messages[0].id)
assert.equal(chat.next(messages), null)

console.log("Demo conversation fixture checks passed")
