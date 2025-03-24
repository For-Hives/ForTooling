'use client'
import Image from 'next/image'

export function WelcomeStep() {
	return (
		<div className='space-y-4'>
			<div className='flex justify-center py-6'>
				<div className='bg-muted/30 flex h-64 w-64 items-center justify-center rounded-full'>
					<Image
						src='/logo.png'
						alt='ForTooling Logo'
						className='h-32 w-32'
						width={128}
						height={128}
					/>
				</div>
			</div>
			<h2 className='text-center text-xl font-semibold'>
				Bienvenue sur ForTooling
			</h2>
			<p className='text-muted-foreground text-center'>
				Notre solution vous aide à suivre, attribuer et maintenir votre parc
				d&apos;équipements de manière simple <br />
				et efficace grâce aux technologies NFC et QR code.
			</p>
			<div className='text-muted-foreground mt-8 text-center text-sm italic'>
				À jamais les casse-têtes de la gestion de votre parc d&apos;équipements.
			</div>
		</div>
	)
}
