import type { AppLocale } from "@/app/lib/i18n/config"

import {
  FEEDBACK_FIXTURE_USER_ID,
  type FeedbackActionCapabilities,
  type FeedbackRecord,
  type FeedbackScreenshot,
  type FeedbackStatus,
  type FeedbackType,
} from "./definitions"

const previewSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%231e293b'/%3E%3Crect x='32' y='32' width='576' height='64' rx='12' fill='%23334155'/%3E%3Crect x='32' y='120' width='256' height='196' rx='12' fill='%230f766e'/%3E%3Crect x='312' y='120' width='296' height='84' rx='12' fill='%23f59e0b'/%3E%3Crect x='312' y='232' width='296' height='84' rx='12' fill='%2314b8a6'/%3E%3C/svg%3E"

const imageScreenshot: FeedbackScreenshot = {
  name: "dashboard-overview.png",
  mimeType: "image/png",
  size: 186_400,
  previewable: true,
  previewUrl: previewSvg,
}

const unsupportedScreenshot: FeedbackScreenshot = {
  name: "browser-console.pdf",
  mimeType: "application/pdf",
  size: 92_100,
  previewable: false,
}

const capabilities = (
  overrides: Partial<FeedbackActionCapabilities> = {}
): FeedbackActionCapabilities => ({
  canWithdraw: false,
  canPromote: false,
  canDismiss: false,
  canErase: false,
  ...overrides,
})

function createRecord({
  id,
  ownerId = FEEDBACK_FIXTURE_USER_ID,
  type,
  title,
  description,
  expectedOutcome,
  reproductionSteps,
  clientContext,
  screenshot,
  status,
  createdAt,
  reviewMessage,
  githubIssueUrl,
  sender,
  recordCapabilities,
}: {
  id: string
  ownerId?: string
  type: FeedbackType
  title: string
  description: string
  expectedOutcome: string
  reproductionSteps?: string
  clientContext?: FeedbackRecord["clientContext"]
  screenshot?: FeedbackScreenshot
  status: FeedbackStatus
  createdAt: string
  reviewMessage?: string
  githubIssueUrl?: string
  sender: FeedbackRecord["sender"]
  recordCapabilities: FeedbackActionCapabilities
}): FeedbackRecord {
  return {
    id,
    ownerId,
    type,
    title,
    description,
    expectedOutcome,
    reproductionSteps,
    clientContext,
    screenshot,
    status,
    createdAt,
    updatedAt: createdAt,
    reviewMessage,
    githubIssueUrl,
    sender,
    capabilities: recordCapabilities,
  }
}

export function createFeedbackFixtureSeed(locale: AppLocale): FeedbackRecord[] {
  const isVietnamese = locale === "vi"
  const currentUser: FeedbackRecord["sender"] = {
    id: FEEDBACK_FIXTURE_USER_ID,
    displayName: isVietnamese ? "Người dùng thử nghiệm" : "Fixture User",
    email: "fixture.user@signapse.test",
    active: true,
  }
  const analyst: FeedbackRecord["sender"] = {
    id: "fixture-analyst",
    displayName: isVietnamese ? "Nguyễn Minh Anh" : "Minh Anh Nguyen",
    email: "minh.anh@signapse.test",
    active: true,
  }
  const formerUser: FeedbackRecord["sender"] = {
    id: "fixture-former-user",
    displayName: isVietnamese ? "Tài khoản đã tắt" : "Deactivated account",
    email: "former@signapse.test",
    active: false,
  }

  const context = (path: string): FeedbackRecord["clientContext"] => ({
    pagePath: path,
    appVersion: "fixture-0.1",
    browser: "Chromium 128",
    operatingSystem: isVietnamese ? "Windows" : "Windows",
    locale,
    observedAt: "2026-08-24T09:30:00.000Z",
  })

  const records: FeedbackRecord[] = [
    createRecord({
      id: "feedback-001",
      type: "BUG",
      title: isVietnamese
        ? "Biểu đồ không giữ bộ lọc sau khi đổi ngôn ngữ"
        : "Chart filters reset after changing language",
      description: isVietnamese
        ? "Khi đang xem biểu đồ giá và chuyển giữa tiếng Việt với English, bộ lọc tài sản và khung thời gian bị đặt lại."
        : "When viewing a market chart and switching between Vietnamese and English, the asset and timeframe filters reset.",
      expectedOutcome: isVietnamese
        ? "Giữ nguyên lựa chọn hiện tại sau khi giao diện đổi ngôn ngữ."
        : "Keep the current selections when the interface language changes.",
      reproductionSteps: isVietnamese
        ? "Mở Biểu đồ giá, chọn BTC/USD, đổi khung 4H, sau đó chuyển ngôn ngữ."
        : "Open Market charts, select BTC/USD, choose 4H, then switch language.",
      clientContext: context("/market-charts"),
      screenshot: imageScreenshot,
      status: "PENDING_REVIEW",
      createdAt: "2026-08-24T09:30:00.000Z",
      sender: currentUser,
      recordCapabilities: capabilities({ canWithdraw: true }),
    }),
    createRecord({
      id: "feedback-002",
      type: "IDEA",
      title: isVietnamese
        ? "Thêm phím tắt mở nhanh bảng điều khiển"
        : "Add a shortcut for opening the dashboard",
      description: isVietnamese
        ? "Một phím tắt cố định sẽ giúp người dùng quay lại bảng điều khiển nhanh hơn khi đang xem các trang chi tiết."
        : "A stable keyboard shortcut would help users return to the dashboard while inspecting detail pages.",
      expectedOutcome: isVietnamese
        ? "Hiển thị phím tắt trong phần trợ giúp và không xung đột với thao tác nhập liệu."
        : "Document the shortcut in help and avoid conflicts with text input.",
      status: "PROMOTED",
      createdAt: "2026-08-22T14:10:00.000Z",
      reviewMessage: isVietnamese
        ? "Đề xuất đã được chuyển tới nhóm sản phẩm để xem xét trong chu kỳ tiếp theo."
        : "The suggestion has been passed to the product team for a future planning cycle.",
      githubIssueUrl: "https://github.com/signapse/signapse-ui/issues/142",
      sender: currentUser,
      recordCapabilities: capabilities({ canErase: true }),
    }),
    createRecord({
      id: "feedback-003",
      type: "BUG",
      title: isVietnamese
        ? "Thông báo lỗi chưa nêu cách khôi phục"
        : "Error message does not explain recovery",
      description: isVietnamese
        ? "Khi truy vấn dữ liệu thất bại, thông báo chỉ nói có lỗi mà không cho biết người dùng nên thử lại hay kiểm tra quyền."
        : "When a data request fails, the message only says something went wrong and does not explain whether to retry or check access.",
      expectedOutcome: isVietnamese
        ? "Thông báo nêu rõ hành động an toàn tiếp theo."
        : "The message should name the safest next action.",
      reproductionSteps: isVietnamese
        ? "Mở trang Sự kiện trong lúc mạng chậm, đợi trạng thái lỗi, đọc thông báo."
        : "Open Events on a slow connection, wait for the error state, and read the message.",
      status: "DISMISSED",
      createdAt: "2026-08-20T11:45:00.000Z",
      reviewMessage: isVietnamese
        ? "Hiện tại trải nghiệm lỗi này đã nằm trong kế hoạch cải thiện nền tảng khác."
        : "This error-state improvement is currently covered by a separate platform plan.",
      sender: currentUser,
      recordCapabilities: capabilities(),
    }),
    createRecord({
      id: "feedback-004",
      type: "BUG",
      title: isVietnamese
        ? "Tệp ảnh đính kèm hiện biểu tượng sai"
        : "Attached image shows the wrong icon",
      description: isVietnamese
        ? "Ảnh PNG hiển thị như tệp không hỗ trợ trong bản xem trước của bản ghi."
        : "A PNG image is displayed as an unsupported file in the record preview.",
      expectedOutcome: isVietnamese
        ? "Ảnh có thể xem trước với văn bản thay thế rõ ràng."
        : "The image should be previewed with meaningful alternative text.",
      screenshot: unsupportedScreenshot,
      status: "PENDING_REVIEW",
      createdAt: "2026-08-18T08:05:00.000Z",
      sender: currentUser,
      recordCapabilities: capabilities({ canWithdraw: true, canErase: true }),
    }),
    createRecord({
      id: "feedback-005",
      type: "IDEA",
      title: isVietnamese
        ? "Cho phép ghim tài sản quan trọng"
        : "Allow important assets to be pinned",
      description: isVietnamese
        ? "Một trạng thái ghim nhỏ trong danh sách tài sản sẽ giúp nhóm phân tích theo dõi các mã ưu tiên."
        : "A small pinned state in asset lists would help the analysis team keep priority symbols in view.",
      expectedOutcome: isVietnamese
        ? "Tài sản ghim xuất hiện trước nhưng không làm thay đổi dữ liệu thị trường."
        : "Pinned assets appear first without changing market data.",
      status: "PROMOTED",
      createdAt: "2026-08-15T16:20:00.000Z",
      reviewMessage: isVietnamese
        ? "Ý tưởng đã được chuyển xử lý để đánh giá cùng với kế hoạch watchlist."
        : "The idea has been promoted for review alongside the watchlist roadmap.",
      githubIssueUrl: "https://github.com/signapse/signapse-ui/issues/119",
      sender: analyst,
      recordCapabilities: capabilities({ canDismiss: true, canErase: true }),
    }),
    createRecord({
      id: "feedback-006",
      type: "BUG",
      title: isVietnamese
        ? "Nội dung dài cần xuống dòng ổn định"
        : "Long content needs stable wrapping",
      description: isVietnamese
        ? "Đây là dữ liệu fixture dài để kiểm tra cách nội dung phản hồi nhiều đoạn, có ký tự tiếng Việt và liên kết dài hiển thị trong chi tiết mà không tạo tràn ngang. Nội dung vẫn phải đọc được ở mức thu phóng 200 phần trăm trên màn hình hẹp."
        : "This is a long fixture entry for checking multi-paragraph feedback, accented text, and long links in detail views without page-level horizontal overflow. The content must remain readable at 200 percent zoom on a narrow viewport.",
      expectedOutcome: isVietnamese
        ? "Nội dung tự xuống dòng và giữ khoảng đọc phù hợp."
        : "Content wraps naturally and keeps a readable measure.",
      reproductionSteps: isVietnamese
        ? "Mở chi tiết bản ghi này trên màn hình hẹp và thu phóng trình duyệt."
        : "Open this detail on a narrow viewport and zoom the browser.",
      clientContext: context("/feedback/feedback-006"),
      status: "PENDING_REVIEW",
      createdAt: "2026-08-12T12:00:00.000Z",
      sender: currentUser,
      recordCapabilities: capabilities({ canWithdraw: true, canPromote: true }),
    }),
    createRecord({
      id: "feedback-007",
      type: "IDEA",
      title: isVietnamese
        ? "Thêm bộ lọc loại phản hồi"
        : "Add a feedback type filter",
      description: isVietnamese
        ? "Người xem xét có thể lọc riêng lỗi và ý tưởng khi hàng đợi lớn hơn."
        : "Reviewers could filter bugs and ideas separately when the queue grows.",
      expectedOutcome: isVietnamese
        ? "Bộ lọc giữ lại các tham số URL khác."
        : "The filter should preserve the other URL parameters.",
      status: "DISMISSED",
      createdAt: "2026-08-10T10:15:00.000Z",
      reviewMessage: isVietnamese
        ? "Bộ lọc này chưa cần thiết cho quy mô hàng đợi hiện tại."
        : "This filter is not needed for the current queue size.",
      sender: currentUser,
      recordCapabilities: capabilities({ canErase: true }),
    }),
    createRecord({
      id: "feedback-008",
      type: "BUG",
      title: isVietnamese
        ? "Ngày trong lịch kinh tế lệch múi giờ"
        : "Economic calendar dates use the wrong timezone",
      description: isVietnamese
        ? "Một số mốc sự kiện hiển thị sang ngày kế tiếp khi người dùng ở múi giờ Việt Nam."
        : "Some event timestamps move to the next day for users in the Vietnam timezone.",
      expectedOutcome: isVietnamese
        ? "Mốc giờ hiển thị theo múi giờ ứng dụng và ngày đúng."
        : "Timestamps should use the application timezone and correct date.",
      clientContext: context("/economic-calendar"),
      status: "PENDING_REVIEW",
      createdAt: "2026-08-08T07:25:00.000Z",
      sender: currentUser,
      recordCapabilities: capabilities({ canWithdraw: true }),
    }),
    createRecord({
      id: "feedback-009",
      type: "IDEA",
      title: isVietnamese
        ? "Hiển thị bản xem trước thông tin kỹ thuật"
        : "Show a preview of technical context",
      description: isVietnamese
        ? "Người gửi nên thấy các trường kỹ thuật trước khi gửi phản hồi."
        : "Senders should see the technical fields before submitting feedback.",
      expectedOutcome: isVietnamese
        ? "Có phần disclosure rõ ràng và tùy chọn tắt."
        : "Provide a clear disclosure with an opt-out control.",
      status: "PROMOTED",
      createdAt: "2026-08-05T09:40:00.000Z",
      reviewMessage: isVietnamese
        ? "Đã chuyển xử lý cùng với kế hoạch minh bạch dữ liệu."
        : "Promoted alongside the data-transparency workstream.",
      sender: currentUser,
      recordCapabilities: capabilities({ canErase: true }),
    }),
    createRecord({
      id: "feedback-010",
      type: "BUG",
      title: isVietnamese
        ? "Nút thử lại cần giữ ngữ cảnh trang"
        : "Retry should preserve page context",
      description: isVietnamese
        ? "Sau lỗi tải dữ liệu, thử lại không nên đưa người dùng về bảng điều khiển."
        : "After a data loading failure, retry should not take the user back to the dashboard.",
      expectedOutcome: isVietnamese
        ? "Giữ nguyên URL và bộ lọc hiện tại khi thử lại."
        : "Keep the current URL and filters when retrying.",
      status: "PENDING_REVIEW",
      createdAt: "2026-08-01T06:30:00.000Z",
      sender: currentUser,
      recordCapabilities: capabilities({ canWithdraw: true, canErase: true }),
    }),
    createRecord({
      id: "feedback-011",
      type: "IDEA",
      title: isVietnamese
        ? "Thêm mô tả cho trạng thái rỗng"
        : "Add guidance to empty states",
      description: isVietnamese
        ? "Trạng thái rỗng nên giải thích người dùng có thể làm gì tiếp theo."
        : "Empty states should explain the next useful action for the user.",
      expectedOutcome: isVietnamese
        ? "Có hành động chính và mô tả ngắn gọn."
        : "Include a primary action and a concise explanation.",
      status: "DISMISSED",
      createdAt: "2026-07-29T15:10:00.000Z",
      reviewMessage: isVietnamese
        ? "Đã ghi nhận nhưng hiện chưa ưu tiên trong phạm vi fixture này."
        : "Recorded, but not prioritized for the current fixture scope.",
      sender: currentUser,
      recordCapabilities: capabilities(),
    }),
    createRecord({
      id: "feedback-012",
      type: "BUG",
      title: isVietnamese
        ? "Tài khoản đã tắt vẫn xuất hiện trong ngữ cảnh"
        : "Deactivated account remains in context",
      description: isVietnamese
        ? "Thông tin người gửi cũ cần được hiển thị an toàn và không tạo liên kết thao tác."
        : "Old sender information should be presented safely without creating an actionable link.",
      expectedOutcome: isVietnamese
        ? "Tên tài khoản được giữ để đối chiếu nhưng trạng thái tắt được nói rõ."
        : "Keep the name for audit context and make the inactive state explicit.",
      clientContext: context("/feedback-submissions"),
      status: "PENDING_REVIEW",
      createdAt: "2026-07-25T13:00:00.000Z",
      sender: formerUser,
      recordCapabilities: capabilities({ canPromote: true, canErase: true }),
    }),
    createRecord({
      id: "feedback-013",
      ownerId: "fixture-analyst",
      type: "IDEA",
      title: isVietnamese
        ? "Cho phép sắp xếp phản hồi theo mức độ"
        : "Allow feedback sorting by impact",
      description: isVietnamese
        ? "Nhóm xem xét cần một cách nhìn ưu tiên khi hàng đợi tăng."
        : "Reviewers need a prioritised view as the queue grows.",
      expectedOutcome: isVietnamese
        ? "Có thể sắp xếp mà không tạo số liệu tổng hợp giả."
        : "Allow sorting without fabricating aggregate metrics.",
      status: "PENDING_REVIEW",
      createdAt: "2026-07-21T10:00:00.000Z",
      sender: analyst,
      recordCapabilities: capabilities({ canPromote: true, canDismiss: true }),
    }),
    createRecord({
      id: "feedback-014",
      ownerId: "fixture-analyst",
      type: "BUG",
      title: isVietnamese
        ? "Bảng moderation cần giữ tham số URL"
        : "Moderation table should preserve URL state",
      description: isVietnamese
        ? "Khi quay lại từ chi tiết, bộ lọc và trang đang xem cần được giữ lại."
        : "When returning from detail, the active filters and page should remain selected.",
      expectedOutcome: isVietnamese
        ? "Back/Forward khôi phục đúng hàng đợi."
        : "Back and Forward restore the same queue state.",
      status: "PROMOTED",
      createdAt: "2026-07-18T08:45:00.000Z",
      reviewMessage: isVietnamese
        ? "Đã chuyển xử lý để kiểm tra trong công việc điều hướng danh sách."
        : "Promoted for review as part of list-navigation work.",
      sender: analyst,
      recordCapabilities: capabilities({ canErase: true }),
    }),
  ]

  return records
}
