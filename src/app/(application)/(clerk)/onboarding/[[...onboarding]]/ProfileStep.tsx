'use client'
import { UserProfile } from '@clerk/nextjs'

export function ProfileStep() {
	return (
		<div className='space-y-4'>
			<h2 className='text-center text-xl font-semibold'>
				Complétez votre profil
			</h2>
			<p className='text-muted-foreground mb-4 text-center'>
				Ajoutez quelques informations pour personnaliser votre expérience et
				faciliter la collaboration
			</p>
			<div className='mt-8 flex w-full justify-center'>
				<UserProfile />
			</div>
		</div>
	)
}
