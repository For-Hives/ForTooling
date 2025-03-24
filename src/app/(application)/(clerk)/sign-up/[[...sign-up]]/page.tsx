import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
	return (
		<div className='flex min-h-screen items-center justify-center px-4 py-12'>
			<div className='relative w-full max-w-sm'>
				<SignUp routing='path' path='/sign-up' signInUrl='/sign-in' />
			</div>
		</div>
	)
}
