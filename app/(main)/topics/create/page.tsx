import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { TopicForm } from "../topic-form"

export default function CreateTopicPage() {
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
          <CardTitle>Create Topic</CardTitle>
          <CardDescription>
            Define a new topic with keywords, entities, and activation status.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <TopicForm />
        </CardContent>
      </Card>
    </div>
  )
}
