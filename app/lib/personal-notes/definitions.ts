import type { Value } from "platejs"
import { z } from "zod"

export const PERSONAL_NOTE_CONTENT_SCHEMA_VERSION = 1

export const personalNoteMutationSchema = z.object({
  content: z.custom<Value>(
    (value) =>
      Array.isArray(value) &&
      value.length > 0 &&
      value.every(
        (node) =>
          typeof node === "object" &&
          node !== null &&
          Array.isArray((node as { children?: unknown }).children)
      )
  ),
  contentSchemaVersion: z.literal(PERSONAL_NOTE_CONTENT_SCHEMA_VERSION),
})

export type PersonalNoteMutationRequest = z.infer<
  typeof personalNoteMutationSchema
>

export interface PersonalNoteSummaryResponse {
  id: number
  title?: string | null
  contentSchemaVersion: number
  createdDate: string
  lastModifiedDate: string
}

export interface PersonalNoteResponse extends PersonalNoteSummaryResponse {
  content: Value
}
