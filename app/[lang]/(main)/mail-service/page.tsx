import { Suspense } from "react"

import {
  getMailServiceProviders,
  getMailServices,
} from "@/app/api/mail-service/action"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { getServerDictionary } from "@/app/lib/i18n/server"
import type { MailServiceRecord } from "@/app/lib/mail-service/definitions"
import { normalizeMailServiceRecord } from "@/app/lib/mail-service/definitions"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import {
  AppListTable,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { MailServiceListPage } from "./mail-service-list"

function sortDefaultMailFirst(mailServices: MailServiceRecord[]) {
  return [...mailServices].sort(
    (current, next) => Number(next.isDefault) - Number(current.isDefault)
  )
}

export default async function MailServicePage() {
  const [permissions, dictionary] = await Promise.all([
    getCurrentPermissions(),
    getServerDictionary(),
  ])

  if (!hasPermission(permissions, "mail-service:all")) {
    return (
      <AccessDenied
        description={dictionary.mailService.accessDeniedDescription}
        permission="mail-service:all"
      />
    )
  }

  return (
    <Suspense fallback={<ListSkeleton dictionary={dictionary} />}>
      <MailServiceContent />
    </Suspense>
  )
}

async function MailServiceContent() {
  const [providers, mailServices] = await Promise.all([
    getMailServiceProviders(),
    getMailServices(),
  ])

  return (
    <MailServiceListPage
      providers={providers}
      mailServices={sortDefaultMailFirst(
        mailServices.map(normalizeMailServiceRecord)
      )}
    />
  )
}

function ListSkeleton({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.mailService

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex w-full flex-1 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Skeleton className="h-8 w-full sm:w-[140px]" />
        </div>
      </div>

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
            {[...Array(4)].map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell className="align-top whitespace-normal">
                  <Skeleton className="h-4 w-64 max-w-full" />
                </TableCell>
                <TableCell className="w-[24%]">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="w-36 text-center">
                  <Skeleton className="mx-auto h-5 w-24 rounded-full" />
                </TableCell>
                <TableCell className="w-28 text-center">
                  <div className="flex justify-center gap-1">
                    <Skeleton className="size-7 rounded" />
                    <Skeleton className="size-7 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AppListTable>
    </div>
  )
}
