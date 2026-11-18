import { describe, expect, test } from 'bun:test'

import { CDN_BASE } from './src/lib/cdn'
import config from './next.config'

describe('image optimizer', () => {
    const [pattern] = config.images?.remotePatterns ?? []

    test('allows only the CDN that cdnUrl() points at', () => {
        expect(pattern).toBeDefined()
        if (!pattern || pattern instanceof URL) return
        expect(`${pattern.protocol}://${pattern.hostname}`).toBe(
            new URL(CDN_BASE).origin
        )
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
})
