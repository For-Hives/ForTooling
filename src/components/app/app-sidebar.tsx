'use client'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import {
	OrganizationSwitcher,
	RedirectToSignIn,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/nextjs'
import {
	Construction,
	Wrench,
	User,
	HardHat,
	Scan,
	ClipboardList,
	Building,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const DotIcon = () => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 512 512'
			fill='currentColor'
		>
			<path d='M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z' />
		</svg>
	)
}

export function AppSidebar() {
	const pathname = usePathname()

	return (
		<Sidebar
			className='fixed top-0 left-0 z-50 h-screen w-20 flex-shrink-0 border-r-0 bg-[#0f2942]'
			collapsible='none'
		>
			<div className='flex h-16 items-center justify-center border-b-0 px-0'>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href='/app'
							className='flex h-full w-full items-center justify-center'
						>
							<div className='text-primary relative flex h-10 w-10 items-center justify-center rounded-md bg-white'>
								<HardHat className='h-5 w-5' />
							</div>
						</Link>
					</TooltipTrigger>
					<TooltipContent side='right'>Accueil</TooltipContent>
				</Tooltip>
			</div>
			<SidebarContent className='px-1 pt-6'>
				<SidebarMenu className='w-full space-y-4'>
					<SignedIn>
						<SidebarMenuItem className='mx-0 my-2 px-2'>
							<Tooltip>
								<TooltipTrigger asChild>
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
								</TooltipTrigger>
								<TooltipContent side='right'>Équipements</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
						<SidebarMenuItem className='mx-0 my-2 px-2'>
							<Tooltip>
								<TooltipTrigger asChild>
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
								</TooltipTrigger>
								<TooltipContent side='right'>Projets</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
						<SidebarMenuItem className='mx-0 my-2 px-2'>
							<Tooltip>
								<TooltipTrigger asChild>
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
								</TooltipTrigger>
								<TooltipContent side='right'>Utilisateurs</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
						<SidebarMenuItem className='mx-0 my-2 px-2'>
							<Tooltip>
								<TooltipTrigger asChild>
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
								</TooltipTrigger>
								<TooltipContent side='right'>Scanner</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
						<SidebarMenuItem className='mx-0 my-2 px-2'>
							<Tooltip>
								<TooltipTrigger asChild>
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
								</TooltipTrigger>
								<TooltipContent side='right'>Inventaire</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
					</SignedIn>
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter className='mt-auto px-0 pb-4'>
				<SignedIn>
					<SidebarMenu className='w-full space-y-4'>
						<SidebarMenuItem className='mx-0 my-2 px-2'>
							<Tooltip>
								<TooltipTrigger asChild>
									<SidebarMenuButton
										asChild
										className='h-16 w-full justify-center rounded-lg border border-transparent py-4 text-white/70 transition-all duration-200 hover:text-[#0f2942]'
									>
										<div className='flex h-full items-center justify-center'>
											<SignedIn>
												<div className='flex h-full items-center justify-center'>
													<UserButton />
												</div>
											</SignedIn>
											<SignedOut>
												<RedirectToSignIn />
											</SignedOut>
										</div>
									</SidebarMenuButton>
								</TooltipTrigger>
								<TooltipContent side='right'>Profil</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
						<SidebarMenuItem className='mx-0 my-2 px-2'>
							<Tooltip>
								<TooltipTrigger asChild>
									<SidebarMenuButton asChild>
										<SignedIn>
											<div className='mr-6'>
												<OrganizationSwitcher
													hidePersonal
													hideSlug
													appearance={{
														elements: {
															organizationPreviewTextContainer__organizationSwitcherTrigger:
																'!hidden',
															organizationSwitcherTrigger: '!text-white',
														},
													}}
												></OrganizationSwitcher>
											</div>
										</SignedIn>
									</SidebarMenuButton>
								</TooltipTrigger>
							</Tooltip>
						</SidebarMenuItem>
					</SidebarMenu>
				</SignedIn>
			</SidebarFooter>
		</Sidebar>
	)
}
