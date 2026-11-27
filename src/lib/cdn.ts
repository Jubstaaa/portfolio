// Content images live solely in this DigitalOcean Spaces bucket — there is no
// public/images copy in the repo. Bucket and region are fixed deployment
// constants, same as the other projects on this droplet; the env var is only an
// override (a staging bucket, say). next.config.ts imports CDN_BASE for the image
// optimizer's allow-list and the CSP, so the two can never drift. Keep this file
// free of path aliases: next.config.ts loads it outside the Next bundler.
const DEFAULT_CDN_BASE = 'https://ilkerbalcilar.fra1.cdn.digitaloceanspaces.com'

export const CDN_BASE =
    // An empty variable means unset, which `??` would not catch.
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    (process.env.NEXT_PUBLIC_CDN_BASE || DEFAULT_CDN_BASE).replace(/\/+$/, '')

// Part of the same contract as CDN_BASE: image-dimensions.ts validates body
// images against it and next.config.ts builds both the optimizer allow-list and
// the legacy redirect from it, so none of the three can drift.
export const CONTENT_IMAGE_PREFIX = '/images/'

export function cdnUrl(src: string): string {
    if (!src.startsWith(CONTENT_IMAGE_PREFIX)) return src

    return `${CDN_BASE}${src}`
}
