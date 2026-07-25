import type { NextConfig } from 'next'

// Derived from the same env var the components use, so the optimizer's allow-list
// can never drift from the host the URLs actually point at. The image optimizer
// validates remote URLs at request time, so this has to be baked into the build.
const cdnHost = process.env.NEXT_PUBLIC_CDN_BASE
    ? new URL(process.env.NEXT_PUBLIC_CDN_BASE).hostname
    : undefined

const nextConfig: NextConfig = {
    // Self-hosted on a DigitalOcean droplet: standalone emits a minimal
    // server.js + traced node_modules, which is what the runner image starts.
    output: 'standalone',
    ...(cdnHost && {
        images: {
            remotePatterns: [
                {
                    protocol: 'https',
                    hostname: cdnHost,
                    pathname: '/images/**',
                },
            ],
        },
    }),
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
