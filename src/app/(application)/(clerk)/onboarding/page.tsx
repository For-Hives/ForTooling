'use client'

import { useUser, UserProfile } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OnboardingPage() {
	const { isLoaded, isSignedIn, user } = useUser()
	const router = useRouter()

	useEffect(() => {
		// Add appropriate redirection logic here
		if (
			isLoaded &&
			isSignedIn &&
			user?.publicMetadata?.hasCompletedOnboarding
		) {
			router.push('/app')
		}
	}, [isLoaded, isSignedIn, user, router])

	if (!isLoaded) {
		return (
			<div className='flex h-full w-full items-center justify-center'>
				<div className='text-muted-foreground animate-pulse'>Chargement...</div>
			</div>
		)
	}

	return (
		<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
			<div className='flex flex-col space-y-2 text-center'>
				<h1 className='text-2xl font-semibold tracking-tight'>
					Complétez votre profil
				</h1>
				<p className='text-muted-foreground text-sm'>
					Quelques informations supplémentaires pour commencer
				</p>
			</div>

			<div className='bg-card rounded-lg border p-6 shadow-sm'>
				<UserProfile
					appearance={{
						elements: {
							card: {
								border: 'none',
								boxShadow: 'none',
							},
							rootBox: {
								boxShadow: 'none',
								width: '100%',
							},
						},
					}}
				/>
			</div>
		</div>
	)
}
