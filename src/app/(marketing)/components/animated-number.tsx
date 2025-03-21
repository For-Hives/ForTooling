'use client'

import {
	motion,
	useInView,
	useMotionValue,
	useSpring,
	useTransform,
} from 'framer-motion'
import { useEffect, useRef } from 'react'

export function AnimatedNumber({
	decimals = 0,
	end,
	start,
}: {
	start: number
	end: number
	decimals?: number
}) {
	const ref = useRef(null)
	const isInView = useInView(ref, { amount: 0.5, once: true })

	const value = useMotionValue(start)
	const spring = useSpring(value, { damping: 30, stiffness: 100 })
	const display = useTransform(spring, num => num.toFixed(decimals))

	useEffect(() => {
		value.set(isInView ? end : start)
	}, [start, end, isInView, value])

	return <motion.span ref={ref}>{display}</motion.span>
}
