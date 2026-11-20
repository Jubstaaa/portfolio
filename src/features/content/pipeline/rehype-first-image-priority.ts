import type { Element, Root } from 'hast'

import { EXIT, visit } from 'unist-util-visit'

// Flag the first image in the body so it can be preloaded — it becomes the
// LCP element on posts whose cover is hidden (showCover: false).
export function markFirstImagePriority(tree: Root): void {
    visit(tree, { tagName: 'img', type: 'element' }, (node: Element) => {
        node.properties.dataPriority = 'true'
        return EXIT
    })
}

export function rehypeFirstImagePriority() {
    return markFirstImagePriority
}
