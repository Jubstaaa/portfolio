const CDN_BASE = process.env.NEXT_PUBLIC_CDN_BASE?.replace(/\/+$/, '') ?? ''

// Content images are served from a DigitalOcean Spaces bucket (+ CDN) in
// production. The copies under public/images stay in the repo on purpose: velite
// reads them at build time to stamp intrinsic dimensions, and they keep any
// already-indexed /images/... URL resolving. Without NEXT_PUBLIC_CDN_BASE — local
// dev — the local path is used unchanged.
export function cdnUrl(src: string): string {
    if (!CDN_BASE || !src.startsWith('/images/')) return src

    return `${CDN_BASE}${src}`
}
