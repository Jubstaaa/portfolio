import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { Anchor } from './anchor'

function render(href: string) {
    return renderToStaticMarkup(<Anchor href={href}>docs</Anchor>)
}

test.each([
    'https://example.com',
    'HTTPS://EXAMPLE.COM/a',
    'ftp://example.com/file',
    'mailto:me@example.com',
])('opens %p in a new tab with a muted arrow', href => {
    const html = render(href)
    expect(html).toContain('target="_blank"')
    expect(html.match(/↗/g)).toHaveLength(1)
    expect(html).toMatch(/class="[^"]*text-muted-foreground[^"]*"[^>]*>↗/)
})

test.each(['/blog/post', '#section', 'relative/path'])(
    'keeps %p in the site without an arrow',
    href => {
        const html = render(href)
        expect(html).not.toContain('target="_blank"')
        expect(html).not.toContain('↗')
    }
)

// An inline-flex link cannot wrap, so a long link would overflow the prose.
test('an external link still wraps inside a paragraph', () => {
    expect(render('https://example.com')).not.toContain('inline-flex')
})
