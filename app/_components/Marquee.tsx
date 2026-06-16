'use client'

// Infinite horizontal strip. We duplicate the children once and then
// translate the inner row continuously — no scroll trigger, just an
// always-on tween that runs at low CPU.
//
// Used for the "outcomes" strip above the comparison table — short,
// reassuring statements (audit, RTO, on-call) rendered in mono so they
// read as a single ticker line instead of competing copy.

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'

export default function Marquee({
	children,
	duration = 38,
	className
}: {
	children: ReactNode
	duration?: number
	className?: string
}) {
	const trackRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		const track = trackRef.current
		if (!track || reduced) return
		const half = track.scrollWidth / 2
		const tween = gsap.to(track, {
			x: -half,
			duration,
			ease: 'none',
			repeat: -1
		})
		return () => { tween.kill() }
	}, [duration])

	return (
		<div
			className={`relative overflow-hidden ${className ?? ''}`}
			style={{
				maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
				WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)'
			}}
		>
			<div ref={trackRef} className="flex w-max gap-12 will-change-transform">
				<div className="flex shrink-0 items-center gap-12">{children}</div>
				<div className="flex shrink-0 items-center gap-12" aria-hidden>{children}</div>
			</div>
		</div>
	)
}
