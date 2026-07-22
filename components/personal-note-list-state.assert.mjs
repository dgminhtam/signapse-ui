import assert from "node:assert/strict"

import { reconcileDeletedPersonalNote } from "./personal-note-list-state.ts"

const page = {
  content: [{ id: 1 }, { id: 2 }, { id: 3 }],
  empty: false,
  last: true,
  number: 0,
  numberOfElements: 3,
  size: 20,
  totalElements: 3,
  totalPages: 1,
}

const inactive = reconcileDeletedPersonalNote(page, 1, 2)
assert.deepEqual(inactive.page.content, [{ id: 2 }, { id: 3 }])
assert.equal(inactive.nextSelectedId, 2)
assert.equal(inactive.deletedSelected, false)

const selected = reconcileDeletedPersonalNote(page, 2, 2)
assert.deepEqual(selected.page.content, [{ id: 1 }, { id: 3 }])
assert.equal(selected.nextSelectedId, 3)
assert.equal(selected.deletedSelected, true)

const finalRecord = reconcileDeletedPersonalNote(
  { ...page, content: [{ id: 1 }], numberOfElements: 1, totalElements: 1 },
  1,
  1
)
assert.equal(finalRecord.page.empty, true)
assert.equal(finalRecord.page.totalPages, 0)
assert.equal(finalRecord.nextSelectedId, null)

console.log("personal-note delete reconciliation assertions passed")
