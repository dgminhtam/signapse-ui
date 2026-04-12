import { format } from "date-fns"
import { ExternalLink, FileText, Newspaper } from "lucide-react"

import { WikiPageSourceRefResponse } from "@/app/lib/wiki/definitions"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface WikiSourceReferencesProps {
  sources: WikiPageSourceRefResponse[]
}

function formatPublishedAt(value: string) {
  return format(new Date(value), "dd/MM/yyyy HH:mm")
}

export function WikiSourceReferences({ sources }: WikiSourceReferencesProps) {
  const sortedSources = [...sources].sort(
    (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
  )

  if (sortedSources.length === 0) {
    return (
      <div className="rounded-lg border border-dashed">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No source references yet</EmptyTitle>
            <EmptyDescription>
              This wiki page does not have any linked source articles yet.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <>
      <div className="hidden rounded-md border border-border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-semibold text-foreground">Article</TableHead>
              <TableHead className="font-semibold text-foreground">Source</TableHead>
              <TableHead className="font-semibold text-foreground">Published Date</TableHead>
              <TableHead className="font-semibold text-foreground">Reference Note</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSources.map((source) => (
              <TableRow key={`${source.articleId}-${source.articleUrl}`} className="border-border hover:bg-muted/50">
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">{source.articleTitle}</span>
                    <span className="text-xs text-muted-foreground">Article ID: {source.articleId}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{source.sourceName}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {formatPublishedAt(source.publishedAt)}
                </TableCell>
                <TableCell className="max-w-sm text-sm text-muted-foreground">
                  {source.referenceNote || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <a href={source.articleUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" data-icon="inline-start" />
                      Open source
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {sortedSources.map((source) => (
          <div
            key={`${source.articleId}-${source.articleUrl}`}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">{source.articleTitle}</h3>
                <p className="text-sm text-muted-foreground">{source.sourceName}</p>
              </div>
              <Button asChild variant="ghost" size="icon-sm" className="shrink-0">
                <a href={source.articleUrl} target="_blank" rel="noopener noreferrer" aria-label="Open source">
                  <ExternalLink className="h-4 w-4" data-icon="inline-start" />
                </a>
              </Button>
            </div>

            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Newspaper className="h-4 w-4" />
                <span>Article ID: {source.articleId}</span>
              </div>
              <div className="text-muted-foreground">Published: {formatPublishedAt(source.publishedAt)}</div>
              {source.referenceNote ? (
                <p className="rounded-md bg-muted/50 p-3 text-foreground/80">{source.referenceNote}</p>
              ) : (
                <p className="rounded-md bg-muted/50 p-3 text-muted-foreground">No reference note</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
