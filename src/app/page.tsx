import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from '@clerk/nextjs'

export default function Home() {
	return (
		<div className='grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20'>
			<header className='flex items-center justify-end p-4'>
				<SignedIn>
					<UserButton signOutUrl='/' />
				</SignedIn>
				<SignedOut>
					<div className='space-x-2'>
						<SignInButton mode='modal' />
						<SignUpButton mode='modal' />
					</div>
				</SignedOut>
			</header>
			<h1>Fortooling</h1>
		</div>
	)
}
