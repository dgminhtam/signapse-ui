import { redirect } from "next/navigation"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SourceDocumentsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const nextParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0) {
      nextParams.set(key, value)
      continue
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item.length > 0) {
          nextParams.append(key, item)
        }
      }
    }
  }

  const query = nextParams.toString()

  redirect(query ? `/news-articles?${query}` : "/news-articles")
}
