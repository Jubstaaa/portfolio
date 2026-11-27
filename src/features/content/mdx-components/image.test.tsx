import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { DeferredImg } from './deferred-image'
import { Img } from './image'

const image = {
    alt: 'diagram',
    height: '600',
    src: '/images/blog/post/diagram.webp',
    width: '1200',
}

test('the first body image is fetched eagerly at high priority', () => {
    const html = renderToStaticMarkup(<Img {...image} data-priority="true" />)
    expect(html).toContain('fetchPriority="high"')
    expect(html).toContain('loading="eager"')
})

test('other body images stay lazy', () => {
    const html = renderToStaticMarkup(<Img {...image} />)
    expect(html).not.toContain('fetchPriority')
    expect(html).toContain('loading="lazy"')
})

test('under a cover the first body image does not compete with it', () => {
    const html = renderToStaticMarkup(
        <DeferredImg {...image} data-priority="true" />
    )
    expect(html).not.toContain('fetchPriority')
    expect(html).toContain('loading="lazy"')
})

test('renders a body image at its stamped size', () => {
    const html = renderToStaticMarkup(<Img {...image} />)
    expect(html).toContain('width="1200"')
    expect(html).toContain('height="600"')
})

test('refuses a body image without dimensions', () => {
    expect(() =>
        renderToStaticMarkup(<Img alt="a" src="/images/a.webp" />)
    ).toThrow('/images/a.webp')
})
