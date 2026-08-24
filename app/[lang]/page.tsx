import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { isDevAuthModeEnabled } from "@/app/lib/dev-auth-mode"
import { getDictionary, hasLocale } from "@/app/lib/i18n/dictionaries"
import { getLandingMetadataConfig } from "@/app/lib/public-landing/metadata-config"
import {
  buildLandingMetadata,
  type LandingMetadataInput,
} from "@/app/lib/public-landing/metadata-policy"

import { LandingPage } from "./landing-page"

type LandingPageProps = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const { lang } = await params

  if (!hasLocale(lang)) {
    return {}
  }

  const dictionary = await getDictionary(lang)
  const metadata = dictionary.landing.metadata
  const input: LandingMetadataInput = {
    locale: lang,
    title: metadata.title,
    description: metadata.description,
    socialImageAlt: metadata.socialImageAlt,
  }

  return buildLandingMetadata(input, getLandingMetadataConfig())
}

export default async function Page({ params }: LandingPageProps) {
  const { lang } = await params

  if (!hasLocale(lang)) {
    notFound()
  }

  const dictionary = await getDictionary(lang)
  const { isAuthenticated } = isDevAuthModeEnabled()
    ? { isAuthenticated: true }
    : await auth()

  return (
    <LandingPage
      dictionary={dictionary}
      locale={lang}
      isAuthenticated={Boolean(isAuthenticated)}
    />
  )
}
