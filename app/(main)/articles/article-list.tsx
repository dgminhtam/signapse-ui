"use client"

import { ArticleListResponse } from "@/app/lib/articles/definitions"
import { Page } from "@/app/lib/definitions"
import { AppPagination } from "@/components/app-pagination"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { useHasPermission } from "@/components/permission-provider"
import { SortSelect } from "@/components/sort-select"
import { ArticleSearch } from "./article-search"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  Eye,
  Trash2,
  Newspaper,
  Calendar,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { deleteArticle } from "@/app/api/articles/action"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { AnalyzeButton } from "./analyze-button"
import { IngestWikiButton } from "./ingest-wiki-button"

interface ArticleListProps {
  articlePage: Page<ArticleListResponse>
}

export function ArticleList({ articlePage }: ArticleListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const canDeleteArticle = useHasPermission("article:delete")

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteArticle(id)
      if (result.success) {
        toast.success("Article deleted successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete article")
      }
      setDeletingId(null)
    })
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          <ArticleSearch />
        </div>
        <div className="flex items-center gap-2">
          <SortSelect
            options={[
              { label: "Latest", value: "publishedAt_desc" },
              { label: "Oldest", value: "publishedAt_asc" },
              { label: "Title (A-Z)", value: "title_asc" },
              { label: "Title (Z-A)", value: "title_desc" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">Article</TableHead>
                <TableHead className="font-semibold text-foreground">Source</TableHead>
                <TableHead className="font-semibold text-foreground">Published Date</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articlePage.content.length > 0 ? (
                articlePage.content.map((article) => (
                  <TableRow key={article.id} className="border-border transition-colors hover:bg-muted/50">
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Link href={`/articles/${article.id}`} className="font-medium hover:underline line-clamp-1">
                          {article.title}
                        </Link>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {article.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{article.sourceName}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(article.publishedAt), "dd/MM/yyyy HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Link href={`/articles/${article.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <AnalyzeButton id={article.id} />
                        <IngestWikiButton articleId={article.id} />
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
                           <a href={article.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">External Link</span>
                           </a>
                        </Button>
                        {canDeleteArticle ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the article.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(article.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={isPending && deletingId === article.id}
                                >
                                  {isPending && deletingId === article.id ? (
                                    <Spinner className="size-4" />
                                  ) : (
                                    <>
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </>
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-24 text-center">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Newspaper className="h-12 w-12 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>No articles found</EmptyTitle>
                        <EmptyDescription>
                          We couldn&apos;t find any articles matching your search criteria.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="my-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AppSelectPageSize />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
             Page {articlePage.number + 1} of {articlePage.totalPages} ({articlePage.totalElements} total)
          </span>
        </div>
        <div className="flex gap-2">
          <AppPagination
            totalElements={articlePage.totalElements}
            itemsPerPage={articlePage.size}
          />
        </div>
      </div>
    </div>
  )
}
