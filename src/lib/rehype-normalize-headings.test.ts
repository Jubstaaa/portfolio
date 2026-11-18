import type { Root } from 'hast'

import { describe, expect, test } from 'bun:test'

import { normalizeHeadings } from './rehype-normalize-headings'

function doc(...tags: string[]): Root {
    return {
        children: tags.map(tagName => ({
            children: [],
            properties: {},
            tagName,
            type: 'element',
        })),
        type: 'root',
    }
}

function tags(tree: Root): string[] {
    return tree.children.flatMap(node =>
        node.type === 'element' ? [node.tagName] : []
    )
}

// The page title is the document's only <h1>, so a body's top heading is an <h2>.
describe('normalizeHeadings', () => {
    test('demotes a body that starts at h1', () => {
        const tree = doc('h1', 'h2', 'p', 'h3')
        normalizeHeadings(tree)
        expect(tags(tree)).toEqual(['h2', 'h3', 'p', 'h4'])
    })

    test('leaves a body that already starts at h2', () => {
        const tree = doc('h2', 'h3')
        normalizeHeadings(tree)
        expect(tags(tree)).toEqual(['h2', 'h3'])
    })

    test('promotes a body whose top heading is deeper than h2', () => {
        const tree = doc('h3', 'h4')
        normalizeHeadings(tree)
        expect(tags(tree)).toEqual(['h2', 'h3'])
    })

    test('ignores a body without headings', () => {
        const tree = doc('p')
        normalizeHeadings(tree)
        expect(tags(tree)).toEqual(['p'])
    })
})
