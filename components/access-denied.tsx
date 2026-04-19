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
  title = "Không có quyền truy cập",
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
              Quyền yêu cầu: <code>{permission}</code>.
            </>
          ) : null}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

