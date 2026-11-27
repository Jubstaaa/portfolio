import { describe, expect, test } from 'bun:test'

import config from './next.config'
import { CDN_BASE, CONTENT_IMAGE_PREFIX } from './src/lib/cdn'

describe('image optimizer', () => {
    const [pattern] = config.images?.remotePatterns ?? []

    test('allows only the CDN that cdnUrl() points at', () => {
        expect(pattern).toBeDefined()
        if (!pattern || pattern instanceof URL) return
        expect(pattern.protocol).toBe('https')
        expect(pattern.hostname).toBe(new URL(CDN_BASE).hostname)
    })

    test('refuses query strings, so each image is cached once', () => {
        if (!pattern || pattern instanceof URL) throw new Error('no pattern')
        expect(pattern.search).toBe('')
    })

    test('bounds the on-disk cache', () => {
        expect(config.images?.maximumDiskCacheSize).toBeGreaterThan(0)
    })
})

describe('response headers', () => {
    test('does not advertise the framework', () => {
        expect(config.poweredByHeader).toBe(false)
    })

    test('every route carries the security headers', async () => {
        const rules = (await config.headers?.()) ?? []
        const all = rules.find(rule => rule.source === '/:path*')
        const keys = all?.headers.map(h => h.key.toLowerCase()) ?? []
        expect(keys).toEqual(
            expect.arrayContaining([
                'content-security-policy',
                'permissions-policy',
                'referrer-policy',
                'strict-transport-security',
                'x-content-type-options',
            ])
        )
        const csp =
            all?.headers.find(h => h.key === 'Content-Security-Policy')
                ?.value ?? ''
        expect(csp).toContain("frame-ancestors 'none'")
        expect(csp).toContain("object-src 'none'")
        expect(csp).toContain(CDN_BASE)
    })

    // Cloudflare Web Analytics (automatic setup) injects its beacon into proxied
    // HTML; blocking it silently breaks the site's analytics.
    test('lets the Cloudflare Web Analytics beacon load and report', async () => {
        const rules = (await config.headers?.()) ?? []
        const csp =
            rules
                .find(rule => rule.source === '/:path*')
                ?.headers.find(h => h.key === 'Content-Security-Policy')
                ?.value ?? ''
        const directive = (name: string) =>
            csp.split('; ').find(d => d.startsWith(`${name} `)) ?? ''
        expect(directive('script-src')).toContain(
            'https://static.cloudflareinsights.com'
        )
        expect(directive('connect-src')).toContain("'self'")
    })
})

describe('redirects', () => {
    const rules = async () => (await config.redirects?.()) ?? []
    const find = async (source: string) =>
        (await rules()).find(rule => rule.source === source)

    // Content images used to be served from public/images and are indexed under
    // those paths; a typo here 404s every one of them with nothing to notice it.
    test('legacy image paths point at the CDN and nowhere else', async () => {
        const rule = await find(`${CONTENT_IMAGE_PREFIX}:path*`)
        expect(rule).toBeDefined()
        expect(rule?.destination).toBe(
            `${CDN_BASE}${CONTENT_IMAGE_PREFIX}:path*`
        )
        expect(rule?.permanent).toBe(true)
    })

    test.each([
        ['/bio', '/about'],
        ['/stack', '/about'],
        ['/portfolio', '/projects'],
        ['/portfolio/portfolio-site', '/projects'],
        ['/portfolio/portfolio-site-old', '/projects'],
        ['/portfolio/:slug', '/projects/:slug'],
    ])('%s is a permanent redirect to %s', async (source, destination) => {
        const rule = await find(source)
        expect(rule).toBeDefined()
        expect(rule?.destination).toBe(destination)
        // A temporary redirect leaks the old URL's ranking instead of moving it.
        expect(rule?.permanent).toBe(true)
    })

    test('every rule is permanent, so none of them bleeds ranking', async () => {
        for (const rule of await rules()) {
            expect(rule.permanent).toBe(true)
        }
    })
})
