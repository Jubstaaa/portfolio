import type { Element, Root } from 'hast'

import { expect, test } from 'bun:test'

import { markFirstImagePriority } from './rehype-first-image-priority'

function img(src: string): Element {
    return {
        children: [],
        properties: { src },
        tagName: 'img',
        type: 'element',
    }
}

test('flags only the first body image as the LCP candidate', () => {
    const first = img('/images/a.webp')
    const second = img('/images/b.webp')
    const tree: Root = {
        children: [
            {
                children: [first],
                properties: {},
                tagName: 'p',
                type: 'element',
            },
            second,
        ],
        type: 'root',
    }
    markFirstImagePriority(tree)
    expect(first.properties.dataPriority).toBe('true')
    expect(second.properties).not.toHaveProperty('dataPriority')
})

test('leaves a body without images untouched', () => {
    const tree: Root = { children: [], type: 'root' }
    markFirstImagePriority(tree)
    expect(tree).toEqual({ children: [], type: 'root' })
})
