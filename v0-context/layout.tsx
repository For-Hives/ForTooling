import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full min-h-screen`}>
        <ThemeProvider>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <div className="min-h-screen ml-20">
              <TopBar />
              <main className="w-full overflow-auto bg-gray-100 min-h-[calc(100vh-4rem)]">
                <div className="p-4 h-full w-full max-w-full">{children}</div>
              </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

