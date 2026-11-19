import type { MetadataRoute } from 'next'

import { site } from '@/features/content/content'
import { absoluteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
    return {
        host: site.url,
        rules: [{ allow: '/', userAgent: '*' }],
        sitemap: absoluteUrl('/sitemap.xml'),
    }
}
