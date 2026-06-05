import Image from "next/image"

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
}: LogoProps) {
  return (
    <>
      <Image
        src="/images/signapse_logo_light.svg"
        alt="Signapse Logo"
        width={width}
        height={height}
        className={`object-contain dark:hidden ${className}`}
        priority
      />
      <Image
        src="/images/signapse_logo_dark.svg"
        alt="Signapse Logo"
        width={width}
        height={height}
        className={`hidden object-contain dark:block ${className}`}
        priority
      />
    </>
  )
}
