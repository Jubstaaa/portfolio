import type { Element, Root } from 'hast'

import { EXIT, visit } from 'unist-util-visit'

export function markFirstImagePriority(tree: Root): void {
    visit(tree, { tagName: 'img', type: 'element' }, (node: Element) => {
        node.properties.dataPriority = 'true'
        return EXIT
    })
}

export function rehypeFirstImagePriority() {
    return markFirstImagePriority
}
