"use client"

import { format } from "date-fns"
import { Clock3, Edit2, Eye, EyeOff, FileText, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteBlog } from "@/app/api/blogs/action"
import { BlogPostListResponse } from "@/app/lib/blogs/definitions"
import { Page } from "@/app/lib/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
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
import { useHasPermission } from "@/components/permission-provider"
import { SortSelect } from "@/components/sort-select"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { BlogSearch } from "./blog-search"

interface BlogListProps {
  blogPage: Page<BlogPostListResponse>
}

export function BlogListPage({ blogPage }: BlogListProps) {
  const blogs = blogPage.content
  const canCreateBlog = useHasPermission("blog:create")
  const canUpdateBlog = useHasPermission("blog:update")
  const canDeleteBlog = useHasPermission("blog:delete")

  return (
    <div className="w-full">
      <AppListToolbar>
        <AppListToolbarLeading>
          {canCreateBlog ? (
            <Button asChild>
              <Link href="/blogs/create">
                <Plus data-icon="inline-start" />
                Tạo bài viết
              </Link>
            </Button>
          ) : null}
          <BlogSearch />
        </AppListToolbarLeading>
        <AppListToolbarTrailing>
          <SortSelect
            className="w-full sm:w-auto"
            options={[
              { label: "Mới nhất", value: "publishedAt_desc" },
              { label: "Cũ hơn", value: "publishedAt_asc" },
              { label: "Tiêu đề A-Z", value: "title_asc" },
              { label: "Tiêu đề Z-A", value: "title_desc" },
            ]}
            triggerClassName="w-full sm:w-[200px]"
          />
          <AppSelectPageSize
            className="w-full sm:w-auto"
            defaultSize={blogPage.size}
            showLabel={false}
            triggerClassName="w-full sm:w-[120px]"
          />
        </AppListToolbarTrailing>
      </AppListToolbar>

      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[58%]">Tiêu đề</AppListTableHead>
              <AppListTableHead className="w-32 text-center">
                Hiển thị
              </AppListTableHead>
              <AppListTableHead className="w-40 text-center">
                Tạo lúc
              </AppListTableHead>
              <AppListTableHead className="w-28 text-center">
                Thao tác
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <TableRow
                  key={blog.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="align-top font-medium whitespace-normal text-foreground">
                    <div className="flex min-w-0 flex-col gap-1">
                      <Link
                        href={`/blogs/${blog.id}`}
                        className="line-clamp-1 break-words"
                      >
                        {blog.title}
                      </Link>
                      <span className="line-clamp-2 text-xs break-words text-muted-foreground">
                        {blog.shortDescription}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-32 text-center">
                    {blog.isVisible ? (
                      <Badge variant="default" className="gap-1">
                        <Eye />
                        Hiển thị
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <EyeOff />
                        Ẩn
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="w-40 text-center">
                    <AppTimeMetadata icon={Clock3}>
                      {blog.createdDate
                        ? format(new Date(blog.createdDate), "dd/MM/yyyy HH:mm")
                        : "-"}
                    </AppTimeMetadata>
                  </TableCell>
                  <TableCell className="w-28 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {canUpdateBlog ? (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground"
                          title="Chỉnh sửa bài viết"
                        >
                          <Link href={`/blogs/${blog.id}`}>
                            <Edit2 />
                            <span className="sr-only">Chỉnh sửa bài viết</span>
                          </Link>
                        </Button>
                      ) : null}
                      {canDeleteBlog ? <DeleteBlogButton id={blog.id} /> : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <AppListTableEmptyState colSpan={4}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có bài viết</EmptyTitle>
                  <EmptyDescription>
                    Tạo bài viết đầu tiên để bắt đầu xuất bản nội dung.
                  </EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>

      <AppPaginationControls page={blogPage} className="mt-4" />
    </div>
  )
}

function DeleteBlogButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteBlog(id)
      if (result.success) {
        toast.success("Đã xóa bài viết.")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Không thể xóa bài viết.")
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          title="Xóa bài viết"
        >
          <Trash2 />
          <span className="sr-only">Xóa bài viết</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Bài viết đã chọn sẽ bị xóa vĩnh
            viễn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {isPending ? "Đang xóa..." : "Xóa bài viết"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
