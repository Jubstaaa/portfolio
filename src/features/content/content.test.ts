import { describe, expect, test } from 'bun:test'

import type { Post } from './content'

import {
    byRecency,
    getAdjacent,
    getPostBySlug,
    getPublishedPosts,
    getSocialHref,
    selectPublished,
} from './content'

function post(slug: string, date: string, draft = false): Post {
    return { date, draft, slug } as Post
}

describe('selectPublished', () => {
    test('drops drafts and orders newest first', () => {
        const result = selectPublished([
            post('old', '2025-01-01'),
            post('secret', '2026-06-01', true),
            post('new', '2026-01-01'),
        ])
        expect(result.map(p => p.slug)).toEqual(['new', 'old'])
    })

    test('orders posts published on the same day deterministically', () => {
        const sameDay = [post('b', '2025-04-19'), post('a', '2025-04-19')]
        expect(selectPublished(sameDay).map(p => p.slug)).toEqual(['a', 'b'])
        expect(selectPublished(sameDay.toReversed()).map(p => p.slug)).toEqual([
            'a',
            'b',
        ])
    })

    test('leaves its input untouched', () => {
        const input = [post('a', '2025-01-01'), post('b', '2026-01-01')]
        selectPublished(input)
        expect(input.map(p => p.slug)).toEqual(['a', 'b'])
    })
})

describe('getPostBySlug', () => {
    test('resolves only published posts', () => {
        for (const published of getPublishedPosts()) {
            expect(getPostBySlug(published.slug)).toBe(published)
        }
        expect(getPostBySlug('__missing__')).toBeUndefined()
    })
})

describe('getAdjacent', () => {
    const list = [{ slug: 'c' }, { slug: 'b' }, { slug: 'a' }]

    test('a middle item has both neighbours', () => {
        expect(getAdjacent(list, { slug: 'b' })).toEqual({
            next: { slug: 'c' },
            prev: { slug: 'a' },
        })
    })

    test('the ends have one neighbour each', () => {
        expect(getAdjacent(list, { slug: 'c' })).toEqual({
            prev: { slug: 'b' },
        })
        expect(getAdjacent(list, { slug: 'a' })).toEqual({
            next: { slug: 'b' },
        })
    })

    test('an item missing from the list has no neighbours', () => {
        expect(getAdjacent(list, { slug: 'draft' })).toEqual({})
    })
})

describe('byRecency', () => {
    test('ongoing first, then latest end, then latest start', () => {
        const items = [
            { end: '2022-06', start: '2020-01' },
            { start: '2023-01' },
            { end: '2022-06', start: '2021-01' },
            { end: '2024-02', start: '2022-07' },
        ]
        expect(items.toSorted(byRecency)).toEqual([
            { start: '2023-01' },
            { end: '2024-02', start: '2022-07' },
            { end: '2022-06', start: '2021-01' },
            { end: '2022-06', start: '2020-01' },
        ])
    })
})

describe('getSocialHref', () => {
    test('finds a profile by its label', () => {
        expect(getSocialHref('Spotify')).toContain('open.spotify.com')
    })

    test('fails loudly on a profile that is not in socials.json', () => {
        expect(() => getSocialHref('MySpace')).toThrow('MySpace')
    })
})
