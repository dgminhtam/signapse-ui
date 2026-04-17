import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { SourceForm } from "../source-form"

export default async function CreateSourcePage() {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "source:create")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add Source</CardTitle>
          <CardDescription>
            Configure a new RSS feed or website to collect articles from.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="You do not have permission to create a source."
            permission="source:create"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/sources">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Source</CardTitle>
          <CardDescription>
            Configure a new RSS feed or website to collect articles from.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <SourceForm />
        </CardContent>
      </Card>
    </div>
  )
}
