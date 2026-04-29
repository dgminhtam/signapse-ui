import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getBlogById } from "@/app/api/blogs/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { AppFormShellSkeleton } from "@/components/app-form-shell"
import { Skeleton } from "@/components/ui/skeleton"

import { UpdateBlogForm } from "./update-blog-form"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditBlogPage({ params }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "blog:update")) {
    return (
      <AccessDenied
        description="Bạn không có quyền chỉnh sửa bài viết."
        permission="blog:update"
      />
    )
  }

  const { id } = await params
  const blogId = Number(id)

  return (
    <Suspense fallback={<UpdateBlogSkeleton />}>
      <FetchBlogData id={blogId} />
    </Suspense>
  )
}

async function FetchBlogData({ id }: { id: number }) {
  const blog = await getBlogById(id)

  if (!blog) {
    notFound()
  }

  return <UpdateBlogForm blog={blog} />
}

function UpdateBlogSkeleton() {
  return (
    <AppFormShellSkeleton width="lg">
      <div className="flex flex-col gap-2 px-6 pt-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      <div className="flex flex-col gap-8 px-6 py-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-96 w-full" />
        </div>
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>

      <div className="flex justify-end gap-3 border-t bg-muted/20 px-6 py-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </AppFormShellSkeleton>
  )
}
