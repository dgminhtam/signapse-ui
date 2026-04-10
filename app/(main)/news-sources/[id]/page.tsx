import { getNewsSourceById } from "@/app/api/news-sources/action"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewsSourceForm } from "../news-source-form"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditNewsSourcePageProps {
  params: Promise<{ id: string }>
}

export default async function EditNewsSourcePage({ params }: EditNewsSourcePageProps) {
  const { id } = await params
  const newsSource = await getNewsSourceById(Number(id))

  if (!newsSource) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/news-sources">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit News Source</CardTitle>
          <CardDescription>
            Update configuration for news source: <span className="font-semibold text-foreground">{newsSource.name}</span>
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <NewsSourceForm initialData={newsSource} />
        </CardContent>
      </Card>
    </div>
  )
}
