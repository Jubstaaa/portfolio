import { FetchInterceptor } from '@mswjs/interceptors/fetch/web'
import { afterAll, afterEach, beforeAll } from 'bun:test'
import { defineNetwork, InterceptorSource } from 'msw/experimental'

// Network-level fetch mocking for a test file. msw/node's defaults hook Node.js
// internals that Bun does not have, so Bun gets the setup the MSW maintainers
// recommend for other runtimes: a network that patches the global fetch
// (mswjs/msw#2811, #2812). Unhandled requests fail the test, so nothing
// silently reaches the real network. `quiet` drops MSW's per-request log,
// which otherwise buries real test output.
type SourceInterceptor = ConstructorParameters<
    typeof InterceptorSource
>[0]['interceptors'][number]

export function setupMockServer() {
    const network = defineNetwork({
        context: { quiet: true },
        onUnhandledFrame: 'error',
        sources: [
            new InterceptorSource({ interceptors: [webFetchInterceptor()] }),
        ],
    })
    beforeAll(() => {
        network.enable()
    })
    afterEach(() => {
        network.resetHandlers()
    })
    afterAll(() => {
        network.disable()
    })
    return network
}

// The web build of @mswjs/interceptors declares its own copy of the
// Interceptor class, which TypeScript treats as a different nominal type from
// the Node build msw's types reference. Same class at runtime.
function webFetchInterceptor(): SourceInterceptor {
    return new FetchInterceptor() as unknown as SourceInterceptor
}
