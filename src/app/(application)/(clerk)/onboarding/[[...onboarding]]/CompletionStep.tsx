'use client'

import { Button } from '@/components/ui/button'
import confetti from 'canvas-confetti'
import { CheckCircle2, ThumbsUp, Rocket, CircleCheck } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function CompletionStep({
	isLoading,
	onComplete,
}: {
	onComplete: () => void
	isLoading: boolean
}) {
	const confettiTriggered = useRef(false)

	useEffect(() => {
		// Trigger confetti animation when component loads
		// But only once (using useRef for tracking)
		if (!confettiTriggered.current) {
			triggerConfetti()
			confettiTriggered.current = true
		}
	}, [])

	const triggerConfetti = () => {
		const end = Date.now() + 3 * 1000 // 3 seconds
		const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']

		// Side cannons animation (left and right)
		const frame = () => {
			if (Date.now() > end) return

			// Left side
			confetti({
				angle: 60,
				colors: colors,
				origin: { x: 0, y: 0.5 },
				particleCount: 2,
				spread: 55,
				startVelocity: 60,
			})

			// Right side
			confetti({
				angle: 120,
				colors: colors,
				origin: { x: 1, y: 0.5 },
				particleCount: 2,
				spread: 55,
				startVelocity: 60,
			})

			requestAnimationFrame(frame)
		}

		frame()

		// Add a central burst at the beginning
		confetti({
			origin: { y: 0.6 },
			particleCount: 100,
			spread: 70,
		})
	}

	return (
		<div className='space-y-4 text-center'>
			<div className='flex justify-center py-6'>
				<div className='rounded-full bg-green-50 p-6'>
					<CheckCircle2 className='h-20 w-20 text-green-500' />
				</div>
			</div>

			<h2 className='text-2xl font-bold'>Félicitations ! 🎉</h2>
			<p className='text-xl font-semibold text-[#0f2942]'>
				Vous êtes prêt à utiliser ForTooling
			</p>

			<div className='mx-auto mt-6 max-w-md'>
				<p className='text-muted-foreground'>
					Votre compte est maintenant configuré. Vous pouvez commencer à
					utiliser ForTooling pour optimiser la gestion de votre parc
					d&apos;équipements.
				</p>
			</div>

			<div className='mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-3'>
				<div className='flex flex-col items-center rounded-lg bg-blue-50 p-4 text-blue-700'>
					<ThumbsUp className='mb-2 h-8 w-8' />
					<p className='text-sm'>Gestion simplifiée</p>
				</div>
				<div className='flex flex-col items-center rounded-lg bg-green-50 p-4 text-green-700'>
					<Rocket className='mb-2 h-8 w-8' />
					<p className='text-sm'>Performance optimisée</p>
				</div>
				<div className='flex flex-col items-center rounded-lg bg-purple-50 p-4 text-purple-700'>
					<CircleCheck className='mb-2 h-8 w-8' />
					<p className='text-sm'>Expérience optimale</p>
				</div>
			</div>

			<div className='mx-auto mt-6 max-w-md rounded-lg bg-blue-50 p-4'>
				<p className='text-sm text-blue-700'>
					Notre équipe est disponible pour vous aider si vous avez des
					questions. N&apos;hésitez pas à nous contacter à{' '}
					<strong>contact@fortooling.com</strong>
				</p>
			</div>

			<div className='mt-10'>
				<Button
					onClick={onComplete}
					disabled={isLoading}
					className='mt-4 bg-[#0f2942] px-8 py-6 text-white hover:bg-[#0a1f34]'
					size='lg'
				>
					{isLoading ? 'Chargement...' : 'Accéder à la plateforme'}
				</Button>
			</div>
		</div>
	)
}
