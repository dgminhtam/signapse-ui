import { redirect } from "next/navigation"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SourceDocumentDetailPage({ params }: PageProps) {
  const { id } = await params

  redirect(`/news-articles/${id}`)
}
