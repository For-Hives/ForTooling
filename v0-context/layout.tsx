import type React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { TopBar } from '@/components/top-bar'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en' className='h-full'>
			<body className={`${inter.className} h-full min-h-screen`}>
				<ThemeProvider>
					<SidebarProvider defaultOpen={true}>
						<AppSidebar />
						<div className='ml-20 min-h-screen'>
							<TopBar />
							<main className='min-h-[calc(100vh-4rem)] w-full overflow-auto bg-gray-100'>
								<div className='h-full w-full max-w-full p-4'>{children}</div>
							</main>
						</div>
					</SidebarProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
