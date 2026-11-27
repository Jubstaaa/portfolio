import { copyFile, mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import {
    dirname,
    extname,
    format,
    join,
    parse,
    relative,
    resolve,
} from 'node:path'
import sharp from 'sharp'

const MAX_EDGE = 2000
const QUALITY = 78

const MIN_GAIN = 0.1
const SOURCES = new Set(['.avif', '.jpeg', '.jpg', '.png', '.tiff', '.webp'])

const [root, outRoot] = process.argv.slice(2)

if (!root || !outRoot) {
    console.error('usage: bun run optimize:images <source-dir> <output-dir>')
    process.exit(1)
}

const outFromRoot = relative(resolve(root), resolve(outRoot))
if (!outFromRoot.startsWith('..')) {
    console.error('the output folder must be outside the source folder')
    process.exit(1)
}

const files = (await readdir(root, { recursive: true, withFileTypes: true }))
    .filter(
        entry =>
            entry.isFile() && SOURCES.has(extname(entry.name).toLowerCase())
    )
    .map(entry => join(entry.parentPath, entry.name))

const targetOf = (file: string): string =>
    format({
        ...parse(join(outRoot, relative(root, file))),
        base: '',
        ext: '.webp',
    })

const sourceByTarget = new Map<string, string>()
for (const file of files) {
    const target = targetOf(file)
    const other = sourceByTarget.get(target)
    if (other) {
        console.error(`${file} and ${other} would both write ${target}`)
        process.exit(1)
    }
    sourceByTarget.set(target, file)
}
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

    const target = targetOf(file)
    await mkdir(dirname(target), { recursive: true })

    if (!isWebp || buffer.length <= original * (1 - MIN_GAIN)) {
        await writeFile(target, buffer)
        after += buffer.length
        written++
    } else {
        await copyFile(file, target)
        after += original
    }
}

const saved = before ? Math.round((1 - after / before) * 100) : 0
console.log(
    `${files.length} images · ${written} written · ` +
        `${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB (${saved}% smaller)`
)
