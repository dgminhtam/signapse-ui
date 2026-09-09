import { describe, expect, it } from "vitest"

import {
  APPROVED_LANDING_PRODUCT_CAPTURES,
  getApprovedLandingProductCapture,
  type LandingProductCaptureDescriptor,
} from "@/app/[lang]/landing-product-media"

const approvedViCapture: LandingProductCaptureDescriptor = {
  feature: "knowledge-graph",
  locale: "vi",
  src: "/images/landing/vi/knowledge-graph.webp",
  width: 1600,
  height: 900,
  sourceRef: "fixture:approved-demo",
  approvalStatus: "approved",
}

describe("landing product media catalog", () => {
  it("keeps AI Assistant and Telegram intentionally text-only", () => {
    for (const locale of ["vi", "en"] as const) {
      expect(APPROVED_LANDING_PRODUCT_CAPTURES[locale]).not.toHaveProperty(
        "ai-assistant"
      )
      expect(APPROVED_LANDING_PRODUCT_CAPTURES[locale]).not.toHaveProperty(
        "telegram"
      )
    }
  })

  it("returns only an approved capture for the requested locale and feature", () => {
    const catalog = {
      vi: { "knowledge-graph": approvedViCapture },
      en: {},
    }

    expect(
      getApprovedLandingProductCapture("vi", "knowledge-graph", catalog)
    ).toEqual(approvedViCapture)
    expect(
      getApprovedLandingProductCapture("vi", "live-charts", catalog)
    ).toBeNull()
    expect(
      getApprovedLandingProductCapture("en", "knowledge-graph", catalog)
    ).toBeNull()
  })

  it("does not expose captures that are not approved", () => {
    const catalog = {
      vi: {
        "knowledge-graph": {
          ...approvedViCapture,
          approvalStatus: "awaiting-owner-approval" as const,
        },
      },
      en: {},
    }

    expect(
      getApprovedLandingProductCapture("vi", "knowledge-graph", catalog)
    ).toBeNull()
  })
})
