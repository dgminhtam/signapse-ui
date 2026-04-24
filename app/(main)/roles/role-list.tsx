"use client"

import { Shield, SquarePen } from "lucide-react"
import { useState } from "react"

import {
  PermissionResponse,
  RoleResponse,
} from "@/app/lib/roles/definitions"
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
  TableHead,
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
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<string[]>([])

  const handleEditRole = (role: RoleResponse) => {
    setSelectedRole(role)
    setSelectedPermissionKeys((role.permissions ?? []).map((permission) => permission.key))
  }

  return (
    <>
      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead>Vai trò</AppListTableHead>
              <AppListTableHead>Key</AppListTableHead>
              <AppListTableHead>Mô tả</AppListTableHead>
              <AppListTableHead className="text-center">Quyền</AppListTableHead>
              <AppListTableHead className="text-right">Thao tác</AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <TableRow key={role.id} className="border-border transition-colors hover:bg-muted/40">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">{role.name}</span>
                      <span className="text-xs text-muted-foreground">ID: {role.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {role.key}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xl text-sm text-muted-foreground">
                    {role.description || "Chưa có mô tả"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{role.permissions.length} quyền</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <SquarePen data-icon="inline-start" />
                        Cập nhật quyền
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
                  <EmptyTitle>Chưa có vai trò nào</EmptyTitle>
                  <EmptyDescription>
                    Hệ thống chưa trả về vai trò nào để bạn quản trị quyền truy cập.
                  </EmptyDescription>
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
