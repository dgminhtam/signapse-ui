import { SearchX } from "lucide-react"

import { EntityQuickDetailDrawer } from "@/components/entity-quick-detail-drawer"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NotFound() {
  return (
    <EntityQuickDetailDrawer
      title="Không tìm thấy chi tiết"
      description="Nội dung được chọn không còn tồn tại hoặc bạn không thể truy cập."
    >
      <Empty className="min-h-[320px] rounded-lg border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>Không tìm thấy nội dung</EmptyTitle>
          <EmptyDescription>
            Hãy đóng bảng chi tiết để quay lại biểu đồ tri thức.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </EntityQuickDetailDrawer>
  )
}
