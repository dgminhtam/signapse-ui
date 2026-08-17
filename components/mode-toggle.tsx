"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { useLocalization } from "@/app/lib/i18n/provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuContentInOverlay as DropdownMenuContent } from "@/components/ui/dropdown-menu-content-in-overlay"

const MODE_TOGGLE_TRIGGER_ID = "mode-toggle-trigger"

export function ModeToggle() {
  const { setTheme } = useTheme()
  const { dictionary } = useLocalization()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label={dictionary.theme.toggle}
          />
        }
        id={MODE_TOGGLE_TRIGGER_ID}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">{dictionary.theme.toggle}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-labelledby={MODE_TOGGLE_TRIGGER_ID}>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            {dictionary.theme.light}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            {dictionary.theme.dark}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            {dictionary.theme.system}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
