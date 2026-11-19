import { expect, spyOn, test } from 'bun:test'

import { writeToClipboard } from './clipboard'

test('reports success when the browser accepts the write', async () => {
    const clipboard = { writeText: () => Promise.resolve() }
    expect(await writeToClipboard('x', clipboard)).toBe(true)
})

test('reports failure instead of rejecting when the write is denied', async () => {
    const logged = spyOn(console, 'error').mockImplementation(() => undefined)
    const clipboard = {
        writeText: () => Promise.reject(new DOMException('denied')),
    }
    expect(await writeToClipboard('x', clipboard)).toBe(false)
    expect(logged).toHaveBeenCalled()
    logged.mockRestore()
})
