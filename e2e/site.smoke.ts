import { describe, expect, setDefaultTimeout, test } from 'bun:test'
import { z } from 'zod'

const { CDN_BASE: cdnBase, SMOKE_BASE_URL: base } = z
    .object({ CDN_BASE: z.url(), SMOKE_BASE_URL: z.url() })
    .parse(process.env)

setDefaultTimeout(30_000)

function get(path: string): Promise<Response> {
    return fetch(base + path, { signal: AbortSignal.timeout(10_000) })
}

async function html(path: string): Promise<string> {
    const res = await get(path)
    expect(res.status).toBe(200)
    return res.text()
}

describe('home', () => {
    test('serves the security headers and hides the framework', async () => {
        const res = await get('/')
        expect(res.status).toBe(200)
        for (const header of [
            'content-security-policy',
            'permissions-policy',
            'referrer-policy',
            'strict-transport-security',
            'x-content-type-options',
        ]) {
            expect(res.headers.has(header)).toBe(true)
        }
        expect(res.headers.has('x-powered-by')).toBe(false)
    })

    test('the CSP is the production one, not the dev one', async () => {
        const csp =
            (await get('/')).headers.get('content-security-policy') ?? ''
        expect(csp).not.toContain('unsafe-eval')
        expect(csp).not.toContain('ws:')
        expect(csp).toContain('upgrade-insecure-requests')
        expect(csp).toContain("form-action 'none'")
        expect(csp).toContain("frame-ancestors 'none'")
    })

    test('server-renders the terminal output visible', async () => {
        const page = await html('/')
        expect(page).toContain('<h1')
        const tag = /<div[^>]*data-terminal-static[^>]*>/.exec(page)?.[0]
        expect(tag).toBeDefined()
        const classes = /class="([^"]*)"/.exec(tag ?? '')?.[1]?.split(/\s+/)
        expect(classes).not.toContain('hidden')
    })
})

test.each(['/', '/about', '/blog'])(
    '%s starts with a skip link to the main content',
    async path => {
        const page = await html(path)
        expect(/<a\b[^>]*>/.exec(page)?.[0]).toContain('href="#main"')
        expect(page).toContain('id="main"')
    }
)

test.each(['/blog/__smoke__', '/projects/__smoke__'])(
    'unknown slug %s is a 404 that no cache keeps',
    async path => {
        const res = await get(path)
        expect(res.status).toBe(404)
        expect(res.headers.get('cache-control') ?? '').not.toMatch(
            /s-maxage|public/
        )
    }
)

test('detail pages preload at most one image (the LCP candidate)', async () => {
    const listing = await html('/projects')
    const paths = [...new Set(listing.match(/\/projects\/[a-z0-9-]+(?=")/g))]
    expect(paths.length).toBeGreaterThan(0)
    for (const path of paths) {
        const preloads = (await html(path)).match(/<link[^>]*as="image"[^>]*>/g)
        expect(preloads?.length ?? 0).toBeLessThanOrEqual(1)
    }
})

test('feed.xml is RSS', async () => {
    const res = await get('/feed.xml')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('rss')
})

test('now-playing degrades to idle without credentials', async () => {
    const res = await get('/api/now-playing')
    expect(res.status).toBe(200)
    const body: unknown = await res.json()
    expect(body).toMatchObject({ isPlaying: expect.any(Boolean) })
})

test('the image optimizer rejects cache-busting query strings', async () => {
    const query = new URLSearchParams({
        q: '75',
        url: `${cdnBase}/images/x.webp?cb=1`,
        w: '640',
    })
    const res = await get(`/_next/image?${query}`)
    expect(res.status).toBe(400)
})

test('the image optimizer rejects a host that is not the CDN', async () => {
    const query = new URLSearchParams({
        q: '75',
        url: 'https://example.com/images/x.webp',
        w: '640',
    })
    expect((await get(`/_next/image?${query}`)).status).toBe(400)
})

test('the image optimizer admits the CDN itself', async () => {
    const query = new URLSearchParams({
        q: '75',
        url: `${cdnBase}/images/x.webp`,
        w: '640',
    })
    expect((await get(`/_next/image?${query}`)).status).not.toBe(400)
})

test('legacy paths still redirect, permanently', async () => {
    const page = await fetch(new URL('/bio', base), { redirect: 'manual' })
    expect(page.status).toBe(308)
    expect(page.headers.get('location')).toBe('/about')

    const image = await fetch(new URL('/images/x.webp', base), {
        redirect: 'manual',
    })
    expect(image.status).toBe(308)
    expect(image.headers.get('location')).toBe(`${cdnBase}/images/x.webp`)
})
