"use client"

import { Shield, SquarePen } from "lucide-react"
import { useState } from "react"

import { useLocalization } from "@/app/lib/i18n/provider"
import { PermissionResponse, RoleResponse } from "@/app/lib/roles/definitions"
import {
  AppListTable,
  AppListTableEmptyState,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { RolePermissionDialog } from "./role-permission-dialog"

interface RoleListPageProps {
  roles: RoleResponse[]
  permissions: PermissionResponse[]
}

export function RoleListPage({ roles, permissions }: RoleListPageProps) {
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null)
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<
    string[]
  >([])
  const { dictionary, formatMessage, formatNumber } = useLocalization()
  const t = dictionary.roles
  const formatCount = (value: number) => formatNumber(value)

  const handleEditRole = (role: RoleResponse) => {
    setSelectedRole(role)
    setSelectedPermissionKeys(
      (role.permissions ?? []).map((permission) => permission.key)
    )
  }

  return (
    <>
      <AppListTable className="mt-0">
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-56">{t.roleColumn}</AppListTableHead>
              <AppListTableHead className="w-48">{t.keyColumn}</AppListTableHead>
              <AppListTableHead className="w-[40%]">
                {t.descriptionColumn}
              </AppListTableHead>
              <AppListTableHead className="w-28 text-center">
                {t.permissionsColumn}
              </AppListTableHead>
              <AppListTableHead className="w-44 text-right">
                {t.actionsColumn}
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <TableRow
                  key={role.id}
                  className="border-border transition-colors hover:bg-muted/40"
                >
                  <TableCell className="w-56 max-w-[14rem] align-top whitespace-normal">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="line-clamp-1 font-medium break-words text-foreground">
                        {role.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ID: {role.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-48 max-w-[12rem]">
                    <Badge variant="secondary" className="max-w-full font-mono">
                      <span className="truncate">{role.key}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[40%] align-top text-sm whitespace-normal text-muted-foreground">
                    <span className="line-clamp-2 break-words">
                      {role.description || t.noDescription}
                    </span>
                  </TableCell>
                  <TableCell className="w-28 text-center">
                    <Badge variant="outline">
                      {formatMessage(t.permissionCount, {
                        count: formatCount(role.permissions.length),
                      })}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-44">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <SquarePen data-icon="inline-start" />
                        {t.updatePermissions}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <AppListTableEmptyState colSpan={5}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Shield />
                  </EmptyMedia>
                  <EmptyTitle>{t.emptyTitle}</EmptyTitle>
                  <EmptyDescription>{t.emptyDescription}</EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>

      <RolePermissionDialog
        role={selectedRole}
        permissions={permissions}
        selectedPermissionKeys={selectedPermissionKeys}
        onSelectedPermissionKeysChange={setSelectedPermissionKeys}
        open={selectedRole !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRole(null)
            setSelectedPermissionKeys([])
          }
        }}
      />
    </>
  )
}
