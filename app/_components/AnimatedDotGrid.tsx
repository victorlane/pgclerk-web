'use client'

// Canvas-driven dot grid for the Security & Compliance hero.
//
// Same visual language as the static `.bg-dotgrid` used on portal cards
// (1px dots in `--color-border-strong` on a regular lattice), but animated:
//
//   - A diagonal "scan wave" sweeps across the grid every few seconds,
//     briefly brightening dots in the accent colour as it passes.
//   - The pointer pulls a soft accent-coloured halo around itself —
//     dots near the cursor scale up and shift to accent. Falls off
//     smoothly with distance. Pure additive, no DOM thrash.
//
// Reduced-motion users get a static dot grid (no canvas, no listeners).
// The canvas auto-sizes to the parent and listens to ResizeObserver so it
// stays crisp on resizes without re-mounting.

import { useEffect, useRef } from 'react'

type Mode = 'scan' | 'radar'

type Props = {
	className?: string
	// Spacing between dots in CSS px. Default matches the portal cards (24).
	spacing?: number
	// Base dot radius in CSS px.
	baseRadius?: number
	// Radius of the pointer halo in CSS px.
	pointerRadius?: number
	// 'scan' — diagonal band sweeps top-left to bottom-right (default).
	// 'radar' — rotating ray plus an expanding ping ring, anchored at
	//           the section centre. Reads as a sonar/radar sweep.
	mode?: Mode
}

export default function AnimatedDotGrid({
	className,
	spacing = 24,
	baseRadius = 1,
	pointerRadius = 140,
	mode = 'scan'
}: Props) {
	const wrapRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const wrap = wrapRef.current
		const canvas = canvasRef.current
		if (!wrap || !canvas) return

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Resolve colours from CSS custom properties so the canvas tracks
		// the theme (and any future dark mode) without hard-coded hex.
		const cssVar = (name: string) =>
			getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
			'#000'
		const baseColor = cssVar('--color-border-strong')
		const accentColor = cssVar('--color-accent')

		let width = 0
		let height = 0
		let dpr = Math.max(1, window.devicePixelRatio || 1)

		const resize = () => {
			const rect = wrap.getBoundingClientRect()
			width = Math.max(1, Math.floor(rect.width))
			height = Math.max(1, Math.floor(rect.height))
			dpr = Math.max(1, window.devicePixelRatio || 1)
			canvas.width = width * dpr
			canvas.height = height * dpr
			canvas.style.width = `${width}px`
			canvas.style.height = `${height}px`
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		}
		resize()

		const ro = new ResizeObserver(resize)
		ro.observe(wrap)

		// Pointer tracked in CSS px relative to the canvas. -1 means absent;
		// we use that to suppress the halo entirely until the user moves in.
		const pointer = { x: -1e6, y: -1e6, active: false }
		const onMove = (e: PointerEvent) => {
			const rect = canvas.getBoundingClientRect()
			pointer.x = e.clientX - rect.left
			pointer.y = e.clientY - rect.top
			pointer.active = true
		}
		const onLeave = () => {
			pointer.active = false
		}
		wrap.addEventListener('pointermove', onMove)
		wrap.addEventListener('pointerleave', onLeave)

		// Sweep geometry — branched per mode.
		//
		// 'scan' mode: a thick diagonal band whose centre walks from top-
		// left to bottom-right and wraps. Distance to the band is a cheap
		// unit-normal dot product.
		//
		// 'radar' mode: a ray rotating around the canvas centre, plus an
		// expanding ping ring that re-emits every sweep. Reads as a sonar
		// pulse; well-suited to a security page header.
		const SCAN_PERIOD_MS = mode === 'radar' ? 5200 : 4200
		const SCAN_BAND_HALF = 90        // CSS px on either side of centre
		// Normal to the band (scan mode): 45° diagonal, normalised.
		const nx = Math.SQRT1_2
		const ny = Math.SQRT1_2

		// Radar ray half-width in radians. Narrow enough to feel like a
		// beam, wide enough that the leading edge brushes a strip of dots.
		const RADAR_BEAM_HALF = 0.18

		let rafId = 0
		let start = performance.now()

		const frame = (now: number) => {
			const elapsed = now - start
			const t = (elapsed % SCAN_PERIOD_MS) / SCAN_PERIOD_MS // 0..1

			// Scan-mode band position: project from outside-top-left to
			// outside-bottom-right so the band always enters and exits
			// cleanly. Not used in radar mode.
			const diag = width + height
			const scanOffset = -SCAN_BAND_HALF + t * (diag + SCAN_BAND_HALF * 2)

			// Radar-mode geometry.
			const cx = width / 2
			const cy = height / 2
			const maxR = Math.hypot(width, height) / 2
			const beamAngle = t * Math.PI * 2 // one revolution per period
			// Expanding ping: a thin ring of radius `pingR` that emanates
			// from the centre every period. Trailing alpha drops as it
			// approaches the canvas edge.
			const pingR = t * maxR * 1.05
			const PING_HALF = 14

			ctx.clearRect(0, 0, width, height)

			// Iterate every lattice point. With 24px spacing this is on the
			// order of a few thousand dots even at 1440-wide hero, which
			// the canvas handles comfortably.
			for (let x = spacing / 2; x < width; x += spacing) {
				for (let y = spacing / 2; y < height; y += spacing) {
					let scanT = 0
					if (mode === 'scan') {
						// Distance from this dot, along the wave normal, to
						// the current scan centre. Smaller -> closer to band.
						const proj = x * nx + y * ny
						const scanDist = Math.abs(proj - scanOffset)
						scanT =
							scanDist < SCAN_BAND_HALF
								? 1 - scanDist / SCAN_BAND_HALF
								: 0
					} else {
						// Radar: ray contribution + ping-ring contribution.
						const dx = x - cx
						const dy = y - cy
						const r = Math.hypot(dx, dy)
						const theta = Math.atan2(dy, dx)
						// Shortest angular distance to the beam centre,
						// wrapped to [-π, π].
						let aDist = theta - beamAngle
						while (aDist > Math.PI) aDist -= Math.PI * 2
						while (aDist < -Math.PI) aDist += Math.PI * 2
						aDist = Math.abs(aDist)
						const beamT =
							aDist < RADAR_BEAM_HALF
								? (1 - aDist / RADAR_BEAM_HALF) * (1 - r / maxR) * 1.4
								: 0
						const ringDist = Math.abs(r - pingR)
						const ringT =
							ringDist < PING_HALF
								? (1 - ringDist / PING_HALF) * (1 - t) * 0.9
								: 0
						scanT = Math.max(beamT, ringT)
						if (scanT > 1) scanT = 1
					}

					// Pointer falloff — squared distance avoids a sqrt in the
					// inner loop; convert to a 0..1 ramp at the end.
					let pointerT = 0
					if (pointer.active) {
						const dx = x - pointer.x
						const dy = y - pointer.y
						const d2 = dx * dx + dy * dy
						const r2 = pointerRadius * pointerRadius
						if (d2 < r2) {
							pointerT = 1 - d2 / r2
							// Sharper falloff — feels more like a spotlight,
							// less like a fog.
							pointerT = pointerT * pointerT
						}
					}

					// Combine. Either source brings the dot fully toward
					// the accent state; we take the max rather than summing
					// so overlap doesn't blow out.
					const energy = Math.max(scanT, pointerT)

					if (energy === 0) {
						// Quiet dot: base colour, base radius. Drawing a tiny
						// rect is faster than a tiny arc and visually
						// identical at 1px.
						ctx.fillStyle = baseColor
						ctx.fillRect(
							x - baseRadius,
							y - baseRadius,
							baseRadius * 2,
							baseRadius * 2
						)
					} else {
						const r = baseRadius + energy * 2.4
						// Blend base -> accent. Canvas globalAlpha gives us
						// a cheap one-line lerp without parsing hex.
						ctx.globalAlpha = 1
						ctx.fillStyle = baseColor
						ctx.beginPath()
						ctx.arc(x, y, r, 0, Math.PI * 2)
						ctx.fill()

						ctx.globalAlpha = energy
						ctx.fillStyle = accentColor
						ctx.beginPath()
						ctx.arc(x, y, r, 0, Math.PI * 2)
						ctx.fill()
						ctx.globalAlpha = 1
					}
				}
			}

			rafId = requestAnimationFrame(frame)
		}
		rafId = requestAnimationFrame(frame)

		return () => {
			cancelAnimationFrame(rafId)
			ro.disconnect()
			wrap.removeEventListener('pointermove', onMove)
			wrap.removeEventListener('pointerleave', onLeave)
		}
	}, [spacing, baseRadius, pointerRadius, mode])

	return (
		<div ref={wrapRef} className={className} aria-hidden>
			{/* Static fallback for reduced-motion / no-JS: same dot lattice
			    rendered with the CSS pattern. The canvas (when active) sits
			    on top and overdraws every pixel, so this layer is invisible
			    when motion is allowed. */}
			<div
				className="absolute inset-0"
				style={{
					backgroundImage:
						'radial-gradient(circle at 1px 1px, var(--color-border-strong) 1px, transparent 0)',
					backgroundSize: `${spacing}px ${spacing}px`
				}}
			/>
			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
		</div>
	)
}
