import { Suspense } from "react"
import { CreateCronjobForm } from "./create-cronjob-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Cronjob</CardTitle>
        <CardDescription>
          Provide the details below to add a new cronjob to the system.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <CreateCronjobForm />
      </CardContent>
    </Card>
  )
}
