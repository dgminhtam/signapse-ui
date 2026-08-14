"use client"

import { Fragment, type FormEvent, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Bot,
  CalendarClock,
  MessageCircle,
  Pencil,
  Plus,
  RadioTower,
} from "lucide-react"
import { toast } from "sonner"

import {
  createTelegramMarketAnalysisSchedule,
  deleteTelegramMarketAnalysisSchedule,
  disableTelegramMarketAnalysisSchedule,
  updateTelegramFeatureSetting,
  updateTelegramMarketAnalysisSchedule,
} from "@/app/api/telegram/action"
import { ActionResult } from "@/app/lib/definitions"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { useLocalization } from "@/app/lib/i18n/provider"
import {
  TELEGRAM_FEATURE_KEYS,
  TelegramConfigurationData,
  TelegramDestinationResponse,
  TelegramFeatureKey,
  TelegramFeatureSettingResponse,
  TelegramMarketAnalysisScheduleResponse,
  getSaveTelegramMarketAnalysisScheduleSchema,
  getUpdateTelegramFeatureSettingSchema,
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
import { Item, ItemActions, ItemContent } from "@/components/ui/item"
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
import { BotConnectionsCard } from "./telegram-bot-connections"
import { DestinationsCard } from "./telegram-destinations"
import {
  ActionConfirmDialog,
  AccessLimitedRow,
  getDestinationLabel,
  ReadinessBadge,
  SectionHeader,
  StatusBadge,
} from "./telegram-configuration-shared"

type RouteDefinition = {
  featureKey: TelegramFeatureKey
  label: string
  description: string
}

type FeatureRouteView = RouteDefinition & {
  setting?: TelegramFeatureSettingResponse
}

function getRouteDefinitions(dictionary: Dictionary): RouteDefinition[] {
  const routes = dictionary.telegram.routeDefinitions

  return [
    {
      featureKey: "ECONOMIC_CALENDAR_ALERT",
      label: routes.ECONOMIC_CALENDAR_ALERT.label,
      description: routes.ECONOMIC_CALENDAR_ALERT.description,
    },
    {
      featureKey: "MARKET_NEWS_ALERT",
      label: routes.MARKET_NEWS_ALERT.label,
      description: routes.MARKET_NEWS_ALERT.description,
    },
    {
      featureKey: "SCHEDULED_MARKET_ANALYSIS",
      label: routes.SCHEDULED_MARKET_ANALYSIS.label,
      description: routes.SCHEDULED_MARKET_ANALYSIS.description,
    },
  ]
}

export function TelegramConfigurationPage({
  data,
}: {
  data: TelegramConfigurationData
}) {
  const { dictionary } = useLocalization()
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
  const routes = getRouteDefinitions(dictionary).map((route) => ({
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
      <section
        className="flex min-w-0 flex-col gap-4"
        aria-labelledby="telegram-infrastructure"
      >
        <SectionHeader
          id="telegram-infrastructure"
          title={dictionary.telegram.infrastructureTitle}
          description={dictionary.telegram.infrastructureDescription}
        />
        <div className="grid min-w-0 gap-4 xl:grid-cols-2">
          <BotConnectionsCard
            botConnections={data.botConnections}
            canRead={data.sectionAccess.botConnections}
            canManage={data.manageAccess.botConnections}
          />
          <DestinationsCard
            destinations={data.destinations}
            activeBotConnections={activeBotConnections}
            canRead={data.sectionAccess.destinations}
            canReadBotConnections={data.sectionAccess.botConnections}
            canManage={data.manageAccess.destinations}
          />
        </div>
      </section>
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
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, cardIndex) => (
          <Card key={cardIndex} className="min-w-0">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <CardAction>
                <Skeleton className="h-9 w-28" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {Array.from({ length: 2 }).map((__, itemIndex) => (
                <Item key={itemIndex} variant="outline" className="items-start">
                  <ItemContent className="min-w-0 gap-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-56 max-w-full" />
                    <Skeleton className="h-4 w-32" />
                  </ItemContent>
                  <ItemActions
                    className={cn(
                      "ms-auto self-start",
                      cardIndex === 1 && "basis-full justify-end sm:basis-auto"
                    )}
                  >
                    {cardIndex === 1 ? <Skeleton className="h-8 w-24" /> : null}
                    <Skeleton className="size-8" />
                  </ItemActions>
                </Item>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
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
  const { dictionary, formatMessage, formatNumber } = useLocalization()
  const t = dictionary.telegram
  const formatCount = (value: number) => formatNumber(value)
  const configuredRoutes = routes.filter(
    (route) => route.setting?.destination && route.setting.enabled
  ).length
  const activeSchedules = schedules.filter(
    (schedule) => schedule.status === "ACTIVE"
  ).length
  const readinessItems = [
    {
      label: t.readiness.bot,
      description: data.sectionAccess.botConnections
        ? formatMessage(t.readiness.activeBots, {
            count: formatCount(activeBotCount),
          })
        : t.readiness.noBotPermission,
      state: activeBotCount > 0 ? t.readiness.ready : t.readiness.needsConfig,
      status: activeBotCount > 0 ? ("ready" as const) : ("attention" as const),
      icon: Bot,
    },
    {
      label: t.readiness.destinations,
      description: data.sectionAccess.destinations
        ? formatMessage(t.readiness.activeDestinations, {
            count: formatCount(activeDestinationCount),
          })
        : t.readiness.noDestinationPermission,
      state:
        activeDestinationCount > 0 ? t.readiness.ready : t.readiness.needsLink,
      status:
        activeDestinationCount > 0
          ? ("ready" as const)
          : ("attention" as const),
      icon: MessageCircle,
    },
    {
      label: t.readiness.routing,
      description: data.currentWorkspace
        ? formatMessage(t.readiness.configuredRoutes, {
            configured: formatCount(configuredRoutes),
            total: formatCount(TELEGRAM_FEATURE_KEYS.length),
            workspace: data.currentWorkspace.name,
          })
        : t.readiness.noWorkspace,
      state:
        configuredRoutes > 0
          ? t.readiness.routesEnabled
          : t.readiness.needsReview,
      status:
        configuredRoutes > 0 ? ("ready" as const) : ("attention" as const),
      icon: RadioTower,
    },
    {
      label: t.readiness.scheduledAnalysis,
      description: data.sectionAccess.schedules
        ? formatMessage(t.readiness.activeSchedules, {
            count: formatCount(activeSchedules),
          })
        : t.readiness.noSchedulePermission,
      state: activeSchedules > 0 ? t.readiness.ready : t.readiness.noSchedules,
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
                <ReadinessBadge status={item.status}>
                  {item.state}
                </ReadinessBadge>
              </CardAction>
            </CardHeader>
          </Card>
        )
      })}
    </div>
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
  const { dictionary } = useLocalization()
  const t = dictionary.telegram

  return (
    <section className="flex flex-col gap-4" aria-labelledby="telegram-routing">
      <SectionHeader
        id="telegram-routing"
        title={t.routing.sectionTitle}
        description={t.routing.sectionDescription}
      />
      <AppListTable className="mt-0">
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[36%]">
                {t.routing.featureColumn}
              </AppListTableHead>
              <AppListTableHead className="w-44">
                {t.routing.workspaceColumn}
              </AppListTableHead>
              <AppListTableHead className="w-64">
                {t.routing.destinationColumn}
              </AppListTableHead>
              <AppListTableHead className="w-32 text-center">
                {t.routing.enabledColumn}
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {!canReadFeatureSettings ? (
              <AccessLimitedRow colSpan={4} title={t.routing.accessLimited} />
            ) : (
              routes.map((route) => {
                const isScheduledMarketAnalysis =
                  route.featureKey === "SCHEDULED_MARKET_ANALYSIS"

                return (
                  <Fragment key={route.featureKey}>
                    <TableRow className="border-border transition-colors hover:bg-muted/50">
                      <TableCell className="align-top whitespace-normal">
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
                        {currentWorkspace?.name ??
                          t.routing.noWorkspaceSelected}
                      </TableCell>
                      <TableCell className="align-top whitespace-normal">
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
                        <TableCell
                          colSpan={4}
                          className="p-4 whitespace-normal"
                        >
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
  const { dictionary } = useLocalization()
  const t = dictionary.telegram

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-background p-4">
      <AppListToolbar>
        <AppListToolbarLeading>
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">
              {t.schedule.panelTitle}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t.schedule.panelDescription}
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
          <Badge variant="outline">{t.common.currentWorkspaceScope}</Badge>
        </AppListToolbarTrailing>
      </AppListToolbar>
      <AppListTable className="mt-0">
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[24%]">
                {t.schedule.scheduleColumn}
              </AppListTableHead>
              <AppListTableHead className="w-44">
                {t.schedule.workspaceColumn}
              </AppListTableHead>
              <AppListTableHead className="w-52">
                {t.schedule.destinationColumn}
              </AppListTableHead>
              <AppListTableHead className="w-44">
                {t.schedule.localTimesColumn}
              </AppListTableHead>
              <AppListTableHead className="w-44">
                {t.schedule.assetsColumn}
              </AppListTableHead>
              <AppListTableHead className="w-32">
                {t.schedule.statusColumn}
              </AppListTableHead>
              <AppListTableHead className="w-28 text-right">
                {t.common.actions}
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {!canReadSchedules ? (
              <AccessLimitedRow colSpan={7} title={t.schedule.accessLimited} />
            ) : schedules.length > 0 ? (
              schedules.map((schedule) => (
                <TableRow
                  key={schedule.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="align-top whitespace-normal">
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
                    {schedule.workspaceName ??
                      currentWorkspace?.name ??
                      t.schedule.currentWorkspaceFallback}
                  </TableCell>
                  <TableCell className="align-top text-sm whitespace-normal text-muted-foreground">
                    {schedule.destination
                      ? getDestinationLabel(schedule.destination, dictionary)
                      : t.schedule.noDestination}
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    {schedule.localTimes.join(", ")}
                  </TableCell>
                  <TableCell className="align-top text-sm whitespace-normal text-muted-foreground">
                    {formatScheduledAssets(schedule, dictionary)}
                  </TableCell>
                  <TableCell className="align-top">
                    <StatusBadge status={schedule.status} />
                  </TableCell>
                  <TableCell className="text-right align-top">
                    <div className="flex justify-end gap-1">
                      <ScheduleFormSheet
                        schedule={schedule}
                        activeDestinations={activeDestinations}
                        currentWorkspace={currentWorkspace}
                        watchlistAssets={watchlistAssets}
                        canManage={canManageSchedules}
                      />
                      <ActionConfirmDialog
                        title={t.schedule.pauseTitle}
                        description={t.schedule.pauseDescription}
                        actionLabel={t.common.pause}
                        triggerLabel={t.schedule.pauseTrigger}
                        disabled={
                          !canManageSchedules || schedule.status !== "ACTIVE"
                        }
                        action={() =>
                          disableTelegramMarketAnalysisSchedule(schedule.id)
                        }
                        successMessage={t.schedule.pauseSuccess}
                      />
                      <ActionConfirmDialog
                        title={t.schedule.deleteTitle}
                        description={t.schedule.deleteDescription}
                        actionLabel={t.schedule.deleteAction}
                        triggerLabel={t.schedule.deleteTrigger}
                        disabled={!canManageSchedules}
                        action={() =>
                          deleteTelegramMarketAnalysisSchedule(schedule.id)
                        }
                        successMessage={t.schedule.deleteSuccess}
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
                  <EmptyTitle>{t.schedule.emptyTitle}</EmptyTitle>
                  <EmptyDescription>
                    {t.schedule.emptyDescription}
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
  const { dictionary, formatMessage } = useLocalization()
  const t = dictionary.telegram
  const [destinationId, setDestinationId] = useState(
    schedule?.destination?.id.toString() ??
      activeDestinations[0]?.id.toString() ??
      ""
  )
  const [isPending, startTransition] = useTransition()
  const isEdit = Boolean(schedule)
  const canSubmit =
    canManage && Boolean(currentWorkspace) && Boolean(destinationId)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit || !currentWorkspace) return

    const formData = new FormData(event.currentTarget)
    const assetIds = getAssetIdsFromInput(
      getOptionalFormString(formData, "assetSymbols"),
      watchlistAssets,
      dictionary
    )

    if (!assetIds.success) {
      toast.error(assetIds.error)
      return
    }

    const request = getSaveTelegramMarketAnalysisScheduleSchema(
      dictionary
    ).safeParse({
      name: getFormString(formData, "name"),
      workspaceId: currentWorkspace.id,
      destinationId: Number(destinationId),
      timezone: getFormString(formData, "timezone"),
      localTimes: splitCommaValues(getFormString(formData, "localTimes")),
      assetIds: assetIds.data,
    })

    if (!request.success) {
      toast.error(request.error.issues[0]?.message ?? t.schedule.invalidData)
      return
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateTelegramMarketAnalysisSchedule(schedule!.id, request.data)
        : await createTelegramMarketAnalysisSchedule(request.data)

      if (result.success) {
        toast.success(
          isEdit ? t.schedule.updateSuccess : t.schedule.createSuccess
        )
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
            <span className="sr-only">{t.schedule.editTrigger}</span>
          </Button>
        ) : (
          <Button
            disabled={
              !canManage || !currentWorkspace || activeDestinations.length === 0
            }
          >
            <Plus data-icon="inline-start" />
            {t.schedule.createSchedule}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? t.schedule.sheetEditTitle : t.schedule.sheetCreateTitle}
          </SheetTitle>
          <SheetDescription>{t.schedule.sheetDescription}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="px-4">
          <AppFormShell
            title={
              isEdit
                ? formatMessage(t.schedule.formEditTitle, {
                    name: schedule?.name ?? "",
                  })
                : t.schedule.formCreateTitle
            }
            description={
              currentWorkspace
                ? formatMessage(t.schedule.workspaceDescription, {
                    workspace: currentWorkspace.name,
                  })
                : t.schedule.noWorkspaceDescription
            }
            width="lg"
            className="max-w-none border-0 shadow-none"
          >
            <AppFormShellBody>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="telegram-schedule-name">
                    {t.schedule.nameLabel}
                  </FieldLabel>
                  <Input
                    id="telegram-schedule-name"
                    name="name"
                    placeholder={t.schedule.namePlaceholder}
                    defaultValue={schedule?.name ?? ""}
                    disabled={isPending}
                  />
                </Field>
                <FieldSet>
                  <FieldLegend>{t.schedule.scopeLegend}</FieldLegend>
                  <FieldGroup className="gap-4">
                    <Field>
                      <FieldLabel>{t.schedule.destinationColumn}</FieldLabel>
                      <Select
                        value={destinationId}
                        onValueChange={setDestinationId}
                        disabled={isPending}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t.destination.placeholder}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {activeDestinations.map((destination) => (
                              <SelectItem
                                key={destination.id}
                                value={destination.id.toString()}
                              >
                                {getDestinationLabel(destination, dictionary)}
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
                                {getDestinationLabel(
                                  schedule.destination,
                                  dictionary
                                )}
                              </SelectItem>
                            ) : null}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSet>
                  <FieldLegend>{t.schedule.scheduleLegend}</FieldLegend>
                  <FieldGroup className="gap-4">
                    <Field>
                      <FieldLabel htmlFor="telegram-schedule-timezone">
                        {t.schedule.timezoneLabel}
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
                        {t.schedule.localTimesLabel}
                      </FieldLabel>
                      <Input
                        id="telegram-schedule-local-times"
                        name="localTimes"
                        defaultValue={schedule?.localTimes.join(", ") ?? ""}
                        placeholder={t.schedule.localTimesPlaceholder}
                        disabled={isPending}
                      />
                      <FieldDescription>
                        {t.schedule.localTimesDescription}
                      </FieldDescription>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="telegram-schedule-assets">
                        {t.schedule.assetsLabel}
                      </FieldLabel>
                      <Input
                        id="telegram-schedule-assets"
                        name="assetSymbols"
                        defaultValue={schedule?.assets
                          ?.map((asset) => asset.assetSymbol)
                          .filter(Boolean)
                          .join(", ")}
                        placeholder={t.schedule.assetsPlaceholder}
                        disabled={isPending}
                      />
                      <FieldDescription>
                        {t.schedule.assetsDescription}
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </AppFormShellBody>
            <AppFormShellFooter>
              <SheetClose asChild>
                <Button type="button" variant="ghost" disabled={isPending}>
                  {dictionary.common.close}
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isPending || !canSubmit}>
                {isPending ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <CalendarClock data-icon="inline-start" />
                )}
                {isEdit ? t.schedule.saveSchedule : t.schedule.createSchedule}
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
  const { dictionary } = useLocalization()
  const t = dictionary.telegram
  const disabled = !canUpdate || !currentWorkspaceId || isPending

  function handleDestinationChange(value: string) {
    setDestinationId(value)

    if (!currentWorkspaceId) return

    const request = getUpdateTelegramFeatureSettingSchema().safeParse({
      featureKey: route.featureKey,
      workspaceId: currentWorkspaceId,
      destinationId: Number(value),
      enabled: route.setting?.enabled ?? false,
    })

    if (!request.success) {
      toast.error(t.routing.destinationUpdateError)
      return
    }

    startTransition(async () => {
      const result = await updateTelegramFeatureSetting(request.data)

      if (result.success) {
        toast.success(t.routing.destinationUpdateSuccess)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  if (activeDestinations.length === 0) {
    return (
      <span className="text-sm text-muted-foreground">
        {t.destination.noActiveDestination}
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
        <SelectValue placeholder={t.destination.placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {activeDestinations.map((destination) => (
            <SelectItem key={destination.id} value={destination.id.toString()}>
              {getDestinationLabel(destination, dictionary)}
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
  const { dictionary, formatMessage } = useLocalization()
  const t = dictionary.telegram
  const destinationId = route.setting?.destination?.id
  const checked = Boolean(route.setting?.enabled)
  const disabled =
    !canUpdate || !currentWorkspaceId || !destinationId || isPending

  function handleCheckedChange(enabled: boolean) {
    if (!currentWorkspaceId || !destinationId) return

    const request = getUpdateTelegramFeatureSettingSchema().safeParse({
      featureKey: route.featureKey,
      workspaceId: currentWorkspaceId,
      destinationId,
      enabled,
    })

    if (!request.success) {
      toast.error(t.routing.statusUpdateError)
      return
    }

    startTransition(async () => {
      const result = await updateTelegramFeatureSetting(request.data)

      if (result.success) {
        toast.success(
          enabled ? t.routing.enabledSuccess : t.routing.disabledSuccess
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
        {checked ? t.common.enabled : t.common.paused}
      </span>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={handleCheckedChange}
        aria-label={formatMessage(t.routing.switchAria, {
          route: route.label,
        })}
      />
    </div>
  )
}

function formatScheduledAssets(
  schedule: TelegramMarketAnalysisScheduleResponse,
  dictionary: Dictionary
) {
  const assets = schedule.assets ?? []

  if (assets.length === 0) {
    return dictionary.telegram.schedule.backendScope
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
  assets: TelegramConfigurationData["watchlistAssets"],
  dictionary: Dictionary
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
      error: dictionary.telegram.schedule.missingAssets.replace(
        "{symbols}",
        missingSymbols.join(", ")
      ),
    }
  }

  return { success: true, data: Array.from(new Set(assetIds)) }
}
