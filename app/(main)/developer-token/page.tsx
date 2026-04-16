import { DeveloperTokenClient } from "./developer-token-client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function DeveloperTokenPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Token</CardTitle>
        <CardDescription>
          Utility page to fetch Clerk Authentication Tokens for testing Backend APIs.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <DeveloperTokenClient />
      </CardContent>
    </Card>
  )
}
