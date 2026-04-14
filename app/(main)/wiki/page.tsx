import { format } from "date-fns"
import Link from "next/link"
import { BookOpen, FileText } from "lucide-react"

import { getWikiPages } from "@/app/api/wiki/action"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"

function formatDateTime(value?: string) {
  if (!value) {
    return "N/A"
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm")
}

export default async function WikiPage() {
  const pages = await getWikiPages()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wiki Pages</CardTitle>
        <CardDescription>
          Browse all wiki pages currently available in the knowledge base.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        {pages.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookOpen />
              </EmptyMedia>
              <EmptyTitle>No wiki pages found</EmptyTitle>
              <EmptyDescription>
                There are no wiki pages matching the current criteria.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-4">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/wiki/${encodeURIComponent(page.slug)}`}
                className="block rounded-lg border p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-base font-semibold">{page.title}</div>
                    <div className="text-sm text-muted-foreground">/{page.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{page.pageType}</Badge>
                    <Badge variant={page.active ? "secondary" : "outline"}>
                      {page.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    Sources: {page.sourceCount}
                  </span>
                  <span>Updated: {formatDateTime(page.lastModifiedDate)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
