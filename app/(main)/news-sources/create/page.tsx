import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewsSourceForm } from "../news-source-form"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateNewsSourcePage() {
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
          <CardTitle>Add News Source</CardTitle>
          <CardDescription>
            Configure a new RSS feed or website to collect news articles from.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <NewsSourceForm />
        </CardContent>
      </Card>
    </div>
  )
}
