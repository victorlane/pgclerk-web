'use client'

// Per-word heading reveal. Splits the heading on whitespace and tweens
// each word in with a small stagger when it enters view. Fires once per
// heading. Tasteful, never re-runs on re-scroll. Reduced-motion users
// get the static heading.

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function HeadingReveal({ children, className }: { children: ReactNode; className?: string }) {
	const ref = useRef<HTMLHeadingElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) { el.style.opacity = '1'; return }

		// Split the heading by whitespace into spans on first run only.
		// (React already rendered the text node; we re-render it client-side
		// here, but the layout is identical so there's no jump.)
		const text = el.textContent ?? ''
		const words = text.trim().split(/\s+/)
		el.innerHTML = words
			.map(w => `<span class="inline-block will-change-transform" style="opacity:0;transform:translateY(14px)">${w}</span>`)
			.join(' ')
		el.style.opacity = '1'

		const spans = el.querySelectorAll<HTMLElement>('span')
		const ctx = gsap.context(() => {
			gsap.to(spans, {
				opacity: 1,
				y: 0,
				duration: 0.55,
				ease: 'power3.out',
				stagger: 0.045,
				scrollTrigger: { trigger: el, start: 'top 88%', once: true }
			})
		}, el)
		return () => ctx.revert()
	}, [])

	return <h2 ref={ref} className={className} style={{ opacity: 0 }}>{children}</h2>
}
