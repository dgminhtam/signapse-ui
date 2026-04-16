"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Copy, Key, RefreshCw, CheckCircle2, ChevronRight, Terminal, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export function DeveloperTokenClient() {
  const { getToken } = useAuth()
  const [token, setToken] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [decoded, setDecoded] = useState<{ header: any; payload: any } | null>(null)

  const decodeJWT = (token: string) => {
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
        header: JSON.parse(jsonHeader),
        payload: JSON.parse(jsonPayload),
      }
    } catch (e) {
      console.error("JWT Decode Error:", e)
      return null
    }
  }

  const handleGetToken = async () => {
    setLoading(true)
    try {
      const jwt = await getToken()
      if (jwt) {
        setToken(jwt)
        setDecoded(decodeJWT(jwt))
        toast.success("Token fetched successfully")
      } else {
        toast.error("Session not found")
      }
    } catch (error) {
      console.error("Error getting token:", error)
      toast.error("Failed to fetch token")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!token) return
    navigator.clipboard.writeText(token)
    toast.success("Token copied to clipboard")
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Info className="h-5 w-5" />
            <h3>Usage Instructions</h3>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              The Clerk token is a <strong>JWT (JSON Web Token)</strong>. You must include this token in the header of each request when calling the Backend API directly.
            </p>
            <div className="rounded-lg bg-muted/50 p-4 font-mono text-xs border">
              <div className="flex items-center gap-2 mb-2 text-primary/70">
                <Terminal className="h-3 w-3" />
                <span>Header Format</span>
              </div>
              Authorization: Bearer [YOUR_TOKEN]
            </div>
            <ul className="space-y-2 list-none">
              <li className="flex gap-2">
                <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Tokens have a short lifespan (usually 1 minute). Fetch a new one if you receive a 401 error.</span>
              </li>
              <li className="flex gap-2">
                <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Use this for testing with Postman, Insomnia, or cURL.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <Key className="h-5 w-5 text-amber-500" />
              <h3>Toolkit</h3>
            </div>
            {token && (
               <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 gap-1 capitalize">
                  <CheckCircle2 className="h-3 w-3" />
                  Token Ready
               </Badge>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleGetToken} 
              disabled={loading}
              className="w-full bg-primary hover:shadow-lg transition-all"
            >
              {loading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {token ? "Fetch New Token" : "Generate Test Token"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleCopy} 
              disabled={!token}
              className="w-full hover:bg-muted"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </div>

      {token && (
        <div className="space-y-6 pt-6 border-t animate-in slide-in-from-bottom-4 duration-300">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                Raw Token
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Encoded Base64</span>
            </div>
            <div className="relative group">
              <Textarea
                readOnly
                value={token}
                className="min-h-[120px] font-mono text-[11px] p-4 bg-muted/30 resize-none border-dashed focus-visible:ring-1 break-all leading-relaxed"
              />
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-md" />
            </div>
          </div>

          {decoded && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <span className="text-sm font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Header
                </span>
                <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 font-mono text-[11px] overflow-auto max-h-[300px] border shadow-inner">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>
              <div className="space-y-3">
                <span className="text-sm font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Payload
                </span>
                <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 font-mono text-[11px] overflow-auto max-h-[300px] border shadow-inner">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {decoded?.payload && (
            <div className="grid gap-4 sm:grid-cols-3">
               <div className="p-3 rounded-md bg-muted/50 border">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">Subject (User ID)</div>
                  <div className="text-xs font-mono truncate">{decoded.payload.sub}</div>
               </div>
               <div className="p-3 rounded-md bg-muted/50 border">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">Issued At</div>
                  <div className="text-xs">{new Date(decoded.payload.iat * 1000).toLocaleString()}</div>
               </div>
               <div className="p-3 rounded-md bg-muted/50 border">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">Expires At</div>
                  <div className="text-xs font-medium text-amber-600">
                    {new Date(decoded.payload.exp * 1000).toLocaleString()}
                  </div>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
