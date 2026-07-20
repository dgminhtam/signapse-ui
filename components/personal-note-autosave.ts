import type { ActionResult } from "@/app/lib/definitions"
import type { PersonalNoteResponse } from "@/app/lib/personal-notes/definitions"
import type { Value } from "platejs"

export type PersonalNoteSaveStatus =
  | "idle"
  | "dirty"
  | "saving"
  | "saved"
  | "error"

interface PersonalNoteAutosaveOptions {
  noteId: number | null
  onSaved: (note: PersonalNoteResponse) => void
  onStatusChange: (status: PersonalNoteSaveStatus, error?: string) => void
  persist: (
    noteId: number | null,
    content: Value
  ) => Promise<ActionResult<PersonalNoteResponse>>
}

export function createPersonalNoteAutosave({
  noteId: initialNoteId,
  onSaved,
  onStatusChange,
  persist,
}: PersonalNoteAutosaveOptions) {
  let noteId = initialNoteId
  let revision = 0
  let savedRevision = 0
  let latestContent: Value | null = null
  let drainPromise: Promise<boolean> | null = null

  async function drain() {
    while (latestContent && savedRevision < revision) {
      const targetRevision = revision
      const targetContent = latestContent
      onStatusChange("saving")

      let result: ActionResult<PersonalNoteResponse>
      try {
        result = await persist(noteId, targetContent)
      } catch {
        onStatusChange("error")
        return false
      }

      if (!result.success) {
        onStatusChange("error", result.error)
        return false
      }

      noteId = result.data.id
      savedRevision = targetRevision
      onSaved(result.data)
    }

    onStatusChange("saved")
    return true
  }

  return {
    change(content: Value) {
      latestContent = content
      revision += 1
      if (!drainPromise) {
        onStatusChange("dirty")
      }
    },
    flush() {
      if (savedRevision === revision) {
        return Promise.resolve(true)
      }

      if (!drainPromise) {
        drainPromise = drain().finally(() => {
          drainPromise = null
        })
      }

      return drainPromise
    },
    hasDirtyChanges() {
      return savedRevision < revision
    },
  }
}
