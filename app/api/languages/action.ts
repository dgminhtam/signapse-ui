"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { LanguageCatalogResponse } from "@/app/lib/languages/definitions"

export async function getLanguages(): Promise<LanguageCatalogResponse> {
  return fetchAuthenticated<LanguageCatalogResponse>("/languages")
}
