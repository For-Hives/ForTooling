'use client'

import { Container } from '@/components/app/container'
import {
	useUser,
	UserProfile,
	SignedIn,
	SignedOut,
	RedirectToSignIn,
} from '@clerk/nextjs'
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
		<>
			{/* todo : onboarding page */}
			<SignedIn>
				<Container isAlternative>
					<div className='flex w-full flex-col items-start space-y-2'>
						<h1 className='text-2xl font-semibold tracking-tight'>
							Complétez votre profil
						</h1>
						<p className='text-muted-foreground text-sm'>
							Quelques informations supplémentaires pour commencer
						</p>
					</div>

					<div className='pt-4'>
						<UserProfile />
					</div>
				</Container>
			</SignedIn>
			<SignedOut>
				<RedirectToSignIn />
			</SignedOut>
		</>
	)
}
