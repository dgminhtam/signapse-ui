import { CreateBlogForm } from "./create-blog-form"
import { getServerDictionary } from "@/app/lib/i18n/server"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"

export default async function Page() {
  const permissions = await getCurrentPermissions()
  const dictionary = await getServerDictionary()

  if (!hasPermission(permissions, "blog:create")) {
    return (
      <AccessDenied
        description={dictionary.blogs.createDenied}
        permission="blog:create"
      />
    )
  }

  return <CreateBlogForm />
}
