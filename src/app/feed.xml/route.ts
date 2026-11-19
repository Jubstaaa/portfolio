import { buildRss } from '@/features/content/rss'

export const dynamic = 'force-static'

export function GET() {
    return new Response(buildRss(), {
        headers: {
            'content-type': 'application/rss+xml; charset=utf-8',
        },
    })
}
