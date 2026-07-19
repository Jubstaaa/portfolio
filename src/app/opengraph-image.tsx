import { site } from '@/lib/content'
import { renderOgImage } from '@/lib/og'

export const size = { height: 630, width: 1200 }
export const contentType = 'image/jpeg'
export const alt = site.title

export default function Image() {
    return renderOgImage({
        eyebrow: `${site.role} · ${site.location}`,
        title: site.name,
    })
}
