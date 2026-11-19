import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { handlePath } from '@/lib/site'

import { Logo } from './logo'

// WCAG 2.5.3: voice-control users say what they see, so the accessible name must
// contain the visible text.
test('the accessible name starts with the visible text', () => {
    const html = renderToStaticMarkup(<Logo />)
    expect(html).not.toContain('aria-label')
    const text = html.replace(/<[^>]+>/g, '')
    expect(text.startsWith(handlePath())).toBe(true)
    expect(text).toContain('home')
})
