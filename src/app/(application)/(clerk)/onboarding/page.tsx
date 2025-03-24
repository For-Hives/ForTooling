'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function OnboardingPage() {
	const [showContactInfo, setShowContactInfo] = useState(false)

	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6'>
			<div className='w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md'>
				<div className='flex items-center justify-center gap-4'>
					<Image src='/logo.png' alt='logo' width={35} height={35} />
					<span className='text-sm font-bold text-gray-900 italic'>x</span>
					<UserButton />
				</div>
				<h1 className='text-center text-2xl font-bold text-gray-900'>
					Bienvenue sur ForTooling
				</h1>

				<p className='text-center text-gray-600'>
					Avant de commencer, vous devez être membre d&apos;une organisation.
				</p>

				<div className='space-y-6 pt-4'>
					<div className='rounded-lg border border-gray-200 p-4'>
						<h2 className='mb-2 text-lg font-medium'>
							Rejoignez une organisation existante
						</h2>
						<p className='mb-4 text-sm text-gray-600'>
							Si vous êtes membre d&apos;une organisation existante, veuillez
							attendre une invitation de l&apos;administrateur.
						</p>

						{!showContactInfo ? (
							<button
								onClick={() => setShowContactInfo(true)}
								className='cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800'
							>
								Je n&apos;ai pas reçu d&apos;invitation
							</button>
						) : (
							<div className='rounded-md bg-blue-50 p-3 text-sm'>
								<p>
									Contactez-nous à l&apos;adresse suivante:{' '}
									<Link
										href='mailto:contact@fortooling.fr'
										className='text-blue-600 hover:underline'
									>
										contact@fortooling.fr
									</Link>
								</p>
								<p className='mt-1'>
									Incluez le nom de votre entreprise et les détails de votre
									message.
								</p>
							</div>
						)}
					</div>

					<div className='rounded-lg border border-gray-200 p-4'>
						<h2 className='mb-2 text-lg font-medium'>
							Créez votre propre organisation
						</h2>
						<p className='mb-4 text-sm text-gray-600'>
							Vous pouvez créer votre propre organisation et commencer à
							utiliser ForTooling immédiatement.
						</p>

						<Link
							href='/create-organization'
							className='inline-block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
						>
							Créer une organisation
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
