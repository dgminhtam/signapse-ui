"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import {
  Clock3,
  Copy,
  Key,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  Terminal,
  Info,
} from "lucide-react"
import { useLocalization } from "@/app/lib/i18n/provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { AppTimeMetadata } from "@/components/app-time-metadata"

type DecodedTokenPayload = Record<string, unknown> & {
  exp?: number
  iat?: number
  sub?: string
}

type DecodedToken = {
  header: Record<string, unknown>
  payload: DecodedTokenPayload
}

type LocalizationContext = ReturnType<typeof useLocalization>

function formatJwtTimestamp(value: unknown, localization: LocalizationContext) {
  if (typeof value !== "number") {
    return localization.dictionary.developerToken.unavailable
  }

  return localization.formatDateTime(
    value * 1000,
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
    localization.dictionary.developerToken.unavailable
  )
}

function formatJwtSubject(value: unknown, localization: LocalizationContext) {
  return typeof value === "string"
    ? value
    : localization.dictionary.developerToken.unavailable
}

export function DeveloperTokenClient() {
  const localization = useLocalization()
  const { dictionary } = localization
  const { getToken } = useAuth()
  const [token, setToken] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [decoded, setDecoded] = useState<DecodedToken | null>(null)

  const decodeJWT = (token: string): DecodedToken | null => {
    try {
      const parts = token.split(".")
      if (parts.length < 2) return null

      const base64Url = parts[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )

      const headerBase64Url = parts[0]
      const headerBase64 = headerBase64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonHeader = decodeURIComponent(
        atob(headerBase64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )

      return {
        header: JSON.parse(jsonHeader) as Record<string, unknown>,
        payload: JSON.parse(jsonPayload) as DecodedTokenPayload,
      }
    } catch (e) {
      console.error("JWT Decode Error:", e)
      return null
    }
  }

  const handleGetToken = async () => {
    setLoading(true)
    try {
      const jwt = await getToken({ template: "signapse" })
      if (jwt) {
        setToken(jwt)
        setDecoded(decodeJWT(jwt))
        toast.success(dictionary.developerToken.tokenFetched)
      } else {
        toast.error(dictionary.developerToken.sessionNotFound)
      }
    } catch (error) {
      console.error("Error getting token:", error)
      toast.error(dictionary.developerToken.fetchFailed)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!token) return
    navigator.clipboard.writeText(token)
    toast.success(dictionary.developerToken.copied)
  }

  return (
    <div className="animate-in space-y-8 duration-500 fade-in">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <Info className="h-5 w-5" />
            <h3>{dictionary.developerToken.usageTitle}</h3>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>{dictionary.developerToken.usageDescription}</p>
            <div className="rounded-lg border bg-muted/50 p-4 font-mono text-xs">
              <div className="mb-2 flex items-center gap-2 text-primary/70">
                <Terminal className="h-3 w-3" />
                <span>{dictionary.developerToken.headerFormat}</span>
              </div>
              Authorization: Bearer [YOUR_TOKEN]
            </div>
            <ul className="list-none space-y-2">
              <li className="flex gap-2">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{dictionary.developerToken.tokenLifespan}</span>
              </li>
              <li className="flex gap-2">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{dictionary.developerToken.testingTools}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <Key className="h-5 w-5 text-amber-500" />
              <h3>{dictionary.developerToken.toolkitTitle}</h3>
            </div>
            {token && (
              <Badge
                variant="outline"
                className="gap-1 border-green-200 bg-green-50 text-green-600 capitalize"
              >
                <CheckCircle2 className="h-3 w-3" />
                {dictionary.developerToken.tokenReady}
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleGetToken}
              disabled={loading}
              className="w-full bg-primary transition-all hover:shadow-lg"
            >
              {loading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {token
                ? dictionary.developerToken.fetchNewToken
                : dictionary.developerToken.generateToken}
            </Button>

            <Button
              variant="outline"
              onClick={handleCopy}
              disabled={!token}
              className="w-full hover:bg-muted"
            >
              <Copy className="mr-2 h-4 w-4" />
              {dictionary.developerToken.copyToClipboard}
            </Button>
          </div>
        </div>
      </div>

      {token && (
        <div className="animate-in space-y-6 border-t pt-6 duration-300 slide-in-from-bottom-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Terminal className="h-4 w-4 text-primary" />
                {dictionary.developerToken.rawToken}
              </span>
              <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                {dictionary.developerToken.encodedBase64}
              </span>
            </div>
            <div className="group relative">
              <Textarea
                readOnly
                value={token}
                className="min-h-[120px] resize-none border-dashed bg-muted/30 p-4 font-mono text-[11px] leading-relaxed break-all focus-visible:ring-1"
              />
              <div className="pointer-events-none absolute inset-0 rounded-md bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>

          {decoded && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {dictionary.developerToken.header}
                </span>
                <pre className="max-h-[300px] overflow-auto rounded-lg border bg-slate-950 p-4 font-mono text-[11px] text-slate-50 shadow-inner">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>
              <div className="space-y-3">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {dictionary.developerToken.payload}
                </span>
                <pre className="max-h-[300px] overflow-auto rounded-lg border bg-slate-950 p-4 font-mono text-[11px] text-slate-50 shadow-inner">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {decoded?.payload && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-md border bg-muted/50 p-3">
                <div className="mb-1 text-[10px] text-muted-foreground uppercase">
                  {dictionary.developerToken.subject}
                </div>
                <div className="truncate font-mono text-xs">
                  {formatJwtSubject(decoded.payload.sub, localization)}
                </div>
              </div>
              <div className="rounded-md border bg-muted/50 p-3">
                <div className="mb-1 text-[10px] text-muted-foreground uppercase">
                  {dictionary.developerToken.issuedAt}
                </div>
                <AppTimeMetadata icon={Clock3}>
                  {formatJwtTimestamp(decoded.payload.iat, localization)}
                </AppTimeMetadata>
              </div>
              <div className="rounded-md border bg-muted/50 p-3">
                <div className="mb-1 text-[10px] text-muted-foreground uppercase">
                  {dictionary.developerToken.expiresAt}
                </div>
                <AppTimeMetadata icon={Clock3}>
                  {formatJwtTimestamp(decoded.payload.exp, localization)}
                </AppTimeMetadata>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
