"use client"

import { AlertTriangle } from "lucide-react"

import { useLocalization } from "@/app/lib/i18n/provider"
import { EntityQuickDetailDrawer } from "@/components/entity-quick-detail-drawer"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function Error() {
  const { dictionary } = useLocalization()

  return (
    <EntityQuickDetailDrawer
      title={dictionary.quickDetail.errorTitle}
      description={dictionary.quickDetail.errorDescription}
    >
      <Empty className="min-h-[320px] rounded-lg border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangle />
          </EmptyMedia>
          <EmptyTitle>{dictionary.quickDetail.errorTitle}</EmptyTitle>
          <EmptyDescription>
            {dictionary.quickDetail.errorEmptyDescription}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </EntityQuickDetailDrawer>
  )
}
