import '@/app/globals.css'

import type { Metadata } from 'next'

import { ClerkProvider, OrganizationSwitcher, UserButton } from '@clerk/nextjs'
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
					<div className='flex min-h-screen flex-col'>
						<header className='flex items-center justify-between bg-[#0f2942] px-6 py-3 text-white'>
							<h1 className='text-xl font-bold'>ForTooling</h1>
							<div className='flex items-center gap-4'>
								<OrganizationSwitcher
									hidePersonal={true}
									appearance={{
										elements: {
											organizationName: {
												color: 'white',
											},
											organizationSwitcherTrigger: {
												color: 'white',
											},
											rootBox: {
												display: 'flex',
											},
										},
									}}
								/>
								<UserButton />
							</div>
						</header>
						<main className='flex-1'>{children}</main>
					</div>
				</body>
			</html>
		</ClerkProvider>
	)
}
