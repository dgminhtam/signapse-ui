import { beforeEach, describe, expect, it, vi } from "vitest"

const { testDictionary } = vi.hoisted(() => ({
  testDictionary: {
    feedback: {
      submitError: "Submit failed",
      withdrawError: "Withdraw failed",
      reviewError: "Review failed",
      eraseError: "Delete failed",
    },
  },
}))

vi.mock("@/app/api/auth/action", () => ({
  fetchAuthenticated: vi.fn(),
}))
vi.mock("@/app/lib/i18n/server", () => ({
  getServerDictionary: vi.fn(async () => testDictionary),
}))
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

import { fetchAuthenticated } from "@/app/api/auth/action"
import { revalidatePath } from "next/cache"
import {
  createFeedbackSubmission,
  deleteFeedback,
  dismissFeedback,
  getModerationFeedback,
  getPersonalFeedback,
  promoteFeedback,
  withdrawFeedback,
} from "@/app/api/feedback/action"

const listItem = {
  id: 42,
  type: "BUG" as const,
  title: "Chart does not refresh",
  status: "PENDING_REVIEW" as const,
  createdDate: "2026-08-25T09:00:00.000Z",
  lastModifiedDate: "2026-08-25T09:05:00.000Z",
  screenshot: null,
}

const page = {
  content: [listItem],
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    offset: 0,
    paged: true,
    unpaged: false,
  },
  last: true,
  totalElements: 1,
  totalPages: 1,
  size: 10,
  number: 0,
  first: true,
  numberOfElements: 1,
  empty: false,
}

const detail = {
  ...listItem,
  description: "The chart stays stale after changing the selected asset.",
  expectedOutcome: "The chart should refresh with the newly selected asset.",
  reproductionSteps: "1. Open the chart.",
  clientContext: null,
  reviewMessage: null,
  reporter: null,
}

describe("Feedback authenticated actions", () => {
  beforeEach(() => {
    vi.mocked(fetchAuthenticated).mockReset()
    vi.mocked(revalidatePath).mockReset()
  })

  it("serializes personal and moderation reads with the accepted query contract", async () => {
    vi.mocked(fetchAuthenticated).mockResolvedValue(page)

    await getPersonalFeedback({ page: 2, size: 10 })
    expect(fetchAuthenticated).toHaveBeenCalledWith(
      "/me/feedback-submissions?page=1&size=10&sort=createdDate%2Cdesc&sort=id%2Cdesc"
    )

    await getModerationFeedback({
      search: "chart",
      type: "BUG",
      status: "PENDING_REVIEW",
      sort: "createdDate_desc",
      page: 2,
      size: 20,
    })
    expect(fetchAuthenticated).toHaveBeenLastCalledWith(
      "/feedback-submissions?%24filter=containsIgnoreCase%28title%2C%27chart%27%29+and+type+eq+BUG+and+status+eq+PENDING_REVIEW&page=1&size=20&sort=createdDate%2Cdesc&sort=id%2Cdesc"
    )
  })

  it("sends multipart create with a JSON submission part and one image", async () => {
    vi.mocked(fetchAuthenticated).mockResolvedValue(detail)
    const formData = new FormData()
    formData.append(
      "submission",
      JSON.stringify({
        type: "BUG",
        title: "Chart does not refresh",
        description: "The chart stays stale after changing the selected asset.",
        expectedOutcome: "The chart should refresh with the selected asset.",
        reproductionSteps: "1. Change the asset.",
        clientContext: { pagePath: "/en/dashboard" },
      })
    )
    formData.append(
      "screenshot",
      new File([new Uint8Array([1, 2, 3])], "chart.png", {
        type: "image/png",
      })
    )

    await expect(createFeedbackSubmission(formData)).resolves.toMatchObject({
      success: true,
      data: detail,
    })
    const [, options] = vi.mocked(fetchAuthenticated).mock.calls[0] as [
      string,
      RequestInit,
    ]
    expect(options.method).toBe("POST")
    expect(options.body).toBeInstanceOf(FormData)
    const body = options.body as FormData
    expect(body.get("screenshot")).toBeInstanceOf(File)
    expect(JSON.parse(await (body.get("submission") as Blob).text())).toEqual(
      expect.objectContaining({ type: "BUG" })
    )
    expect(revalidatePath).toHaveBeenCalledWith("/feedback")
  })

  it("keeps Promote and Dismiss request bodies distinct", async () => {
    vi.mocked(fetchAuthenticated).mockResolvedValue(detail)

    await promoteFeedback(42, {
      reviewMessage: "Issue was created for engineering.",
      githubIssueUrl: "https://github.com/signapse/signapse/issues/123",
    })
    expect(fetchAuthenticated).toHaveBeenLastCalledWith(
      "/feedback-submissions/42/promote",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          reviewMessage: "Issue was created for engineering.",
          githubIssueUrl: "https://github.com/signapse/signapse/issues/123",
        }),
      })
    )

    await dismissFeedback(42, {
      reviewMessage: "This does not fit the current product scope.",
    })
    expect(fetchAuthenticated).toHaveBeenLastCalledWith(
      "/feedback-submissions/42/dismiss",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          reviewMessage: "This does not fit the current product scope.",
        }),
      })
    )
  })

  it("handles 204 deletion and preserves stable lifecycle codes without backend copy", async () => {
    vi.mocked(fetchAuthenticated).mockResolvedValue(null)
    await expect(withdrawFeedback(42)).resolves.toEqual({
      success: true,
      data: undefined,
    })
    await expect(deleteFeedback(42)).resolves.toEqual({
      success: true,
      data: undefined,
    })

    const conflict = Object.assign(new Error("raw backend message"), {
      status: 409,
      code: "FEEDBACK_ALREADY_REVIEWED",
    })
    vi.mocked(fetchAuthenticated).mockRejectedValue(conflict)
    await expect(
      promoteFeedback(42, {
        reviewMessage: "Issue was created for engineering.",
        githubIssueUrl: "https://github.com/signapse/signapse/issues/123",
      })
    ).resolves.toEqual({
      success: false,
      error: "Review failed",
      status: 409,
      code: "FEEDBACK_ALREADY_REVIEWED",
      kind: "lifecycle-conflict",
    })
  })
})
