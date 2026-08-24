import "server-only"

import type { LandingMetadataConfig } from "./metadata-policy"

export function getLandingMetadataConfig(): LandingMetadataConfig {
  return {
    publicOrigin: process.env.SIGNAPSE_PUBLIC_ORIGIN,
    indexable: process.env.SIGNAPSE_LANDING_INDEXABLE === "true",
  }
}
