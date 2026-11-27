import type { NextConfig } from 'next'

import { CDN_BASE, CONTENT_IMAGE_PREFIX } from './src/lib/cdn'

const isDev = process.env.NODE_ENV === 'development'

const contentSecurityPolicy = [
    "default-src 'self'",

    `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",

    `img-src 'self' data: ${CDN_BASE}`,
    "font-src 'self'",
    `connect-src 'self'${isDev ? ' ws:' : ''}`,
    "manifest-src 'self'",
    "object-src 'none'",

    "frame-src 'none'",
    "worker-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const securityHeaders = [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy },

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
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],

        maximumDiskCacheSize: 500_000_000,

        minimumCacheTTL: 2_678_400,
        remotePatterns: [
            {
                hostname: new URL(CDN_BASE).hostname,
                pathname: `${CONTENT_IMAGE_PREFIX}**`,
                protocol: 'https',

                search: '',
            },
        ],
    },

    output: 'standalone',
    poweredByHeader: false,
    async redirects() {
        return [
            {
                destination: `${CDN_BASE}${CONTENT_IMAGE_PREFIX}:path*`,
                permanent: true,
                source: `${CONTENT_IMAGE_PREFIX}:path*`,
            },

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
