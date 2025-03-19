'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
	Construction,
	Wrench,
	User,
	Building,
	HardHat,
	Scan,
	ClipboardList,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AppSidebar() {
	const pathname = usePathname()

	return (
		<Sidebar
			className='fixed top-0 left-0 z-50 h-screen w-20 flex-shrink-0 border-r-0 bg-[#0f2942]'
			collapsible='none'
		>
			<div className='flex h-16 items-center justify-center border-b-0 px-0'>
				<Link
					href='/app'
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
						<SidebarMenuButton
							asChild
							isActive={pathname?.startsWith('/app/equipments')}
							className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white hover:text-[#0f2942]'
						>
							<Link
								href='/app/equipments'
								className='flex h-full items-center justify-center'
							>
								<Wrench className='h-8 w-8' />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem className='mx-0 my-2 px-2'>
						<SidebarMenuButton
							asChild
							isActive={pathname?.startsWith('/app/projects')}
							className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white hover:text-[#0f2942]'
						>
							<Link
								href='/app/projects'
								className='flex h-full items-center justify-center'
							>
								<Construction className='h-8 w-8' />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem className='mx-0 my-2 px-2'>
						<SidebarMenuButton
							asChild
							isActive={pathname?.startsWith('/app/users')}
							className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white hover:text-[#0f2942]'
						>
							<Link
								href='/app/users'
								className='flex h-full items-center justify-center'
							>
								<User className='h-8 w-8' />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem className='mx-0 my-2 px-2'>
						<SidebarMenuButton
							asChild
							isActive={pathname?.startsWith('/app/scan')}
							className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white hover:text-[#0f2942]'
						>
							<Link
								href='/app/scan'
								className='flex h-full items-center justify-center'
							>
								<Scan className='h-8 w-8' />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem className='mx-0 my-2 px-2'>
						<SidebarMenuButton
							asChild
							isActive={pathname?.startsWith('/app/inventory')}
							className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white hover:text-[#0f2942]'
						>
							<Link
								href='/app/inventory'
								className='flex h-full items-center justify-center'
							>
								<ClipboardList className='h-8 w-8' />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter className='mt-auto px-0 pb-4'>
				<SidebarMenu className='w-full space-y-4'>
					<SidebarMenuItem className='mx-0 my-2 px-2'>
						<SidebarMenuButton
							asChild
							isActive={pathname?.startsWith('/app/organization')}
							className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white hover:text-[#0f2942]'
						>
							<Link
								href='/app/organization'
								className='flex h-full items-center justify-center'
							>
								<Building className='h-8 w-8' />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem className='mx-0 my-2 px-2'>
						<SidebarMenuButton
							asChild
							className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white hover:text-[#0f2942]'
						>
							<Link
								href='/app/profile'
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
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
