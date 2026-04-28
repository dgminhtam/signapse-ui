import { CreateBlogForm } from "./create-blog-form"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"

export default async function Page() {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "blog:create")) {
    return (
      <AccessDenied
        description="Bạn không có quyền tạo bài viết."
        permission="blog:create"
      />
    )
  }

  return <CreateBlogForm />
}
