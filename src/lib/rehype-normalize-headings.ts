import type { Root } from 'hast'

import { headingRank } from 'hast-util-heading-rank'
import { shiftHeading } from 'hast-util-shift-heading'
import { visit } from 'unist-util-visit'

const BODY_TOP_RANK = 2

export function normalizeHeadings(tree: Root): void {
    let top = Number.POSITIVE_INFINITY
    visit(tree, 'element', node => {
        const rank = headingRank(node)
        if (rank !== undefined && rank < top) top = rank
    })
    if (Number.isFinite(top) && top !== BODY_TOP_RANK) {
        shiftHeading(tree, BODY_TOP_RANK - top)
    }
}

export function rehypeNormalizeHeadings() {
    return normalizeHeadings
}
