import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import sharp from 'sharp'

import { OgCard } from '@/components/og-card/og-card'
import { handlePath } from '@/lib/site'

const OG_SIZE = { height: 630, width: 1200 } as const
const OG_CONTENT_TYPE = 'image/jpeg'

const FONT_DIR = join(process.cwd(), 'src/fonts/hermit')

async function loadFonts() {
    const [regular, bold] = await Promise.all([
        readFile(join(FONT_DIR, 'Hermit-Regular.otf')),
        readFile(join(FONT_DIR, 'Hermit-Bold.otf')),
    ])
    return [
        {
            data: regular,
            name: 'Hermit',
            style: 'normal' as const,
            weight: 400 as const,
        },
        {
            data: bold,
            name: 'Hermit',
            style: 'normal' as const,
            weight: 700 as const,
        },
    ]
}

async function loadCover(src?: string): Promise<string | undefined> {
    if (!src) return undefined
    try {
        const file = join(process.cwd(), 'public', src.replace(/^\//, ''))
        const png = await sharp(await readFile(file))
            .resize(OG_SIZE.width, OG_SIZE.height, { fit: 'cover' })
            .png()
            .toBuffer()
        return `data:image/png;base64,${png.toString('base64')}`
    } catch {
        return undefined
    }
}

interface OgInput {
    cover?: string
    eyebrow: string
    segment?: string
    title: string
}

export async function renderOgImage({
    cover,
    eyebrow,
    segment,
    title,
}: OgInput) {
    const path = handlePath(segment)
    const cta =
        segment === 'projects'
            ? 'View the project'
            : segment === 'blog'
              ? 'Read the post'
              : 'Explore the site'
    const [fonts, coverUrl] = await Promise.all([loadFonts(), loadCover(cover)])

    const image = new ImageResponse(
        OgCard({ coverUrl, cta, eyebrow, path, title }),
        { ...OG_SIZE, fonts }
    )

    const png = Buffer.from(await image.arrayBuffer())
    const jpeg = await sharp(png)
        .jpeg({ mozjpeg: true, quality: 84 })
        .toBuffer()
    return new Response(new Uint8Array(jpeg), {
        headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Content-Type': OG_CONTENT_TYPE,
        },
    })
}
