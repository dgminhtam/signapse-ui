"use client"

import { ArticleListResponse } from "@/app/lib/articles/definitions"
import { Page } from "@/app/lib/definitions"
import { AppPagination } from "@/components/app-pagination"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { Card } from "@/components/ui/card"
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

interface ArticleListProps {
  articlePage: Page<ArticleListResponse>
}

export function ArticleList({ articlePage }: ArticleListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    startTransition(async () => {
      try {
        await deleteArticle(id)
        toast.success("Article deleted successfully")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete article")
      } finally {
        setDeletingId(null)
      }
    })
  }

  if (articlePage.empty) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Newspaper />
            </EmptyMedia>
            <EmptyTitle>No articles found</EmptyTitle>
            <EmptyDescription>
              We couldn&apos;t find any articles matching your search criteria.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Article</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Published Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articlePage.content.map((article) => (
            <TableRow key={article.id}>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium line-clamp-1">
                    {article.title}
                  </span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {article.description}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{article.sourceName}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(article.publishedAt), "MMM dd, yyyy HH:mm")}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link href={`/articles/${article.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon-sm" asChild>
                     <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">External Link</span>
                     </a>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                            <Spinner size="sm" data-icon="inline-start" />
                          ) : (
                            <Trash2 className="h-4 w-4" data-icon="inline-start" />
                          )}
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-4 border-t">
        <div className="flex items-center gap-4">
          <AppSelectPageSize />
          <p className="text-sm text-muted-foreground">
            Total {articlePage.totalElements} articles
          </p>
        </div>
        <AppPagination totalPages={articlePage.totalPages} />
      </div>
    </Card>
  )
}
