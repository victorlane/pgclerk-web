/** @type {import('next').NextConfig} */
const config = {
	// pgclerk.com is statically renderable end-to-end — no API, no
	// authenticated data fetches, no per-visitor personalisation.
	// Keep `output` unset so we can still use ISR / on-demand revalidation
	// if and when we add an MDX content layer.
	poweredByHeader: false
}
export default config
