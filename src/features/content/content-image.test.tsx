import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { ContentImage } from './content-image'

const image = {
    alt: 'cover',
    height: 1125,
    src: '/images/blog/post/cover.webp',
    width: 2000,
}

// Next 16 image docs: prefer fetchPriority/loading over `preload` for the LCP
// image, so the browser raises its priority without a competing <link>.
test('the LCP cover is fetched eagerly at high priority', () => {
    const html = renderToStaticMarkup(<ContentImage {...image} lcpCandidate />)
    expect(html).toContain('fetchPriority="high"')
    expect(html).toContain('loading="eager"')
})

test('a cover that is not the LCP candidate stays lazy', () => {
    const html = renderToStaticMarkup(<ContentImage {...image} />)
    expect(html).not.toContain('fetchPriority')
    expect(html).toContain('loading="lazy"')
})
