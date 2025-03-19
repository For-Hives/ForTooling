'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Construction, Wrench, User, Building, HardHat } from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from '@/components/ui/tooltip'

export function AppSidebar() {
	const pathname = usePathname()

	return (
		<TooltipProvider>
			<Sidebar
				className='fixed top-0 left-0 z-50 h-screen w-20 flex-shrink-0 border-r-0 bg-[#0f2942]'
				collapsible='none'
			>
				<div className='flex h-16 items-center justify-center border-b-0 px-0'>
					<Link
						href='/'
						className='flex h-full w-full items-center justify-center'
					>
						<div className='bg-primary text-primary-foreground relative flex h-8 w-8 items-center justify-center rounded-md'>
							<HardHat className='h-5 w-5' />
						</div>
					</Link>
				</div>
				<SidebarContent className='px-1 pt-6'>
					<SidebarMenu className='w-full space-y-4'>
						<SidebarMenuItem className='mx-0 my-2 px-2'>
							<Tooltip>
								<TooltipTrigger asChild>
									<SidebarMenuButton
										asChild
										isActive={pathname === '/projects'}
										className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white hover:text-[#0f2942]'
									>
										<Link
											href='/projects'
											className='flex h-full items-center justify-center'
										>
											<Construction className='h-12 w-12' />
										</Link>
									</SidebarMenuButton>
								</TooltipTrigger>
								<TooltipContent side='right'>Projects</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
						<SidebarMenuItem className='mx-0 my-2 px-2'>
							<Tooltip>
								<TooltipTrigger asChild>
									<SidebarMenuButton
										asChild
										isActive={pathname === '/equipment'}
										className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white hover:text-[#0f2942]'
									>
										<Link
											href='/equipment'
											className='flex h-full items-center justify-center'
										>
											<Wrench className='h-12 w-12' />
										</Link>
									</SidebarMenuButton>
								</TooltipTrigger>
								<TooltipContent side='right'>Equipment</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
						<SidebarMenuItem className='mx-0 my-2 px-2'>
							<Tooltip>
								<TooltipTrigger asChild>
									<SidebarMenuButton
										asChild
										isActive={pathname === '/users'}
										className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white hover:text-[#0f2942]'
									>
										<Link
											href='/users'
											className='flex h-full items-center justify-center'
										>
											<User className='h-12 w-12' />
										</Link>
									</SidebarMenuButton>
								</TooltipTrigger>
								<TooltipContent side='right'>Users</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarContent>
				<SidebarFooter className='mt-auto px-0 pb-4'>
					<SidebarMenu className='w-full space-y-4'>
						<SidebarMenuItem className='mx-0 my-2 px-2'>
							<Tooltip>
								<TooltipTrigger asChild>
									<SidebarMenuButton
										asChild
										isActive={pathname === '/organization'}
										className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white hover:text-[#0f2942]'
									>
										<Link
											href='/organization'
											className='flex h-full items-center justify-center'
										>
											<Building className='h-12 w-12' />
										</Link>
									</SidebarMenuButton>
								</TooltipTrigger>
								<TooltipContent side='right'>Organization</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
						<SidebarMenuItem className='mx-0 my-2 px-2'>
							<Tooltip>
								<TooltipTrigger asChild>
									<SidebarMenuButton
										asChild
										className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white hover:text-[#0f2942]'
									>
										<Link
											href='/profile'
											className='flex h-full items-center justify-center'
										>
											<Avatar className='border-primary h-12 w-12 border-2'>
												<AvatarImage
													src='/placeholder.svg?height=48&width=48'
													alt='User'
												/>
												<AvatarFallback>UN</AvatarFallback>
											</Avatar>
										</Link>
									</SidebarMenuButton>
								</TooltipTrigger>
								<TooltipContent side='right'>Profile</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
		</TooltipProvider>
	)
}
