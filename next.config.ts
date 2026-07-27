import type { NextConfig } from 'next'

// The image optimizer validates remote URLs at request time, so the CDN host has
// to be compiled into the build. Keep in sync with DEFAULT_CDN_BASE in
// src/lib/cdn.ts — this config cannot import it (it is evaluated before the
// tsconfig path aliases exist).
const cdnBase =
    process.env.NEXT_PUBLIC_CDN_BASE ||
    'https://ilkerbalcilar.fra1.cdn.digitaloceanspaces.com'
const cdnHost = new URL(cdnBase).hostname

const nextConfig: NextConfig = {
    // Self-hosted on a DigitalOcean droplet: standalone emits a minimal
    // server.js + traced node_modules, which is what the runner image starts.
    output: 'standalone',
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: cdnHost, pathname: '/images/**' },
        ],
    },
    async redirects() {
        return [
            // Content images used to be served from public/images and are indexed
            // under those paths; they live in the Spaces bucket now.
            {
                source: '/images/:path*',
                destination: `${cdnBase}/images/:path*`,
                permanent: true,
            },
            // Legacy `/_next/image?url=/images/...` URLs are indexed as well and
            // cannot be salvaged: the optimizer resolves a relative `url` through
            // this router, hits the redirect above and rejects the bodiless 308
            // ("isn't a valid image ... received null", HTTP 400). A rule on
            // /_next/image never fires — internal routes are matched before custom
            // redirects. The log line is expected crawler noise, not a live bug.
            { source: '/bio', destination: '/about', permanent: true },
            { source: '/stack', destination: '/about', permanent: true },
            { source: '/portfolio', destination: '/projects', permanent: true },
            {
                source: '/portfolio/portfolio-site',
                destination: '/projects',
                permanent: true,
            },
            {
                source: '/portfolio/portfolio-site-old',
                destination: '/projects',
                permanent: true,
            },
            {
                source: '/portfolio/:slug',
                destination: '/projects/:slug',
                permanent: true,
            },
        ]
    },
}

export default nextConfig
