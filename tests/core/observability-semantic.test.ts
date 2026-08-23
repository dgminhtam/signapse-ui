import { describe, expect, it } from "vitest"

import {
  normalizeBackendRoute,
  sanitizeObservabilityAttributes,
  summarizeValidationIssues,
} from "@/app/lib/observability/semantic"

describe("observability semantics", () => {
  it("normalizes backend routes without authority, query, fragment, or identifiers", () => {
    expect(
      normalizeBackendRoute(
        "https://user:secret@api.example.test/workspaces/42/assets/550e8400-e29b-41d4-a716-446655440000/candles?token=top-secret#payload"
      )
    ).toBe("/workspaces/:id/assets/:id/candles")
  })

  it("redacts identity-like path values", () => {
    expect(
      normalizeBackendRoute("/users/alice@example.test/messages/private")
    ).toBe("/users/:id/messages/:id")
    expect(
      normalizeBackendRoute("/conversations/secret-chat/prompts/system")
    ).toBe("/conversations/:id/prompts/:id")
    expect(normalizeBackendRoute("/blogs/user-controlled-slug")).toBe(
      "/blogs/:id"
    )
  })

  it("emits only approved primitive fields", () => {
    expect(
      sanitizeObservabilityAttributes({
        operation: "signapse.backend.request",
        outcome: "success",
        duration_ms: 12,
        authorization: "Bearer secret",
        user_id: "user_123",
        prompt: "buy now",
        payload: { secret: true },
        route: "/assets/:id",
        raw_url: "https://api.example.test/assets/123?token=secret",
      })
    ).toEqual({
      operation: "signapse.backend.request",
      outcome: "success",
      duration_ms: 12,
      route: "/assets/:id",
    })
  })

  it("bounds validation metadata and removes values and array indexes", () => {
    expect(
      summarizeValidationIssues(
        [
          { code: "invalid_type", path: ["items", 123, "price"] },
          { code: "too_small", path: ["prompt", "the private prompt"] },
          { code: "custom", path: ["authorization"] },
        ],
        2
      )
    ).toEqual({
      "validation.issue_count": 3,
      "validation.issue_codes": "invalid_type,too_small",
      "validation.issue_paths": "items.[].price,prompt.:field",
    })
  })
})
