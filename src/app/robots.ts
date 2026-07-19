import type { MetadataRoute } from 'next'

import { site } from '@/lib/content'

export default function robots(): MetadataRoute.Robots {
    return {
        host: site.url,
        rules: [{ allow: '/', userAgent: '*' }],
        sitemap: new URL('/sitemap.xml', site.url).toString(),
    }
}
