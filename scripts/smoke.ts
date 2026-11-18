// Post-build smoke test against a running container (CI runs it on the candidate
// image before anything is pushed). It asserts the behaviour that unit tests cannot
// see: response headers, Next's routing of unknown slugs, and the image optimizer's
// allow-list.
//
//   CDN_BASE=https://… bun scripts/smoke.ts http://127.0.0.1:3000

export {}

const base = process.argv[2] ?? 'http://127.0.0.1:3000'
const cdnBase = process.env.CDN_BASE

const REQUIRED_HEADERS = [
    'content-security-policy',
    'permissions-policy',
    'referrer-policy',
    'strict-transport-security',
    'x-content-type-options',
]

function assert(condition: boolean, message: string): asserts condition {
    if (!condition) throw new Error(message)
}

// A hung route must fail as a named check, not stall the job until its timeout,
// and a page that errors must not pass a check that only inspects its body.
async function request(path: string, status = 200): Promise<Response> {
    const res = await fetch(base + path, {
        signal: AbortSignal.timeout(10_000),
    })
    assert(
        res.status === status,
        `${path} -> ${res.status}, expected ${status}`
    )
    return res
}

const checks: [string, () => Promise<void>][] = [
    [
        'home: 200, security headers, no x-powered-by',
        async () => {
            const res = await request('/')
            for (const header of REQUIRED_HEADERS) {
                assert(res.headers.has(header), `missing ${header}`)
            }
            assert(!res.headers.has('x-powered-by'), 'x-powered-by present')
        },
    ],
    [
        'home: terminal output is server-rendered visibly',
        async () => {
            const html = await (await request('/')).text()
            assert(html.includes('<h1'), 'no <h1>')
            const tag = /<div[^>]*data-terminal-static[^>]*>/.exec(html)?.[0]
            assert(tag !== undefined, 'no static terminal output')
            assert(
                !/class="[^"]*\bhidden\b/.test(tag),
                'static terminal output is hidden'
            )
        },
    ],
    [
        'every page starts with a skip link to the main content',
        async () => {
            for (const path of ['/', '/about', '/blog']) {
                const html = await (await request(path)).text()
                const firstLink = /<a\b[^>]*>/.exec(html)?.[0] ?? ''
                assert(
                    firstLink.includes('href="#main"'),
                    `${path}: ${firstLink}`
                )
                assert(html.includes('id="main"'), `${path}: no #main`)
            }
        },
    ],
    [
        'unknown slugs: 404 and not cacheable',
        async () => {
            for (const path of ['/blog/__smoke__', '/projects/__smoke__']) {
                const res = await request(path, 404)
                const cacheControl = res.headers.get('cache-control') ?? ''
                assert(
                    !/s-maxage|public/.test(cacheControl),
                    `${path} cacheable: ${cacheControl}`
                )
            }
        },
    ],
    [
        'detail pages preload at most one image (the LCP candidate)',
        async () => {
            const listing = await (await request('/projects')).text()
            const paths = [
                ...new Set(listing.match(/\/projects\/[a-z0-9-]+(?=")/g)),
            ]
            assert(paths.length > 0, 'no project links on /projects')
            for (const path of paths) {
                const html = await (await request(path)).text()
                const preloads = html.match(/<link[^>]*as="image"[^>]*>/g) ?? []
                assert(preloads.length <= 1, `${path}: ${preloads.length}`)
            }
        },
    ],
    [
        'feed.xml: RSS',
        async () => {
            const res = await request('/feed.xml')
            assert(
                res.headers.get('content-type')?.includes('rss') === true,
                `content-type ${res.headers.get('content-type')}`
            )
        },
    ],
    [
        'now-playing: degrades to idle without credentials',
        async () => {
            const res = await request('/api/now-playing')
            const body: unknown = await res.json()
            assert(
                typeof body === 'object' &&
                    body !== null &&
                    'isPlaying' in body &&
                    typeof body.isPlaying === 'boolean',
                `unexpected body ${JSON.stringify(body)}`
            )
        },
    ],
    [
        'image optimizer: rejects cache-busting query strings',
        async () => {
            assert(cdnBase !== undefined && cdnBase !== '', 'CDN_BASE unset')
            const src = encodeURIComponent(`${cdnBase}/images/x.webp?cb=1`)
            await request(`/_next/image?url=${src}&w=640&q=75`, 400)
        },
    ],
]

let failed = 0
for (const [name, run] of checks) {
    try {
        await run()
        process.stdout.write(`ok   ${name}\n`)
    } catch (error) {
        failed += 1
        console.error(
            `FAIL ${name}: ${error instanceof Error ? error.message : String(error)}`
        )
    }
}
process.exit(failed === 0 ? 0 : 1)
