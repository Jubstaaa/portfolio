import type { MetadataRoute } from 'next'

import { site } from '@/features/content/content'

export default function manifest(): MetadataRoute.Manifest {
    return {
        background_color: '#0a0a0f',
        description: site.description,
        display: 'standalone',

        icons: [
            { sizes: '192x192', src: '/icon-192.png', type: 'image/png' },
            { sizes: '512x512', src: '/icon-512.png', type: 'image/png' },
        ],
        name: site.name,
        short_name: site.name,
        start_url: '/',
        theme_color: '#0a0a0f',
    }
}
