// src/app/waiting-approval/page.tsx
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
export default function WaitingApproval() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6'>
			<div className='w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md'>
				<div className='flex items-center justify-center gap-4'>
					<Image src='/logo.png' alt='logo' width={35} height={35} />
					<span className='text-sm font-bold text-gray-900 italic'>x</span>
					<UserButton />
				</div>

				<h1 className='text-center text-2xl font-bold text-gray-900'>
					Votre compte est en attente d&apos;approbation
				</h1>

				<p className='text-center text-gray-600'>
					Merci de vous être inscrit à ForTooling. Un administrateur doit vous
					inviter à une organisation avant que vous puissiez accéder à
					l&apos;application.
				</p>

				<p className='text-center text-gray-600'>
					Vous recevrez un email lorsque votre invitation sera disponible.
				</p>
			</div>
		</div>
	)
}
