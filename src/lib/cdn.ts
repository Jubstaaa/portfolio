// Content images live solely in this DigitalOcean Spaces bucket — there is no
// public/images copy in the repo. Bucket and region are fixed deployment
// constants, same as the other projects on this droplet; the env var is only an
// override (a staging bucket, say). next.config.ts imports CDN_BASE for the image
// optimizer's allow-list and the CSP, so the two can never drift. Keep this file
// free of path aliases: next.config.ts and velite import it relatively.
const DEFAULT_CDN_BASE = 'https://ilkerbalcilar.fra1.cdn.digitaloceanspaces.com'

export const CDN_BASE =
    // An empty variable means unset, which `??` would not catch.
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    (process.env.NEXT_PUBLIC_CDN_BASE || DEFAULT_CDN_BASE).replace(/\/+$/, '')

export function cdnUrl(src: string): string {
    if (!src.startsWith('/images/')) return src

    return `${CDN_BASE}${src}`
}
