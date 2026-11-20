import { expect, test } from 'bun:test'
import { noop } from 'lodash-es'
import { renderToStaticMarkup } from 'react-dom/server'

import ErrorPage from './error'

function render(error: unknown) {
    return renderToStaticMarkup(<ErrorPage error={error} retry={noop} />)
}

test('shows the digest of a server error so it can be matched to the logs', () => {
    const error = Object.assign(new Error('boom'), { digest: '4242' })
    expect(render(error)).toContain('ref: 4242')
})

// A Client Component can throw anything, and Next forwards it as-is.
test.each([null, undefined, 'boom', { digest: 'not-an-error' }])(
    'renders for a thrown %p without a reference',
    thrown => {
        const html = render(thrown)
        expect(html).toContain('unexpected error')
        expect(html).not.toContain('ref:')
    }
)
