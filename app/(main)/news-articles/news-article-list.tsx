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
import {
  AppListTable,
  AppListTableEmptyState,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
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
    return "Chưa có"
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
              { label: "Mới nhất", value: "publishedAt_desc" },
              { label: "Cũ nhất", value: "publishedAt_asc" },
              { label: "Ngày tạo", value: "createdDate_desc" },
              { label: "Tiêu đề A-Z", value: "title_asc" },
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

      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead>Bài viết</AppListTableHead>
              <AppListTableHead>Nguồn tin</AppListTableHead>
              <AppListTableHead>Thời gian</AppListTableHead>
              <AppListTableHead>Trạng thái</AppListTableHead>
              <AppListTableHead className="text-right">Thao tác</AppListTableHead>
            </AppListTableHeaderRow>
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
                        {article.description?.trim() || "Chưa có mô tả ngắn."}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {article.newsOutletName?.trim() || "Chưa có nguồn tin"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDateTime(article.publishedAt)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Tạo lúc {formatDateTime(article.createdDate)}
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
                          <span className="sr-only">Xem chi tiết</span>
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
                          <span className="sr-only">Mở liên kết gốc</span>
                        </a>
                      </Button>
                      <NewsArticleDeleteButton id={article.id} title={article.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <AppListTableEmptyState colSpan={5}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Newspaper className="text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có bài viết tin tức</EmptyTitle>
                  <EmptyDescription>
                    Không có bài viết nào khớp với bộ lọc hiện tại.
                  </EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>

      <AppPaginationControls page={newsArticlePage} className="mt-4" />
    </div>
  )
}
