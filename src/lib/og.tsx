import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import sharp from 'sharp'

import { site } from '@/lib/content'
import { handlePath } from '@/lib/site'

export const OG_SIZE = { height: 630, width: 1200 } as const
export const OG_CONTENT_TYPE = 'image/jpeg'

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

// satori can't decode webp and has no system-font fallback, so covers are
// rasterized to png and only ASCII glyphs are used in the layout.
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

    const overlay = coverUrl
        ? 'linear-gradient(90deg, rgba(18,20,25,0.95) 0%, rgba(18,20,25,0.88) 52%, rgba(18,20,25,0.6) 100%)'
        : '#16181d'

    const image = new ImageResponse(
        <div
            style={{
                display: 'flex',
                height: '100%',
                position: 'relative',
                width: '100%',
            }}>
            {coverUrl ? (
                // satori only understands raw <img>; next/image cannot run here.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    alt=""
                    height={OG_SIZE.height}
                    src={coverUrl}
                    width={OG_SIZE.width}
                    style={{
                        left: 0,
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                    }}
                />
            ) : null}
            <div
                style={{
                    background: overlay,
                    height: '100%',
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                }}
            />

            <div
                style={{
                    borderTop: '10px solid #5aa6ea',
                    color: '#ece9e1',
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'Hermit',
                    height: '100%',
                    justifyContent: 'space-between',
                    padding: '72px',
                    position: 'relative',
                    width: '100%',
                }}>
                <div
                    style={{ color: '#8a93a1', display: 'flex', fontSize: 30 }}>
                    {path}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                        style={{
                            color: '#5aa6ea',
                            display: 'flex',
                            fontSize: 30,
                            marginBottom: 24,
                        }}>
                        {eyebrow}
                    </div>
                    <div
                        style={{
                            color: '#ece9e1',
                            display: 'flex',
                            fontSize: 60,
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.12,
                        }}>
                        {title}
                    </div>
                </div>

                <div
                    style={{
                        alignItems: 'center',
                        color: '#8a93a1',
                        display: 'flex',
                        fontSize: 28,
                        justifyContent: 'space-between',
                    }}>
                    <span>{`${site.name} · ${site.url.replace(/^https?:\/\//, '')}`}</span>
                    <div
                        style={{
                            alignItems: 'center',
                            background: '#5aa6ea',
                            borderRadius: 10,
                            color: '#16181d',
                            display: 'flex',
                            fontSize: 26,
                            fontWeight: 700,
                            padding: '12px 24px',
                        }}>
                        {`${cta} ->`}
                    </div>
                </div>
            </div>
        </div>,
        { ...OG_SIZE, fonts }
    )

    // satori/resvg only emit PNG, which is huge for photographic covers — recompress
    // to JPEG so social cards stay small.
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
