// Re-encodes everything under public/images to webp q78, capped at 2000px on the
// long edge — the same treatment Payload applies to uploads on the other projects
// sharing this droplet, so content images stay consistent wherever they come from.
//
// Run it after adding images, before committing: `bun run optimize:images`.
// Filenames never change (sources are already .webp), so the Spaces sync
// overwrites in place and no orphaned objects are ever left behind.
import { readdir, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import sharp from 'sharp'

const ROOT = 'public/images'
const MAX_EDGE = 2000
const QUALITY = 78
// Re-encoding a lossy webp almost always yields a slightly smaller file, so a
// "smaller than before" test would rewrite every image on every run and stack up
// generation loss. Only a real win justifies another lossy pass, which also makes
// repeat runs no-ops.
const MIN_GAIN = 0.1

async function walk(dir, out = []) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name)
        if (entry.isDirectory()) await walk(path, out)
        else if (entry.name.endsWith('.webp')) out.push(path)
    }

    return out
}

const files = await walk(ROOT)
let before = 0
let after = 0
let rewritten = 0

for (const file of files) {
    const original = (await stat(file)).size
    const buffer = await sharp(file)
        .resize({
            width: MAX_EDGE,
            height: MAX_EDGE,
            fit: 'inside',
            withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toBuffer()

    before += original

    if (buffer.length <= original * (1 - MIN_GAIN)) {
        await writeFile(file, buffer)
        after += buffer.length
        rewritten++
    } else {
        after += original
    }
}

const saved = Math.round((1 - after / before) * 100)
console.log(
    `${files.length} images · ${rewritten} rewritten · ` +
        `${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB (${saved}% smaller)`
)
