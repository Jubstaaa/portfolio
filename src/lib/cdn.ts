const DEFAULT_CDN_BASE = 'https://ilkerbalcilar.fra1.cdn.digitaloceanspaces.com'

export const CDN_BASE =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    (process.env.NEXT_PUBLIC_CDN_BASE || DEFAULT_CDN_BASE).replace(/\/+$/, '')

export const CONTENT_IMAGE_PREFIX = '/images/'

export function cdnUrl(src: string): string {
    if (!src.startsWith(CONTENT_IMAGE_PREFIX)) return src

    return `${CDN_BASE}${src}`
}
