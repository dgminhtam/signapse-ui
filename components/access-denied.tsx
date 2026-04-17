import { ShieldAlert } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface AccessDeniedProps {
  title?: string
  description: string
  permission?: string
}

export function AccessDenied({
  title = "Access denied",
  description,
  permission,
}: AccessDeniedProps) {
  return (
    <Empty className="min-h-[320px] rounded-lg border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldAlert />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          {description}
          {permission ? (
            <>
              {" "}
              Required permission: <code>{permission}</code>.
            </>
          ) : null}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

