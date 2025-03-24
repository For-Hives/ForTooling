import '@/app/globals.css'

import type { Metadata } from 'next'
import type React from 'react'

import { AppSidebar } from '@/components/app/app-sidebar'
import { TopBar } from '@/components/app/top-bar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
	title: {
		default: "ForTooling - Gestion de l'outillage",
		template: '%s - ForTooling',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang='fr'>
				<head>
					<link
						rel='stylesheet'
						href='https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap'
					/>
				</head>
				<body className='text-gray-950 antialiased'>
					<div className={`h-full min-h-screen`}>
						<SidebarProvider>
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
				</body>
			</html>
		</ClerkProvider>
	)
}
