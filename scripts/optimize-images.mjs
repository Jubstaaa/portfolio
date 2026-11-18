// Prepares images for the Spaces bucket: webp q78, capped at 2000px on the long
// edge — the same treatment Payload applies to uploads on the other projects
// sharing this droplet, so content images stay consistent wherever they come from.
//
//   bun run optimize:images <dir>
//
// Content images live only in the bucket, never in this repo, so point this at
// wherever the sources are, then upload the results under images/ preserving the
// subpath (a cover at images/projects/foo/cover.webp is referenced as
// /images/projects/foo/cover.webp).
import { readdir, stat, unlink, writeFile } from 'node:fs/promises'
import { extname, format, join, parse } from 'node:path'
import sharp from 'sharp'

const MAX_EDGE = 2000
const QUALITY = 78
// Re-encoding a lossy webp almost always yields a slightly smaller file, so a
// "smaller than before" test would rewrite every image on every run and stack up
// generation loss. Only a real win justifies another lossy pass, which also makes
// repeat runs no-ops.
const MIN_GAIN = 0.1
const SOURCES = new Set(['.avif', '.jpeg', '.jpg', '.png', '.tiff', '.webp'])

const root = process.argv[2]

if (!root) {
    console.error('usage: bun run optimize:images <dir>')
    process.exit(1)
}

const files = (await readdir(root, { recursive: true, withFileTypes: true }))
    .filter(
        entry =>
            entry.isFile() && SOURCES.has(extname(entry.name).toLowerCase())
    )
    .map(entry => join(entry.parentPath, entry.name))
let before = 0
let after = 0
let written = 0

for (const file of files) {
    const original = (await stat(file)).size
    const isWebp = extname(file).toLowerCase() === '.webp'
    const buffer = await sharp(file)
        .resize({
            fit: 'inside',
            height: MAX_EDGE,
            width: MAX_EDGE,
            withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toBuffer()

    before += original

    // A non-webp source always gets converted; an existing webp only when the
    // re-encode actually buys something.
    if (!isWebp) {
        const target = format({ ...parse(file), base: '', ext: '.webp' })
        await writeFile(target, buffer)
        await unlink(file)
        after += buffer.length
        written++
    } else if (buffer.length <= original * (1 - MIN_GAIN)) {
        await writeFile(file, buffer)
        after += buffer.length
        written++
    } else {
        after += original
    }
}

const saved = before ? Math.round((1 - after / before) * 100) : 0
console.log(
    `${files.length} images · ${written} written · ` +
        `${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB (${saved}% smaller)`
)
