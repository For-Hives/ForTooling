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
		return <div>Chargement...</div>
	}

	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6'>
			<div className='w-full max-w-lg rounded-lg bg-white p-8 shadow-md'>
				<h1 className='mb-6 text-center text-2xl font-bold text-gray-900'>
					{`Complétez votre invitation`}
				</h1>

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
