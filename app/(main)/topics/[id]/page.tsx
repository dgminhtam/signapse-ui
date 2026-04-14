import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { getTopicById } from "@/app/api/topics/action"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { TopicForm } from "../topic-form"

interface EditTopicPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTopicPage({ params }: EditTopicPageProps) {
  const { id } = await params
  const topic = await getTopicById(Number(id))

  if (!topic) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/topics">
            <ArrowLeft data-icon="inline-start" />
            Back to list
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Topic</CardTitle>
          <CardDescription>
            Update configuration for topic:{" "}
            <span className="font-semibold text-foreground">{topic.name}</span>
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <TopicForm initialData={topic} />
        </CardContent>
      </Card>
    </div>
  )
}
