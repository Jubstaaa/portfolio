import type { Element, Root } from 'hast'

import sharp from 'sharp'
import { visit } from 'unist-util-visit'

import { CONTENT_IMAGE_PREFIX } from '@/lib/cdn'

import { readImageBytes } from './image-source'

export async function readImageDimensions(
    src: string
): Promise<{ height: number; width: number }> {
    const bytes = await readImageBytes(src)
    try {
        const { autoOrient } = await sharp(bytes).metadata()
        return { height: autoOrient.height, width: autoOrient.width }
    } catch (cause) {
        throw new Error(`cannot read the size of ${src}`, { cause })
    }
}

export function rehypeImageDimensions() {
    return stampImageDimensions
}

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
