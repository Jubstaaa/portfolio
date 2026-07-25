// Relative, not the @/ alias: velite bundles this file with its own esbuild pass,
// which does not read tsconfig paths.
import { CDN_BASE } from './cdn'

// Anything that needs the actual image bytes at build time — intrinsic dimensions
// for the aspect-ratio boxes, OG card rasterisation — reads them from the CDN,
// because the repo no longer carries a copy.
//
// This throws rather than returning nothing on failure: every caller's fallback is
// a silent degradation (dimensions vanish → layout shift on every content image,
// cover vanishes → a blank OG card), and the build is the right place to find out.
export async function readImageBytes(src: string): Promise<Buffer> {
    const url = `${CDN_BASE}${src}`
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error(`image fetch failed: ${url} → HTTP ${res.status}`)
    }

    return Buffer.from(await res.arrayBuffer())
}
