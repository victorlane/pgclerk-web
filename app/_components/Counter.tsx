'use client'

// Scroll-triggered odometer counter for the metric strip. Counts up
// from 0 to `to` when the element scrolls into view, then stops.
// Format is callback so we can render "99.95%" or "12 m" or "47 days"
// using the same primitive.

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Counter takes plain serialisable props so a server component can use
// it. The format kind picks the rendering — we keep the set tight on
// purpose; you can add more here as needed.
type FormatKind = 'int' | 'plus' | 'slash7' | 'every-days' | 'minutes'

const fmt = (v: number, kind: FormatKind): string => {
	const n = Math.round(v)
	switch (kind) {
		case 'plus':         return `${n}+`
		case 'slash7':       return `${n}/7`
		case 'every-days':   return `every ${n} days`
		case 'minutes':      return `${n} min`
		default:             return n.toLocaleString()
	}
}

export default function Counter({
	to,
	durationSec = 1.4,
	kind = 'int',
	className
}: {
	to: number
	durationSec?: number
	kind?: FormatKind
	className?: string
}) {
	const ref = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) { el.textContent = fmt(to, kind); return }

		const obj = { v: 0 }
		const ctx = gsap.context(() => {
			gsap.to(obj, {
				v: to,
				duration: durationSec,
				ease: 'power2.out',
				onUpdate: () => { if (el) el.textContent = fmt(obj.v, kind) },
				scrollTrigger: { trigger: el, start: 'top 85%', once: true }
			})
		}, el)
		return () => ctx.revert()
	}, [to, durationSec, kind])

	return <span ref={ref} className={className}>{fmt(0, kind)}</span>
}
