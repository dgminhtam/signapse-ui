import { SearchX } from "lucide-react"

import { getServerDictionary } from "@/app/lib/i18n/server"
import { EntityQuickDetailDrawer } from "@/components/entity-quick-detail-drawer"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default async function NotFound() {
  const dictionary = await getServerDictionary()

  return (
    <EntityQuickDetailDrawer
      title={dictionary.quickDetail.notFoundTitle}
      description={dictionary.quickDetail.notFoundDescription}
    >
      <Empty className="min-h-[320px] rounded-lg border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>{dictionary.quickDetail.notFoundEmptyTitle}</EmptyTitle>
          <EmptyDescription>
            {dictionary.quickDetail.notFoundEmptyDescription}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </EntityQuickDetailDrawer>
  )
}
