"use client"

import { AlertTriangle } from "lucide-react"

import { EntityQuickDetailDrawer } from "@/components/entity-quick-detail-drawer"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function Error() {
  return (
    <EntityQuickDetailDrawer
      title="Không thể tải chi tiết"
      description="Đã xảy ra lỗi khi mở nội dung từ biểu đồ tri thức."
    >
      <Empty className="min-h-[320px] rounded-lg border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangle />
          </EmptyMedia>
          <EmptyTitle>Không thể tải chi tiết</EmptyTitle>
          <EmptyDescription>
            Vui lòng đóng bảng chi tiết và thử mở lại từ biểu đồ tri thức.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </EntityQuickDetailDrawer>
  )
}
