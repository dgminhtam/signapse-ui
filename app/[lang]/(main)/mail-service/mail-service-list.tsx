"use client"

import { Mail, MailPlus, SquarePen, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteMailService } from "@/app/api/mail-service/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import type { MailServiceRecord } from "@/app/lib/mail-service/definitions"
import {
  AppListToolbar,
  AppListToolbarLeading,
} from "@/components/app-list-toolbar"
import {
  AppListTable,
  AppListTableEmptyState,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import { useHasPermission } from "@/components/permission-provider"
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
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { MailServiceFormDialog } from "./mail-service-form-dialog"

interface MailServiceListPageProps {
  mailServices: MailServiceRecord[]
  providers: string[]
}

export function MailServiceListPage({
  mailServices,
  providers,
}: MailServiceListPageProps) {
  const { dictionary } = useLocalization()
  const t = dictionary.mailService
  const canManageMailService = useHasPermission("mail-service:all")
  const [dialogMode, setDialogMode] = useState<"create" | "update">("create")
  const [selectedMailService, setSelectedMailService] =
    useState<MailServiceRecord | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const defaultCount = mailServices.filter((mail) => mail.isDefault).length

  function openCreateDialog() {
    setDialogMode("create")
    setSelectedMailService(null)
    setDialogOpen(true)
  }

  function openUpdateDialog(mailService: MailServiceRecord) {
    setDialogMode("update")
    setSelectedMailService(mailService)
    setDialogOpen(true)
  }

  return (
    <div className="w-full">
      <AppListToolbar>
        <AppListToolbarLeading>
          {canManageMailService ? (
            <Button type="button" onClick={openCreateDialog}>
              <MailPlus data-icon="inline-start" />
              {t.addMail}
            </Button>
          ) : null}
        </AppListToolbarLeading>
      </AppListToolbar>

      {defaultCount > 1 ? (
        <div
          role="status"
          className="mt-4 rounded-xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground"
        >
          {t.inconsistentDefault}
        </div>
      ) : null}

      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[44%]">
                {t.emailColumn}
              </AppListTableHead>
              <AppListTableHead className="w-[24%]">
                {t.providerColumn}
              </AppListTableHead>
              <AppListTableHead className="w-36 text-center">
                {t.statusColumn}
              </AppListTableHead>
              <AppListTableHead className="w-28 text-center">
                {t.actionsColumn}
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {mailServices.length > 0 ? (
              mailServices.map((mailService) => (
                <TableRow
                  key={mailService.email}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="align-top whitespace-normal">
                    <span className="block min-w-0 break-all font-medium text-foreground">
                      {mailService.email}
                    </span>
                  </TableCell>
                  <TableCell className="w-[24%] max-w-[14rem]">
                    <span className="block truncate text-sm text-muted-foreground">
                      {mailService.provider}
                    </span>
                  </TableCell>
                  <TableCell className="w-36 text-center">
                    <Badge
                      variant={mailService.isDefault ? "default" : "secondary"}
                    >
                      {mailService.isDefault
                        ? t.activeStatus
                        : t.standbyStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-28 text-center">
                    <div className="flex justify-center gap-1">
                      {canManageMailService ? (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => openUpdateDialog(mailService)}
                                aria-label={t.edit}
                              >
                                <SquarePen data-icon="inline-start" />
                                <span className="sr-only">{t.edit}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t.editTooltip}</TooltipContent>
                          </Tooltip>
                          <DeleteMailServiceButton mailService={mailService} />
                        </>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <AppListTableEmptyState colSpan={4}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Mail />
                  </EmptyMedia>
                  <EmptyTitle>{t.emptyTitle}</EmptyTitle>
                  <EmptyDescription>{t.emptyDescription}</EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>

      <MailServiceFormDialog
        mode={dialogMode}
        mailService={selectedMailService}
        open={dialogOpen}
        providers={providers}
        existingEmails={mailServices.map((mailService) => mailService.email)}
        onOpenChange={(open) => {
          setDialogOpen(open)

          if (!open) {
            setSelectedMailService(null)
          }
        }}
      />
    </div>
  )
}

function DeleteMailServiceButton({
  mailService,
}: {
  mailService: MailServiceRecord
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { dictionary, formatMessage } = useLocalization()
  const t = dictionary.mailService

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteMailService(mailService.email)

      if (result.success) {
        toast.success(formatMessage(t.deleteSuccess, { email: mailService.email }))
        setOpen(false)
        router.refresh()
        return
      }

      toast.error(result.error)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={t.delete}
            >
              <Trash2 data-icon="inline-start" />
              <span className="sr-only">{t.delete}</span>
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{t.delete}</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {formatMessage(t.deleteDescription, { email: mailService.email })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {dictionary.common.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(event) => {
              event.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" />
                {t.deletePending}
              </>
            ) : (
              t.deleteAction
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
