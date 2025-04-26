import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SimulationProvider } from "@/context/simulation-context"
import { UserProvider } from "@/context/user-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HoverRobotix Simulation",
  description: "Personal EV and Delivery Robot Simulation App",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SimulationProvider>
            <UserProvider>
              {children}
              <Toaster />
            </UserProvider>
          </SimulationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
