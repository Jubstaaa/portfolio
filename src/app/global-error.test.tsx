import { expect, mock, test } from 'bun:test'
import { noop } from 'lodash-es'
import { renderToStaticMarkup } from 'react-dom/server'

import { site } from '@/features/content/content'

void mock.module('@/styles/fonts', () => ({
    fontVariables: 'hermit-variable hermit-italic-variable',
}))

const { default: GlobalError } = await import('./global-error')

test('renders its own document in the site language and fonts', () => {
    const html = renderToStaticMarkup(
        <GlobalError error={new Error('boom')} retry={noop} />
    )
    expect(html).toContain(`lang="${site.locale}"`)
    expect(html).toContain('hermit-variable hermit-italic-variable')
})
