import { CreditCard } from "lucide-react"

import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface AccountBillingPlaceholderProps {
  dictionary: Dictionary["accountProfile"]
}

export function AccountBillingPlaceholder({
  dictionary,
}: AccountBillingPlaceholderProps) {
  return (
    <Empty className="min-h-72">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CreditCard />
        </EmptyMedia>
        <EmptyTitle>{dictionary.billingEmptyTitle}</EmptyTitle>
        <EmptyDescription>
          {dictionary.billingEmptyDescription}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
