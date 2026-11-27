import { describe, expect, test } from 'bun:test'

import { navLabel } from '@/features/content/site'

import { isActive } from './nav.utils'

describe('isActive', () => {
    test('home is active only on the home page', () => {
        expect(isActive('/', '/')).toBe(true)
        expect(isActive('/blog', '/')).toBe(false)
    })

    test('a section is active on itself and its children', () => {
        expect(isActive('/blog', '/blog')).toBe(true)
        expect(isActive('/blog/a-post', '/blog')).toBe(true)
    })

    test('a shared prefix is not a child', () => {
        expect(isActive('/blogroll', '/blog')).toBe(false)
    })
})

test('navLabel renders a content label as a relative directory', () => {
    expect(navLabel('about')).toBe('./about')
})
