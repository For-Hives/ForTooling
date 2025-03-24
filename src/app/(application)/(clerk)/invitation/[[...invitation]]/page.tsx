'use client'

import { OrganizationProfile, useOrganization, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function InvitationPage() {
	const { isLoaded, isSignedIn } = useUser()
	const { isLoaded: orgIsLoaded, organization } = useOrganization()
	const router = useRouter()

	useEffect(() => {
		// If user is logged in and has joined the organization, redirect to app
		if (isLoaded && isSignedIn && orgIsLoaded && organization) {
			router.push('/app')
		}
	}, [isLoaded, isSignedIn, orgIsLoaded, organization, router])

	if (!isLoaded || !orgIsLoaded) {
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
					Complétez votre invitation
				</h1>
				<p className='text-muted-foreground text-sm'>
					Suivez les étapes pour rejoindre l&apos;organisation
				</p>
			</div>

			<div className='bg-card rounded-lg border p-6 shadow-sm'>
				<OrganizationProfile
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
