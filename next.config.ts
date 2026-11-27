import type { NextConfig } from 'next'

// Relative, not the @/ alias: the config is evaluated before tsconfig paths exist.
import { CDN_BASE, CONTENT_IMAGE_PREFIX } from './src/lib/cdn'

const isDev = process.env.NODE_ENV === 'development'

// Pages are prerendered, so per-request nonces are impossible: Next's inline flight
// data and the theme script need 'unsafe-inline'. Dev additionally needs eval for
// React's stack traces and a websocket for HMR.
const contentSecurityPolicy = [
    "default-src 'self'",
    // static.cloudflareinsights.com: the Web Analytics beacon Cloudflare injects
    // into proxied HTML. It reports to /cdn-cgi/rum on this origin ('self').
    `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${CDN_BASE}`,
    "font-src 'self'",
    `connect-src 'self'${isDev ? ' ws:' : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const securityHeaders = [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy },
    // No includeSubDomains/preload: other subdomains are not this app's to vouch for.
    { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    },
]

const nextConfig: NextConfig = {
    async headers() {
        return [{ headers: securityHeaders, source: '/:path*' }]
    },
    images: {
        // Content renders at most ~720 CSS px wide, so 2x tops out near 1440.
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        // The cache is bind-mounted from the shared droplet's disk.
        maximumDiskCacheSize: 500_000_000,
        // Source images are immutable once uploaded; re-encoding every 4 hours
        // only burns CPU in a 256 MB container.
        minimumCacheTTL: 2_678_400,
        remotePatterns: [
            {
                hostname: new URL(CDN_BASE).hostname,
                pathname: `${CONTENT_IMAGE_PREFIX}**`,
                protocol: 'https',
                // The bucket ignores query strings but the optimizer keys its cache
                // on them, so allowing any would let a loop of ?x=N fill the disk.
                search: '',
            },
        ],
    },
    // Self-hosted on a DigitalOcean droplet: standalone emits a minimal
    // server.js + traced node_modules, which is what the runner image starts.
    output: 'standalone',
    poweredByHeader: false,
    async redirects() {
        return [
            // Content images used to be served from public/images and are indexed
            // under those paths; they live in the Spaces bucket now.
            {
                destination: `${CDN_BASE}${CONTENT_IMAGE_PREFIX}:path*`,
                permanent: true,
                source: `${CONTENT_IMAGE_PREFIX}:path*`,
            },
            // Legacy `/_next/image?url=/images/...` URLs are indexed as well and
            // cannot be salvaged: the optimizer resolves a relative `url` through
            // this router, hits the redirect above and rejects the bodiless 308
            // ("isn't a valid image ... received null", HTTP 400). A rule on
            // /_next/image never fires — internal routes are matched before custom
            // redirects. The log line is expected crawler noise, not a live bug.
            { destination: '/about', permanent: true, source: '/bio' },
            { destination: '/about', permanent: true, source: '/stack' },
            { destination: '/projects', permanent: true, source: '/portfolio' },
            {
                destination: '/projects',
                permanent: true,
                source: '/portfolio/portfolio-site',
            },
            {
                destination: '/projects',
                permanent: true,
                source: '/portfolio/portfolio-site-old',
            },
            {
                destination: '/projects/:slug',
                permanent: true,
                source: '/portfolio/:slug',
            },
        ]
    },
}

export default nextConfig
