'use client'

// Row-by-row reveal for the comparison table. The whole component
// receives a render tree and animates direct child rows of a [data-rows]
// container as they enter view. Each row fades and slides up; the cell
// `pgclerk` highlight kicks in after the row settles, so the eye is
// guided down the table.
//
// One small section moment, not a per-section animation party.

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ComparisonReveal({ children }: { children: ReactNode }) {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) return

		const rows = el.querySelectorAll<HTMLElement>('[data-cmp-row]')
		if (rows.length === 0) return

		const ctx = gsap.context(() => {
			gsap.set(rows, { opacity: 0, y: 14 })
			ScrollTrigger.batch(rows, {
				start: 'top 88%',
				once: true,
				onEnter: batch => {
					gsap.to(batch, {
						opacity: 1,
						y: 0,
						duration: 0.55,
						ease: 'power3.out',
						stagger: 0.08
					})
				}
			})
		}, el)
		return () => ctx.revert()
	}, [])

	return <div ref={ref}>{children}</div>
}
