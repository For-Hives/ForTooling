import { Container } from '@/components/app/container'
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
	return (
		<Container>
			<SignIn path='/sign-in' signUpUrl='/sign-up' />
		</Container>
	)
}
