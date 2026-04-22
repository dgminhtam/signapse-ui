import { redirect } from "next/navigation"

interface LegacyEditSourcePageProps {
  params: Promise<{ id: string }>
}

export default async function LegacyEditSourcePage({
  params,
}: LegacyEditSourcePageProps) {
  const { id } = await params
  redirect(`/news-outlets/${id}`)
}
