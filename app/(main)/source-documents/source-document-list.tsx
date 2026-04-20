"use client"

import { format } from "date-fns"
import {
  Calendar,
  Eye,
  ExternalLink,
  Newspaper,
} from "lucide-react"
import Link from "next/link"

import { Page } from "@/app/lib/definitions"
import {
  SOURCE_DOCUMENT_LIFECYCLE_LABELS,
  SOURCE_DOCUMENT_READINESS_STATUS_LABELS,
  SOURCE_DOCUMENT_TYPE_LABELS,
  SourceDocumentLifecycleStatus,
  SourceDocumentListResponse,
  SourceDocumentReadinessStatus,
} from "@/app/lib/source-documents/definitions"
import { AppPaginationControls } from "@/components/app-pagination-controls"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { SourceDocumentAnalyzeButton } from "./source-document-analyze-button"
import { SourceDocumentDeleteButton } from "./source-document-delete-button"
import { SourceDocumentDerivePendingEventsButton } from "./source-document-derive-pending-events-button"
import {
  getSourceDocumentEventDerivationLabel,
  getSourceDocumentEventDerivationVariant,
} from "./source-document-event-derivation"
import { SourceDocumentSearch } from "./source-document-search"
import { SourceDocumentTypeFilter } from "./source-document-type-filter"

interface SourceDocumentListProps {
  sourceDocumentPage: Page<SourceDocumentListResponse>
}

function formatDateTime(value?: string) {
  if (!value) {
    return "Chưa có"
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm")
}

function getLifecycleVariant(
  status: SourceDocumentLifecycleStatus
): "outline" | "secondary" | "destructive" {
  if (status === "FAILED") {
    return "destructive"
  }

  if (status === "NORMALIZED") {
    return "secondary"
  }

  return "outline"
}

function getReadinessVariant(
  status: SourceDocumentReadinessStatus
): "outline" | "secondary" | "destructive" {
  if (status === "FAILED") {
    return "destructive"
  }

  if (status === "READY") {
    return "secondary"
  }

  return "outline"
}

export function SourceDocumentList({
  sourceDocumentPage,
}: SourceDocumentListProps) {
  const documents = sourceDocumentPage.content

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          <SourceDocumentDerivePendingEventsButton />
          <SourceDocumentSearch />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SourceDocumentTypeFilter />
          <SortSelect
            options={[
              { label: "Mới nhất", value: "publishedAt_desc" },
              { label: "Cũ nhất", value: "publishedAt_asc" },
              { label: "Ngày tạo", value: "createdDate_desc" },
              { label: "Tiêu đề A-Z", value: "title_asc" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">
                  Tài liệu
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Loại
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Thời gian
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Trạng thái
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length > 0 ? (
                documents.map((document) => (
                  <TableRow
                    key={document.id}
                    className="border-border transition-colors hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Link
                          href={`/source-documents/${document.id}`}
                          className="line-clamp-1 font-medium hover:underline"
                        >
                          {document.title}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {document.sourceName}
                        </span>
                        <span className="line-clamp-2 text-xs text-muted-foreground">
                          {document.description?.trim() || "Chưa có mô tả ngắn."}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {SOURCE_DOCUMENT_TYPE_LABELS[document.documentType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDateTime(document.publishedAt)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Tạo lúc {formatDateTime(document.createdDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Badge variant={getLifecycleVariant(document.lifecycleStatus)}>
                          {SOURCE_DOCUMENT_LIFECYCLE_LABELS[document.lifecycleStatus]}
                        </Badge>
                        <Badge variant={getReadinessVariant(document.readinessStatus)}>
                          {SOURCE_DOCUMENT_READINESS_STATUS_LABELS[document.readinessStatus]}
                        </Badge>
                        <Badge
                          variant={getSourceDocumentEventDerivationVariant(
                            document.eventDerivationStatus
                          )}
                        >
                          {getSourceDocumentEventDerivationLabel(
                            document.eventDerivationStatus
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          asChild
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Link href={`/source-documents/${document.id}`}>
                            <Eye className="h-4 w-4" data-icon="inline-start" />
                            <span className="sr-only">Xem chi tiết</span>
                          </Link>
                        </Button>
                        <SourceDocumentAnalyzeButton id={document.id} />
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          asChild
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <a
                            href={document.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" data-icon="inline-start" />
                            <span className="sr-only">Mở liên kết gốc</span>
                          </a>
                        </Button>
                        <SourceDocumentDeleteButton
                          id={document.id}
                          title={document.title}
                        />
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
                          <Newspaper className="h-12 w-12 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>Chưa có tài liệu nguồn</EmptyTitle>
                        <EmptyDescription>
                          Không có tài liệu nào khớp với bộ lọc hiện tại.
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

      <AppPaginationControls page={sourceDocumentPage} className="mt-4" />
    </div>
  )
}
