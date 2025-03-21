import type { Metadata } from 'next'

import { BentoCard } from '@/app/(marketing)/components/bento-card'
import { Button } from '@/app/(marketing)/components/button'
import { Container } from '@/app/(marketing)/components/container'
import { Footer } from '@/app/(marketing)/components/footer'
import { Gradient } from '@/app/(marketing)/components/gradient'
import { Keyboard } from '@/app/(marketing)/components/keyboard'
import { Logo } from '@/app/(marketing)/components/logo'
import { Map } from '@/app/(marketing)/components/map'
import { Navbar } from '@/app/(marketing)/components/navbar'
import { Heading, Subheading } from '@/app/(marketing)/components/text'

export const metadata: Metadata = {
	description:
		"ForTooling aide les entreprises BTP à suivre, attribuer et maintenir leur parc d'équipements via une interface simple et des QR codes.",
}

function Hero() {
	return (
		<div className='relative'>
			<Gradient className='absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset' />
			<Container className='relative'>
				<Navbar />
				<div className='pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48'>
					<h1 className='font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]'>
						ForTooling
					</h1>
					<p className='mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8'>
						Suivez votre matériel BTP sans effort et sans vous ruiner. Solution
						complète de suivi d'équipements par QR code à prix imbattable.
					</p>
					<div className='mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row'>
						<Button href='#contact'>Nous contacter</Button>
						{/* 
							TODO: Ajouter bouton "Essai gratuit" quand disponible 
							<Button variant='secondary' href='/signup'>Essai gratuit</Button>
						*/}

						{/*
							TODO: Ajouter bouton de connexion Clerk quand disponible
							<Button variant='secondary' href='/signin'>Connexion</Button>
						*/}
					</div>
				</div>
			</Container>
		</div>
	)
}

function FeatureSection() {
	return (
		<div className='overflow-hidden'>
			<Container className='pb-24'>
				<Heading as='h2' className='max-w-3xl'>
					Gestion simplifiée de vos équipements BTP
				</Heading>
				<div className='mt-8 space-y-6 text-xl text-gray-700'>
					<p>
						ForTooling est une solution SaaS qui permet aux entreprises du BTP
						de:
					</p>
					<ul className='list-disc space-y-3 pl-6'>
						<li>Suivre la localisation de chaque équipement par QR code</li>
						<li>
							Attribuer facilement le matériel aux employés ou aux chantiers
						</li>
						<li>Réduire significativement les pertes d'équipements</li>
						<li>Simplifier la gestion quotidienne de votre parc matériel</li>
					</ul>
					<p>Le tout à un prix défiant toute concurrence.</p>
				</div>

				{/* 
					TODO: Ajouter des captures d'écran réelles quand disponibles
					<Screenshot
						width={1216}
						height={768}
						src='/screenshots/app.png'
						className='mt-16 h-[36rem] sm:h-auto sm:w-[76rem]'
					/>
				*/}

				<div className='mt-16 flex justify-center'>
					<img src='/logo.png' alt='ForTooling logo' className='h-40 w-auto' />
				</div>
			</Container>
		</div>
	)
}

function ConstructionNotice() {
	return (
		<div className='mx-2 mt-2 rounded-4xl bg-gray-900 py-24'>
			<Container>
				<Subheading dark>Lancement imminent</Subheading>
				<Heading as='h3' dark className='mt-2 max-w-3xl'>
					Notre plateforme sera bientôt disponible.
				</Heading>

				<div className='mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-3'>
					<BentoCard
						dark
						eyebrow='Programme pionnier'
						title='Rejoignez nos premiers utilisateurs'
						description="Bénéficiez de 50% de réduction la première année et d'un accompagnement personnalisé en rejoignant notre programme Pionnier."
						graphic={<Logo />}
						className='lg:col-span-1'
					/>

					<BentoCard
						dark
						eyebrow='En construction'
						title="L'équipe ForTooling travaille d'arrache-pied"
						description='Notre équipe met les bouchées doubles pour vous livrer une solution clé en main adaptée aux besoins réels du terrain.'
						graphic={<Keyboard highlighted={['F', 'T']} />}
						className='lg:col-span-1'
					/>

					<BentoCard
						dark
						eyebrow='Déploiement'
						title='Prêt en un temps record'
						description='La solution sera déployée sur vos chantiers en 48h seulement, sans perturber votre activité quotidienne.'
						graphic={<Map />}
						className='lg:col-span-1'
					/>
				</div>
			</Container>
		</div>
	)
}

function PricingSection() {
	return (
		<Container className='py-24'>
			<Heading as='h2' className='text-center'>
				Tarification simple et transparente
			</Heading>
			<p className='mx-auto mt-4 max-w-2xl text-center text-xl text-gray-600'>
				Des forfaits adaptés à toutes les tailles d&apos;entreprise, sans coûts
				cachés.
			</p>

			<div className='mt-16 grid grid-cols-1 gap-8 md:grid-cols-3'>
				{/* Plan Essentiel */}
				<div className='rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md'>
					<h3 className='text-lg font-semibold text-gray-900'>Essentiel</h3>
					<p className='mt-2 text-sm text-gray-500'>
						Pour les petites entreprises
					</p>

					<div className='mt-6 flex items-baseline'>
						<span className='text-4xl font-bold tracking-tight'>1,90€</span>
						<span className='ml-1 text-lg text-gray-500'>/jour</span>
					</div>

					<p className='mt-1 text-sm text-gray-500'>Facturé mensuellement</p>

					<ul className='mt-8 space-y-4 text-sm'>
						<li className='flex items-start'>
							<svg
								className='mr-2 h-5 w-5 flex-shrink-0 text-blue-600'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
									clipRule='evenodd'
								></path>
							</svg>
							Jusqu&apos;à 100 équipements
						</li>
						<li className='flex items-start'>
							<svg
								className='mr-2 h-5 w-5 flex-shrink-0 text-blue-600'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
									clipRule='evenodd'
								></path>
							</svg>
							5 utilisateurs maximum
						</li>
						<li className='flex items-start'>
							<svg
								className='mr-2 h-5 w-5 flex-shrink-0 text-blue-600'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
									clipRule='evenodd'
								></path>
							</svg>
							Fonctionnalités essentielles
						</li>
					</ul>

					<div className='mt-8'>
						{/* TODO: Activer bouton quand inscription disponible */}
						<Button href='#contact' className='w-full'>
							Nous contacter
						</Button>
					</div>
				</div>

				{/* Plan Business */}
				<div className='relative rounded-3xl border-2 border-blue-600 bg-white p-8 shadow-md'>
					<div className='absolute -top-5 right-0 left-0 mx-auto w-fit rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white'>
						Recommandé
					</div>

					<h3 className='text-lg font-semibold text-gray-900'>Business</h3>
					<p className='mt-2 text-sm text-gray-500'>
						Pour les entreprises en croissance
					</p>

					<div className='mt-6 flex items-baseline'>
						<span className='text-4xl font-bold tracking-tight'>3,90€</span>
						<span className='ml-1 text-lg text-gray-500'>/jour</span>
					</div>

					<p className='mt-1 text-sm text-gray-500'>Facturé mensuellement</p>

					<ul className='mt-8 space-y-4 text-sm'>
						<li className='flex items-start'>
							<svg
								className='mr-2 h-5 w-5 flex-shrink-0 text-blue-600'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
									clipRule='evenodd'
								></path>
							</svg>
							Jusqu&apos;à 500 équipements
						</li>
						<li className='flex items-start'>
							<svg
								className='mr-2 h-5 w-5 flex-shrink-0 text-blue-600'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
									clipRule='evenodd'
								></path>
							</svg>
							20 utilisateurs maximum
						</li>
						<li className='flex items-start'>
							<svg
								className='mr-2 h-5 w-5 flex-shrink-0 text-blue-600'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
									clipRule='evenodd'
								></path>
							</svg>
							Fonctionnalités avancées
						</li>
						<li className='flex items-start'>
							<svg
								className='mr-2 h-5 w-5 flex-shrink-0 text-blue-600'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
									clipRule='evenodd'
								></path>
							</svg>
							Support prioritaire
						</li>
					</ul>

					<div className='mt-8'>
						{/* TODO: Activer bouton quand inscription disponible */}
						<Button href='#contact' className='w-full'>
							Nous contacter
						</Button>
					</div>
				</div>

				{/* Plan Enterprise */}
				<div className='rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md'>
					<h3 className='text-lg font-semibold text-gray-900'>Enterprise</h3>
					<p className='mt-2 text-sm text-gray-500'>
						Pour les grandes entreprises
					</p>

					<div className='mt-6 flex items-baseline'>
						<span className='text-4xl font-bold tracking-tight'>
							Sur mesure
						</span>
					</div>

					<p className='mt-1 text-sm text-gray-500'>
						Contactez-nous pour un devis
					</p>

					<ul className='mt-8 space-y-4 text-sm'>
						<li className='flex items-start'>
							<svg
								className='mr-2 h-5 w-5 flex-shrink-0 text-blue-600'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
									clipRule='evenodd'
								></path>
							</svg>
							Équipements illimités
						</li>
						<li className='flex items-start'>
							<svg
								className='mr-2 h-5 w-5 flex-shrink-0 text-blue-600'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
									clipRule='evenodd'
								></path>
							</svg>
							Utilisateurs illimités
						</li>
						<li className='flex items-start'>
							<svg
								className='mr-2 h-5 w-5 flex-shrink-0 text-blue-600'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
									clipRule='evenodd'
								></path>
							</svg>
							Toutes les fonctionnalités
						</li>
						<li className='flex items-start'>
							<svg
								className='mr-2 h-5 w-5 flex-shrink-0 text-blue-600'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
									clipRule='evenodd'
								></path>
							</svg>
							Personnalisation complète
						</li>
					</ul>

					<div className='mt-8'>
						<Button href='#contact' className='w-full'>
							Contacter un expert
						</Button>
					</div>
				</div>
			</div>

			<p className='mx-auto mt-8 max-w-2xl text-center text-sm text-gray-500'>
				* Tous les prix sont affichés hors taxes. Réduction de 50% pour les 20
				premiers clients "Pionniers".
			</p>
		</Container>
	)
}

function ContactSection() {
	return (
		<Container className='py-24'>
			<Heading as='h2' className='text-center'>
				Contactez-nous
			</Heading>
			<div className='mt-8 text-center text-xl'>
				<p>Vous souhaitez en savoir plus ou être informé du lancement?</p>
				<p className='mt-4 font-medium text-blue-600'>
					<a href='mailto:contact@fortooling.fr'>contact@fortooling.fr</a>
				</p>

				{/*
					TODO: Ajouter un formulaire de contact complet
					<form className='mt-8 mx-auto max-w-md'>...</form>
				*/}
			</div>
		</Container>
	)
}

export default function Home() {
	return (
		<div className='overflow-hidden'>
			<Hero />
			<main>
				<div className='bg-linear-to-b from-white from-50% to-gray-100 py-16'>
					<FeatureSection />
					<ConstructionNotice />
					<PricingSection />
					<ContactSection />

					{/*
						TODO: Ajouter sections quand contenu disponible
						- Problème/Solution 
						- Comment ça marche (3 étapes)
						- Avantages vs concurrence
						- Témoignages
					*/}
				</div>
			</main>
			{/*
				TODO: Remplacer par des vrais témoignages quand disponibles
				<Testimonials />
			*/}
			<Footer />
		</div>
	)
}
