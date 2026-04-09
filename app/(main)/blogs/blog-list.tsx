"use client"

import { BlogPostListResponse } from "@/app/lib/blogs/definitions"
import { Page } from "@/app/lib/definitions"
import { AppPagination } from "@/components/app-pagination"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { SortSelect } from "@/components/sort-select"
import { BlogSearch } from "./blog-search"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Edit2, Eye, EyeOff, Plus, Trash2, FileText } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { deleteBlog } from "@/app/api/blogs/action"
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

interface BlogListProps {
  blogPage: Page<BlogPostListResponse>
}

export function BlogListPage({ blogPage }: BlogListProps) {
  const blogs = blogPage.content

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full sm:w-auto flex-1 items-center gap-4">
          <Button asChild>
            <Link href="/blogs/create">
              <Plus data-icon="inline-start" /> Tạo bài viết mới
            </Link>
          </Button>
          <BlogSearch />
        </div>
        <div className="flex items-center gap-2">
          <SortSelect
            options={[
              { label: "Mới nhất", value: "publishedAt_desc" },
              { label: "Cũ nhất", value: "publishedAt_asc" },
              { label: "Tiêu đề (A-Z)", value: "title_asc" },
              { label: "Tiêu đề (Z-A)", value: "title_desc" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Card className="overflow-hidden border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">
                  Tiêu đề
                </TableHead>
                <TableHead className="text-center font-semibold text-foreground">
                  Trạng thái
                </TableHead>
                <TableHead className="text-center font-semibold text-foreground">
                  Ngày tạo
                </TableHead>
                <TableHead className="text-center font-semibold text-foreground">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <TableRow
                    key={blog.id}
                    className="border-border transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium text-foreground">
                      <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                      <br />
                      <span className="block max-w-[300px] truncate text-xs text-muted-foreground">
                        {blog.shortDescription}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {blog.isVisible ? (
                        <Badge
                          variant="default"
                          className="gap-1"
                        >
                          <Eye /> Hiển thị
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="gap-1"
                        >
                          <EyeOff /> Ẩn
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {blog.createdDate &&
                        format(new Date(blog.createdDate), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Link href={`/blogs/${blog.id}`}>
                            <Edit2 />
                          </Link>
                        </Button>
                        <DeleteBlogButton id={blog.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-12"
                  >
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon"><FileText /></EmptyMedia>
                        <EmptyTitle>Chưa có bài viết nào</EmptyTitle>
                        <EmptyDescription>Hãy tạo bài viết đầu tiên để có nội dung hiển thị.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="my-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AppSelectPageSize />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Trang {blogPage.number + 1} trên {blogPage.totalPages} (
            {blogPage.totalElements} tổng)
          </span>
        </div>
        <div className="flex gap-2">
          <AppPagination
            totalElements={blogPage.totalElements}
            itemsPerPage={blogPage.size}
          />
        </div>
      </div>
    </div>
  )
}

function DeleteBlogButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteBlog(id)
        toast.success("Xóa bài viết thành công")
        setOpen(false)
        router.refresh()
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa bài viết")
        console.error(error)
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
          title="Delete"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi
            hệ thống.
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
            {isPending ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
