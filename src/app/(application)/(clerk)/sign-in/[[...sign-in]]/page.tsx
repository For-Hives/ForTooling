import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
	return (
		<div className='flex min-h-screen items-center justify-center px-4 py-12'>
			<div className='relative w-full max-w-sm'>
				<SignIn path='/sign-in' signUpUrl='/sign-up' />
			</div>
		</div>
	)
}
