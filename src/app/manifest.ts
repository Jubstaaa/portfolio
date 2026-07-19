import type { MetadataRoute } from 'next'

import { site } from '@/lib/content'

export default function manifest(): MetadataRoute.Manifest {
    return {
        background_color: '#0a0a0f',
        description: site.description,
        display: 'standalone',
        name: site.name,
        short_name: site.name,
        start_url: '/',
        theme_color: '#0a0a0f',
    }
}
