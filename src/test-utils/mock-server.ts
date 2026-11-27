import { FetchInterceptor } from '@mswjs/interceptors/fetch/web'
import { afterAll, afterEach, beforeAll } from 'bun:test'
import { defineNetwork, InterceptorSource } from 'msw/experimental'

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

function webFetchInterceptor(): SourceInterceptor {
    return new FetchInterceptor() as unknown as SourceInterceptor
}
