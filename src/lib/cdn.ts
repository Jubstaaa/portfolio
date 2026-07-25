// Content images live solely in this DigitalOcean Spaces bucket — there is no
// public/images copy in the repo. Bucket and region are fixed deployment
// constants, same as the other projects on this droplet; the env var is only an
// override (a staging bucket, say). next.config.ts derives the image optimizer's
// remote allow-list from this value, so the two can never drift.
const DEFAULT_CDN_BASE = 'https://ilkerbalcilar.fra1.cdn.digitaloceanspaces.com'

export const CDN_BASE = (
    process.env.NEXT_PUBLIC_CDN_BASE || DEFAULT_CDN_BASE
).replace(/\/+$/, '')

export function cdnUrl(src: string): string {
    if (!src.startsWith('/images/')) return src

    return `${CDN_BASE}${src}`
}
