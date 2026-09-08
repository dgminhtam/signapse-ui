import { describe, expect, it } from "vitest"

import {
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
