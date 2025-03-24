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
	Construction,
	Wrench,
	ClipboardList,
	Scan,
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
			<OrganizationStep key='organization' hasOrganization={!!organization} />,
			<ProfileStep key='profile' />,
			<CompletionStep
				key='completion'
				onComplete={completeOnboarding}
				isLoading={isLoading}
			/>,
		])
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
				<Container isAlternative>
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

// Step content components
function WelcomeStep() {
	return (
		<div className='space-y-4'>
			<div className='flex justify-center py-6'>
				<div className='bg-muted/30 flex h-64 w-64 items-center justify-center rounded-full'>
					<img src='/logo.png' alt='ForTooling Logo' className='h-32 w-32' />
				</div>
			</div>
			<h2 className='text-center text-xl font-semibold'>
				Bienvenue sur ForTooling
			</h2>
			<p className='text-muted-foreground text-center'>
				Notre solution vous aide à suivre, attribuer et maintenir votre parc
				d&apos;équipements de manière simple et efficace grâce aux technologies
				NFC et QR code.
			</p>
			<div className='text-muted-foreground mt-8 text-center text-sm italic'>
				&quot;Plus jamais d&apos;équipements perdus ou mal attribués.&quot;
			</div>
		</div>
	)
}

function FeaturesStep() {
	return (
		<div className='space-y-4'>
			<h2 className='text-center text-xl font-semibold'>
				Découvrez nos fonctionnalités clés
			</h2>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<div className='rounded-lg border bg-white p-4 transition-shadow duration-200 hover:shadow-md'>
					<div className='mb-2 flex items-center gap-2'>
						<Wrench className='h-5 w-5 text-blue-500' />
						<h3 className='font-medium'>Suivi d&apos;équipements</h3>
					</div>
					<p className='text-muted-foreground text-sm'>
						Localisez et suivez tous vos équipements en temps réel avec la
						technologie NFC/QR
					</p>
				</div>
				<div className='rounded-lg border bg-white p-4 transition-shadow duration-200 hover:shadow-md'>
					<div className='mb-2 flex items-center gap-2'>
						<Construction className='h-5 w-5 text-amber-500' />
						<h3 className='font-medium'>Attribution aux projets</h3>
					</div>
					<p className='text-muted-foreground text-sm'>
						Affectez facilement des équipements aux utilisateurs et aux projets
					</p>
				</div>
				<div className='rounded-lg border bg-white p-4 transition-shadow duration-200 hover:shadow-md'>
					<div className='mb-2 flex items-center gap-2'>
						<Scan className='h-5 w-5 text-purple-500' />
						<h3 className='font-medium'>Scan rapide</h3>
					</div>
					<p className='text-muted-foreground text-sm'>
						Scannez les équipements en quelques secondes pour obtenir leur
						statut et les gérer
					</p>
				</div>
				<div className='rounded-lg border bg-white p-4 transition-shadow duration-200 hover:shadow-md'>
					<div className='mb-2 flex items-center gap-2'>
						<ClipboardList className='h-5 w-5 text-red-500' />
						<h3 className='font-medium'>Rapports détaillés</h3>
					</div>
					<p className='text-muted-foreground text-sm'>
						Générez des analyses détaillées sur l&apos;utilisation de votre parc
						matériel
					</p>
				</div>
			</div>
		</div>
	)
}

function OrganizationStep({ hasOrganization }: { hasOrganization: boolean }) {
	const router = useRouter()

	return (
		<div className='space-y-4'>
			<h2 className='text-center text-xl font-semibold'>
				Configurez votre organisation
			</h2>
			<p className='text-muted-foreground text-center'>
				Vous devez créer ou rejoindre une organisation pour continuer. Cela
				permettra de gérer les équipements et utilisateurs de votre entreprise.
			</p>

			{hasOrganization ? (
				<div className='mt-6 flex flex-col items-center'>
					<div className='mb-4 rounded-full bg-green-50 p-2 text-green-700'>
						<CheckCircle2 className='h-8 w-8' />
					</div>
					<p className='font-medium text-green-700'>
						Organisation configurée avec succès!
					</p>
					<p className='text-muted-foreground mt-2 text-sm'>
						Vous pouvez continuer vers l&apos;étape suivante.
					</p>
				</div>
			) : (
				<>
					<div className='flex flex-col justify-center gap-4 pt-4 sm:flex-row'>
						<Button
							onClick={() => router.push('/organization-profile')}
							className='w-full sm:w-auto'
						>
							<Building className='mr-2 h-4 w-4' />
							Créer une organisation
						</Button>
						<Button
							variant='outline'
							onClick={() => router.push('/organizations')}
							className='w-full sm:w-auto'
						>
							<User className='mr-2 h-4 w-4' />
							Rejoindre une organisation
						</Button>
					</div>
					<div className='mt-6 border-t pt-4'>
						<div className='rounded-lg bg-amber-50 p-4'>
							<p className='flex items-center gap-2 font-medium text-amber-700'>
								<Info className='h-5 w-5' /> Note importante
							</p>
							<p className='mt-1 text-sm text-amber-600'>
								Vous devez créer ou rejoindre une organisation avant de pouvoir
								continuer. Cliquez sur l&apos;un des boutons ci-dessus, puis
								revenez à cette page.
							</p>
						</div>
					</div>
				</>
			)}
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
				Ajoutez quelques informations pour personnaliser votre expérience et
				faciliter la collaboration
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
				<div className='rounded-full bg-green-50 p-6'>
					<CheckCircle2 className='h-20 w-20 text-green-500' />
				</div>
			</div>
			<h2 className='text-xl font-semibold'>
				Félicitations, vous êtes prêt à commencer !
			</h2>
			<p className='text-muted-foreground'>
				Votre compte est maintenant configuré. Vous pouvez commencer à utiliser
				ForTooling pour optimiser la gestion de votre parc d&apos;équipements.
			</p>
			<div className='mx-auto mt-4 max-w-md rounded-lg bg-blue-50 p-4'>
				<p className='text-sm text-blue-700'>
					Notre équipe est disponible pour vous aider si vous avez des
					questions. N&apos;hésitez pas à nous contacter à{' '}
					<strong>support@fortooling.fr</strong>
				</p>
			</div>
			<Button
				onClick={onComplete}
				disabled={isLoading}
				className='mt-6 bg-[#0f2942] px-8 py-2 hover:bg-[#0a1f34]'
				size='lg'
			>
				{isLoading ? 'Chargement...' : 'Accéder à la plateforme'}
			</Button>
		</div>
	)
}
