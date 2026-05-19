import { redirect } from "next/navigation"

import { hasLocale } from "@/app/lib/i18n/dictionaries"

interface WatchlistsPageProps {
  params: Promise<{ lang: string }>
}

export default async function WatchlistsPage({ params }: WatchlistsPageProps) {
  const { lang } = await params

  redirect(hasLocale(lang) ? `/${lang}` : "/vi")
}
