/** @type {import('next').NextConfig} */
const config = {
	// pgclerk.com is statically renderable end-to-end — no API, no
	// authenticated data fetches, no per-visitor personalisation.
	// `output: 'standalone'` trims the deploy image to just
	// `.next/standalone` + `.next/static` (+ `public/` when it exists),
	// which is what the Dockerfile copies into the runtime stage.
	output: 'standalone',
	poweredByHeader: false
}
export default config
