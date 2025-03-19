"use client"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function TopBar() {
  const pathname = usePathname()

  // Function to generate page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard"

    const paths = pathname.split("/").filter(Boolean)
    if (paths.length === 0) return "Dashboard"

    const lastPath = paths[paths.length - 1]
    return lastPath.charAt(0).toUpperCase() + lastPath.slice(1)
  }

  const pageTitle = getPageTitle()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-6 bg-[#0f2942] text-white w-full">
      <div className="flex items-center gap-2 flex-1">
        <div className="bg-white text-gray-900 px-4 py-2 rounded-lg shadow-sm">
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
        </div>
      </div>
      <div className="relative w-64">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search..."
          className="pl-8 h-9 w-full rounded-md bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary"
        />
      </div>
    </header>
  )
}

