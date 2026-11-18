import { afterAll, afterEach, beforeAll } from 'bun:test'
import { setupServer } from 'msw/node'

// Network-level fetch mocking for a test file. Unhandled requests fail the test,
// so nothing silently reaches the real network.
export function setupMockServer() {
    const server = setupServer()
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())
    return server
}
