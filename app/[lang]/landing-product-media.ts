import type { AppLocale } from "@/app/lib/i18n/config"

export type LandingProductFeature =
  "knowledge-graph" | "live-charts" | "ai-assistant" | "telegram"

export type LandingProductCaptureDescriptor = {
  feature: LandingProductFeature
  locale: AppLocale
  src: string
  width: number
  height: number
  sourceRef: string
  approvalStatus:
    "approved" | "awaiting-source" | "captured" | "awaiting-owner-approval"
}

export type ApprovedLandingProductCapture = LandingProductCaptureDescriptor & {
  approvalStatus: "approved"
}

/**
 * Only captures that have completed the public-data and Product Owner review
 * belong here. Missing entries intentionally keep their chapter text-first.
 */
export const APPROVED_LANDING_PRODUCT_CAPTURES: Record<
  AppLocale,
  Partial<Record<LandingProductFeature, LandingProductCaptureDescriptor>>
> = {
  vi: {},
  en: {},
}

export function getApprovedLandingProductCapture(
  locale: AppLocale,
  feature: LandingProductFeature,
  catalog = APPROVED_LANDING_PRODUCT_CAPTURES
): ApprovedLandingProductCapture | null {
  const capture = catalog[locale][feature]

  return isApprovedCapture(capture) ? capture : null
}

function isApprovedCapture(
  capture: LandingProductCaptureDescriptor | undefined
): capture is ApprovedLandingProductCapture {
  return capture?.approvalStatus === "approved"
}
