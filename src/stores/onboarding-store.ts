import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OnboardingStep = 1 | 2 | 3 | 4 | 5

interface OnboardingState {
	currentStep: OnboardingStep
	setCurrentStep: (step: OnboardingStep) => void
	isLoading: boolean
	setIsLoading: (loading: boolean) => void
	resetOnboarding: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
	persist(
		set => ({
			currentStep: 1,
			isLoading: false,
			resetOnboarding: () => set({ currentStep: 1, isLoading: false }),
			setCurrentStep: step => set({ currentStep: step }),
			setIsLoading: loading => set({ isLoading: loading }),
		}),
		{
			name: 'onboarding-state',
		}
	)
)
