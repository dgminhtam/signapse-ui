import { CreateBlogForm } from "./create-blog-form"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default async function Page() {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "blog:create")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Blog Post</CardTitle>
          <CardDescription>
            Fill in the details below to add a new blog post to the system.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="You do not have permission to create blog posts."
            permission="blog:create"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Blog Post</CardTitle>
        <CardDescription>
          Fill in the details below to add a new blog post to the system.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <CreateBlogForm />
      </CardContent>
    </Card>
  )
}
