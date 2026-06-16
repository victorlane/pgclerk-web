'use client'

// Lenis smooth-scroll + GSAP ticker integration, scoped to marketing
// routes only. The operator console keeps native scroll — smooth-scroll
// in dense data UIs fights with keyboard focus + scrollIntoView.
//
// We register ScrollTrigger here and tell it to read from Lenis so every
// section's scroll-driven animation uses the same source of truth.
//
// On unmount (route change away from marketing) we destroy the Lenis
// instance and kill all ScrollTriggers — otherwise the operator console
// would inherit the smooth-scroll until next reload.

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function MarketingScrollProvider({ children }: { children: ReactNode }) {
	useEffect(() => {
		// Respect prefers-reduced-motion: skip Lenis entirely so users who
		// opted out of motion get the OS-native scroll.
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) return

		const lenis = new Lenis({
			duration: 1.1,
			easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true
		})

		lenis.on('scroll', ScrollTrigger.update)

		// Drive Lenis from GSAP's ticker so they share one RAF.
		const tick = (time: number) => lenis.raf(time * 1000)
		gsap.ticker.add(tick)
		gsap.ticker.lagSmoothing(0)

		return () => {
			gsap.ticker.remove(tick)
			ScrollTrigger.getAll().forEach(st => st.kill())
			lenis.destroy()
		}
	}, [])

	return <>{children}</>
}
