import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { handlePath } from '@/features/content/site'

import { Logo } from './logo'

test('the accessible name starts with the visible text', () => {
    const html = renderToStaticMarkup(<Logo />)
    expect(html).not.toContain('aria-label')
    const text = html.replace(/<[^>]+>/g, '')
    expect(text.startsWith(handlePath())).toBe(true)
    expect(text).toContain('home')
})
