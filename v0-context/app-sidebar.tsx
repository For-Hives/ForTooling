"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Construction, Wrench, User, Building, HardHat } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <Sidebar
        className="border-r-0 bg-[#0f2942] w-20 flex-shrink-0 h-screen fixed left-0 top-0 z-50"
        collapsible="none"
      >
        <div className="h-16 flex items-center justify-center px-0 border-b-0">
          <Link href="/" className="flex items-center justify-center h-full w-full">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <HardHat className="h-5 w-5" />
            </div>
          </Link>
        </div>
        <SidebarContent className="pt-6 px-1">
          <SidebarMenu className="space-y-4 w-full">
            <SidebarMenuItem className="mx-0 px-2 my-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/projects"}
                    className="text-white/70 hover:text-[#0f2942] hover:bg-white justify-center h-16 py-4 rounded-lg w-full transition-all duration-200 border border-transparent hover:border-white/20"
                  >
                    <Link href="/projects" className="flex items-center justify-center h-full">
                      <Construction className="h-12 w-12" />
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">Projects</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
            <SidebarMenuItem className="mx-0 px-2 my-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/equipment"}
                    className="text-white/70 hover:text-[#0f2942] hover:bg-white justify-center h-16 py-4 rounded-lg w-full transition-all duration-200 border border-transparent hover:border-white/20"
                  >
                    <Link href="/equipment" className="flex items-center justify-center h-full">
                      <Wrench className="h-12 w-12" />
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">Equipment</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
            <SidebarMenuItem className="mx-0 px-2 my-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/users"}
                    className="text-white/70 hover:text-[#0f2942] hover:bg-white justify-center h-16 py-4 rounded-lg w-full transition-all duration-200 border border-transparent hover:border-white/20"
                  >
                    <Link href="/users" className="flex items-center justify-center h-full">
                      <User className="h-12 w-12" />
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">Users</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="mt-auto pb-4 px-0">
          <SidebarMenu className="space-y-4 w-full">
            <SidebarMenuItem className="mx-0 px-2 my-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/organization"}
                    className="text-white/70 hover:text-[#0f2942] hover:bg-white justify-center h-16 py-4 rounded-lg w-full transition-all duration-200 border border-transparent hover:border-white/20"
                  >
                    <Link href="/organization" className="flex items-center justify-center h-full">
                      <Building className="h-12 w-12" />
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">Organization</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
            <SidebarMenuItem className="mx-0 px-2 my-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    className="text-white/70 hover:text-[#0f2942] hover:bg-white justify-center h-16 py-4 rounded-lg w-full transition-all duration-200 border border-transparent hover:border-white/20"
                  >
                    <Link href="/profile" className="flex items-center justify-center h-full">
                      <Avatar className="h-12 w-12 border-2 border-primary">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
                        <AvatarFallback>UN</AvatarFallback>
                      </Avatar>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">Profile</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}

