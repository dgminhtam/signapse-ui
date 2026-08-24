import type { Metadata } from "next"

import type { AppLocale } from "@/app/lib/i18n/config"
import { withLocalePath } from "@/app/lib/i18n/routing"

export const APPROVED_INDEXABLE_ORIGIN = "https://signapse.cloud"

export type LandingMetadataConfig = {
  publicOrigin?: string
  indexable: boolean
}

export type LandingMetadataInput = {
  locale: AppLocale
  title: string
  description: string
  socialImageAlt: string
}

type LandingDeploymentPolicy = {
  origin: URL | null
  indexable: boolean
}

function parsePublicOrigin(value: string | undefined): URL | null {
  if (!value) return null

  try {
    const url = new URL(value)

    if (
      url.protocol !== "https:" ||
      !url.hostname ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    ) {
      return null
    }

    return new URL(url.origin)
  } catch {
    return null
  }
}

export function resolveLandingDeploymentPolicy(
  config: LandingMetadataConfig
): LandingDeploymentPolicy {
  const origin = parsePublicOrigin(config.publicOrigin)

  if (config.indexable && origin?.origin !== APPROVED_INDEXABLE_ORIGIN) {
    throw new Error(
      `Indexable landing metadata requires public origin ${APPROVED_INDEXABLE_ORIGIN}.`
    )
  }

  return {
    origin,
    indexable: config.indexable,
  }
}

function absoluteUrl(origin: URL, pathname: string): string {
  return new URL(pathname, origin).toString()
}

export function buildLandingMetadata(
  input: LandingMetadataInput,
  config: LandingMetadataConfig
): Metadata {
  const policy = resolveLandingDeploymentPolicy(config)
  const relativeSocialImagePath = `${withLocalePath("/opengraph-image", input.locale)}`
  const socialImageUrl = policy.origin
    ? absoluteUrl(policy.origin, relativeSocialImagePath)
    : relativeSocialImagePath
  const canonicalPath = withLocalePath("/", input.locale)

  const metadata: Metadata = {
    title: input.title,
    description: input.description,
    openGraph: {
      title: input.title,
      description: input.description,
      type: "website",
      siteName: "Signapse",
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: input.socialImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [socialImageUrl],
    },
  }

  if (!policy.indexable) {
    metadata.robots = { index: false, follow: true }
  }

  if (policy.origin) {
    const origin = policy.origin
    const canonical = absoluteUrl(origin, canonicalPath)
    const viUrl = absoluteUrl(origin, "/vi")
    const enUrl = absoluteUrl(origin, "/en")

    metadata.metadataBase = origin
    metadata.alternates = {
      canonical,
      languages: {
        vi: viUrl,
        en: enUrl,
        "x-default": absoluteUrl(origin, "/"),
      },
    }
    metadata.openGraph = {
      ...metadata.openGraph,
      url: canonical,
    }
  }

  return metadata
}
