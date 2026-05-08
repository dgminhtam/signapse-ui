import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import NextTopLoader from 'nextjs-toploader';

const fontSans = Inter({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", fontSans.variable)}
    >
      <body>
        <NextTopLoader color="var(--primary)" showSpinner={false} height={3} />
        <ClerkProvider>
          <Providers>
            {children}
          </Providers>
        </ClerkProvider>

      </body>
    </html>
  )
}
