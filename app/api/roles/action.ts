"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult } from "@/app/lib/definitions"
import {
  PermissionResponse,
  RoleResponse,
  UpdateRolePermissionsRequest,
} from "@/app/lib/roles/definitions"

export async function getRoles(): Promise<RoleResponse[]> {
  return fetchAuthenticated<RoleResponse[]>("/roles")
}

export async function getPermissions(): Promise<PermissionResponse[]> {
  return fetchAuthenticated<PermissionResponse[]>("/permissions")
}

export async function updateRolePermissions(
  roleKey: string,
  request: UpdateRolePermissionsRequest
): Promise<ActionResult<RoleResponse>> {
  try {
    const data = await fetchAuthenticated<RoleResponse>(
      `/roles/${encodeURIComponent(roleKey)}/permissions`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      }
    )

    revalidatePath("/roles")

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Khong the cap nhat permission cho role",
    }
  }
}
