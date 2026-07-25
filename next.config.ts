import type { NextConfig } from 'next'

// The image optimizer validates remote URLs at request time, so the CDN host has
// to be compiled into the build. Keep in sync with DEFAULT_CDN_BASE in
// src/lib/cdn.ts — this config cannot import it (it is evaluated before the
// tsconfig path aliases exist).
const cdnHost = new URL(
    process.env.NEXT_PUBLIC_CDN_BASE ||
        'https://ilkerbalcilar-portfolio.fra1.cdn.digitaloceanspaces.com'
).hostname

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
