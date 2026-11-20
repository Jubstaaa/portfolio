import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { CopyStatusIcon } from './copy-status-icon'

test.each([
    ['idle', 'lucide-copy'],
    ['copied', 'lucide-check'],
    ['failed', 'lucide-x'],
] as const)('shows the %s state', (status, icon) => {
    const html = renderToStaticMarkup(<CopyStatusIcon status={status} />)
    expect(html).toContain(icon)
    expect(html).toContain('aria-hidden="true"')
})
