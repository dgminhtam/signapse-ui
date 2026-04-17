"use client"

import { format } from "date-fns"
import { Edit2, Eye, EyeOff, FileText, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteBlog } from "@/app/api/blogs/action"
import { BlogPostListResponse } from "@/app/lib/blogs/definitions"
import { Page } from "@/app/lib/definitions"
import { AppPagination } from "@/components/app-pagination"
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
import { Card } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          {canCreateBlog ? (
            <Button asChild>
              <Link href="/blogs/create">
                <Plus data-icon="inline-start" /> Create blog post
              </Link>
            </Button>
          ) : null}
          <BlogSearch />
        </div>
        <div className="flex items-center gap-2">
          <SortSelect
            options={[
              { label: "Newest", value: "publishedAt_desc" },
              { label: "Oldest", value: "publishedAt_asc" },
              { label: "Title (A-Z)", value: "title_asc" },
              { label: "Title (Z-A)", value: "title_desc" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Card className="overflow-hidden border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">Title</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Visibility</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Created</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Actions</TableHead>
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
                        <Badge variant="default" className="gap-1">
                          <Eye /> Visible
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <EyeOff /> Hidden
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {blog.createdDate
                        ? format(new Date(blog.createdDate), "dd/MM/yyyy HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {canUpdateBlog ? (
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
                        ) : null}
                        {canDeleteBlog ? <DeleteBlogButton id={blog.id} /> : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-12">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <FileText />
                        </EmptyMedia>
                        <EmptyTitle>No blog posts found</EmptyTitle>
                        <EmptyDescription>
                          Create your first blog post to start publishing content.
                        </EmptyDescription>
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
            Page {blogPage.number + 1} of {blogPage.totalPages} ({blogPage.totalElements} total)
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
      const result = await deleteBlog(id)
      if (result.success) {
        toast.success("Blog post deleted successfully")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete blog post")
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
          <AlertDialogTitle>Delete this blog post?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The selected blog post will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
