'use client'

import { CompletionStep } from '@/app/(application)/(clerk)/onboarding/[[...onboarding]]/CompletionStep'
import { FeaturesStep } from '@/app/(application)/(clerk)/onboarding/[[...onboarding]]/FeaturesStep'
import { OrganizationStep } from '@/app/(application)/(clerk)/onboarding/[[...onboarding]]/OrganizationStep'
import { ProfileStep } from '@/app/(application)/(clerk)/onboarding/[[...onboarding]]/ProfileStep'
import { WelcomeStep } from '@/app/(application)/(clerk)/onboarding/[[...onboarding]]/WelcomeStep'
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
	useOrganization,
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
import { useState, useEffect } from 'react'

// Onboarding steps data
const steps = [
	{
		description: 'Bienvenue sur ForTooling',
		icon: <Info className='h-4 w-4' />,
		id: 1,
		title: 'Bienvenue',
	},
	{
		description: 'Découvrez les fonctionnalités clés',
		icon: <Laptop className='h-4 w-4' />,
		id: 2,
		title: 'Fonctionnalités',
	},
	{
		description: 'Configurez votre organisation',
		icon: <Building className='h-4 w-4' />,
		id: 3,
		title: 'Organisation',
	},
	{
		description: 'Complétez votre profil',
		icon: <User className='h-4 w-4' />,
		id: 4,
		title: 'Profil',
	},
	{
		description: 'Vous êtes prêt à commencer',
		icon: <CheckCircle2 className='h-4 w-4' />,
		id: 5,
		title: 'Prêt !',
	},
]

export default function OnboardingPage() {
	const { isLoaded, isSignedIn, user } = useUser()
	const router = useRouter()
	const { organization } = useOrganization()

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
				hasOrganization={!!organization}
				organization={organization || {}}
			/>,
			<ProfileStep key='profile' />,
			<CompletionStep
				key='completion'
				onComplete={completeOnboarding}
				isLoading={isLoading}
			/>,
		])
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoaded, isSignedIn, user, router, isLoading, organization])

	const goToNextStep = () => {
		// Check if we're on the organization step (index 2) and block if no organization
		if (currentStep === 3 && !organization) {
			return // Block progression if no organization
		}

		if (currentStep < 5) {
			setCurrentStep((currentStep + 1) as OnboardingStep)
		}
	}

	const goToPreviousStep = () => {
		if (currentStep > 1) {
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
				<Container>
					<div className='flex w-full flex-col space-y-6'>
						<div className='space-y-2'>
							<h1 className='text-2xl font-semibold tracking-tight'>
								Bienvenue sur votre plateforme de gestion d&apos;équipements
							</h1>
							<p className='text-muted-foreground'>
								Suivez ces quelques étapes pour configurer votre compte et
								commencer à utiliser ForTooling
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
							{stepContents[currentStep - 1]}
						</div>

						<div className='flex w-full justify-between pt-4'>
							<Button
								variant='outline'
								onClick={goToPreviousStep}
								disabled={currentStep === 1}
							>
								<ArrowLeft className='mr-2 h-4 w-4' />
								Précédent
							</Button>

							{currentStep < 5 ? (
								<Button
									onClick={goToNextStep}
									disabled={currentStep === 3 && !organization}
								>
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
