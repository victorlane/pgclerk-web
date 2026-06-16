'use client'

// Magnetic CTA. When the cursor is within ~80px of the button, the
// button drifts toward it with inertia. Inspired by the inertia idiom
// in the GSAP references but capped so it never reads as a toy — max
// offset is small, ease is soft, and the button snaps cleanly back on
// pointer-leave. Wraps any clickable child.
//
// Renders as a plain wrapper so the focus ring, hover state, and click
// target stay on the original button.

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'

export default function MagneticCTA({
	children,
	className,
	radius = 110,
	pull = 0.32
}: {
	children: ReactNode
	className?: string
	/** Px radius around the wrapper centre where the magnet engages. */
	radius?: number
	/** Maximum fraction of cursor offset the button reaches when the
	    cursor sits right on top of it. */
	pull?: number
}) {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) return
		// Don't engage on touch devices — it feels janky against tap
		// targets that don't have hover.
		if (window.matchMedia('(hover: none)').matches) return

		// Longer duration + softer ease so the button glides rather than
		// snaps to the cursor.
		const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power4.out' })
		const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power4.out' })

		const onMove = (e: PointerEvent) => {
			const r = el.getBoundingClientRect()
			const cx = r.left + r.width / 2
			const cy = r.top + r.height / 2
			const dx = e.clientX - cx
			const dy = e.clientY - cy
			const halfSize = Math.max(r.width, r.height) / 2
			const dist = Math.hypot(dx, dy)

			// Distance-from-button — only count proximity beyond the
			// button's own bounds so the magnet engages around it, not
			// just when the cursor crosses the centre.
			const proximity = Math.max(0, dist - halfSize)
			if (proximity > radius) {
				xTo(0); yTo(0)
				return
			}

			// `falloff` ramps 0 → 1 as you approach. Cubed so the field
			// is weak at the edge and only gets meaningful very close to
			// the button. This kills the jolt.
			const t = 1 - proximity / radius
			const falloff = t * t * t

			xTo(dx * pull * falloff)
			yTo(dy * pull * falloff)
		}
		const onLeave = () => { xTo(0); yTo(0) }

		window.addEventListener('pointermove', onMove)
		el.addEventListener('pointerleave', onLeave)
		return () => {
			window.removeEventListener('pointermove', onMove)
			el.removeEventListener('pointerleave', onLeave)
		}
	}, [radius, pull])

	return <div ref={ref} className={`inline-block will-change-transform ${className ?? ''}`}>{children}</div>
}
