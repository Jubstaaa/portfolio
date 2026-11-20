import type { Element, Root } from 'hast'

import sharp from 'sharp'
import { visit } from 'unist-util-visit'

import { readImageBytes } from './image-source'

export const CONTENT_IMAGE_PREFIX = '/images/'

export async function readImageDimensions(
    src: string
): Promise<{ height: number; width: number }> {
    const bytes = await readImageBytes(src)
    try {
        const { height, width } = await sharp(bytes).metadata()
        return { height, width }
    } catch (cause) {
        // sharp's decode errors do not say which file they were decoding.
        throw new Error(`cannot read the size of ${src}`, { cause })
    }
}

export function rehypeImageDimensions() {
    return stampImageDimensions
}

// Stamp intrinsic width/height on body images so next/image reserves the
// correct aspect-ratio box up front — kills the reload layout shift / flicker.
// An image the build cannot measure fails it rather than shipping that shift.
export async function stampImageDimensions(tree: Root): Promise<void> {
    const images: Element[] = []
    visit(tree, { tagName: 'img', type: 'element' }, (node: Element) => {
        images.push(node)
    })

    await Promise.all(
        images.map(async node => {
            const { height, src, width } = node.properties
            if (
                typeof src !== 'string' ||
                !src.startsWith(CONTENT_IMAGE_PREFIX)
            ) {
                throw new Error(
                    `body image ${String(src)} is not on the CDN: content images live under ${CONTENT_IMAGE_PREFIX}`
                )
            }
            if (width && height) return
            Object.assign(node.properties, await readImageDimensions(src))
        })
    )
}
