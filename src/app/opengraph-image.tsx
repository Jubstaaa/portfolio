import { site } from '@/features/content/content'
import { renderOgImage } from '@/lib/og/og'

export default function HomeOgImage() {
    return renderOgImage({
        eyebrow: `${site.role} · ${site.location}`,
        title: site.name,
    })
}

export const size = { height: 630, width: 1200 }
export const contentType = 'image/jpeg'
export const alt = site.title
