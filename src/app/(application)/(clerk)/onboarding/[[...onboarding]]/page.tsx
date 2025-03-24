'use client'

import { markOnboardingComplete } from '@/app/(application)/app/actions/user'
import { Container } from '@/components/app/container'
import { Button } from '@/components/ui/button'
import {
	Stepper,
	StepperItem,
	StepperTrigger,
	StepperIndicator,
	StepperSeparator,
	StepperTitle,
	StepperDescription,
} from '@/components/ui/stepper'
import { OnboardingStep, useOnboardingStore } from '@/stores/onboarding-store'
import {
	useUser,
	SignedIn,
	SignedOut,
	RedirectToSignIn,
	UserProfile,
} from '@clerk/nextjs'
import {
	ArrowLeft,
	ArrowRight,
	Building,
	CheckCircle2,
	Info,
	User,
	Laptop,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { NextRouter } from 'next/router'
import { useState, useEffect } from 'react'

// Onboarding steps data
const steps = [
	{
		description: 'Bienvenue sur notre plateforme',
		icon: <Info className='h-4 w-4' />,
		id: 0,
		title: 'Bienvenue',
	},
	{
		description: 'Découvrez les fonctionnalités clés',
		icon: <Laptop className='h-4 w-4' />,
		id: 1,
		title: 'Fonctionnalités',
	},
	{
		description: 'Configurez votre organisation',
		icon: <Building className='h-4 w-4' />,
		id: 2,
		title: 'Organisation',
	},
	{
		description: 'Complétez votre profil',
		icon: <User className='h-4 w-4' />,
		id: 3,
		title: 'Profil',
	},
	{
		description: 'Vous êtes prêt à commencer',
		icon: <CheckCircle2 className='h-4 w-4' />,
		id: 4,
		title: 'Prêt !',
	},
]

export default function OnboardingPage() {
	const { isLoaded, isSignedIn, user } = useUser()
	const router = useRouter()

	// Use the Zustand store
	const { currentStep, isLoading, setCurrentStep, setIsLoading } =
		useOnboardingStore()

	// Step content components stored in an array
	const [stepContents, setStepContents] = useState<React.ReactNode[]>([])

	useEffect(() => {
		// Check if user has completed onboarding
		if (
			isLoaded &&
			isSignedIn &&
			user?.publicMetadata?.hasCompletedOnboarding
		) {
			router.push('/app')
		}

		// Initialize step contents
		setStepContents([
			<WelcomeStep key='welcome' />,
			<FeaturesStep key='features' />,
			<OrganizationStep
				key='organization'
				router={router as unknown as NextRouter}
			/>,
			<ProfileStep key='profile' />,
			<CompletionStep
				key='completion'
				onComplete={completeOnboarding}
				isLoading={isLoading}
			/>,
		])
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoaded, isSignedIn, user, router, isLoading])

	const goToNextStep = () => {
		if (currentStep < 4) {
			setCurrentStep((currentStep + 1) as OnboardingStep)
		}
	}

	const goToPreviousStep = () => {
		if (currentStep > 0) {
			setCurrentStep((currentStep - 1) as OnboardingStep)
		}
	}

	async function completeOnboarding() {
		setIsLoading(true)
		try {
			await markOnboardingComplete()
			router.push('/app')
		} catch (error) {
			console.error('Failed to complete onboarding:', error)
		} finally {
			setIsLoading(false)
		}
	}

	if (!isLoaded) {
		return (
			<div className='flex h-full w-full items-center justify-center'>
				<div className='text-muted-foreground animate-pulse'>Chargement...</div>
			</div>
		)
	}

	return (
		<>
			<SignedIn>
				<Container isAlternative>
					<div className='flex w-full flex-col space-y-6'>
						<div className='space-y-2'>
							<h1 className='text-2xl font-semibold tracking-tight'>
								Bienvenue sur votre plateforme de gestion d&apos;équipements
							</h1>
							<p className='text-muted-foreground'>
								Suivez ces quelques étapes pour configurer votre compte
							</p>
						</div>

						<div className='w-full py-4'>
							<Stepper value={currentStep} className='w-full'>
								{steps.map((step, index) => (
									<StepperItem
										key={step.id}
										step={step.id}
										completed={currentStep > step.id}
										disabled={currentStep < step.id}
										loading={isLoading && currentStep === step.id}
										className='[&:not(:last-child)]:flex-1'
									>
										<StepperTrigger
											onClick={() =>
												currentStep >= step.id &&
												setCurrentStep(step.id as OnboardingStep)
											}
										>
											<StepperIndicator>{step.icon}</StepperIndicator>
											<div className='hidden flex-col text-left md:inline-flex'>
												<StepperTitle>{step.title}</StepperTitle>
												<StepperDescription>
													{step.description}
												</StepperDescription>
											</div>
										</StepperTrigger>
										{index < steps.length - 1 && <StepperSeparator />}
									</StepperItem>
								))}
							</Stepper>
						</div>

						<div className='bg-card min-h-[400px] w-full rounded-lg border p-6'>
							{stepContents[currentStep]}
						</div>

						<div className='flex w-full justify-between pt-4'>
							<Button
								variant='outline'
								onClick={goToPreviousStep}
								disabled={(currentStep as number) === 0}
							>
								<ArrowLeft className='mr-2 h-4 w-4' />
								Précédent
							</Button>

							{currentStep < 4 ? (
								<Button onClick={goToNextStep}>
									Suivant
									<ArrowRight className='ml-2 h-4 w-4' />
								</Button>
							) : (
								<Button onClick={completeOnboarding} disabled={isLoading}>
									{isLoading ? 'Chargement...' : 'Terminer'}
								</Button>
							)}
						</div>
					</div>
				</Container>
			</SignedIn>
			<SignedOut>
				<RedirectToSignIn />
			</SignedOut>
		</>
	)
}

// Step content components
function WelcomeStep() {
	return (
		<div className='space-y-4'>
			<div className='flex justify-center py-6'>
				<div className='bg-muted/30 flex h-64 w-64 items-center justify-center rounded-full'>
					{/* Replace with actual image when available */}
					<Building className='text-primary/40 h-32 w-32' />
				</div>
			</div>
			<h2 className='text-center text-xl font-semibold'>
				Bienvenue sur notre plateforme
			</h2>
			<p className='text-muted-foreground text-center'>
				Notre solution vous aide à suivre, attribuer et maintenir votre parc
				d&apos;équipements de manière simple et efficace grâce à la technologie
				NFC/QR.
			</p>
		</div>
	)
}

function FeaturesStep() {
	return (
		<div className='space-y-4'>
			<h2 className='text-center text-xl font-semibold'>
				Fonctionnalités principales
			</h2>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<div className='rounded-lg border p-4'>
					<h3 className='font-medium'>Suivi d&apos;équipements</h3>
					<p className='text-muted-foreground text-sm'>
						Localisez et suivez tous vos équipements en temps réel
					</p>
				</div>
				<div className='rounded-lg border p-4'>
					<h3 className='font-medium'>Attribution</h3>
					<p className='text-muted-foreground text-sm'>
						Affectez des équipements aux utilisateurs et aux projets
					</p>
				</div>
				<div className='rounded-lg border p-4'>
					<h3 className='font-medium'>Maintenance</h3>
					<p className='text-muted-foreground text-sm'>
						Planifiez et suivez les opérations de maintenance
					</p>
				</div>
				<div className='rounded-lg border p-4'>
					<h3 className='font-medium'>Rapports</h3>
					<p className='text-muted-foreground text-sm'>
						Générez des analyses détaillées sur l&apos;utilisation
					</p>
				</div>
			</div>
		</div>
	)
}

function OrganizationStep({ router }: { router: NextRouter }) {
	return (
		<div className='space-y-4'>
			<h2 className='text-center text-xl font-semibold'>
				Configurez votre organisation
			</h2>
			<p className='text-muted-foreground text-center'>
				Vous devez créer ou rejoindre une organisation pour commencer. Cela
				permettra de gérer les équipements et utilisateurs de votre entreprise.
			</p>
			<div className='flex flex-col justify-center gap-4 pt-4 sm:flex-row'>
				<Button
					onClick={() => router.push('/organization-profile')}
					className='w-full sm:w-auto'
				>
					Créer une organisation
				</Button>
				<Button
					variant='outline'
					onClick={() => router.push('/organizations')}
					className='w-full sm:w-auto'
				>
					Rejoindre une organisation
				</Button>
			</div>
		</div>
	)
}

function ProfileStep() {
	return (
		<div className='space-y-4'>
			<h2 className='text-center text-xl font-semibold'>
				Complétez votre profil
			</h2>
			<p className='text-muted-foreground mb-4 text-center'>
				Quelques informations pour personnaliser votre expérience
			</p>
			<div className='mx-auto max-w-md'>
				<UserProfile />
			</div>
		</div>
	)
}

function CompletionStep({
	isLoading,
	onComplete,
}: {
	onComplete: () => void
	isLoading: boolean
}) {
	return (
		<div className='space-y-4 text-center'>
			<div className='flex justify-center py-6'>
				<CheckCircle2 className='h-20 w-20 text-green-500' />
			</div>
			<h2 className='text-xl font-semibold'>Vous êtes prêt à commencer !</h2>
			<p className='text-muted-foreground'>
				Votre compte est maintenant configuré. Vous pouvez commencer à utiliser
				la plateforme pour gérer vos équipements.
			</p>
			<Button onClick={onComplete} disabled={isLoading} className='mt-4'>
				{isLoading ? 'Chargement...' : 'Accéder à la plateforme'}
			</Button>
		</div>
	)
}
