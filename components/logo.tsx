"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"

interface LogoProps {
  width?: number
  height?: number
  className?: string
  variant?: "icon" | "full"
}

export function Logo({
  width = 40,
  height = 40,
  className = "",
  variant = "icon",
}: LogoProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ width, height }} className={`bg-muted ${className}`} />
  }

  const isDark = theme === "dark"
  const logoSrc = isDark ? "/images/signapse_logo_dark.svg" : "/images/signapse_logo_light.svg"

  return (
    <Image
      src={logoSrc}
      alt="Signapse Logo"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  )
}
