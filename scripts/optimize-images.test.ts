import { afterEach, beforeEach, expect, test } from 'bun:test'
import { mkdir, mkdtemp, readdir, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'

const SCRIPT = join(import.meta.dir, 'optimize-images.mjs')

let work: string

beforeEach(async () => {
    work = await mkdtemp(join(tmpdir(), 'optimize-images-'))
    await mkdir(join(work, 'in/projects/foo'), { recursive: true })
    await sharp({
        create: { background: '#336699', channels: 3, height: 40, width: 60 },
    })
        .png()
        .toFile(join(work, 'in/projects/foo/cover.png'))
})

afterEach(async () => {
    await rm(work, { force: true, recursive: true })
})

function run(...args: string[]) {
    return Bun.spawnSync(['bun', SCRIPT, ...args], { stderr: 'pipe' })
}

test('writes webp copies to the output folder and leaves the sources alone', async () => {
    const result = run(join(work, 'in'), join(work, 'out'))
    expect(result.exitCode).toBe(0)
    expect(await readdir(join(work, 'in/projects/foo'))).toEqual(['cover.png'])
    const output = await sharp(
        join(work, 'out/projects/foo/cover.webp')
    ).metadata()
    expect(output.format).toBe('webp')
})

test('refuses to run without an output folder', async () => {
    const result = run(join(work, 'in'))
    expect(result.exitCode).not.toBe(0)
    expect((await stat(join(work, 'in/projects/foo/cover.png'))).isFile()).toBe(
        true
    )
})
