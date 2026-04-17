import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getSourceById } from "@/app/api/sources/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { SourceForm } from "../source-form"

interface EditSourcePageProps {
  params: Promise<{ id: string }>
}

export default async function EditSourcePage({ params }: EditSourcePageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "source:update")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Source</CardTitle>
          <CardDescription>
            Update source configuration and crawling behavior.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="You do not have permission to update sources."
            permission="source:update"
          />
        </CardContent>
      </Card>
    )
  }

  const { id } = await params
  const source = await getSourceById(Number(id))

  if (!source) {
    notFound()
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
          <CardTitle>Edit Source</CardTitle>
          <CardDescription>
            Update configuration for source: <span className="font-semibold text-foreground">{source.name}</span>
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <SourceForm initialData={source} />
        </CardContent>
      </Card>
    </div>
  )
}
