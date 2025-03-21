import type { Metadata } from 'next'

import { Button } from '@/app/(marketing)/components/button'
import { Container } from '@/app/(marketing)/components/container'
import { Footer } from '@/app/(marketing)/components/footer'
import { Gradient } from '@/app/(marketing)/components/gradient'
import { Navbar } from '@/app/(marketing)/components/navbar'
import { Screenshot } from '@/app/(marketing)/components/screenshot'
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
		<Container className='py-16 text-center'>
			<div className='rounded-xl bg-blue-50 p-8'>
				<Heading as='h3' className='text-3xl'>
					🚧 Site en construction 🚧
				</Heading>
				<p className='mt-4 text-lg text-gray-700'>
					Nous travaillons activement sur le développement de ForTooling. La
					plateforme sera bientôt disponible avec toutes ses fonctionnalités.
				</p>
				<p className='mt-4 text-lg font-medium text-gray-800'>
					Intéressé? Contactez-nous dès maintenant pour être informé du
					lancement et bénéficier d'offres exclusives.
				</p>
			</div>
		</Container>
	)
}

function ContactSection() {
	return (
		<Container id='contact' className='pt-16 pb-24'>
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

function SimpleFooter() {
	return (
		<footer className='border-t border-gray-200 bg-gray-50 py-12'>
			<Container>
				<div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
					<div className='flex items-center gap-2'>
						<img src='/logo.png' alt='ForTooling' className='h-8 w-auto' />
						<p className='text-sm text-gray-500'>
							© {new Date().getFullYear()} ForTooling. Tous droits réservés.
						</p>
					</div>

					{/* 
						TODO: Ajouter les liens vers pages légales quand disponibles
						<div className='flex gap-6 text-sm text-gray-500'>
							<a href='/mentions-legales'>Mentions légales</a>
							<a href='/politique-confidentialite'>Confidentialité</a>
							<a href='/cgv'>CGV</a>
						</div>
					*/}

					{/*
						TODO: Ajouter liens réseaux sociaux quand disponibles
						<div className='flex gap-4'>
							<a href='#' className='text-gray-400 hover:text-gray-500'>
								<span className='sr-only'>LinkedIn</span>
								<svg>...</svg>
							</a>
						</div>
					*/}
				</div>
			</Container>
		</footer>
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
					<ContactSection />

					{/*
						TODO: Ajouter sections quand contenu disponible
						- Problème/Solution 
						- Comment ça marche (3 étapes)
						- Tarifs
						- Avantages vs concurrence
						- Témoignages
					*/}
				</div>
			</main>
			{/*
				TODO: Remplacer par des vrais témoignages quand disponibles
				<Testimonials />
			*/}
			<SimpleFooter />

			{/*
				TODO: Remplacer par footer complet quand disponible
				<Footer />
			*/}
		</div>
	)
}
