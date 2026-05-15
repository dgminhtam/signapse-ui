"use client"

import {
  Fragment,
  type FormEvent,
  type ReactNode,
  useState,
  useTransition,
} from "react"
import { useRouter } from "next/navigation"
import {
  Bot,
  CalendarClock,
  CheckCircle2,
  Clipboard,
  Link2,
  MessageCircle,
  Pencil,
  Plus,
  RadioTower,
  RefreshCw,
  Send,
  ShieldAlert,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import {
  createTelegramBotConnection,
  createTelegramLinkToken,
  createTelegramMarketAnalysisSchedule,
  deleteTelegramBotConnection,
  deleteTelegramDestination,
  deleteTelegramMarketAnalysisSchedule,
  disableTelegramBotConnection,
  disableTelegramDestination,
  disableTelegramMarketAnalysisSchedule,
  updateTelegramBotConnection,
  updateTelegramDestination,
  updateTelegramFeatureSetting,
  updateTelegramMarketAnalysisSchedule,
} from "@/app/api/telegram/action"
import { ActionResult } from "@/app/lib/definitions"
import {
  createTelegramBotConnectionSchema,
  saveTelegramMarketAnalysisScheduleSchema,
  TELEGRAM_FEATURE_KEYS,
  TelegramBotConnectionResponse,
  TelegramChatType,
  TelegramConfigurationData,
  TelegramConnectionStatus,
  TelegramDestinationResponse,
  TelegramDestinationStatus,
  TelegramFeatureKey,
  TelegramFeatureSettingResponse,
  TelegramLinkTokenResponse,
  TelegramMarketAnalysisScheduleResponse,
  updateTelegramBotConnectionSchema,
  updateTelegramDestinationSchema,
  updateTelegramFeatureSettingSchema,
} from "@/app/lib/telegram/definitions"
import {
  AppFormShell,
  AppFormShellBody,
  AppFormShellFooter,
} from "@/components/app-form-shell"
import {
  AppListTable,
  AppListTableEmptyState,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import {
  AppListToolbar,
  AppListToolbarLeading,
  AppListToolbarTrailing,
} from "@/components/app-list-toolbar"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type RouteDefinition = {
  featureKey: TelegramFeatureKey
  label: string
  description: string
}

type FeatureRouteView = RouteDefinition & {
  setting?: TelegramFeatureSettingResponse
}

const routeDefinitions: RouteDefinition[] = [
  {
    featureKey: "ECONOMIC_CALENDAR_ALERT",
    label: "Cảnh báo lịch kinh tế",
    description:
      "Gửi đánh giá tác động trước và sau khi dữ liệu kinh tế được công bố.",
  },
  {
    featureKey: "MARKET_NEWS_ALERT",
    label: "Cảnh báo tin thị trường",
    description:
      "Gửi tóm tắt sự kiện thị trường khi tin tức đủ liên quan tới danh sách theo dõi.",
  },
  {
    featureKey: "SCHEDULED_MARKET_ANALYSIS",
    label: "Phân tích thị trường định kỳ",
    description: "Định tuyến bản phân tích AI theo lịch gửi cố định trong ngày.",
  },
]

export function TelegramConfigurationPage({
  data,
}: {
  data: TelegramConfigurationData
}) {
  const featureSettings = data.currentWorkspace
    ? data.featureSettings.filter(
        (setting) => setting.workspaceId === data.currentWorkspace?.id
      )
    : []
  const schedules = data.currentWorkspace
    ? data.schedules.filter(
        (schedule) => schedule.workspaceId === data.currentWorkspace?.id
      )
    : []
  const routes = routeDefinitions.map((route) => ({
    ...route,
    setting: featureSettings.find(
      (setting) => setting.featureKey === route.featureKey
    ),
  }))
  const activeBotConnections = data.botConnections.filter(
    (connection) => connection.status === "ACTIVE"
  )
  const activeDestinations = data.destinations.filter(
    (destination) => destination.status === "ACTIVE"
  )

  return (
    <div className="flex w-full flex-col gap-6">
      <ReadinessSummary
        data={data}
        routes={routes}
        schedules={schedules}
        activeBotCount={activeBotConnections.length}
        activeDestinationCount={activeDestinations.length}
      />
      <BotConnectionSection
        botConnections={data.botConnections}
        canRead={data.sectionAccess.botConnections}
        canManage={data.manageAccess.botConnections}
      />
      <DestinationSection
        destinations={data.destinations}
        activeBotConnections={activeBotConnections}
        canRead={data.sectionAccess.destinations}
        canManage={data.manageAccess.destinations}
      />
      <FeatureRoutingSection
        routes={routes}
        schedules={schedules}
        activeDestinations={activeDestinations}
        currentWorkspace={data.currentWorkspace}
        watchlistAssets={data.watchlistAssets}
        canReadFeatureSettings={data.sectionAccess.featureSettings}
        canUpdateFeatureSettings={data.manageAccess.featureSettings}
        canReadSchedules={data.sectionAccess.schedules}
        canManageSchedules={data.manageAccess.schedules}
      />
    </div>
  )
}

export function TelegramConfigurationSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} size="sm">
            <CardHeader>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      {Array.from({ length: 2 }).map((_, index) => (
        <AppListTable key={index} className="mt-0">
          <Table>
            <TableHeader>
              <AppListTableHeaderRow>
                <AppListTableHead>
                  <Skeleton className="h-4 w-24" />
                </AppListTableHead>
                <AppListTableHead>
                  <Skeleton className="h-4 w-28" />
                </AppListTableHead>
                <AppListTableHead>
                  <Skeleton className="h-4 w-20" />
                </AppListTableHead>
              </AppListTableHeaderRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 2 }).map((__, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>
                    <Skeleton className="h-5 w-44" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AppListTable>
      ))}
      <AppListTable className="mt-0">
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead>
                <Skeleton className="h-4 w-24" />
              </AppListTableHead>
              <AppListTableHead>
                <Skeleton className="h-4 w-28" />
              </AppListTableHead>
              <AppListTableHead>
                <Skeleton className="h-4 w-20" />
              </AppListTableHead>
              <AppListTableHead>
                <Skeleton className="h-4 w-16" />
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <Skeleton className="h-5 w-44" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="mx-auto h-5 w-20" />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} className="p-4">
                <div className="flex flex-col gap-4 rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </AppListTable>
    </div>
  )
}

function ReadinessSummary({
  data,
  routes,
  schedules,
  activeBotCount,
  activeDestinationCount,
}: {
  data: TelegramConfigurationData
  routes: FeatureRouteView[]
  schedules: TelegramMarketAnalysisScheduleResponse[]
  activeBotCount: number
  activeDestinationCount: number
}) {
  const configuredRoutes = routes.filter(
    (route) => route.setting?.destination && route.setting.enabled
  ).length
  const activeSchedules = schedules.filter(
    (schedule) => schedule.status === "ACTIVE"
  ).length
  const readinessItems = [
    {
      label: "Bot Telegram",
      description: data.sectionAccess.botConnections
        ? `${activeBotCount} bot đang hoạt động.`
        : "Bạn chưa có quyền xem bot.",
      state: activeBotCount > 0 ? "Sẵn sàng" : "Cần cấu hình",
      status: activeBotCount > 0 ? ("ready" as const) : ("attention" as const),
      icon: Bot,
    },
    {
      label: "Điểm nhận",
      description: data.sectionAccess.destinations
        ? `${activeDestinationCount} điểm nhận đang hoạt động.`
        : "Bạn chưa có quyền xem điểm nhận.",
      state: activeDestinationCount > 0 ? "Sẵn sàng" : "Cần liên kết",
      status:
        activeDestinationCount > 0 ? ("ready" as const) : ("attention" as const),
      icon: MessageCircle,
    },
    {
      label: "Định tuyến",
      description: data.currentWorkspace
        ? `${configuredRoutes}/${TELEGRAM_FEATURE_KEYS.length} luồng đã bật trong ${data.currentWorkspace.name}.`
        : "Chưa có không gian làm việc hiện tại.",
      state: configuredRoutes > 0 ? "Có luồng bật" : "Cần rà soát",
      status: configuredRoutes > 0 ? ("ready" as const) : ("attention" as const),
      icon: RadioTower,
    },
    {
      label: "Phân tích định kỳ",
      description: data.sectionAccess.schedules
        ? `${activeSchedules} lịch gửi đang hoạt động.`
        : "Bạn chưa có quyền xem lịch gửi.",
      state: activeSchedules > 0 ? "Sẵn sàng" : "Chưa có lịch",
      status: activeSchedules > 0 ? ("ready" as const) : ("attention" as const),
      icon: CalendarClock,
    },
  ]

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {readinessItems.map((item) => {
        const Icon = item.icon

        return (
          <Card key={item.label} size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="size-4 text-muted-foreground" />
                {item.label}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
              <CardAction>
                <ReadinessBadge status={item.status}>{item.state}</ReadinessBadge>
              </CardAction>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}

function BotConnectionSection({
  botConnections,
  canRead,
  canManage,
}: {
  botConnections: TelegramBotConnectionResponse[]
  canRead: boolean
  canManage: boolean
}) {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="telegram-bots">
      <SectionHeader
        id="telegram-bots"
        title="Bot Telegram"
        description="Bot do người dùng quản lý, token chỉ nhập khi tạo và không hiển thị lại trên giao diện."
      />
      <AppListToolbar>
        <AppListToolbarLeading>
          <BotConnectionSheet canManage={canManage} />
        </AppListToolbarLeading>
        <AppListToolbarTrailing>
          <Badge variant="outline">Dữ liệu từ API</Badge>
        </AppListToolbarTrailing>
      </AppListToolbar>
      <AppListTable className="mt-0">
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[34%]">Bot</AppListTableHead>
              <AppListTableHead className="w-40">Trạng thái</AppListTableHead>
              <AppListTableHead className="w-48">Webhook</AppListTableHead>
              <AppListTableHead className="w-44">Xác thực</AppListTableHead>
              <AppListTableHead className="w-28 text-right">Thao tác</AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {!canRead ? (
              <AccessLimitedRow colSpan={5} title="Không có quyền xem bot Telegram" />
            ) : botConnections.length > 0 ? (
              botConnections.map((connection) => (
                <TableRow
                  key={connection.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="whitespace-normal align-top">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="font-medium text-foreground">
                        {getBotLabel(connection)}
                      </span>
                      <span className="truncate text-sm text-muted-foreground">
                        {connection.botUsername ? `@${connection.botUsername}` : "Chưa có username"} ·{" "}
                        {connection.botFirstName ?? "Chưa có tên bot"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <StatusBadge status={connection.status} />
                  </TableCell>
                  <TableCell className="whitespace-normal align-top">
                    <AppTimeMetadata icon={CalendarClock}>
                      {connection.lastWebhookRegisteredAt
                        ? `Đã đăng ký ${formatDateTime(connection.lastWebhookRegisteredAt)}`
                        : "Chưa có thời điểm đăng ký"}
                    </AppTimeMetadata>
                    {connection.failureReason ? (
                      <span className="block text-destructive">
                        {connection.failureReason}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="align-top">
                    <AppTimeMetadata icon={RefreshCw}>
                      {formatDateTime(connection.lastValidatedAt)}
                    </AppTimeMetadata>
                  </TableCell>
                  <TableCell className="align-top text-right">
                    <div className="flex justify-end gap-1">
                      <BotConnectionSheet
                        canManage={canManage}
                        connection={connection}
                      />
                      <ActionConfirmDialog
                        title="Tạm dừng bot Telegram?"
                        description="Bot tạm dừng sẽ không gửi được thông báo qua các điểm nhận đang dùng bot này."
                        actionLabel="Tạm dừng"
                        triggerLabel="Tạm dừng bot Telegram"
                        disabled={!canManage || connection.status !== "ACTIVE"}
                        action={() => disableTelegramBotConnection(connection.id)}
                        successMessage="Đã tạm dừng bot Telegram."
                      />
                      <ActionConfirmDialog
                        title="Xóa bot Telegram?"
                        description="Hành động này hủy liên kết bot khỏi Signapse và có thể ảnh hưởng các điểm nhận liên quan."
                        actionLabel="Xóa bot"
                        triggerLabel="Xóa bot Telegram"
                        disabled={!canManage}
                        action={() => deleteTelegramBotConnection(connection.id)}
                        successMessage="Đã xóa bot Telegram."
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <AppListTableEmptyState colSpan={5}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Bot />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có bot Telegram</EmptyTitle>
                  <EmptyDescription>
                    Kết nối bot do bạn tạo trong BotFather để bắt đầu gửi thông báo.
                  </EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>
    </section>
  )
}

function DestinationSection({
  destinations,
  activeBotConnections,
  canRead,
  canManage,
}: {
  destinations: TelegramDestinationResponse[]
  activeBotConnections: TelegramBotConnectionResponse[]
  canRead: boolean
  canManage: boolean
}) {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="telegram-destinations">
      <SectionHeader
        id="telegram-destinations"
        title="Điểm nhận"
        description="Chat, group hoặc channel đã xác minh bằng lệnh /start qua bot được chọn."
      />
      <AppListToolbar>
        <AppListToolbarLeading>
          <DestinationLinkSheet
            activeBotConnections={activeBotConnections}
            canManage={canManage}
          />
        </AppListToolbarLeading>
        <AppListToolbarTrailing>
          <Badge variant="outline">Xác minh qua Telegram</Badge>
        </AppListToolbarTrailing>
      </AppListToolbar>
      <AppListTable className="mt-0">
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[34%]">Điểm nhận</AppListTableHead>
              <AppListTableHead className="w-32">Loại chat</AppListTableHead>
              <AppListTableHead className="w-48">Bot</AppListTableHead>
              <AppListTableHead className="w-36">Trạng thái</AppListTableHead>
              <AppListTableHead className="w-36">Cập nhật</AppListTableHead>
              <AppListTableHead className="w-28 text-right">Thao tác</AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {!canRead ? (
              <AccessLimitedRow colSpan={6} title="Không có quyền xem điểm nhận" />
            ) : destinations.length > 0 ? (
              destinations.map((destination) => (
                <TableRow
                  key={destination.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="whitespace-normal align-top">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="font-medium text-foreground">
                        {getDestinationLabel(destination)}
                      </span>
                      <span className="truncate text-sm text-muted-foreground">
                        {destination.chatTitle ?? destination.username ?? destination.chatId ?? "Chưa có metadata chat"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="outline">{formatChatType(destination.chatType)}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-normal align-top text-sm text-muted-foreground">
                    {destination.botDisplayLabel ??
                      destination.botUsername ??
                      `Bot #${destination.botConnectionId}`}
                  </TableCell>
                  <TableCell className="align-top">
                    <StatusBadge status={destination.status} />
                  </TableCell>
                  <TableCell className="align-top">
                    <AppTimeMetadata icon={RefreshCw}>
                      {formatDateTime(destination.lastModifiedDate)}
                    </AppTimeMetadata>
                  </TableCell>
                  <TableCell className="align-top text-right">
                    <div className="flex justify-end gap-1">
                      <DestinationUpdateSheet
                        destination={destination}
                        canManage={canManage}
                      />
                      <ActionConfirmDialog
                        title="Tạm dừng điểm nhận Telegram?"
                        description="Điểm nhận tạm dừng sẽ không còn nhận thông báo từ các luồng đang trỏ tới nó."
                        actionLabel="Tạm dừng"
                        triggerLabel="Tạm dừng điểm nhận Telegram"
                        disabled={!canManage || destination.status !== "ACTIVE"}
                        action={() => disableTelegramDestination(destination.id)}
                        successMessage="Đã tạm dừng điểm nhận Telegram."
                      />
                      <ActionConfirmDialog
                        title="Xóa điểm nhận Telegram?"
                        description="Hành động này hủy điểm nhận đã xác minh và không thể hoàn tác từ giao diện."
                        actionLabel="Xóa điểm nhận"
                        triggerLabel="Xóa điểm nhận Telegram"
                        disabled={!canManage}
                        action={() => deleteTelegramDestination(destination.id)}
                        successMessage="Đã xóa điểm nhận Telegram."
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <AppListTableEmptyState colSpan={6}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessageCircle />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có điểm nhận</EmptyTitle>
                  <EmptyDescription>
                    Tạo lệnh liên kết rồi gửi lệnh đó trong Telegram để xác minh chat, group hoặc channel.
                  </EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>
    </section>
  )
}

function FeatureRoutingSection({
  routes,
  schedules,
  activeDestinations,
  currentWorkspace,
  watchlistAssets,
  canReadFeatureSettings,
  canUpdateFeatureSettings,
  canReadSchedules,
  canManageSchedules,
}: {
  routes: FeatureRouteView[]
  schedules: TelegramMarketAnalysisScheduleResponse[]
  activeDestinations: TelegramDestinationResponse[]
  currentWorkspace: TelegramConfigurationData["currentWorkspace"]
  watchlistAssets: TelegramConfigurationData["watchlistAssets"]
  canReadFeatureSettings: boolean
  canUpdateFeatureSettings: boolean
  canReadSchedules: boolean
  canManageSchedules: boolean
}) {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="telegram-routing">
      <SectionHeader
        id="telegram-routing"
        title="Định tuyến tính năng"
        description="Mỗi luồng Telegram chọn một điểm nhận riêng trong không gian làm việc."
      />
      <AppListTable className="mt-0">
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[36%]">Tính năng</AppListTableHead>
              <AppListTableHead className="w-44">Không gian</AppListTableHead>
              <AppListTableHead className="w-64">Điểm nhận</AppListTableHead>
              <AppListTableHead className="w-32 text-center">Bật gửi</AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {!canReadFeatureSettings ? (
              <AccessLimitedRow colSpan={4} title="Không có quyền xem định tuyến" />
            ) : (
              routes.map((route) => {
                const isScheduledMarketAnalysis =
                  route.featureKey === "SCHEDULED_MARKET_ANALYSIS"

                return (
                  <Fragment key={route.featureKey}>
                    <TableRow className="border-border transition-colors hover:bg-muted/50">
                      <TableCell className="whitespace-normal align-top">
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="font-medium text-foreground">
                            {route.label}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {route.description}
                          </span>
                          <code className="w-fit rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            {route.featureKey}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {currentWorkspace?.name ?? "Chưa chọn không gian"}
                      </TableCell>
                      <TableCell className="whitespace-normal align-top">
                        <FeatureRouteDestinationSelect
                          route={route}
                          activeDestinations={activeDestinations}
                          currentWorkspaceId={currentWorkspace?.id}
                          canUpdate={canUpdateFeatureSettings}
                        />
                      </TableCell>
                      <TableCell className="align-top">
                        <FeatureRouteSwitch
                          route={route}
                          currentWorkspaceId={currentWorkspace?.id}
                          canUpdate={canUpdateFeatureSettings}
                        />
                      </TableCell>
                    </TableRow>
                    {isScheduledMarketAnalysis ? (
                      <TableRow className="border-border bg-muted/10 hover:bg-muted/10">
                        <TableCell colSpan={4} className="whitespace-normal p-4">
                          <MarketAnalysisSchedulePanel
                            schedules={schedules}
                            activeDestinations={activeDestinations}
                            currentWorkspace={currentWorkspace}
                            watchlistAssets={watchlistAssets}
                            canReadSchedules={canReadSchedules}
                            canManageSchedules={canManageSchedules}
                          />
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </AppListTable>
    </section>
  )
}

function MarketAnalysisSchedulePanel({
  schedules,
  activeDestinations,
  currentWorkspace,
  watchlistAssets,
  canReadSchedules,
  canManageSchedules,
}: {
  schedules: TelegramMarketAnalysisScheduleResponse[]
  activeDestinations: TelegramDestinationResponse[]
  currentWorkspace: TelegramConfigurationData["currentWorkspace"]
  watchlistAssets: TelegramConfigurationData["watchlistAssets"]
  canReadSchedules: boolean
  canManageSchedules: boolean
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-background p-4">
      <AppListToolbar>
        <AppListToolbarLeading>
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">
              Lịch gửi phân tích
            </h3>
            <p className="text-sm text-muted-foreground">
              Gửi bản phân tích AI theo giờ địa phương và danh sách tài sản đã chọn.
            </p>
          </div>
          <ScheduleFormSheet
            activeDestinations={activeDestinations}
            currentWorkspace={currentWorkspace}
            watchlistAssets={watchlistAssets}
            canManage={canManageSchedules}
          />
        </AppListToolbarLeading>
        <AppListToolbarTrailing>
          <Badge variant="outline">Theo không gian hiện tại</Badge>
        </AppListToolbarTrailing>
      </AppListToolbar>
      <AppListTable className="mt-0">
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[24%]">Lịch gửi</AppListTableHead>
              <AppListTableHead className="w-44">Không gian</AppListTableHead>
              <AppListTableHead className="w-52">Điểm nhận</AppListTableHead>
              <AppListTableHead className="w-44">Giờ gửi</AppListTableHead>
              <AppListTableHead className="w-44">Tài sản</AppListTableHead>
              <AppListTableHead className="w-32">Trạng thái</AppListTableHead>
              <AppListTableHead className="w-28 text-right">Thao tác</AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {!canReadSchedules ? (
              <AccessLimitedRow colSpan={7} title="Không có quyền xem lịch phân tích" />
            ) : schedules.length > 0 ? (
              schedules.map((schedule) => (
                <TableRow
                  key={schedule.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="whitespace-normal align-top">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="font-medium text-foreground">
                        {schedule.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {schedule.timezone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    {schedule.workspaceName ?? currentWorkspace?.name ?? "Không gian hiện tại"}
                  </TableCell>
                  <TableCell className="whitespace-normal align-top text-sm text-muted-foreground">
                    {schedule.destination
                      ? getDestinationLabel(schedule.destination)
                      : "Chưa có điểm nhận"}
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    {schedule.localTimes.join(", ")}
                  </TableCell>
                  <TableCell className="whitespace-normal align-top text-sm text-muted-foreground">
                    {formatScheduledAssets(schedule)}
                  </TableCell>
                  <TableCell className="align-top">
                    <StatusBadge status={schedule.status} />
                  </TableCell>
                  <TableCell className="align-top text-right">
                    <div className="flex justify-end gap-1">
                      <ScheduleFormSheet
                        schedule={schedule}
                        activeDestinations={activeDestinations}
                        currentWorkspace={currentWorkspace}
                        watchlistAssets={watchlistAssets}
                        canManage={canManageSchedules}
                      />
                      <ActionConfirmDialog
                        title="Tạm dừng lịch phân tích?"
                        description="Lịch tạm dừng sẽ không gửi phân tích thị trường cho đến khi được cấu hình lại từ backend."
                        actionLabel="Tạm dừng"
                        triggerLabel="Tạm dừng lịch phân tích"
                        disabled={!canManageSchedules || schedule.status !== "ACTIVE"}
                        action={() =>
                          disableTelegramMarketAnalysisSchedule(schedule.id)
                        }
                        successMessage="Đã tạm dừng lịch phân tích."
                      />
                      <ActionConfirmDialog
                        title="Xóa lịch phân tích?"
                        description="Hành động này xóa lịch gửi phân tích thị trường và không thể hoàn tác từ giao diện."
                        actionLabel="Xóa lịch"
                        triggerLabel="Xóa lịch phân tích"
                        disabled={!canManageSchedules}
                        action={() =>
                          deleteTelegramMarketAnalysisSchedule(schedule.id)
                        }
                        successMessage="Đã xóa lịch phân tích."
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <AppListTableEmptyState colSpan={7}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CalendarClock />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có lịch phân tích</EmptyTitle>
                  <EmptyDescription>
                    Tạo lịch gửi theo giờ địa phương cho không gian làm việc hiện tại.
                  </EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>
    </div>
  )
}

function BotConnectionSheet({
  canManage,
  connection,
}: {
  canManage: boolean
  connection?: TelegramBotConnectionResponse
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isEdit = Boolean(connection)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canManage) return

    const formData = new FormData(event.currentTarget)
    if (isEdit) {
      const request = updateTelegramBotConnectionSchema.safeParse({
        displayLabel: getOptionalFormString(formData, "displayLabel"),
      })

      if (!request.success) {
        toast.error(
          request.error.issues[0]?.message ?? "Dữ liệu bot không hợp lệ."
        )
        return
      }

      startTransition(async () => {
        const result = await updateTelegramBotConnection(connection!.id, request.data)

        if (result.success) {
          toast.success("Đã cập nhật bot Telegram.")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      })
      return
    }

    const request = createTelegramBotConnectionSchema.safeParse({
      botToken: getFormString(formData, "botToken"),
      displayLabel: getOptionalFormString(formData, "displayLabel"),
    })

    if (!request.success) {
      toast.error(request.error.issues[0]?.message ?? "Dữ liệu bot không hợp lệ.")
      return
    }

    startTransition(async () => {
      const result = await createTelegramBotConnection(request.data)

      if (result.success) {
        toast.success("Đã kết nối bot Telegram.")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon-sm" disabled={!canManage}>
            <Pencil data-icon="inline-start" />
            <span className="sr-only">Sửa bot Telegram</span>
          </Button>
        ) : (
          <Button disabled={!canManage}>
            <Plus data-icon="inline-start" />
            Kết nối bot
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Chỉnh sửa bot Telegram" : "Kết nối bot Telegram"}
          </SheetTitle>
          <SheetDescription>
            Token chỉ nhập khi tạo mới và không hiển thị lại sau khi lưu.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="px-4">
          <AppFormShell
            title={isEdit ? "Thông tin bot" : "Bot Telegram mới"}
            description={
              isEdit
                ? "Chỉ cập nhật tên hiển thị cho bot đã kết nối."
                : "Dán token bot do BotFather cấp để Signapse xác thực và đăng ký webhook."
            }
            width="sm"
            className="max-w-none border-0 shadow-none"
          >
            <AppFormShellBody>
              <FieldGroup>
                {!isEdit ? (
                  <Field>
                    <FieldLabel htmlFor="telegram-bot-token">Token bot</FieldLabel>
                    <Input
                      id="telegram-bot-token"
                      name="botToken"
                      type="password"
                      placeholder="123456:ABC..."
                      disabled={isPending}
                    />
                    <FieldDescription>
                      Token chỉ gửi một lần khi tạo kết nối.
                    </FieldDescription>
                  </Field>
                ) : null}
                <Field>
                  <FieldLabel htmlFor="telegram-bot-label">Tên hiển thị</FieldLabel>
                  <Input
                    id="telegram-bot-label"
                    name="displayLabel"
                    placeholder="Bot cảnh báo thị trường"
                    defaultValue={connection?.displayLabel ?? ""}
                    disabled={isPending}
                  />
                </Field>
              </FieldGroup>
            </AppFormShellBody>
            <AppFormShellFooter>
              <SheetClose asChild>
                <Button type="button" variant="ghost" disabled={isPending}>
                  Đóng
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isPending || !canManage}>
                {isPending ? <Spinner data-icon="inline-start" /> : <Send data-icon="inline-start" />}
                {isEdit ? "Lưu bot" : "Kết nối bot"}
              </Button>
            </AppFormShellFooter>
          </AppFormShell>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function DestinationLinkSheet({
  activeBotConnections,
  canManage,
}: {
  activeBotConnections: TelegramBotConnectionResponse[]
  canManage: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [botConnectionId, setBotConnectionId] = useState(
    activeBotConnections[0]?.id.toString() ?? ""
  )
  const [linkToken, setLinkToken] = useState<TelegramLinkTokenResponse | null>(
    null
  )
  const [isPending, startTransition] = useTransition()
  const canSubmit = canManage && botConnectionId

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit) return

    startTransition(async () => {
      const result = await createTelegramLinkToken({
        botConnectionId: Number(botConnectionId),
      })

      if (result.success) {
        setLinkToken(result.data)
        toast.success("Đã tạo lệnh liên kết Telegram.")
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleRefresh() {
    router.refresh()
    toast.success("Đã làm mới danh sách điểm nhận.")
  }

  async function handleCopy() {
    if (!linkToken?.startCommand) return

    try {
      await navigator.clipboard.writeText(linkToken.startCommand)
      toast.success("Đã sao chép lệnh liên kết.")
    } catch {
      toast.error("Không thể sao chép lệnh liên kết.")
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button disabled={!canManage || activeBotConnections.length === 0}>
          <Link2 data-icon="inline-start" />
          Liên kết điểm nhận
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Liên kết điểm nhận</SheetTitle>
          <SheetDescription>
            Tạo lệnh /start rồi gửi lệnh đó trong Telegram để xác minh chat, group hoặc channel.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Bot nhận lệnh /start</FieldLabel>
              <Select
                value={botConnectionId}
                onValueChange={setBotConnectionId}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn bot đang hoạt động" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {activeBotConnections.map((botConnection) => (
                      <SelectItem
                        key={botConnection.id}
                        value={botConnection.id.toString()}
                      >
                        {getBotLabel(botConnection)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                Điểm nhận mới sẽ được gắn với bot đang chọn.
              </FieldDescription>
            </Field>
          </FieldGroup>
          {linkToken ? (
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clipboard className="size-4 text-muted-foreground" />
                Lệnh liên kết
              </div>
              <code className="min-w-0 break-all rounded-md bg-background px-3 py-2 text-sm">
                {linkToken.startCommand}
              </code>
              <AppTimeMetadata icon={CalendarClock}>
                Hết hạn: {formatDateTime(linkToken.expiresAt)}
              </AppTimeMetadata>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={handleCopy}>
                  <Clipboard data-icon="inline-start" />
                  Sao chép lệnh
                </Button>
                <Button type="button" variant="outline" onClick={handleRefresh}>
                  <RefreshCw data-icon="inline-start" />
                  Làm mới điểm nhận
                </Button>
              </div>
            </div>
          ) : null}
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" variant="ghost" disabled={isPending}>
                Đóng
              </Button>
            </SheetClose>
            <Button type="submit" disabled={!canSubmit || isPending}>
              {isPending ? <Spinner data-icon="inline-start" /> : <Link2 data-icon="inline-start" />}
              Tạo lệnh liên kết
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function DestinationUpdateSheet({
  destination,
  canManage,
}: {
  destination: TelegramDestinationResponse
  canManage: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canManage) return

    const formData = new FormData(event.currentTarget)
    const request = updateTelegramDestinationSchema.safeParse({
      displayLabel: getOptionalFormString(formData, "displayLabel"),
    })

    if (!request.success) {
      toast.error(
        request.error.issues[0]?.message ?? "Dữ liệu điểm nhận không hợp lệ."
      )
      return
    }

    startTransition(async () => {
      const result = await updateTelegramDestination(destination.id, request.data)

      if (result.success) {
        toast.success("Đã cập nhật điểm nhận Telegram.")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" disabled={!canManage}>
          <Pencil data-icon="inline-start" />
          <span className="sr-only">Sửa điểm nhận</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Chỉnh sửa điểm nhận</SheetTitle>
          <SheetDescription>
            Cập nhật tên hiển thị để dễ nhận diện chat, group hoặc channel.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="px-4">
          <AppFormShell
            title="Thông tin điểm nhận"
            width="sm"
            className="max-w-none border-0 shadow-none"
          >
            <AppFormShellBody>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor={`telegram-destination-${destination.id}`}>
                    Tên hiển thị
                  </FieldLabel>
                  <Input
                    id={`telegram-destination-${destination.id}`}
                    name="displayLabel"
                    defaultValue={destination.displayLabel ?? ""}
                    disabled={isPending}
                  />
                </Field>
              </FieldGroup>
            </AppFormShellBody>
            <AppFormShellFooter>
              <SheetClose asChild>
                <Button type="button" variant="ghost" disabled={isPending}>
                  Đóng
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Spinner data-icon="inline-start" /> : <Send data-icon="inline-start" />}
                Lưu điểm nhận
              </Button>
            </AppFormShellFooter>
          </AppFormShell>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function ScheduleFormSheet({
  schedule,
  activeDestinations,
  currentWorkspace,
  watchlistAssets,
  canManage,
}: {
  schedule?: TelegramMarketAnalysisScheduleResponse
  activeDestinations: TelegramDestinationResponse[]
  currentWorkspace: TelegramConfigurationData["currentWorkspace"]
  watchlistAssets: TelegramConfigurationData["watchlistAssets"]
  canManage: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [destinationId, setDestinationId] = useState(
    schedule?.destination?.id.toString() ?? activeDestinations[0]?.id.toString() ?? ""
  )
  const [isPending, startTransition] = useTransition()
  const isEdit = Boolean(schedule)
  const canSubmit = canManage && Boolean(currentWorkspace) && Boolean(destinationId)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit || !currentWorkspace) return

    const formData = new FormData(event.currentTarget)
    const assetIds = getAssetIdsFromInput(
      getOptionalFormString(formData, "assetSymbols"),
      watchlistAssets
    )

    if (!assetIds.success) {
      toast.error(assetIds.error)
      return
    }

    const request = saveTelegramMarketAnalysisScheduleSchema.safeParse({
      name: getFormString(formData, "name"),
      workspaceId: currentWorkspace.id,
      destinationId: Number(destinationId),
      timezone: getFormString(formData, "timezone"),
      localTimes: splitCommaValues(getFormString(formData, "localTimes")),
      assetIds: assetIds.data,
    })

    if (!request.success) {
      toast.error(request.error.issues[0]?.message ?? "Dữ liệu lịch không hợp lệ.")
      return
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateTelegramMarketAnalysisSchedule(schedule!.id, request.data)
        : await createTelegramMarketAnalysisSchedule(request.data)

      if (result.success) {
        toast.success(isEdit ? "Đã cập nhật lịch phân tích." : "Đã tạo lịch phân tích.")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon-sm" disabled={!canManage}>
            <Pencil data-icon="inline-start" />
            <span className="sr-only">Sửa lịch phân tích</span>
          </Button>
        ) : (
          <Button disabled={!canManage || !currentWorkspace || activeDestinations.length === 0}>
            <Plus data-icon="inline-start" />
            Tạo lịch
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Chỉnh sửa lịch phân tích" : "Tạo lịch phân tích"}
          </SheetTitle>
          <SheetDescription>
            Lịch gửi dùng không gian hiện tại, điểm nhận đang hoạt động và tài sản trong danh sách theo dõi.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="px-4">
          <AppFormShell
            title={isEdit ? `Lịch ${schedule?.name}` : "Lịch phân tích mới"}
            description={
              currentWorkspace
                ? `Không gian: ${currentWorkspace.name}`
                : "Chưa có không gian làm việc hiện tại."
            }
            width="lg"
            className="max-w-none border-0 shadow-none"
          >
            <AppFormShellBody>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="telegram-schedule-name">Tên lịch</FieldLabel>
                  <Input
                    id="telegram-schedule-name"
                    name="name"
                    placeholder="Bản tin đầu ngày"
                    defaultValue={schedule?.name ?? ""}
                    disabled={isPending}
                  />
                </Field>
                <FieldSet>
                  <FieldLegend>Phạm vi gửi</FieldLegend>
                  <FieldGroup className="gap-4">
                    <Field>
                      <FieldLabel>Điểm nhận</FieldLabel>
                      <Select
                        value={destinationId}
                        onValueChange={setDestinationId}
                        disabled={isPending}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn điểm nhận" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {activeDestinations.map((destination) => (
                              <SelectItem
                                key={destination.id}
                                value={destination.id.toString()}
                              >
                                {getDestinationLabel(destination)}
                              </SelectItem>
                            ))}
                            {schedule?.destination &&
                            !activeDestinations.some(
                              (destination) =>
                                destination.id === schedule.destination?.id
                            ) ? (
                              <SelectItem
                                value={schedule.destination.id.toString()}
                              >
                                {getDestinationLabel(schedule.destination)}
                              </SelectItem>
                            ) : null}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSet>
                  <FieldLegend>Lịch gửi</FieldLegend>
                  <FieldGroup className="gap-4">
                    <Field>
                      <FieldLabel htmlFor="telegram-schedule-timezone">
                        Múi giờ
                      </FieldLabel>
                      <Input
                        id="telegram-schedule-timezone"
                        name="timezone"
                        defaultValue={schedule?.timezone ?? "Asia/Bangkok"}
                        disabled={isPending}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="telegram-schedule-local-times">
                        Giờ gửi
                      </FieldLabel>
                      <Input
                        id="telegram-schedule-local-times"
                        name="localTimes"
                        defaultValue={schedule?.localTimes.join(", ") ?? ""}
                        placeholder="07:30, 13:30, 19:30"
                        disabled={isPending}
                      />
                      <FieldDescription>
                        Nhập nhiều mốc giờ, cách nhau bằng dấu phẩy.
                      </FieldDescription>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="telegram-schedule-assets">
                        Tài sản
                      </FieldLabel>
                      <Input
                        id="telegram-schedule-assets"
                        name="assetSymbols"
                        defaultValue={schedule?.assets
                          ?.map((asset) => asset.assetSymbol)
                          .filter(Boolean)
                          .join(", ")}
                        placeholder="BTC, ETH, XAUUSD"
                        disabled={isPending}
                      />
                      <FieldDescription>
                        Dùng ký hiệu trong danh sách theo dõi hiện tại. Để trống nếu muốn gửi theo toàn bộ phạm vi backend cho lịch này.
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </AppFormShellBody>
            <AppFormShellFooter>
              <SheetClose asChild>
                <Button type="button" variant="ghost" disabled={isPending}>
                  Đóng
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isPending || !canSubmit}>
                {isPending ? <Spinner data-icon="inline-start" /> : <CalendarClock data-icon="inline-start" />}
                {isEdit ? "Lưu lịch" : "Tạo lịch"}
              </Button>
            </AppFormShellFooter>
          </AppFormShell>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function FeatureRouteDestinationSelect({
  route,
  activeDestinations,
  currentWorkspaceId,
  canUpdate,
}: {
  route: FeatureRouteView
  activeDestinations: TelegramDestinationResponse[]
  currentWorkspaceId?: number
  canUpdate: boolean
}) {
  const router = useRouter()
  const [destinationId, setDestinationId] = useState(
    route.setting?.destination?.id.toString() ?? ""
  )
  const [isPending, startTransition] = useTransition()
  const disabled = !canUpdate || !currentWorkspaceId || isPending

  function handleDestinationChange(value: string) {
    setDestinationId(value)

    if (!currentWorkspaceId) return

    const request = updateTelegramFeatureSettingSchema.safeParse({
      featureKey: route.featureKey,
      workspaceId: currentWorkspaceId,
      destinationId: Number(value),
      enabled: route.setting?.enabled ?? false,
    })

    if (!request.success) {
      toast.error("Không thể cập nhật điểm nhận cho định tuyến.")
      return
    }

    startTransition(async () => {
      const result = await updateTelegramFeatureSetting(request.data)

      if (result.success) {
        toast.success("Đã cập nhật điểm nhận định tuyến.")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  if (activeDestinations.length === 0) {
    return (
      <span className="text-sm text-muted-foreground">
        Chưa có điểm nhận đang hoạt động.
      </span>
    )
  }

  return (
    <Select
      value={destinationId || undefined}
      onValueChange={handleDestinationChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Chọn điểm nhận" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {activeDestinations.map((destination) => (
            <SelectItem key={destination.id} value={destination.id.toString()}>
              {getDestinationLabel(destination)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function FeatureRouteSwitch({
  route,
  currentWorkspaceId,
  canUpdate,
}: {
  route: FeatureRouteView
  currentWorkspaceId?: number
  canUpdate: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const destinationId = route.setting?.destination?.id
  const checked = Boolean(route.setting?.enabled)
  const disabled = !canUpdate || !currentWorkspaceId || !destinationId || isPending

  function handleCheckedChange(enabled: boolean) {
    if (!currentWorkspaceId || !destinationId) return

    const request = updateTelegramFeatureSettingSchema.safeParse({
      featureKey: route.featureKey,
      workspaceId: currentWorkspaceId,
      destinationId,
      enabled,
    })

    if (!request.success) {
      toast.error("Không thể cập nhật trạng thái định tuyến.")
      return
    }

    startTransition(async () => {
      const result = await updateTelegramFeatureSetting(request.data)

      if (result.success) {
        toast.success(
          enabled ? "Đã bật định tuyến Telegram." : "Đã tạm dừng định tuyến Telegram."
        )
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div
      className="mx-auto inline-flex h-8 w-32 items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-xs data-[disabled=true]:opacity-60"
      data-disabled={disabled ? true : undefined}
    >
      <span
        className={cn(
          "min-w-14 text-left text-xs font-medium",
          checked ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {checked ? "Đang bật" : "Tạm dừng"}
      </span>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={handleCheckedChange}
        aria-label={`Bật hoặc tắt định tuyến ${route.label}`}
      />
    </div>
  )
}

function ActionConfirmDialog<T>({
  title,
  description,
  actionLabel,
  triggerLabel,
  disabled,
  action,
  successMessage,
}: {
  title: string
  description: string
  actionLabel: string
  triggerLabel: string
  disabled?: boolean
  action: () => Promise<ActionResult<T>>
  successMessage: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleAction() {
    startTransition(async () => {
      const result = await action()

      if (result.success) {
        toast.success(successMessage)
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={disabled}
        >
          <Trash2 data-icon="inline-start" />
          <span className="sr-only">{triggerLabel}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Đóng</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault()
              handleAction()
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function AccessLimitedRow({
  colSpan,
  title,
}: {
  colSpan: number
  title: string
}) {
  return (
    <AppListTableEmptyState colSpan={colSpan}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldAlert />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          Tài khoản hiện tại không có quyền đọc khu vực này.
        </EmptyDescription>
      </EmptyHeader>
    </AppListTableEmptyState>
  )
}

function SectionHeader({
  id,
  title,
  description,
}: {
  id: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <h2 id={id} className="text-base font-semibold text-foreground">
        {title}
      </h2>
      <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function ReadinessBadge({
  status,
  children,
}: {
  status: "ready" | "attention"
  children: ReactNode
}) {
  return status === "ready" ? (
    <Badge variant="secondary">
      <CheckCircle2 data-icon="inline-start" />
      {children}
    </Badge>
  ) : (
    <Badge variant="outline">
      <ShieldAlert data-icon="inline-start" />
      {children}
    </Badge>
  )
}

function StatusBadge({
  status,
}: {
  status: TelegramConnectionStatus | TelegramDestinationStatus
}) {
  if (status === "ACTIVE") {
    return <Badge variant="secondary">Đang hoạt động</Badge>
  }

  if (status === "INVALID") {
    return <Badge variant="destructive">Không hợp lệ</Badge>
  }

  if (status === "REMOVED") {
    return <Badge variant="outline">Đã xóa</Badge>
  }

  return <Badge variant="outline">Tạm dừng</Badge>
}

function formatChatType(chatType: TelegramChatType) {
  const labels: Record<TelegramChatType, string> = {
    PRIVATE: "Chat riêng",
    GROUP: "Nhóm",
    SUPERGROUP: "Siêu nhóm",
    CHANNEL: "Kênh",
    UNKNOWN: "Không rõ",
  }

  return labels[chatType]
}

function getBotLabel(connection: TelegramBotConnectionResponse) {
  return (
    connection.displayLabel ||
    connection.botFirstName ||
    connection.botUsername ||
    `Bot #${connection.id}`
  )
}

function getDestinationLabel(destination: TelegramDestinationResponse) {
  return (
    destination.displayLabel ||
    destination.chatTitle ||
    destination.username ||
    `Điểm nhận #${destination.id}`
  )
}

function formatDateTime(value?: string) {
  if (!value) {
    return "Chưa có dữ liệu"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date)
}

function formatScheduledAssets(schedule: TelegramMarketAnalysisScheduleResponse) {
  const assets = schedule.assets ?? []

  if (assets.length === 0) {
    return "Theo phạm vi backend"
  }

  return assets
    .map((asset) => asset.assetSymbol ?? asset.assetName ?? asset.assetId)
    .join(", ")
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

function getOptionalFormString(formData: FormData, key: string) {
  const value = getFormString(formData, key).trim()
  return value ? value : undefined
}

function splitCommaValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function getAssetIdsFromInput(
  value: string | undefined,
  assets: TelegramConfigurationData["watchlistAssets"]
): ActionResult<number[]> {
  const symbols = splitCommaValues(value ?? "")

  if (symbols.length === 0) {
    return { success: true, data: [] }
  }

  const assetIds: number[] = []
  const missingSymbols: string[] = []

  symbols.forEach((symbol) => {
    const asset = assets.find(
      (item) => item.assetSymbol.toLowerCase() === symbol.toLowerCase()
    )

    if (asset) {
      assetIds.push(asset.assetId)
    } else {
      missingSymbols.push(symbol)
    }
  })

  if (missingSymbols.length > 0) {
    return {
      success: false,
      error: `Không tìm thấy tài sản trong danh sách theo dõi: ${missingSymbols.join(", ")}.`,
    }
  }

  return { success: true, data: Array.from(new Set(assetIds)) }
}
