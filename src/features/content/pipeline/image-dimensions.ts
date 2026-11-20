import type { Element, Root } from 'hast'

import sharp from 'sharp'
import { visit } from 'unist-util-visit'

import { readImageBytes } from './image-source'

export async function readImageDimensions(
    src: string
): Promise<{ height: number; width: number }> {
    const { height, width } = await sharp(await readImageBytes(src)).metadata()
    return { height, width }
}

export function rehypeImageDimensions() {
    return stampImageDimensions
}

// Stamp intrinsic width/height on body images so next/image reserves the
// correct aspect-ratio box up front — kills the reload layout shift / flicker.
export async function stampImageDimensions(tree: Root): Promise<void> {
    const images: Element[] = []
    visit(tree, { tagName: 'img', type: 'element' }, (node: Element) => {
        images.push(node)
    })

    await Promise.all(
        images.map(async node => {
            const { height, src, width } = node.properties
            if (typeof src !== 'string' || !src.startsWith('/')) return
            if (width && height) return
            Object.assign(node.properties, await readImageDimensions(src))
        })
    )
}
