import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import type { NowPlayingPayload } from './now-playing.schema'

import { NowPlaying } from './now-playing'

function render(payload?: NowPlayingPayload) {
    const client = new QueryClient()
    if (payload) client.setQueryData(['now-playing'], payload)
    return renderToStaticMarkup(
        <QueryClientProvider client={client}>
            <NowPlaying />
        </QueryClientProvider>
    )
}

// Chrome records a text block's LCP once, at its first paint. The track name
// arrives after hydration, so it has to land in the block that was painted
// with the placeholder; a new, larger block would become the home page's LCP.
const LABEL_BLOCK = /^<span class="[^"]*"><span class="[^"]*break-all[^"]*">/

test.each([
    ['loading', undefined, '—'],
    ['idle', { isPlaying: false } as const, '— not listening'],
])('the %s state renders its text in the label block', (_, payload, text) => {
    const html = render(payload)
    expect(html).toMatch(LABEL_BLOCK)
    expect(html).toContain(text)
})

test('a playing track renders its link inside the same label block', () => {
    const html = render({
        artist: 'Gotye',
        isPlaying: true,
        title: 'Somebody That I Used to Know',
        url: 'https://open.spotify.com/track/x',
    })
    expect(html).toMatch(
        /^<span class="[^"]*"><span aria-hidden="true" class="[^"]*"><\/span><span class="[^"]*break-all[^"]*"><a /
    )
    expect(html).toContain('Somebody That I Used to Know — Gotye')
    expect(html).toContain('href="https://open.spotify.com/track/x"')
})
