'use client'

// Hover micro-tilt. Tracks the pointer over the card and rotates it
// slightly toward the cursor, with an inertia-style ease on leave so
// it springs back. Total range is tiny (±6deg) — anything bigger
// feels showy and breaks the "we are responsible adults" tone we
// want for an MSP audience.
//
// Each instance owns its own gsap.quickTo for cheap per-frame updates.

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'

export default function Tilt({
	children,
	className,
	max = 6
}: {
	children: ReactNode
	className?: string
	max?: number
}) {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) return

		const rotX = gsap.quickTo(el, 'rotateX', { duration: 0.45, ease: 'power3.out' })
		const rotY = gsap.quickTo(el, 'rotateY', { duration: 0.45, ease: 'power3.out' })
		const lift = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })

		const onMove = (e: PointerEvent) => {
			const r = el.getBoundingClientRect()
			const x = (e.clientX - r.left) / r.width - 0.5
			const y = (e.clientY - r.top) / r.height - 0.5
			rotY(x * max)
			rotX(-y * max)
			lift(-3)
		}
		const onLeave = () => {
			rotX(0); rotY(0); lift(0)
		}

		el.addEventListener('pointermove', onMove)
		el.addEventListener('pointerleave', onLeave)
		return () => {
			el.removeEventListener('pointermove', onMove)
			el.removeEventListener('pointerleave', onLeave)
		}
	}, [max])

	return (
		<div
			ref={ref}
			className={className}
			style={{ transformStyle: 'preserve-3d', perspective: 800, willChange: 'transform' }}
		>
			{children}
		</div>
	)
}
