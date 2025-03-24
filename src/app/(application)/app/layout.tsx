import type { Metadata } from 'next'
import type React from 'react'

import { AppSidebar } from '@/components/app/app-sidebar'
import { TopBar } from '@/components/app/top-bar'
import '@/app/globals.css'
import { SidebarProvider } from '@/components/ui/sidebar'
import {
	ClerkProvider,
	RedirectToSignIn,
	SignedIn,
	SignedOut,
} from '@clerk/nextjs'

export const metadata: Metadata = {
	title: {
		default: 'Radiant - Close every deal',
		template: '%s - Radiant',
	},
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='fr'>
			<head>
				<link
					rel='stylesheet'
					href='https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap'
				/>
			</head>
			<body className='text-gray-950 antialiased'>
				<ClerkProvider>
					<SignedIn>
						<div className={`h-full min-h-screen`}>
							<SidebarProvider defaultOpen={true}>
								<AppSidebar />
								<div className='ml-20 min-h-screen w-full bg-[#0f2942]'>
									<TopBar />
									<main className='min-h-[calc(100vh-4rem)] w-full overflow-auto rounded-tl-xl bg-stone-50'>
										<div className='h-full w-full max-w-full p-4'>
											{children}
										</div>
									</main>
								</div>
							</SidebarProvider>
						</div>
					</SignedIn>
					<SignedOut>
						<RedirectToSignIn redirectUrl={'/sign-in'} />
					</SignedOut>
				</ClerkProvider>
			</body>
		</html>
	)
}
