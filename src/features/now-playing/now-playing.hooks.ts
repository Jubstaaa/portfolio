import { useQuery } from '@tanstack/react-query'

import type { NowPlayingPayload } from './now-playing.schema'

export function useNowPlaying() {
    return useQuery<NowPlayingPayload>({
        queryFn: async () => {
            const res = await fetch('/api/now-playing')
            if (!res.ok) throw new Error(`now-playing: HTTP ${res.status}`)
            // Loaded with the first response rather than with the terminal: zod
            // would otherwise double the home page's terminal chunk.
            const { nowPlayingPayloadSchema } =
                await import('./now-playing.schema')
            return nowPlayingPayloadSchema.parse(await res.json())
        },
        queryKey: ['now-playing'],
        refetchInterval: 30_000,
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 30_000,
    })
}
