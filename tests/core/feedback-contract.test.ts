import { afterEach, describe, expect, it, vi } from "vitest"

import {
  feedbackDetailResponseSchema,
  feedbackListResponseSchema,
  feedbackPageResponseSchema,
  feedbackSubmissionSchema,
} from "@/app/lib/feedback/definitions"
import { mapFeedbackDetail, mapFeedbackListItem } from "@/app/lib/feedback/mappers"
import { normalizeFeedbackError } from "@/app/lib/feedback/errors"
import { validateFeedbackScreenshot } from "@/app/lib/feedback/validation"
import {
  parseFeedbackModerationQuery,
  serializeFeedbackModerationQuery,
} from "@/app/lib/feedback/query"

const listItem = {
  id: 42,
  type: "BUG" as const,
  title: "Chart does not refresh",
  status: "PENDING_REVIEW" as const,
  createdDate: "2026-08-25T09:00:00.000Z",
  lastModifiedDate: "2026-08-25T09:05:00.000Z",
  screenshot: {
    id: 9,
    mimeType: "image/png" as const,
    size: 1024,
  },
}

describe("feedback runtime contract", () => {
  it("accepts additive fields in list, detail, and page responses", () => {
    const list = feedbackListResponseSchema.safeParse({
      ...listItem,
      futureField: "kept for forward compatibility",
    })
    const detail = feedbackDetailResponseSchema.safeParse({
      ...listItem,
      description: "The chart stays stale after changing the selected asset.",
      expectedOutcome: "The chart should refresh with the newly selected asset.",
      reproductionSteps: "1. Open the chart.\n2. Change the asset.",
      clientContext: {
        pagePath: "/en/dashboard",
        appVersion: "1.2.3",
        browserName: "Chrome",
        browserVersion: "128",
        osName: "Windows",
        osVersion: "11",
        locale: "en",
        observedTime: "2026-08-25T09:04:00.000Z",
      },
      reviewMessage: null,
      reporter: null,
      futureField: true,
    })
    const page = feedbackPageResponseSchema.safeParse({
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
      futurePageField: "allowed",
    })

    expect(list.success).toBe(true)
    expect(detail.success).toBe(true)
    expect(page.success).toBe(true)
  })

  it("rejects malformed core response fields", () => {
    expect(
      feedbackListResponseSchema.safeParse({
        ...listItem,
        id: "42",
      }).success
    ).toBe(false)
    expect(
      feedbackListResponseSchema.safeParse({
        ...listItem,
        status: "UNKNOWN",
      }).success
    ).toBe(false)
  })

  it("enforces BUG-only reproduction and observed time fields", () => {
    const common = {
      title: "A valid feedback title",
      description: "This description is long enough for the contract.",
      expectedOutcome: "The expected outcome is explicit and actionable.",
    }

    expect(
      feedbackSubmissionSchema.safeParse({
        ...common,
        type: "BUG",
        reproductionSteps: "1. Reproduce the issue.",
        clientContext: { observedTime: "2026-08-25T09:04:00.000Z" },
      }).success
    ).toBe(true)
    expect(
      feedbackSubmissionSchema.safeParse({
        ...common,
        type: "IDEA",
        reproductionSteps: "This is not valid for an idea.",
      }).success
    ).toBe(false)
    expect(
      feedbackSubmissionSchema.safeParse({
        ...common,
        type: "IDEA",
        clientContext: { observedTime: "2026-08-25T09:04:00.000Z" },
      }).success
    ).toBe(false)
  })
})

describe("feedback query contract", () => {
  it("normalizes moderation filters and clamps unsupported pagination", () => {
    expect(
      parseFeedbackModerationQuery({
        search: "  chart  ",
        type: "BUG",
        status: "PROMOTED",
        sort: "createdDate_asc",
        page: "3",
        size: "50",
      })
    ).toEqual({
      search: "chart",
      type: "BUG",
      status: "PROMOTED",
      sort: "createdDate_asc",
      page: 3,
      size: 50,
    })

    expect(
      parseFeedbackModerationQuery({ page: "0", size: "25", status: "invalid" })
    ).toMatchObject({
      page: 1,
      size: 10,
      status: "PENDING_REVIEW",
    })
  })

  it("serializes OData filters, zero-based pages, and repeated sort params", () => {
    const serialized = serializeFeedbackModerationQuery({
      search: "O'Reilly",
      type: "BUG",
      status: "PENDING_REVIEW",
      sort: "createdDate_desc",
      page: 2,
      size: 20,
    })
    const params = new URLSearchParams(serialized)

    expect(params.get("$filter")).toBe(
      "containsIgnoreCase(title,'O''Reilly') and type eq BUG and status eq PENDING_REVIEW"
    )
    expect(params.get("page")).toBe("1")
    expect(params.get("size")).toBe("20")
    expect(params.getAll("sort")).toEqual(["createdDate,desc", "id,desc"])
  })
})

describe("feedback response mappers", () => {
  it("maps backend numeric IDs and context names into UI view models", () => {
    expect(mapFeedbackListItem(listItem)).toMatchObject({
      id: "42",
      createdAt: listItem.createdDate,
      updatedAt: listItem.lastModifiedDate,
      screenshot: { id: 9, mimeType: "image/png" },
    })

    const mapped = mapFeedbackDetail({
      ...listItem,
      description: "The chart stays stale after changing the selected asset.",
      expectedOutcome: "The chart should refresh with the newly selected asset.",
      reproductionSteps: null,
      clientContext: {
        pagePath: "/en/dashboard",
        observedTime: "2026-08-25T09:04:00.000Z",
      },
      reviewMessage: "Queued for implementation.",
      githubIssueNumber: 123,
      reporter: {
        id: 7,
        email: "reporter@example.com",
        firstName: "Ada",
        lastName: "Lovelace",
        active: true,
      },
    })

    expect(mapped).toMatchObject({
      id: "42",
      clientContext: {
        pagePath: "/en/dashboard",
        observedAt: "2026-08-25T09:04:00.000Z",
      },
      githubIssueNumber: 123,
      sender: { id: "7", displayName: "Ada Lovelace" },
    })
  })
})

describe("feedback error normalization", () => {
  it.each([
    [400, undefined, "validation"],
    [401, undefined, "unauthenticated"],
    [403, undefined, "forbidden"],
    [404, undefined, "missing"],
    [413, undefined, "payload-too-large"],
    [502, undefined, "upstream"],
    [500, undefined, "server"],
  ] as const)("maps HTTP %s to %s", (status, code, kind) => {
    expect(normalizeFeedbackError({ status, code }, "Try again")).toMatchObject({
      status,
      kind,
      message: "Try again",
    })
  })

  it("recognizes lifecycle codes without exposing backend copy", () => {
    expect(
      normalizeFeedbackError(
        {
          status: 409,
          code: "FEEDBACK_ALREADY_REVIEWED",
        },
        "The feedback changed."
      )
    ).toEqual({
      status: 409,
      code: "FEEDBACK_ALREADY_REVIEWED",
      kind: "lifecycle-conflict",
      message: "The feedback changed.",
    })
    expect(
      normalizeFeedbackError({ name: "AbortError" }, "Timed out")
    ).toMatchObject({ kind: "timeout", message: "Timed out" })
    expect(
      normalizeFeedbackError({ status: undefined }, "Offline")
    ).toMatchObject({ kind: "network", message: "Offline" })
  })
})

describe("feedback screenshot input constraints", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("rejects unsupported MIME and byte overflow before decoding", async () => {
    const messages = {
      unsupported: "Unsupported",
      tooLarge: "Too large",
      dimensionsTooLarge: "Too many pixels",
    }
    expect(
      await validateFeedbackScreenshot(
        new File(["x"], "capture.webp", { type: "image/webp" }),
        messages
      )
    ).toBe("Unsupported")
    expect(
      await validateFeedbackScreenshot(
        new File([new Uint8Array(5 * 1024 * 1024 + 1)], "capture.png", {
          type: "image/png",
        }),
        messages
      )
    ).toBe("Too large")
  })

  it("rejects decoded dimensions above the 25 megapixel limit", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => ({ width: 5000, height: 5001, close: vi.fn() }))
    )
    expect(
      await validateFeedbackScreenshot(
        new File(["image"], "capture.png", { type: "image/png" }),
        {
          unsupported: "Unsupported",
          tooLarge: "Too large",
          dimensionsTooLarge: "Too many pixels",
        }
      )
    ).toBe("Too many pixels")
  })
})
