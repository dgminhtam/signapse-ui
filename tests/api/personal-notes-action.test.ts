import { beforeEach, describe, expect, it, vi } from "vitest"

const { testDictionary } = vi.hoisted(() => ({
  testDictionary: {
    personalNotes: {
      invalidContent: "Note content is invalid",
      createError: "Note create failed",
      updateError: "Note update failed",
      deleteError: "Note delete failed",
    },
  },
}))

vi.mock("@/app/api/auth/action", () => ({
  fetchAuthenticated: vi.fn(),
}))

vi.mock("@/app/lib/i18n/server", () => ({
  getServerDictionary: vi.fn(async () => testDictionary),
}))

import { fetchAuthenticated } from "@/app/api/auth/action"
import {
  createPersonalNote,
  deletePersonalNote,
  getPersonalNote,
  getPersonalNotes,
  updatePersonalNote,
} from "@/app/api/personal-notes/action"
import type { PersonalNoteMutationRequest } from "@/app/lib/personal-notes/definitions"

const noteContent: PersonalNoteMutationRequest["content"] = [
  { type: "p", children: [{ text: "Track gold" }] },
]

const noteRequest: PersonalNoteMutationRequest = {
  title: "Gold thesis",
  content: noteContent,
  contentSchemaVersion: 1,
}

const noteResponse = {
  id: 3,
  title: "Gold thesis",
  content: noteContent,
  contentSchemaVersion: 1,
  createdDate: "2026-07-29T00:00:00.000Z",
  lastModifiedDate: "2026-07-29T00:00:00.000Z",
}

describe("Personal Notes actions", () => {
  beforeEach(() => {
    vi.mocked(fetchAuthenticated).mockReset()
  })

  it("reads list/detail data with the shared query serializer", async () => {
    vi.mocked(fetchAuthenticated).mockResolvedValue(noteResponse)

    await getPersonalNotes({
      filter: "title eq 'Gold'",
      page: 1,
      size: 20,
      sort: [{ field: "lastModifiedDate", direction: "desc" }],
    })
    expect(fetchAuthenticated).toHaveBeenCalledWith(
      "/me/notes?%24filter=title+eq+%27Gold%27&page=1&size=20&sort=lastModifiedDate%2Cdesc"
    )

    await getPersonalNote(3)
    expect(fetchAuthenticated).toHaveBeenCalledWith("/me/notes/3")
  })

  it("creates, updates, and deletes valid notes", async () => {
    vi.mocked(fetchAuthenticated).mockResolvedValue(noteResponse)

    await expect(createPersonalNote(noteRequest)).resolves.toEqual({
      success: true,
      data: noteResponse,
    })
    expect(fetchAuthenticated).toHaveBeenCalledWith("/me/notes", {
      method: "POST",
      body: JSON.stringify(noteRequest),
    })

    await expect(updatePersonalNote(3, noteRequest)).resolves.toEqual({
      success: true,
      data: noteResponse,
    })
    expect(fetchAuthenticated).toHaveBeenCalledWith("/me/notes/3", {
      method: "PUT",
      body: JSON.stringify(noteRequest),
    })

    vi.mocked(fetchAuthenticated).mockResolvedValue(undefined)
    await expect(deletePersonalNote(3)).resolves.toEqual({
      success: true,
      data: undefined,
    })
    expect(fetchAuthenticated).toHaveBeenCalledWith("/me/notes/3", {
      method: "DELETE",
    })
  })

  it("rejects invalid content and returns action errors", async () => {
    const invalid = await createPersonalNote({
      ...noteRequest,
      content: [],
    })
    expect(invalid).toEqual({
      success: false,
      error: testDictionary.personalNotes.invalidContent,
    })
    expect(fetchAuthenticated).not.toHaveBeenCalled()

    vi.mocked(fetchAuthenticated).mockRejectedValue(
      new Error("Notes backend down")
    )
    await expect(updatePersonalNote(3, noteRequest)).resolves.toEqual({
      success: false,
      error: "Notes backend down",
    })
    await expect(deletePersonalNote(3)).resolves.toEqual({
      success: false,
      error: "Notes backend down",
    })
  })
})
