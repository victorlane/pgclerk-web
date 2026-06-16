// Root layout for pgclerk.com — the public marketing site.
//
// The operator console and customer portal live in a separate Next.js
// app served from `app.pgclerk.com`. The "Sign in" and "Customer sign
// in" links cross the host boundary; everything else is local to this
// site.

import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'
import MarketingScrollProvider from './_components/MarketingScrollProvider'

// Where the operator console + customer portal live. Used for the
// "Sign in" link in the header and footer.
const APP_ORIGIN = 'https://app.pgclerk.com'

export const metadata = {
	title: 'pgclerk — Postgres operations, run as a service',
	description:
		'pgclerk runs Postgres for you: 24x7 on-call, HA, verified backups, version upgrades, security hardening — on AWS, GCP, Azure managed services or self-managed VMs.',
	metadataBase: new URL('https://pgclerk.com'),
	openGraph: {
		type: 'website',
		url: 'https://pgclerk.com',
		siteName: 'pgclerk'
	}
}

const NAV = [
	{ href: '/product', label: 'Product' },
	{ href: '/pricing', label: 'Pricing' },
	{ href: '/security', label: 'Security' },
	{ href: '/comparison', label: 'Comparison' },
	{ href: '/about', label: 'About' }
]

const Wordmark = () => (
	<div className="flex items-center gap-2">
		<div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-fg-strong)] text-white">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
				<path
					d="M4 6c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v3c0 1.1-.9 2-2 2H6a2 2 0 0 1-2-2V6Zm0 9c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v3c0 1.1-.9 2-2 2H6a2 2 0 0 1-2-2v-3Z"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<circle cx="8" cy="7.5" r="0.9" fill="currentColor" />
				<circle cx="8" cy="16.5" r="0.9" fill="currentColor" />
			</svg>
		</div>
		<span className="font-semibold tracking-tight text-[15px] text-[var(--color-fg-strong)]">pgclerk</span>
	</div>
)

const Header = () => (
	<header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur">
		<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
			<Link href="/" className="flex items-center" aria-label="pgclerk home">
				<Wordmark />
			</Link>
			<nav className="hidden items-center gap-1 md:flex">
				{NAV.map(item => (
					<Link
						key={item.href}
						href={item.href}
						className="rounded-md px-3 py-1.5 text-[13px] text-[var(--color-fg-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
					>
						{item.label}
					</Link>
				))}
			</nav>
			<div className="flex items-center gap-2">
				<a
					href={`${APP_ORIGIN}/login`}
					className="rounded-md px-3 py-1.5 text-[13px] text-[var(--color-fg)] transition hover:bg-[var(--color-surface-2)]"
				>
					Sign in
				</a>
				<a
					href="mailto:hello@pgclerk.com?subject=Discovery%20call"
					className="rounded-md bg-[var(--color-fg-strong)] px-3 py-1.5 text-[13px] font-medium text-white transition hover:bg-black"
				>
					Book a call
				</a>
			</div>
		</div>
	</header>
)

const Footer = () => (
	<footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
		<div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-4">
			<div className="md:col-span-2">
				<Wordmark />
				<p className="mt-3 max-w-sm text-[13px] text-[var(--color-fg-muted)]">
					Postgres operations, run as a service. Continuous cover,
					verified recovery, and documented change control — on AWS,
					GCP, Azure, or customer-owned infrastructure.
				</p>
				<div className="mt-4 font-mono text-[11px] text-[var(--color-fg-subtle)]">
					hello@pgclerk.com
				</div>
			</div>
			<div>
				<div className="mb-3 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-fg-subtle)]">
					Product
				</div>
				<ul className="space-y-1.5 text-[13px]">
					<li><Link href="/product" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">What we run</Link></li>
					<li><Link href="/pricing" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">Pricing</Link></li>
					<li><Link href="/comparison" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">Comparison</Link></li>
					<li><Link href="/security" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">Security &amp; compliance</Link></li>
				</ul>
			</div>
			<div>
				<div className="mb-3 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-fg-subtle)]">
					Company
				</div>
				<ul className="space-y-1.5 text-[13px]">
					<li><Link href="/about" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">About</Link></li>
					<li><a href={`${APP_ORIGIN}/portal`} className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">Customer sign in</a></li>
					<li><a href="mailto:hello@pgclerk.com" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">Contact</a></li>
				</ul>
			</div>
		</div>
		<div className="border-t border-[var(--color-border)]">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-[11px] text-[var(--color-fg-subtle)]">
				<span>© {new Date().getFullYear()} pgclerk. Operated by Brinkhorst Consulting.</span>
				<span className="font-mono">postgres 15 / 16 / 17 / 18</span>
			</div>
		</div>
	</footer>
)

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<MarketingScrollProvider>
					<div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
						<Header />
						<main>{children}</main>
						<Footer />
					</div>
				</MarketingScrollProvider>
			</body>
		</html>
	)
}
