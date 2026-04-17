"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { BackendMeResponse } from "@/app/lib/users/definitions"

export async function getMe(): Promise<BackendMeResponse> {
  return fetchAuthenticated<BackendMeResponse>("/me")
}
