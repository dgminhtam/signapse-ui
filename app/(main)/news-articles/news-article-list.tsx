"use client"

import { format } from "date-fns"
import { Calendar, Eye, ExternalLink, Newspaper } from "lucide-react"
import Link from "next/link"

import { Page } from "@/app/lib/definitions"
import {
  NewsArticleListResponse,
  NEWS_ARTICLE_STATUS_LABELS,
  getNewsArticleStatusVariant,
} from "@/app/lib/news-articles/definitions"
import { AppPaginationControls } from "@/components/app-pagination-controls"
import {
  AppListToolbar,
  AppListToolbarLeading,
  AppListToolbarTrailing,
} from "@/components/app-list-toolbar"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SortSelect } from "@/components/sort-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { NewsArticleAnalyzeButton } from "./news-article-analyze-button"
import { NewsArticleDeleteButton } from "./news-article-delete-button"
import { NewsArticleDerivePendingEventsButton } from "./news-article-derive-pending-events-button"
import { NewsArticleSearch } from "./news-article-search"

interface NewsArticleListProps {
  newsArticlePage: Page<NewsArticleListResponse>
}

function formatDateTime(value?: string) {
  if (!value) {
    return "Chua co"
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm")
}

export function NewsArticleList({ newsArticlePage }: NewsArticleListProps) {
  const articles = newsArticlePage.content ?? []

  return (
    <div className="w-full">
      <AppListToolbar>
        <AppListToolbarLeading>
          <NewsArticleDerivePendingEventsButton />
          <NewsArticleSearch />
        </AppListToolbarLeading>
        <AppListToolbarTrailing>
          <SortSelect
            className="w-full sm:w-auto"
            options={[
              { label: "Moi nhat", value: "publishedAt_desc" },
              { label: "Cu nhat", value: "publishedAt_asc" },
              { label: "Ngay tao", value: "createdDate_desc" },
              { label: "Tieu de A-Z", value: "title_asc" },
            ]}
            triggerClassName="w-full sm:w-[200px]"
          />
          <AppSelectPageSize
            className="w-full sm:w-auto"
            defaultSize={newsArticlePage.size}
            showLabel={false}
            triggerClassName="w-full sm:w-[120px]"
          />
        </AppListToolbarTrailing>
      </AppListToolbar>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-semibold text-foreground">Bai viet</TableHead>
              <TableHead className="font-semibold text-foreground">Nguon tin</TableHead>
              <TableHead className="font-semibold text-foreground">Thoi gian</TableHead>
              <TableHead className="font-semibold text-foreground">Trang thai</TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Thao tac
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length > 0 ? (
              articles.map((article) => (
                <TableRow
                  key={article.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/news-articles/${article.id}`}
                        className="line-clamp-1 font-medium hover:underline"
                      >
                        {article.title}
                      </Link>
                      <span className="line-clamp-2 text-xs text-muted-foreground">
                        {article.description?.trim() || "Chua co mo ta ngan."}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {article.newsOutletName?.trim() || "Chua co nguon tin"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDateTime(article.publishedAt)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Tao luc {formatDateTime(article.createdDate)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getNewsArticleStatusVariant(article.status)}>
                      {NEWS_ARTICLE_STATUS_LABELS[article.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Link href={`/news-articles/${article.id}`}>
                          <Eye data-icon="inline-start" />
                          <span className="sr-only">Xem chi tiet</span>
                        </Link>
                      </Button>
                      <NewsArticleAnalyzeButton id={article.id} />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink data-icon="inline-start" />
                          <span className="sr-only">Mo lien ket goc</span>
                        </a>
                      </Button>
                      <NewsArticleDeleteButton id={article.id} title={article.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-24 text-center">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Newspaper className="text-muted-foreground" />
                      </EmptyMedia>
                      <EmptyTitle>Chua co bai viet tin tuc</EmptyTitle>
                      <EmptyDescription>
                        Khong co bai viet nao khop voi bo loc hien tai.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AppPaginationControls page={newsArticlePage} className="mt-4" />
    </div>
  )
}
