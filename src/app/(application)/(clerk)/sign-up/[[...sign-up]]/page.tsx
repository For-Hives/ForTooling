import { Container } from '@/components/app/container'
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
	return (
		<Container>
			<SignUp routing='path' path='/sign-up' signInUrl='/sign-in' />
		</Container>
	)
}
