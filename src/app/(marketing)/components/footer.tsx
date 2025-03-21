import {
	PlusGrid,
	PlusGridItem,
	PlusGridRow,
} from '@/app/(marketing)/components/plus-grid'

import { Button } from './button'
import { Container } from './container'
import { Gradient } from './gradient'
import { Link } from './link'
import { Logo } from './logo'
import { Subheading } from './text'

function CallToAction() {
	return (
		<div className='relative pt-20 pb-16 text-center sm:py-24'>
			<hgroup>
				<Subheading>Commencer</Subheading>
				<p className='mt-6 text-3xl font-medium tracking-tight text-gray-950 sm:text-5xl'>
					{`Prêt à optimiser votre gestion?`}
					<br />
					Essayez gratuitement.
				</p>
			</hgroup>

			<p className='mx-auto mt-6 max-w-xs text-sm/6 text-gray-500'>
				{`Simplifiez le suivi de vos équipements et optimisez l'utilisation de votre parc matériel.`}
			</p>
			<div className='mt-6'>
				<Button className='w-full sm:w-auto' href='#'>
					{`Démarrer l'essai`}
				</Button>
			</div>
		</div>
	)
}

function SitemapHeading({ children }: { children: React.ReactNode }) {
	return <h3 className='text-sm/6 font-medium text-gray-950/50'>{children}</h3>
}

function SitemapLinks({ children }: { children: React.ReactNode }) {
	return <ul className='mt-6 space-y-4 text-sm/6'>{children}</ul>
}

function SitemapLink(props: React.ComponentPropsWithoutRef<typeof Link>) {
	return (
		<li>
			<Link
				{...props}
				className='font-medium text-gray-950 data-hover:text-gray-950/75'
			/>
		</li>
	)
}

function Sitemap() {
	return (
		<>
			<div>
				<SitemapHeading>Produit</SitemapHeading>
				<SitemapLinks>
					<SitemapLink href='/pricing'>Tarification</SitemapLink>
					{/* <SitemapLink href='#'>Fonctionnalités</SitemapLink> */}
					{/* <SitemapLink href='#'>API</SitemapLink> */}
				</SitemapLinks>
			</div>
			<div>
				<SitemapHeading>Entreprise</SitemapHeading>
				<SitemapLinks>
					{/* <SitemapLink href='#'>Carrières</SitemapLink> */}
					<SitemapLink href='/blog'>Blog</SitemapLink>
					<SitemapLink href='/company'>{`À propos`}</SitemapLink>
				</SitemapLinks>
			</div>
			<div>
				<SitemapHeading>Support</SitemapHeading>
				<SitemapLinks>
					{/* <SitemapLink href='#'>Centre d'aide</SitemapLink> */}
					<SitemapLink href='mailto:contact@fortooling.fr'>
						Contactez-nous
					</SitemapLink>
				</SitemapLinks>
			</div>
			<div>
				<SitemapHeading>Légal</SitemapHeading>
				<SitemapLinks>
					<SitemapLink href='/cgu'>{`Conditions d'utilisation`}</SitemapLink>
					<SitemapLink href='/privacy'>
						{`Politique de confidentialité`}
					</SitemapLink>
				</SitemapLinks>
			</div>
		</>
	)
}

function SocialIconFacebook(props: React.ComponentPropsWithoutRef<'svg'>) {
	return (
		<svg viewBox='0 0 16 16' fill='currentColor' {...props}>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M16 8.05C16 3.603 12.418 0 8 0S0 3.604 0 8.05c0 4.016 2.926 7.346 6.75 7.95v-5.624H4.718V8.05H6.75V6.276c0-2.017 1.194-3.131 3.022-3.131.875 0 1.79.157 1.79.157v1.98h-1.008c-.994 0-1.304.62-1.304 1.257v1.51h2.219l-.355 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.95z'
			/>
		</svg>
	)
}

function SocialIconLinkedIn(props: React.ComponentPropsWithoutRef<'svg'>) {
	return (
		<svg viewBox='0 0 16 16' fill='currentColor' {...props}>
			<path d='M14.82 0H1.18A1.169 1.169 0 000 1.154v13.694A1.168 1.168 0 001.18 16h13.64A1.17 1.17 0 0016 14.845V1.15A1.171 1.171 0 0014.82 0zM4.744 13.64H2.369V5.996h2.375v7.644zm-1.18-8.684a1.377 1.377 0 11.52-.106 1.377 1.377 0 01-.527.103l.007.003zm10.075 8.683h-2.375V9.921c0-.885-.015-2.025-1.234-2.025-1.218 0-1.425.966-1.425 1.968v3.775H6.233V5.997H8.51v1.05h.032c.317-.601 1.09-1.235 2.246-1.235 2.405-.005 2.851 1.578 2.851 3.63v4.197z' />
		</svg>
	)
}

function SocialIconInstagram(props: React.ComponentPropsWithoutRef<'svg'>) {
	return (
		<svg viewBox='0 0 24 24' fill='currentColor' {...props}>
			<path
				xmlns='http://www.w3.org/2000/svg'
				d='M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077'
			/>
		</svg>
	)
}

function SocialLinks() {
	return (
		<>
			<Link
				href='https://facebook.com'
				target='_blank'
				aria-label='Visitez notre Facebook'
				className='text-gray-950 data-hover:text-gray-950/75'
			>
				<SocialIconFacebook className='size-4' />
			</Link>
			<Link
				href='https://facebook.com'
				target='_blank'
				aria-label='Visitez notre Facebook'
				className='text-gray-950 data-hover:text-gray-950/75'
			>
				<SocialIconInstagram className='size-4' />
			</Link>
			<Link
				href='https://linkedin.com'
				target='_blank'
				aria-label='Visitez notre LinkedIn'
				className='text-gray-950 data-hover:text-gray-950/75'
			>
				<SocialIconLinkedIn className='size-4' />
			</Link>
		</>
	)
}

function Copyright() {
	return (
		<div className='text-sm/6 text-gray-950'>
			&copy; {new Date().getFullYear()} ForTooling. {`Tous droits réservés.`}
		</div>
	)
}

export function Footer() {
	return (
		<footer>
			<Gradient className='relative'>
				<div className='absolute inset-2 rounded-4xl bg-white/80' />
				<Container>
					<CallToAction />
					<PlusGrid className='pb-16'>
						<PlusGridRow>
							<div className='grid grid-cols-2 gap-y-10 pb-6 lg:grid-cols-6 lg:gap-8'>
								<div className='col-span-2 flex'>
									<PlusGridItem className='pt-6 lg:pb-6'>
										<Logo className='h-9 w-9' />
									</PlusGridItem>
								</div>
								<div className='col-span-2 grid grid-cols-2 gap-x-8 gap-y-12 lg:col-span-4 lg:grid-cols-subgrid lg:pt-6'>
									<Sitemap />
								</div>
							</div>
						</PlusGridRow>
						<PlusGridRow className='flex justify-between'>
							<div>
								<PlusGridItem className='py-3'>
									<Copyright />
								</PlusGridItem>
							</div>
							<div className='flex'>
								<PlusGridItem className='flex items-center gap-8 py-3'>
									<SocialLinks />
								</PlusGridItem>
							</div>
						</PlusGridRow>
					</PlusGrid>
				</Container>
			</Gradient>
		</footer>
	)
}
