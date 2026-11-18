import { site } from '@/lib/content'
import { renderOgImage } from '@/lib/og'

export default function HomeOgImage() {
    return renderOgImage({
        eyebrow: `${site.role} · ${site.location}`,
        title: site.name,
    })
}
